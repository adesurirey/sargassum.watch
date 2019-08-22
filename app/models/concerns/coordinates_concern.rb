# frozen_string_literal: true

module CoordinatesConcern
  extend ActiveSupport::Concern

  included do
    def geo_json_coordinates
      [longitude, latitude]
    end

    def geocoder_coordinates
      [latitude, longitude]
    end
  end
end
