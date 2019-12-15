# frozen_string_literal: true

class ReportDecorator < ApplicationDecorator
  delegate_all

  def self.collection_decorator_class
    GeoJSONDecorator
  end

  def as_geojson
    {
      type:       "Feature",
      geometry:   {
        type:        "Point",
        coordinates: geojson_coordinates,
      },
      properties: properties,
    }
  end

  def properties
    {
      id:         id,
      name:       name,
      level:      numeric_level,
      humanLevel: level,
      photo:      photo_url,
      source:     source,
      updatedAt:  updated_at.httpdate,
    }
  end

  def numeric_level
    self.class.levels[level]
  end

  def photo_url
    # geoJSON format doesn't support null value
    return "" unless photo.attached?

    Rails.application.routes.url_helpers.url_for(photo)
  end

  def source
    # geoJSON format doesn't support null value
    object.source || ""
  end
end
