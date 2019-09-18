# frozen_string_literal: true

# == Schema Information
#
# Table name: reports
#
#  id         :bigint           not null, primary key
#  latitude   :float            not null
#  level      :integer          not null
#  longitude  :float            not null
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :string           not null
#
# Indexes
#
#  index_reports_on_latitude_and_longitude  (latitude,longitude)
#

class Report < ApplicationRecord
  include CoordinatesConcern

  GEO_ATTRIBUTES = [:id, :name, :level, :latitude, :longitude, :updated_at].freeze

  MIN_DISTANCE_FROM_LAST_REPORT_IN_KM   = 1
  MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME = Time.current.beginning_of_day

  enum level: {
    clear:    0,
    moderate: 1,
    critical: 2,
  }

  validate :timestamps_are_past
  validates :latitude, numericality: LATITUDE_NUMERICALITY
  validates :longitude, numericality: LONGITUDE_NUMERICALITY
  validates :level, presence: true
  validates :user_id, presence: true, length: { is: 32 }

  before_create :reverse_geocode, if: :should_geocode?

  after_save :create_geo_json_cache

  default_scope { order(updated_at: :asc) }

  scope :infested, -> { where.not(level: :clear) }

  class << self
    def cached_geo_json
      reports = all.select(GEO_ATTRIBUTES)

      Rails.cache.fetch(cache_key(reports)) do
        reports.decorate.to_geo_json
      end
    end

    def find_or_initialize_by(params)
      current_with(params) || new(params)
    end

    def formatted_levels
      levels.map { |k, v| { value: v, label: k } }
    end

    private

    def cache_key(reports)
      { serializer: "reports", stat_record: reports.maximum(:updated_at) }
    end

    def current_with(params)
      user_id, latitude, longitude = params.values_at(:user_id, :latitude, :longitude)

      where(
        user_id:    user_id,
        created_at: MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME..,
      )
        .near([latitude, longitude], MIN_DISTANCE_FROM_LAST_REPORT_IN_KM, units: :km)
        .first
        .tap { |report| report&.assign_attributes(params) }
    end
  end

  reverse_geocoded_by :latitude, :longitude do |report, results|
    next unless results.any?

    # Nominatim-specific result handling.
    address = results.first.data["address"]
    # First key in hash is often a precise place name.
    report.name = address[address.keys.first] if address.present?
  end

  private

  def timestamps_are_past
    errors.add(:created_at) if created_at.present? && created_at > Time.current
    errors.add(:updated_at) if updated_at.present? && updated_at > Time.current
  end

  def should_geocode?
    name.blank?
  end

  def create_geo_json_cache
    CreateReportsGeoJsonCacheJob.perform_later
  end
end
