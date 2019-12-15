# frozen_string_literal: true

module CachableGeoJSONConcern
  extend ActiveSupport::Concern

  included do
    attribute :skip_cache, :boolean, default: false

    after_commit :create_geojson_cache, unless: :skip_cache

    private

    def create_geojson_cache
      self.class.create_geojson_cache
    end
  end
end
