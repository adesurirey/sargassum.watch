# frozen_string_literal: true

module Assets
  class KML
    attr_reader :errors
    attr_reader :name
    attr_reader :placemarks

    def initialize(file_path, custom_placemark_attributes = {})
      @document = Nokogiri::XML(File.open(file_path))
      @custom_placemark_attributes = custom_placemark_attributes
      @errors = []

      @name = parse_name
      @placemarks = parse_placemarks.compact
    end

    private

    def parse_name
      @document.at_css("Document name").text
    end

    def parse_placemarks
      @document.css("Placemark").map do |placemark|
        Placemark.new(placemark, @custom_placemark_attributes).attributes
      rescue Placemark::InvalidNodeError => e
        @errors << e.message
        next
      end
    end
  end
end
