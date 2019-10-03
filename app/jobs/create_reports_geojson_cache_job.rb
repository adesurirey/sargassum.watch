# frozen_string_literal: true

class CreateReportsGeoJSONCacheJob < ApplicationJob
  queue_as :critical

  def perform
    Report.cached_geojson
  end
end
