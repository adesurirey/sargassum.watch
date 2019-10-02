# frozen_string_literal: true

class ScrapReportsJob < ApplicationJob
  queue_as :default

  def perform(kind)
    file = Scrapper.call(kind: kind, year: Time.current.year)
    kml = Assets::KML.new(file, report_attibutes(kind))
    placemarks = kml.placemarks

    filter_placemarks!(placemarks) if Dataset.any?

    placemarks.each do |placemark|
      report = Report.find_or_initialize_for_scrapper(placemark)
      report.save! if report.new_record?
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

  def filter_placemarks!(placemarks)
    placemarks.select! do |placemark|
      placemark[:created_at] > Dataset.last.end_at
    end
  end
end
