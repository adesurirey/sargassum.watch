# frozen_string_literal: true

class SargassumMonitoringScrapper < BaseService
  MIDS = {
    2019 => {
      with:    "1jQbixC2zZfrxgRTmZYULzDvHPwGmbsZh",
      without: "1L0VAsV3pcHd5S4C0iBX6DtwCZdaMvENT",
    },
    2018 => {
      with:    "1SI0WSsYwOA_MlPZS-mestIcqUTkhdbcd",
      without: "1BBMjAfKlT11DYn6m2cPYOAezgt14Fb5G",
    },
  }.freeze

  attr_reader :kml

  def self.call(year:, kind:, attributes: {})
    fail ArgumentError, "No url for #{year} #{kind}" unless MIDS[year][kind]

    new(year, kind, attributes).kml
  end

  private

  def initialize(year, kind, attributes)
    @year = year
    @url = build_url(MIDS[year][kind])
    @kml = Assets::KML.new(request.body, attributes)
    clean_kml
  end

  def build_url(mid)
    "https://www.google.com/maps/d/kml?mid=#{mid}&forcekml=1"
  end

  def clean_kml
    @kml.placemarks.select! do |placemark|
      placemark[:updated_at].year == @year
    end
  end
end
