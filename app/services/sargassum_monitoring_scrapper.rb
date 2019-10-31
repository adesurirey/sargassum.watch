# frozen_string_literal: true

class SargassumMonitoringScrapper
  URLS = {
    2019 => {
      with:    "https://www.google.com/maps/d/kml?mid=1jQbixC2zZfrxgRTmZYULzDvHPwGmbsZh&forcekml=1",
      without: "https://www.google.com/maps/d/kml?mid=1L0VAsV3pcHd5S4C0iBX6DtwCZdaMvENT&forcekml=1",
    },
    2018 => {
      with:    "https://www.google.com/maps/d/kml?mid=1SI0WSsYwOA_MlPZS-mestIcqUTkhdbcd&forcekml=1",
      without: "https://www.google.com/maps/d/kml?mid=1BBMjAfKlT11DYn6m2cPYOAezgt14Fb5G&forcekml=1",
    },
  }.freeze

  attr_reader :kml

  def self.call(year:, kind:, attributes: {})
    fail ArgumentError, "No url found for #{year} #{kind}" unless URLS[year][kind]

    new(year, kind, attributes).kml
  end

  private

  def initialize(year, kind, attributes)
    @year = year
    @url = URLS[year][kind]
    @kml = Assets::KML.new(request.body, attributes)
    clean_kml
  end

  def clean_kml
    @kml.placemarks.select! do |placemark|
      placemark[:updated_at].year == @year
    end
  end

  def request
    Faraday.get @url
  end
end
