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

    geometry = feature[:geometry]
    assert_equal "Point", geometry[:type]
    assert_equal report.geo_json_coordinates, geometry[:coordinates]

    properties = feature[:properties]
    assert_equal report.id, properties[:id]
    assert_equal report.name, properties[:name]
    assert_equal report.numeric_level, properties[:level]
    assert_equal report.created_ago, properties[:createdAgo]
  end
end
