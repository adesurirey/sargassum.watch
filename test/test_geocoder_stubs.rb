# frozen_string_literal: true

# Add here addresses or coordinates lookup you want to stub.
# Results are Nominatim-specific.
#
addresses = {
  [43.217595, 5.4557003] => {
    "place_id"     => 73_734_627,
    "licence"      => "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type"     => "way",
    "osm_id"       => 12_368_631,
    "lat"          => "43.2163891",
    "lon"          => "5.4559391",
    "display_name" => "Sentier des Treize Contours, Marseille, France",
    "address"      => {
      "path"          => "Sentier des Treize Contours",
      "suburb"        => "Le Redon",
      "city_district" => "Marseille 9e Arrondissement",
      "city"          => "Marseille",
      "county"        => "Marseille",
      "state"         => "Provence-Alpes-Côte d'Azur",
      "country"       => "France",
      "postcode"      => "13009",
      "country_code"  => "fr",
    },
    "boundingbox"  => ["43.2159685", "43.2171552", "5.4546957", "5.4576363"],
  },
}

Geocoder.configure(lookup: :test, ip_lookup: :test)
addresses.each { |lookup, results| Geocoder::Lookup::Test.add_stub(lookup, [results]) }
