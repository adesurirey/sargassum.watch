# frozen_string_literal: true

# Add here addresses or coordinates lookup you want to stub.
# Results are Nominatim-specific.
#
addresses = {
  [43.217595, 5.4557003]  => {
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

  [43.2103943, 5.3814709] => {
    "place_id"     => 113_491_273,
    "licence"      => "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type"     => "way",
    "osm_id"       => 158_942_787,
    "lat"          => "43.2104301189751",
    "lon"          => "5.38147195695337",
    "display_name" => "Sentier des Douaniers, Marseilleveyre, Marseille, France",
    "address"      => {
      "path"          => "Sentier des Douaniers",
      "suburb"        => "Marseilleveyre",
      "city_district" => "8th arrondissement of Marseille",
      "city"          => "Marseille",
      "county"        => "Marseille",
      "state"         => "Provence-Alpes-Côte d'Azur",
      "country"       => "France",
      "postcode"      => "13008",
      "country_code"  => "fr",
    },
    "boundingbox"  => ["43.2077214", "43.2124073", "5.3539176", "5.3826675"],
  },

  [43.212772, 5.4449099]  => {
    "place_id"     => 86_638_947,
    "licence"      => "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type"     => "way",
    "osm_id"       => 40_254_502,
    "lat"          => "43.2133356577208",
    "lon"          => "5.44493125701618",
    "display_name" => "Sentier de Morgiou, Luminy, Marseille, Bouches-du-Rhône, France",
    "address"      => {
      "path"          => "Sentier de Morgiou",
      "neighbourhood" => "Luminy",
      "suburb"        => "Lei Baumetas",
      "city_district" => "Marseille 9e Arrondissement",
      "city"          => "Marseille",
      "county"        => "Marseille",
      "state"         => "Provence-Alpes-Côte d'Azur",
      "country"       => "France",
      "postcode"      => "13009",
      "country_code"  => "fr",
    },
    "boundingbox"  => ["43.2126776", "43.219922", "5.440542", "5.4459065"],
  },
}

Geocoder.configure(lookup: :test, ip_lookup: :test)
addresses.each { |lookup, results| Geocoder::Lookup::Test.add_stub(lookup, [results]) }
