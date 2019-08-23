# frozen_string_literal: true

class CreateReportsGeoJsonCacheJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    reports = Report.all.select(Report.geo_attributes)

    Rails.cache.fetch(Report.cache_key(reports)) do
      reports.decorate.to_geo_json
    end
  end
end
