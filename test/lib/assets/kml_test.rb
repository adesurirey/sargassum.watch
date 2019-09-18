# frozen_string_literal: true

require "test_helper"

class Assets::KMLTest < ActiveSupport::TestCase
  test "should return a hash of placemarks" do
    kml = Assets::KML.new(file_fixture("valid_placemarks.kml"))

    assert_equal "Valid placemarks", kml.name
    assert_equal 60, kml.placemarks.size
    assert_equal 0, kml.errors.size

    assert kml.placemarks.all?
  end

  test "should merge custom placemark attributes" do
    custom_attributes = {
      level:   :clear,
      user_id: SecureRandom.hex,
    }

    kml = Assets::KML.new(
      file_fixture("valid_placemarks.kml"),
      custom_attributes,
    )

    first = kml.placemarks.first
    last = kml.placemarks.last

    assert_equal custom_attributes[:level], first[:level]
    assert_equal custom_attributes[:user_id], first[:user_id]
    assert first[:name].present?
    assert first[:updated_at].present?
    assert first[:latitude].present?
    assert first[:longitude].present?

    assert_equal custom_attributes[:level], first[:level]
    assert_equal custom_attributes[:user_id], first[:user_id]

    assert_not_equal first[:name], last[:name]
    assert_not_equal first[:latitude], last[:latitude]
    assert_not_equal first[:longitude], last[:longitude]
    assert_not_equal first[:updated_at], last[:updated_at]
  end

  test "should ignore invalid placemarks and store errors" do
    kml = Assets::KML.new(file_fixture("invalid_placemarks.kml"))

    assert_equal "Invalid placemarks", kml.name
    assert_equal 1, kml.placemarks.size
    assert_equal 7, kml.errors.size

    assert_equal "No date found in name: Riu dunamar - Riviera Maya", kml.errors.first
    assert_equal "No date found in name: 01/01/219 Riu dunamar - Riviera Maya", kml.errors[1]
    assert_equal "Invalid date in name: 31/02/2019 Riu dunamar - Riviera Maya", kml.errors[2]
    assert_equal "No name found", kml.errors[3]
    assert_equal "No name found", kml.errors[4]
    assert_equal "No coordinates found", kml.errors[5]
    assert_equal "No coordinates found", kml.errors.last
  end
end
