# frozen_string_literal: true

require "test_helper"

class WebcamsControllerTest < ActionDispatch::IntegrationTest
  test "index should return all webcams as a geoJSON" do
    create_list(:webcam, 5, :youtube)
    create_list(:webcam, 5, :image)

    get webcams_path, headers: json_headers
    assert_response :success

    assert_equal "FeatureCollection", body["type"]
    assert_equal 10, body["features"].size
  end

  test "index should return geoJSON from cache" do
    create_list(:webcam, 10)
    get webcams_path, headers: json_headers
    etag = response.headers["etag"]

    get webcams_path, headers: json_headers
    assert_equal etag, response.headers["etag"]

    create(:webcam)

    get webcams_path, headers: json_headers
    assert_not_equal etag, response.headers["etag"]
  end

  test "index should regenerate cached geoJSON" do
    create_list(:webcam, 10)
    get webcams_path, headers: json_headers
    etag = response.headers["etag"]
    create(:webcam)

    get webcams_path, headers: json_headers
    assert_not_equal etag, response.headers["etag"]
  end
end
