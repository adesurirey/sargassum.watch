# frozen_string_literal: true

require "test_helper"

class ReportDecoratorTest < Draper::TestCase
  test "should return created_at in a fomatted string" do
    report = create(:report).decorate
    assert_equal "less than a minute ago", report.created_ago
  end

  test "should return a valid geoJSON feature" do
    report = create(:report).decorate

    feature = report.as_geo_json

    assert_kind_of Hash, feature
    assert feature.key?(:type)
    assert feature.key?(:geometry)
    assert feature.key?(:properties)

    assert_equal "Feature", feature[:type]
    assert_equal "Point", feature[:geometry][:type]
    assert_equal report.lon_lat, feature[:geometry][:coordinates]
    assert_equal report.id, feature[:properties][:id]
    assert_equal report.numeric_level, feature[:properties][:level]
    assert_equal report.created_ago, feature[:properties][:createdAgo]
  end
end
