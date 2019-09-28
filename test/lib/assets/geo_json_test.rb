# frozen_string_literal: true

require "test_helper"

class Assets::GeoJsonTest < ActiveSupport::TestCase
  test "should return a valid geoJSON from datasets and reports" do
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 1", reports: Report.all)
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 2", reports: Report.all)
    create_list(:report, 2)

    assert_equal 2, Report.count
    assert_equal 2, Dataset.count

    geo_json = Assets::GeoJson.generate(datasets: Dataset.all, reports: Report.all)
    assert_kind_of String, geo_json

    geo_json = JSON.parse geo_json
    assert_equal "FeatureCollection", geo_json["type"]
    assert_equal 6, geo_json["features"].size
  end

  test "should sort features by ascendant updated_at" do
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 1", reports: Report.all)
    create_list(:report, 2)
    Dataset.pack_reports!(name: "Pack 2", reports: Report.all)
    create(:report)
    first_report = create(:report, name: "First report", updated_at: 1.day.ago)

    geo_json = Assets::GeoJson.generate(datasets: Dataset.all, reports: Report.all)
    geo_json = JSON.parse geo_json

    assert_equal 6, geo_json["features"].size
    assert_equal first_report.id, geo_json["features"].first["properties"]["id"]
  end
end
