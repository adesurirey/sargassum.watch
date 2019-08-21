# frozen_string_literal: true

require "test_helper"

class Assets::KMLTest < ActiveSupport::TestCase
  test "should return a hash of placemarks from a kml file" do
    kml = Assets::KML.new(file_fixture("valid_placemarks.kml"))

    assert_equal "2019 - Beaches without sargassum", kml.name
    assert_equal 60, kml.placemarks.size
    assert_equal 0, kml.errors.size

    assert kml.placemarks.all? { |placemark| placemark.class == Hash }
    assert kml.placemarks.all? { |placemark| placemark[:created_at].class == DateTime }
    assert kml.placemarks.all? { |placemark| placemark[:latitude].class == Float }
    assert kml.placemarks.all? { |placemark| placemark[:longitude].class == Float }
  end

  test "should accept custom placemark attributes" do
    custom_attributes = {
      level:      :low,
      session_id: SecureRandom.hex,
    }

    kml = Assets::KML.new(
      file_fixture("invalid_placemarks.kml"),
      custom_attributes,
    )

    assert_equal custom_attributes[:level], kml.placemarks.first[:level]
    assert_equal custom_attributes[:session_id], kml.placemarks.first[:session_id]
    assert kml.placemarks.all? { |placemark| placemark[:created_at] }
    assert kml.placemarks.all? { |placemark| placemark[:latitude] }
    assert kml.placemarks.all? { |placemark| placemark[:longitude] }
  end

  test "should ignore invalid placemarks" do
    kml = Assets::KML.new(file_fixture("invalid_placemarks.kml"))

    assert_equal "2019 - Beaches without sargassum", kml.name
    assert_equal 1, kml.placemarks.size
    assert_equal 7, kml.errors.size
    assert_equal "No date found in name: Riu dunamar - Riviera Maya", kml.errors.first
  end
end
