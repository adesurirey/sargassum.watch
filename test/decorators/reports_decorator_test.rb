# frozen_string_literal: true

require "test_helper"

class ReportsDecoratorTest < Draper::TestCase
  test "should format collection as a valid geoJSON" do
    create_list(:report, 10, :low)
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
end
