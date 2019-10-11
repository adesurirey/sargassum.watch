# frozen_string_literal: true

require "test_helper"

class ReportDecoratorTest < Draper::TestCase
  test "should return a valid geoJSON feature" do
    report = create(:report, source: "somesource.com").decorate

    feature = report.as_geojson

    assert_kind_of Hash, feature
    assert feature.key?(:type)
    assert feature.key?(:geometry)
    assert feature.key?(:properties)

    assert_equal "Feature", feature[:type]

    geometry = feature[:geometry]
    assert_equal "Point", geometry[:type]
    assert_equal report.geojson_coordinates, geometry[:coordinates]

    properties = feature[:properties]
    assert_equal report.id, properties[:id]
    assert_equal report.name, properties[:name]
    assert_equal report.numeric_level, properties[:level]
    assert_equal report.level, properties[:humanLevel]
    assert_equal report.updated_at.httpdate, properties[:updatedAt]
    assert_equal report.source, properties[:source]
  end

  test "should return json" do
    report = create(:report).decorate
    assert_kind_of String, report.to_geojson
  end

  test "should return level enum as numeric" do
    report = build(:report).decorate

    assert_kind_of Integer, report.numeric_level
  end

  test "should not return empty string for nil source" do
    report = create(:report, source: nil).decorate

    assert_equal "", report.as_geojson[:properties][:source]
  end
end
