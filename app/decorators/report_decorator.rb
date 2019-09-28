# frozen_string_literal: true

class ReportDecorator < Draper::Decorator
  delegate_all

  def as_geo_json
    {
      type:       "Feature",
      geometry:   {
        type:        "Point",
        coordinates: geo_json_coordinates,
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

  def to_geo_json
    as_geo_json.to_json
  end

  def numeric_level
    self.class.levels[level]
  end
end
