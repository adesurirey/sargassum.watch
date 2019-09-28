# frozen_string_literal: true

module Assets
  class GeoJson
    attr_reader :result

    class << self
      def generate(datasets: [], reports: [])
        new(datasets, reports).result.to_json
      end
    end

    private

    def initialize(datasets, reports)
      features = extract_features(datasets, reports)

      @result = {
        type:     "FeatureCollection",
        features: sort(features),
      }
    end

    def extract_features(datasets, reports)
      datasets.flat_map(&:features) + reports.decorate.map(&:as_geo_json)
    end

    def sort(features)
      features.sort_by { |feature| feature[:properties][:updatedAt].to_datetime }
    end
  end
end
