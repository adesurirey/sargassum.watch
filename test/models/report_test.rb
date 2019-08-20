# frozen_string_literal: true

# == Schema Information
#
# Table name: reports
#
#  id         :bigint           not null, primary key
#  latitude   :float            not null
#  level      :integer          not null
#  longitude  :float            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  session_id :string           not null
#
# Indexes
#
#  index_reports_on_latitude_and_longitude  (latitude,longitude)
#

require "test_helper"

class ReportTest < ActiveSupport::TestCase
  test "should be valid" do
    low = Report.new(
      latitude:   Faker::Address.latitude,
      longitude:  Faker::Address.longitude,
      level:      :low,
      session_id: SecureRandom.hex,
    )
    moderate = Report.new(
      latitude:   Faker::Address.latitude,
      longitude:  Faker::Address.longitude,
      level:      :moderate,
      session_id: SecureRandom.hex,
    )
    critical = Report.new(
      latitude:   Faker::Address.latitude,
      longitude:  Faker::Address.longitude,
      level:      :critical,
      session_id: SecureRandom.hex,
    )

    assert low.valid?
    assert moderate.valid?
    assert critical.valid?
  end

  test "should not be valid" do
    report = Report.new

    assert_not report.valid?

    assert_includes map_errors(report, :latitude), :blank
    assert_includes map_errors(report, :longitude), :blank
    assert_includes map_errors(report, :level), :blank
    assert_includes map_errors(report, :session_id), :blank
  end

  test "should only return infested reports" do
    create_list(:report, 2, :low)
    create_list(:report, 2, :moderate)
    create_list(:report, 2, :critical)

    reports = Report.infested

    assert_equal 4, reports.size
    assert_not reports.any?(&:low?)
  end

  test "should return a valid geoJSON coordinates array" do
    report = build(:report)

    assert_equal report.longitude, report.geo_json_coordinates.first
    assert_equal report.latitude, report.geo_json_coordinates.last
  end

  test "should return a valid geocoder coordinates array" do
    report = build(:report)

    assert_equal report.latitude, report.geocoder_coordinates.first
    assert_equal report.longitude, report.geocoder_coordinates.last
  end

  test "should return level enum as numeric" do
    report = build(:report)

    assert_kind_of Integer, report.numeric_level
  end

  test "should be geocoded" do
    create(:report)

    assert_not_empty Report.geocoded
    assert_empty Report.not_geocoded
  end

  test "should filter reports in a given km radius" do
    report = create(:report, :sugiton)

    results = Report.near(report.geocoder_coordinates, 1)
    assert_equal 1, results.size
    assert_equal report, results.first

    results = Report.near([43.210767, 5.45597], 1)
    assert_equal 1, results.size
    assert_equal report, results.first
  end

  private

  def map_errors(record, attribute)
    record.errors.details[attribute].map { |e| e[:error] }
  end
end
