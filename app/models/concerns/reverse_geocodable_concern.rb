# frozen_string_literal: true

module ReverseGeocodableConcern
  extend ActiveSupport::Concern

  included do
    before_create :reverse_geocode, if: :should_geocode?

    reverse_geocoded_by :latitude, :longitude do |record, results|
      next unless results.any?

      # Nominatim-specific result handling.
      address = results.first.data["address"]
      return if address.blank?

      # First key in hash is often a precise place name,
      # but it can also be a street number.
      address.keys.each do |key|
        next if integer?(address[key])

        record.name = address[key]
        break
      end
    end

    private

    def should_geocode?
      name.blank?
    end
  end

  module ClassMethods
    def integer?(string)
      string.to_i.to_s == string
    end
  end
end
