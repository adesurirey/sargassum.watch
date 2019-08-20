# frozen_string_literal: true

class ReportsDecorator < Draper::CollectionDecorator
  def as_geo_json
    {
      type:     "FeatureCollection",
      features: map(&:as_geo_json),
    }
  end
end
