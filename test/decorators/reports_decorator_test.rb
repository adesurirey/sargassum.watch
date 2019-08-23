# frozen_string_literal: true

require "test_helper"

class ReportsDecoratorTest < Draper::TestCase
  test "should format collection as a valid geoJSON" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    reports = Report.all.decorate
    geo_json = reports.as_geo_json

    assert_kind_of Hash, geo_json
    assert geo_json.key?(:type)
    assert geo_json.key?(:features)

    assert_equal "FeatureCollection", geo_json[:type]
    assert_equal reports.first.as_geo_json, geo_json[:features].first
  end

  test "should return json" do
    create_list(:report, 10)

    reports = Report.all.decorate
    assert_kind_of String, reports.to_geo_json
  end
end
