# frozen_string_literal: true

require "test_helper"

class Api::V1::ReportsControllerTest < ActionDispatch::IntegrationTest
  test "index should return all reports as a geoJSON" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    get api_v1_reports_path, headers: json_headers
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
    assert_kind_of String, properties["humanLevel"]
    assert_kind_of String, properties["photo"]
    assert_kind_of String, properties["updatedAt"]
  end

  test "index should return geoJSON from cache" do
    create_list(:report, 10, :clear)
    get api_v1_reports_path, headers: json_headers
    etag = response.headers["etag"]

    get api_v1_reports_path, headers: json_headers
    assert_equal etag, response.headers["etag"]

    create(:report)

    get api_v1_reports_path, headers: json_headers
    assert_not_equal etag, response.headers["etag"]
  end

  test "index should regenerate cached geoJSON" do
    create_list(:report, 10, :clear)
    get api_v1_reports_path, headers: json_headers
    etag = response.headers["etag"]
    create(:report)

    get api_v1_reports_path, headers: json_headers
    assert_not_equal etag, response.headers["etag"]
  end

  test "create should create new reports" do
    clear = report_params { coordinates_hash(:sugiton).merge(level: "clear") }
    assert_difference "Report.count", 1 do
      assert_difference "Report.clear.count", 1 do
        post api_v1_reports_path, params: clear, headers: auth_headers
      end
    end
    assert_response :created

    moderate = report_params { coordinates_hash(:morgiou).merge(level: "moderate") }
    assert_difference "Report.count", 1 do
      assert_difference "Report.moderate.count", 1 do
        post api_v1_reports_path, params: moderate, headers: auth_headers
      end
    end
    assert_response :created

    critical = report_params { coordinates_hash(:podestat).merge(level: "critical") }
    assert_difference "Report.count", 1 do
      assert_difference "Report.critical.count", 1 do
        post api_v1_reports_path, params: critical, headers: auth_headers
      end
    end
    assert_response :created
  end

  test "create should return created report as a geoJSON feature" do
    params = report_params { coordinates_hash(:sugiton).merge(level: "critical") }
    post api_v1_reports_path, params: params, headers: auth_headers

    assert_response :success
    assert_equal %w[type geometry properties], body.keys
    assert_equal "Feature", body["type"]
    assert_kind_of Integer, body["properties"]["id"]
    assert_not_nil body["properties"]["name"]
    assert body["properties"]["canUpdate"]
  end

  test "create should update users report already created at same place within 24h" do
    moderate = report_params { coordinates_hash(:sugiton).merge(level: "moderate") }
    post api_v1_reports_path, params: moderate, headers: auth_headers
    assert_response :created
    id = body["properties"]["id"]

    critical = report_params { coordinates_hash(:sugiton).merge(level: "critical") }
    assert_no_difference "Report.count" do
      assert_difference "Report.critical.count", 1 do
        post api_v1_reports_path, params: critical, headers: auth_headers
      end
    end
    assert_response :ok
    assert_equal id, body["properties"]["id"]
    assert body["properties"]["canUpdate"]
  end

  test "create should return unprocessable entity errors" do
    params = report_params { coordinates_hash(:sugiton) }

    assert_no_difference "Report.count" do
      post api_v1_reports_path, params: params, headers: auth_headers
    end
    assert_response :unprocessable_entity
    assert_equal "can't be blank", body["errors"]["level"].first
  end

  test "create should not error without a x-fingerprint header" do
    params = report_params { coordinates_hash(:sugiton).merge(level: "moderate") }

    assert_difference "Report.count", 1 do
      post api_v1_reports_path, params: params, headers: json_headers
    end
    assert_response :success
  end

  test "update should attach a photo to a report" do
    report = create(:report)
    params = report.attributes.slice("latitude", "longitude").merge(photo: photo_upload)

    patch api_v1_report_path(report.id),
          params:  params,
          headers: auth_headers(report.user_id)

    assert_response :ok
    assert report.reload.photo.attached?
    assert body["properties"]["canUpdate"]
  end

  test "update should return forbidden when report isn't updatable" do
    report = create(:report, updated_at: 2.days.ago)
    params = report.attributes.merge(photo: photo_upload)

    patch api_v1_report_path(report.id),
          params:  params,
          headers: auth_headers(report.user_id)

    assert_response :forbidden
  end

  private

  def report_params
    { report: yield }
  end

  def photo_upload
    fixture_file_upload(
      Rails.root.join("test", "fixtures", "files", "photo.jpg"),
      "image/jpg",
    )
  end

  def assert_same_http_header(name, msg = nil, &block)
    assert_same_http_header_after_each(name, [-> {}], msg, &block)
  end

  def assert_different_http_header(name, msg = nil, &block)
    assert_different_http_header_after_each(name, [-> {}], msg, &block)
  end
end
