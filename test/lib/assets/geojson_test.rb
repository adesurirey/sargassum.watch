# frozen_string_literal: true

require "test_helper"

class Assets::GeoJSONTest < ActiveSupport::TestCase
  test "should return a valid geoJSON from datasets and reports" do
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 1", reports: Report.all)
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 2", reports: Report.all)
    create_list(:report, 2)

    assert_equal 2, Report.count
    assert_equal 2, Dataset.count

    geojson = Assets::GeoJSON.generate(datasets: Dataset.all, reports: Report.all)
    assert_kind_of String, geojson

    geojson = JSON.parse geojson
    assert_equal "FeatureCollection", geojson["type"]
    assert_equal 6, geojson["features"].size
  end

  test "should sort features by ascendant updated_at" do
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 1", reports: Report.all)
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 2", reports: Report.all)
    create(:report)
    first_report = create(:report, name: "First report", updated_at: 1.day.ago)

    geojson = Assets::GeoJSON.generate(datasets: Dataset.all, reports: Report.all)
    geojson = JSON.parse geojson

    assert_equal 6, geojson["features"].size
    assert_equal first_report.id, geojson["features"].first["properties"]["id"]
  end
end
