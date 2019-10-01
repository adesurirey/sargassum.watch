# frozen_string_literal: true

module CoordinatesConcern
  extend ActiveSupport::Concern

  included do
    LATITUDE_NUMERICALITY  = { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }.freeze
    LONGITUDE_NUMERICALITY = { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }.freeze

    def geojson_coordinates
      [longitude, latitude]
    end

    def geocoder_coordinates
      [latitude, longitude]
    end
  end
end
