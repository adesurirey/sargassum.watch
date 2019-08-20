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

  def lon_lat
    [longitude, latitude]
  end

  def numeric_level
    self.class.levels[level]
  end
end
