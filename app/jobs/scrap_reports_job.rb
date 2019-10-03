# frozen_string_literal: true

class ScrapReportsJob < ApplicationJob
  queue_as :default

  def perform(kind, year = Time.current.year)
    @created_reports_count = 0
    @attributes = report_attibutes(kind.to_sym)

    @kml = Scrapper.call(kind: kind.to_sym, year: year, attributes: @attributes)
    @placemarks = after_last_dataset(@kml.placemarks)

    Report.transaction do
      create_reports!
      create_or_update_log!
    end
  end

  private

  def report_attibutes(kind)
    {
      level:   report_level(kind),
      user_id: SecureRandom.hex,
      source:  "http://sargassummonitoring.com",
    }
  end

  def report_level(kind)
    case kind
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

      report.save!
      @created_reports_count += 1
    end
  end

  def create_or_update_log!
    ScrapperLog.create_or_update_from_kml!(
      kml:                   @kml,
      created_reports_count: @created_reports_count,
      level:                 @attributes[:level],
    )
  end
end
