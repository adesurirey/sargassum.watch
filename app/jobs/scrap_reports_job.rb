# frozen_string_literal: true

class ScrapReportsJob < ApplicationJob
  queue_as :default

  def perform(kind, year = Time.current.year)
    @kind = kind
    @attributes = report_attibutes
    @kml = ReportScrapper.call(kind: kind, year: year, attributes: @attributes)
    @placemarks = after_last_dataset(@kml.placemarks)
    @created_reports_count = 0

    Report.transaction do
      create_reports!
      create_or_update_parser_log!
    end

    teardown
  end

  private

  def report_attibutes
    {
      level:   report_level,
      user_id: SecureRandom.hex,
      source:  "http://sargassummonitoring.com",
    }
  end

  def report_level
    case @kind
    when :with then :na
    when :without then :clear
    end
  end

  def after_last_dataset(placemarks)
    return placemarks unless Dataset.any?

    placemarks.select do |placemark|
      placemark[:created_at] > Dataset.last.end_at
    end
  end

  def create_reports!
    @placemarks.each do |placemark|
      report = Report.find_or_initialize_for_scrapper(placemark)
      next unless report.new_record?

      Report.without_cache_callback { report.save! }
      @created_reports_count += 1
    end
  end

  def create_or_update_parser_log!
    ScrapperLog.create_or_update_from_kml!(
      kml:                   @kml,
      created_reports_count: @created_reports_count,
      level:                 @attributes[:level],
    )
  end

  def teardown
    refresh_reports_cache
    reschedule
  end

  def refresh_reports_cache
    CreateReportsGeoJSONCacheJob.perform_later if @created_reports_count.positive?
  end

  def reschedule
    ScrapReportsJob.set(wait_until: 12.hours.from_now).perform_later(@kind)
  end
end
