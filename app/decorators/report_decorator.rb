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

    Rails.application.routes.url_helpers.url_for(optimized_photo)
  end

  def source
    # geoJSON format doesn't support null value
    object.source || ""
  end

  private

  # When the browser hits the variant URL, Active Storage will lazily transform the
  # original blob into the specified format and redirect to its new service location.
  #
  def optimized_photo
    photo.variant(
      # Strip the image of any profiles, comments or these PNG chunks:
      # bKGD, cHRM, EXIF, gAMA, iCCP, iTXt, sRGB, tEXt, zCCP, zTXt, date
      strip:           true,
      # Rotate pictures according to EXIF
      auto_orient:     true,
      # Resize to maximum 3x fullscreen display dimensions
      resize_to_limit: [2556, 1620],
      # Convert to progressive JPEG
      convert:         "jpg",
      quality:         85,
      saver:           { interlace: "Plane" },
    )
  end
end
