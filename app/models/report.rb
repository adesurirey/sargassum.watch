# frozen_string_literal: true

# == Schema Information
#
# Table name: reports
#
#  id         :bigint           not null, primary key
#  latitude   :float            not null
#  level      :integer          not null
#  longitude  :float            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  session_id :string           not null
#
# Indexes
#
#  index_reports_on_latitude_and_longitude  (latitude,longitude)
#

class Report < ApplicationRecord
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
