# frozen_string_literal: true

class WebcamDecorator < ApplicationDecorator
  delegate_all

  def self.collection_decorator_class
    GeoJSONDecorator
  end

  def as_geojson
    case kind.to_sym
    when :youtube
      base_geojson.deep_merge(properties: { youtubeId: youtube_id })
    when :image
      base_geojson.deep_merge(properties: { liveImageUrl: url })
    end
  end

  private

  def base_geojson
    {
      type:       "Feature",
      geometry:   {
        type:        "Point",
        coordinates: geojson_coordinates,
      },
      properties: {
        id: id,
      },
    }
  end
end
