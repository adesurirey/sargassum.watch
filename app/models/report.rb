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
#  session_id :string           not null
#
# Indexes
#
#  index_reports_on_latitude_and_longitude  (latitude,longitude)
#

class Report < ApplicationRecord
  include CoordinatesConcern

  MIN_DISTANCE_FROM_LAST_REPORT_IN_KM   = 1
  MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME = Time.current.beginning_of_day

  enum level: {
    clear:    0,
    moderate: 1,
    critical: 2,
  }

  validates :latitude, numericality: LATITUDE_NUMERICALITY
  validates :longitude, numericality: LONGITUDE_NUMERICALITY
  validates :level, presence: true
  validates :session_id, presence: true

  before_create :reverse_geocode, if: :should_geocode?

  default_scope { order(updated_at: :asc) }

  scope :infested, -> { where.not(level: :clear) }

  class << self
    def geo_attributes
      [:id, :name, :level, :latitude, :longitude, :updated_at]
    end

    def cache_key(reports)
      { serializer: "reports", stat_record: reports.maximum(:updated_at) }
    end

    def find_or_initialize_by(params)
      current_with(params) || new(params)
    end

    private

    def current_with(params)
      session_id, latitude, longitude = params.values_at(:session_id, :latitude, :longitude)

      where(
        session_id: session_id,
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

  def should_geocode?
    name.blank?
  end
end
