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

  test "index should only return clear reports" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    get reports_path(level: "clear"), headers: json_headers
    assert_response :success

    assert_equal 10, body["features"].size
    assert_equal 0, body["features"].sample["properties"]["level"]
  end

  test "index should only return moderate reports" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    get reports_path(level: "moderate"), headers: json_headers
    assert_response :success

    assert_equal 10, body["features"].size
    assert_equal 1, body["features"].sample["properties"]["level"]
  end

  test "index should only return critical reports" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    get reports_path(level: "critical"), headers: json_headers
    assert_response :success

    assert_equal 10, body["features"].size
    assert_equal 2, body["features"].sample["properties"]["level"]
  end

  test "index should only return reports updated within 24 hours" do
    first = create(:report, updated_at: Time.current - 23.hours)
    last = create(:report, updated_at: Time.current)
    create(:report, updated_at: Time.current - 2.days)

    get reports_path(range: "last_24_hours"), headers: json_headers
    assert_response :success

    assert_equal 2, body["features"].size
    assert_equal first.id, body["features"].first["properties"]["id"]
    assert_equal last.id, body["features"].last["properties"]["id"]
  end

  test "index should only return reports updated within 7 days" do
    first = create(:report, updated_at: Time.current - 6.days)
    last = create(:report, updated_at: Time.current)
    create(:report, updated_at: Time.current - 7.days)

    get reports_path(range: "last_7_days"), headers: json_headers
    assert_response :success

    assert_equal 2, body["features"].size
    assert_equal first.id, body["features"].first["properties"]["id"]
    assert_equal last.id, body["features"].last["properties"]["id"]
  end

  test "index should only return reports updated within 30 days" do
    first = create(:report, updated_at: Time.current - 29.days)
    last = create(:report, updated_at: Time.current)
    create(:report, updated_at: Time.current - 30.days)

    get reports_path(range: "last_30_days"), headers: json_headers
    assert_response :success

    assert_equal 2, body["features"].size
    assert_equal first.id, body["features"].first["properties"]["id"]
    assert_equal last.id, body["features"].last["properties"]["id"]
  end

  test "index should only return reports updated within 12 months" do
    first = create(:report, updated_at: Time.current - 11.months)
    last = create(:report, updated_at: Time.current)
    create(:report, updated_at: Time.current - 2.years)

    get reports_path(range: "last_12_months"), headers: json_headers
    assert_response :success

    assert_equal 2, body["features"].size
    assert_equal first.id, body["features"].first["properties"]["id"]
    assert_equal last.id, body["features"].last["properties"]["id"]
  end

  test "index should only return critical reports within 24 hours" do
    first = create(:report, :critical, updated_at: Time.current - 23.hours)
    last = create(:report, :critical, updated_at: Time.current)
    create(:report, :critical, updated_at: Time.current - 2.days)
    create(:report, :moderate, updated_at: Time.current - 2.hours)

    get reports_path(range: "last_24_hours", level: "critical"), headers: json_headers
    assert_response :success

    assert_equal 2, body["features"].size
    assert_equal first.id, body["features"].first["properties"]["id"]
    assert_equal last.id, body["features"].last["properties"]["id"]
  end
end
