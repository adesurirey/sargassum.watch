# frozen_string_literal: true

class Scrapper
  URLS = {
    "2019" => {
      with:    "https://www.google.com/maps/d/kml?mid=1jQbixC2zZfrxgRTmZYULzDvHPwGmbsZh&forcekml=1",
      without: "https://www.google.com/maps/d/kml?mid=1L0VAsV3pcHd5S4C0iBX6DtwCZdaMvENT&forcekml=1",
    },
    "2018" => {
      with:    "https://www.google.com/maps/d/kml?mid=1SI0WSsYwOA_MlPZS-mestIcqUTkhdbcd&forcekml=1",
      without: "https://www.google.com/maps/d/kml?mid=1BBMjAfKlT11DYn6m2cPYOAezgt14Fb5G&forcekml=1",
    },
  }.freeze

  attr_reader :kml

  class << self
    def call(year:, kind:)
      fail ArgumentError unless [:with, :without].include?(kind)

      new(year, kind).kml
    end
  end

  private

  def initialize(year, kind)
    @url = URLS[year][kind]
    @kml = request.body
  end

  def request
    Faraday.get @url
  end
end
