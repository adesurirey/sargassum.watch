# frozen_string_literal: true

module CachableGeoJSONConcern
  extend ActiveSupport::Concern

  included do
    after_commit :create_geojson_cache

    private

    def create_geojson_cache
      self.class.create_geojson_cache
    end
  end

  module ClassMethods
    def without_cache_callback
      skip_callback(:commit, :after, :create_geojson_cache, raise: false)
      yield
      set_callback(:commit, :after, :create_geojson_cache, raise: false)
    end
  end
end
