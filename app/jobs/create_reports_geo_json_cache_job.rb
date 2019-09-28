# frozen_string_literal: true

class CreateReportsGeoJsonCacheJob < ApplicationJob
  queue_as :default

  def perform
    Report.cached_geo_json
  end
end
