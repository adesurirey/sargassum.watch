# frozen_string_literal: true

class ScrapViajefestJob < ApplicationJob
  queue_as :default

  def perform
    @created_reports_count = 0

    results = ViajefestScrapper.call
    @results = after_last_dataset(results)

    Report.transaction do
      create_reports!
      create_or_update_scrapper_log!
    end

    teardown
  end

  private

  def after_last_dataset(results)
    return results unless Dataset.any?

    if results.first[:created_at] > Dataset.last.end_at
      results
    else
      []
    end
  end

  def create_reports!
    user_id = SecureRandom.hex

    @results.each do |result|
      report = Report.find_or_initialize_for_scrapper(result)
      next unless report.new_record?

      report.user_id = user_id
      Report.without_cache_callback { report.save! }
      @created_reports_count += 1
    end
  end

  def create_or_update_scrapper_log!
    ScrapperLog.create_or_update!(
      file_name:                  ViajefestScrapper::URL,
      last_created_reports_count: @created_reports_count,
      level:                      :na,
      valid_placemarks_count:     @results.size,
      invalid_placemarks_count:   0,
    )
  end

  def teardown
    refresh_reports_cache
    reschedule
  end

  def refresh_reports_cache
    Report.create_geojson_cache if @created_reports_count.positive?
  end

  def reschedule
    ScrapViajefestJob.set(wait_until: 1.day.from_now).perform_later
  end
end
