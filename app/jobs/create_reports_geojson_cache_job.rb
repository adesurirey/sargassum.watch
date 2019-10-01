# frozen_string_literal: true

class CreateReportsGeoJSONCacheJob < ApplicationJob
  queue_as :default

  def perform
    Report.cached_geojson
  end
end
