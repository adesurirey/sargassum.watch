# frozen_string_literal: true

module Assets
  class KML
    class Placemark
      InvalidNodeError = Class.new(StandardError)

      DATE_REGEX = %r{\d{2}/\d{2}/\d{4}}.freeze
      NBSP = " "

      attr_reader :attributes

      def initialize(node_set, attributes = {})
        @node = node_set
        @name = parse_name
        @created_at = parse_date
        @latitude, @longitude, _elevation = parse_coordinates

        @attributes = attributes.merge!(
          name:       formatted_name,
          longitude:  @longitude,
          latitude:   @latitude,
          created_at: @created_at,
        )
      end

      def formatted_name
        @name.gsub(DATE_REGEX, "")
             .tr(NBSP, "")
             .split("-")
             .first
             .strip
      end

      private

      def parse_name
        @node.css("name")&.text.tap do |name|
          error(:blank_name) if name.blank?
        end
      end

      def parse_date
        @name[DATE_REGEX]&.to_datetime.tap do |date|
          error(:blank_date) if date.blank?
        end
      rescue ArgumentError
        error(:invalid_date)
      end

      def parse_coordinates
        coord_string = @node.at_css("coordinates")&.text.tap do |string|
          error(:blank_coordinates) if string.blank?
        end

        coord_string.strip.split(",").map!(&:to_f)
      end

      def error(kind)
        case kind
        when :blank_name
          fail InvalidNodeError, "No name found"
        when :blank_date
          fail InvalidNodeError, "No date found in name: #{@name.strip}"
        when :invalid_date
          fail InvalidNodeError, "Invalid date in name: #{@name.strip}"
        when :blank_coordinates
          fail InvalidNodeError, "No coordinates found"
        end
      end
    end
  end
end
