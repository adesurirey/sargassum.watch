# frozen_string_literal: true

# NOTE: Use it to get coordinates of known points
#
# - Sugiton and Sugiton beach are less than a km of distance
# - Sugiton and Morgiou are more than a km of distance
#
module TestCoordinatesHelper
  PLACES = {
    sugiton:       { latitude: 43.217595, longitude: 5.4557003 },
    sugiton_beach: { latitude: 43.210767, longitude: 5.4568787 },
    morgiou:       { latitude: 43.212772, longitude: 5.4449099 },
    podestat:      { latitude: 43.2103943, longitude: 5.3814709 },
  }.freeze

  def coordinates_array(id, format)
    latitude, longitude = PLACES.fetch(id).values_at(:latitude, :longitude)

    return [latitude, longitude] if format == :geocoder
    return [longitude, latitude] if format == :geojson

    fail StandardError, "Unknown coordinates format: #{format}, formats: [:geocoder, :geojson]"
  end

  def coordinates_hash(id)
    PLACES.fetch(id)
  end
end
