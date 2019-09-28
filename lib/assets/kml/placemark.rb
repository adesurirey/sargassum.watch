# frozen_string_literal: true

module Assets
  class KML
    class Placemark
      InvalidNodeError = Class.new(StandardError)

      NBSP = " "

      def initialize(node_set, custom_attributes = {})
        @node = node_set
        @custom_attributes = custom_attributes

        @name = parse_name
        @created_at = parse_date
        @longitude, @latitude, _elevation = parse_coordinates
      end

      def attributes
        @custom_attributes.merge(
          name:       formatted_name,
          longitude:  @longitude,
          latitude:   @latitude,
          created_at: @created_at,
          updated_at: @created_at,
        )
      end

      private

      def formatted_name
        @name.gsub(DateFinder::DATE_REGEX, "")
             .gsub(DateFinder::DATE_REGEX_NO_DAY, "")
             .gsub(DateFinder::DATE_REGEX_019, "")
             .split("-")
             .first
             .strip
      end

      def parse_name
        name = @node.css("name")&.text
        error(:blank_name) if name.blank?

        name.tr(NBSP, " ").strip.tap do |cleaned|
          error(:blank_name) if cleaned.blank?
        end
      end

      def parse_date
        find_date&.to_datetime.tap do |date|
          error(:invalid_date) if date > DateTime.current
        end
      rescue ArgumentError
        error(:invalid_date)
      end

      def find_date
        DateFinder.call(@name).tap do |date|
          error(:blank_date) if date.blank?
        end
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
