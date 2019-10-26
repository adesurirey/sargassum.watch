# frozen_string_literal: true

class WebcamScrapper
  URL = "http://www.webcamsdemexico.com"
  COORDINATES_PATH = "/Scripts/data.json"
  TEXT_ARRAY_REGEX = /\[.+\]/m.freeze

  attr_reader :results

  def self.call
    new.results
  end

  private

  def initialize
    @results = []
    scrap
  end

  def scrap
    scrap_state_webcams
    scrap_webcams_coordinates
    scrap_webcams_source
    validate_webcam_sources!
    format_results
  end

  def scrap_state_webcams
    html = request(URL).body
    doc = Nokogiri::HTML(html)

    doc.at('span:contains("Quintana Roo")').parent.search("a").each do |element|
      result = { name: element.text.strip, path: element.attribute("href").value }
      @results << result
    end
  end

  def scrap_webcams_coordinates
    malformated_json = request(URL + COORDINATES_PATH).body
    webcams = array_from_text(malformated_json)

    @results.each do |result|
      match = webcams.find { |webcam| webcam[:photo_url].match?(result[:path]) }

      result.merge!(
        url:       match[:photo_url],
        latitude:  match[:latitude],
        longitude: match[:longitude],
      )
    end
  end

  def scrap_webcams_source
    @results.each do |result|
      html = request(result[:url]).body
      doc = Nokogiri::HTML(html)

      youtube_url = doc.search("#ytIframe").attribute("src")
      live_image_url = doc.search("#liveimg").attribute("src")

      merge_source!(result, youtube_url: youtube_url, live_image_url: live_image_url)
    end
  end

  def merge_source!(result, youtube_url: nil, live_image_url: nil)
    if youtube_url
      youtube_id = extract_youtube_id(youtube_url)
      result.merge!(kind: :youtube, youtube_id: youtube_id, url: nil)
    elsif live_image_url
      result.merge!(kind: :image, url: live_image_url.value)
    else
      fail StandardError, "No source found at #{result[:url]}"
    end
  end

  def extract_youtube_id(url)
    url.value.split("/").last.gsub("?autoplay=1", "")
  end

  def validate_webcam_sources!
    @results.map! do |result|
      next if result[:youtube_id] && !youtube_video_exists?(result[:youtube_id])
      next if result[:url] && !url_exists?(result[:url])

      result
    end

    @results.compact!
  end

  def format_results
    @results.each do |result|
      result.slice!(:kind, :name, :youtube_id, :url, :latitude, :longitude)
      result[:source] = URL
    end
  end

  def array_from_text(text)
    text_array = text.match(TEXT_ARRAY_REGEX)
    JSON.parse(text_array).map(&:symbolize_keys)
  end

  def url_exists?(url)
    response = Faraday.get url
    response.status == 200
  end

  def youtube_video_exists?(id)
    url_exists?("https://img.youtube.com/vi/#{id}/mqdefault.jpg")
  end

  def request(url)
    Faraday.get url
  end
end
