# frozen_string_literal: true

class Scrapper
  KINDS = [:with, :without].freeze
  YEARS = [2018, 2019].freeze
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

  class << self
    def call(year:, kind:)
      validate_args(year, kind)

      new(year, kind).kml
    end

    private

    def validate_args(year, kind)
      fail ArgumentError, "Unknown year #{year}, expected: #{YEARS}" unless YEARS.include?(year)
      fail ArgumentError, "Unknown kind #{kind}, expected: #{KINDS}" unless KINDS.include?(kind)
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
