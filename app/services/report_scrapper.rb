# frozen_string_literal: true

class ReportScrapper
  include ClientConcern

  attr_reader :kml

  class << self
    def url(year:, kind:)
      ENV.fetch("REPORT_SCRAPPER_URL_#{year}_#{kind.upcase}")
    end

    def call(year:, kind:, attributes: {})
      url = url(year: year, kind: kind)

      new(url, year, attributes).kml
    end
  end

  private

  def initialize(url, year, attributes)
    @url = url
    @year = year
    @attributes = attributes
    @kml = nil

    scrap
  end

  def scrap
    @kml = to_kml(request)
    clean_results!
  end

  def request
    Faraday.get @url, nil, headers
  end

  def to_kml(response)
    Assets::KML.new(response.body, @attributes)
  end

  def clean_results!
    @kml.placemarks.select! do |placemark|
      placemark[:updated_at].year == @year
    end
  end
end
