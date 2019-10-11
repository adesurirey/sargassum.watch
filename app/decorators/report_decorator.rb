# frozen_string_literal: true

class ReportDecorator < Draper::Decorator
  delegate_all

  def as_geojson
    {
      type:       "Feature",
      geometry:   {
        type:        "Point",
        coordinates: geojson_coordinates,
      },
      properties: {
        id:         id,
        name:       name,
        level:      numeric_level,
        humanLevel: level,
        updatedAt:  updated_at.httpdate,
        source:     source,
      },
    }
  end

  def to_geojson
    as_geojson.to_json
  end

  def numeric_level
    self.class.levels[level]
  end

  def source
    # geoJSON format doesn't support null value
    object.source || ""
  end
end
