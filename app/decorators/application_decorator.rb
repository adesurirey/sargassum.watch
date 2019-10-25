# frozen_string_literal: true

class ApplicationDecorator < Draper::Decorator
  def to_geojson
    as_geojson.to_json
  end
end
