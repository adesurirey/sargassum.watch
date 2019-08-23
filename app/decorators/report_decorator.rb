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
        updatedAt:  updated_at.httpdate,
        updatedAgo: updated_ago,
      },
    }
  end

  def numeric_level
    self.class.levels[level]
  end

  def updated_ago
    "#{h.time_ago_in_words(updated_at)} #{I18n.t('ago')}"
  end
end
