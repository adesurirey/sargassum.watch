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
#  source     :string
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

  GEO_ATTRIBUTES = [:id, :name, :level, :latitude, :longitude, :updated_at, :source].freeze

  MIN_DISTANCE_FROM_LAST_REPORT_IN_KM   = 1
  MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME = Time.current.beginning_of_day

  enum level: {
    clear:    0,
    moderate: 1,
    na:       2,
    critical: 3,
  }

  validate :timestamps_are_past
  validates :latitude, numericality: LATITUDE_NUMERICALITY
  validates :longitude, numericality: LONGITUDE_NUMERICALITY
  validates :level, presence: true
  validates :user_id, presence: true, length: { is: 32 }

  before_create :reverse_geocode, if: :should_geocode?

  after_commit :create_geojson_cache

  default_scope { order(updated_at: :asc) }

  scope :infested, -> { where.not(level: :clear) }

  class << self
    def cached_geojson
      datasets = Dataset.where(end_date: 1.year.ago..DateTime.current)
      reports = all.select(GEO_ATTRIBUTES)

      Rails.cache.fetch(cache_key(datasets, reports)) do
        Assets::GeoJSON.generate(datasets: datasets, reports: reports)
      end
    end

    def find_or_initialize_by(params)
      current_with(params) || new(params)
    end

    def create_geojson_cache
      CreateReportsGeoJSONCacheJob.perform_later
    end

    def formatted_levels
      levels.map { |k, v| { value: v, label: k } }
    end

    private

    def cache_key(datasets, reports)
      { serializer: "reports", stat_record: last_update(datasets, reports) }
    end

    def last_update(datasets, reports)
      return reports.maximum(:updated_at) if datasets.empty?
      return datasets.maximum(:updated_at) if reports.empty?

      [datasets.maximum(:updated_at), reports.maximum(:updated_at)].max
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

  def create_geojson_cache
    self.class.create_geojson_cache
  end

  def should_geocode?
    name.blank?
  end
end
