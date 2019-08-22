# frozen_string_literal: true

class ReportDecorator < Draper::Decorator
  delegate_all

  def created_ago
    # Uses updated_at as users can edit a record up to 24H after creation.
    "#{h.time_ago_in_words(updated_at)} #{I18n.t('ago')}"
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
