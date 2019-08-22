# frozen_string_literal: true

class ReportDecorator < Draper::Decorator
  delegate_all

  def created_ago
    "#{h.time_ago_in_words(created_at)} #{I18n.t('ago')}"
  end

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
        createdAgo: created_ago,
      },
    }
  end
end
