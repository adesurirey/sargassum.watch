# frozen_string_literal: true

require "test_helper"

class ReportsDecoratorTest < Draper::TestCase
  test "should format collection as a valid geoJSON" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    reports = Report.all.decorate
    geojson = reports.as_geojson

    assert_kind_of Hash, geojson
    assert geojson.key?(:type)
    assert geojson.key?(:features)

    assert_equal "FeatureCollection", geojson[:type]
    assert_equal reports.first.as_geojson, geojson[:features].first
  end

  test "should return json" do
    create_list(:report, 10)

    reports = Report.all.decorate
    assert_kind_of String, reports.to_geojson
  end
end
