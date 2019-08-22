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
  MIN_DISTANCE_FROM_LAST_REPORT_IN_KM   = 1
  MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME = Time.current.beginning_of_day

  enum level: {
    low:      0,
    moderate: 1,
    critical: 2,
  }

  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :level, presence: true
  validates :session_id, presence: true

  scope :infested, -> { where.not(level: :low) }

  reverse_geocoded_by :latitude, :longitude

  class << self
    def find_or_initialize_by(attributes)
      current_for(attributes.slice(:session_id, :latitude, :longitude)) || new(attributes)
    end

    private

    def current_for(session_id:, latitude:, longitude:)
      where(
        session_id: session_id,
        created_at: MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME..,
      )
        .near([latitude, longitude], MIN_DISTANCE_FROM_LAST_REPORT_IN_KM, units: :km)
        .first
    end
  end

  def geo_json_coordinates
    [longitude, latitude]
  end

  def geocoder_coordinates
    [latitude, longitude]
  end

  def numeric_level
    self.class.levels[level]
  end
end
