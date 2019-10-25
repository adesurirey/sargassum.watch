# frozen_string_literal: true

module GeolocatableConcern
  extend ActiveSupport::Concern

  LATITUDE_NUMERICALITY  = { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }.freeze
  LONGITUDE_NUMERICALITY = { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }.freeze

  included do
    validates :latitude, numericality: LATITUDE_NUMERICALITY
    validates :longitude, numericality: LONGITUDE_NUMERICALITY

    def geojson_coordinates
      [longitude, latitude]
    end

    def geocoder_coordinates
      [latitude, longitude]
    end
  end
end
