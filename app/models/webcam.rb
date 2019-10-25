# frozen_string_literal: true

# == Schema Information
#
# Table name: webcams
#
#  id         :bigint           not null, primary key
#  kind       :integer          not null
#  latitude   :float            not null
#  longitude  :float            not null
#  name       :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  youtube_id :string
#

class Webcam < ApplicationRecord
  include GeolocatableConcern
  include ReverseGeocodableConcern

  enum kind: { youtube: 0, image: 1 }, _suffix: true

  validates :kind, presence: true
  validate :validate_source

  private

  def validate_source
    case kind&.to_sym
    when :youtube
      errors.add(:youtube_id, :blank) if youtube_id.blank?
    when :image
      errors.add(:url, :blank) if url.blank?
    end
  end
end
