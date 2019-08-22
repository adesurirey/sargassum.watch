# frozen_string_literal: true

require "test_helper"

class ReportsControllerTest < ActionDispatch::IntegrationTest
  test "index should return all reports as geoJSON" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    get reports_path, headers: json_headers
    assert_response :success

    assert_equal "FeatureCollection", body["type"]
    assert_equal 30, body["features"].size

    feature = body["features"].sample
    assert_equal %w[type geometry properties], feature.keys

    type = feature["type"]
    assert_equal "Feature", type

    geometry = feature["geometry"]
    assert_equal "Point", geometry["type"]
    assert_equal 2, geometry["coordinates"].size
    assert_kind_of Float, geometry["coordinates"].first
    assert_kind_of Float, geometry["coordinates"].last

    properties = feature["properties"]
    assert_kind_of Integer, properties["id"]
    assert_kind_of String, properties["name"]
    assert_kind_of Integer, properties["level"]
    assert_kind_of String, properties["createdAgo"]
  end
end
