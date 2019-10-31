# frozen_string_literal: true

class ViajefestScrapper < BaseService
  NoDateFoundError = Class.new(StandardError)
  UnknownColorError = Class.new(StandardError)
  BadCountError = Class.new(StandardError)

  URL = "https://www.viajefest.com/sargazo-en-quintana-roo/"

  CIRCLES_REGEX = /L\.circle[^;]+;/.freeze

  CIRCLE_REGEX_1 = %r{
    \[(?<latitude>[^,]+),\s*(?<longitude>[^\]]+)\]
    .+
    color:\s*'(?<color>[^']+)'
    .+
    <a[^>]+>(?<name>[^<]+)</a>
  }mx.freeze

  CIRCLE_REGEX_2 = /
    \[(?<latitude>[^,]+),\s*(?<longitude>[^\]]+)\]
    .+
    color:\s*'(?<color>[^']+)'
    .+
    bindTooltip\([^"]+"(?<name>[^"]+)"
  /mx.freeze

  attr_reader :results

  def self.call
    new.results
  end

  private

  def initialize
    @url = URL
    @results = []

    scrap
  end

  def scrap
    html = request.body
    doc = Nokogiri::HTML(html)

    source_count = parse_reports_count(doc)
    created_at = parse_date(doc)
    circles = parse_beach_circles(html)

    circles.each do |circle|
      @results << build_result(circle, created_at)
    end

    validate_results_count(source_count)
  end

  def parse_reports_count(doc)
    count_str = doc.search(".beach-count .header p").children.last.text
    count_str.match(/\d+/).to_s.to_i
  end

  def validate_results_count(source_count)
    return if source_count == @results.size

    fail BadCountError, "Scrapped #{@results.size} results out of #{source_count}"
  end

  def parse_date(doc)
    date_str = doc.search(".beach-count .header p").children.first.text
    date_str.gsub!("🗓 ", "")

    fail NoDateFoundError, "No date found" unless date_str.present?

    DateTime.parse(date_str)
  end

  def parse_beach_circles(html)
    circles = html.scan(CIRCLES_REGEX)

    circles.select! { |circle| circle.match?(/beachCircle/) }
  end

  def build_result(circle, created_at)
    props = circle.match(CIRCLE_REGEX_1) || circle.match(CIRCLE_REGEX_2)

    {
      name:       props[:name].strip,
      level:      circle_level(props[:color]),
      latitude:   props[:latitude].to_f,
      longitude:  props[:longitude].to_f,
      source:     URL,
      created_at: created_at,
      updated_at: created_at,
    }
  end

  def circle_level(color)
    case color
    when "#1aacef" then :clear
    when "#15d268" then :clear
    when "#fff702" then :moderate
    when "#ffa700" then :moderate
    when "#ff7c65" then :critical
    else
      fail UnknownColorError, "Color #{color} has no corresponding level"
    end
  end
end
