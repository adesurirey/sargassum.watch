# frozen_string_literal: true

module Assets
  class KML
    class Placemark
      class DateFinder
        DATE_REGEX = %r{\d{2}(/|\s)\d{2}(/|\s)\d{4}}.freeze
        DATE_REGEX_NO_DAY = %r{\d{2}(/|\s)\d{4}}.freeze
        DATE_REGEX_019 = %r{\d{2}/\d{2}/019}.freeze

        attr_reader :result

        class << self
          def call(placemark_name)
            new(placemark_name).result
          end
        end

        private

        def initialize(placemark_name)
          @name = placemark_name
          @result = find_date
        end

        def find_date
          date = @name[DATE_REGEX]
          date = try_unclear_date_formats if date.blank?
          date
        end

        def try_unclear_date_formats
          try_no_day_date || try_019_date
        end

        def try_no_day_date
          @name[DATE_REGEX_NO_DAY].tap do |date|
            date&.prepend("01/")
          end
        end

        def try_019_date
          date = @name[DATE_REGEX_019]
          return if date.blank?

          date = date.split("/")
          year = date.pop

          date.push(year.prepend("2")).join("/")
        end
      end
    end
  end
end
