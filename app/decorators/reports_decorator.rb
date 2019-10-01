# frozen_string_literal: true

class ReportsDecorator < Draper::CollectionDecorator
  def as_geojson
    {
      type:     "FeatureCollection",
      features: map(&:as_geojson),
    }
  end

  def to_geojson
    as_geojson.to_json
  end
end
