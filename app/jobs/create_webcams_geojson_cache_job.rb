# frozen_string_literal: true

class CreateWebcamsGeoJSONCacheJob < ApplicationJob
  queue_as :critical

  def perform
    Webcam.cached_geojson
  end
end
