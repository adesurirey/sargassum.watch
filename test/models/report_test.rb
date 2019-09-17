# frozen_string_literal: true

# == Schema Information
#
# Table name: reports
#
#  id         :bigint           not null, primary key
#  latitude   :float            not null
#  level      :integer          not null
#  longitude  :float            not null
#  name       :string
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
    clear = Report.new(
      latitude:   Faker::Address.latitude,
      longitude:  Faker::Address.longitude,
      level:      :clear,
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

    assert clear.valid?
    assert moderate.valid?
    assert critical.valid?
  end

  test "should not be valid" do
    report = Report.new

    assert_not report.valid?
    assert_includes map_errors(report, :latitude), :not_a_number
    assert_includes map_errors(report, :longitude), :not_a_number
    assert_includes map_errors(report, :level), :blank
    assert_includes map_errors(report, :session_id), :blank

    report.latitude = 180
    report.longitude = -200

    assert_not report.valid?
    assert_includes map_errors(report, :latitude), :less_than_or_equal_to
    assert_includes map_errors(report, :longitude), :greater_than_or_equal_to
  end

  test "should not be in the future" do
    future = 3.days.from_now
    report = build(:report, created_at: future, updated_at: future)

    assert_not report.valid?
    assert_includes map_errors(report, :created_at), :invalid
    assert_includes map_errors(report, :updated_at), :invalid
  end

  test "should be ordered by ascendant updated_at" do
    create_list(:report, 10)
    report = Report.first.tap(&:touch)

    assert_not_equal report, Report.first
    assert_equal report, Report.last
  end

  test "should only return infested reports" do
    create_list(:report, 2, :clear)
    create_list(:report, 2, :moderate)
    create_list(:report, 2, :critical)

    reports = Report.infested

    assert_equal 4, reports.size
    assert_not reports.any?(&:clear?)
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

  test "should not trigger a geocoder lookup when name is set" do
    report = build(:report)
    init_name = report.name

    assert report.save
    assert_equal init_name, report.name
  end

  test "should be reverse geocoded with most accurate place name" do
    report = build(:report, :sugiton, name: nil)

    assert report.save
    assert_equal "Sentier des Treize Contours", report.name
  end

  test "should filter reports in a given km perimeter" do
    report = create(:report, :sugiton)

    results = Report.near(report.geocoder_coordinates, 1)
    assert_equal 1, results.size
    assert_equal report, results.first

    results = Report.near(coordinates_array(:sugiton_beach, :geocoder), 1)
    assert_equal 1, results.size
    assert_equal report, results.first
  end

  test "should find a nearby report created by same user on same day and update it" do
    report = create(:report, :sugiton, :critical)
    coords = coordinates_hash(:sugiton_beach)
    params = report_params(
      longitude:  coords[:longitude],
      latitude:   coords[:latitude],
      session_id: report.session_id,
      level:      "clear",
    )

    result = Report.find_or_initialize_by(params)

    assert_equal report, result
    assert result.level_changed?
  end

  test "should initialize a valid new record from params" do
    report = create(:report, :sugiton, :critical)
    coords = coordinates_hash(:morgiou)
    params = report_params(
      longitude:  coords[:longitude],
      latitude:   coords[:latitude],
      session_id: report.session_id,
      level:      :clear,
    )

    result = Report.find_or_initialize_by(params)

    assert result.new_record?
    assert result.valid?
  end

  test "should return all as geoJSON" do
    create_list(:report, 10, :clear)
    create_list(:report, 10, :moderate)
    create_list(:report, 10, :critical)

    geo_json = Report.cached_geo_json
    assert_kind_of String, geo_json

    geo_json = JSON.parse geo_json
    assert_equal 30, geo_json["features"].size
  end

  test "should update geoJSON cache" do
    assert_enqueued_with job: CreateReportsGeoJsonCacheJob do
      create(:report)
    end

    report = build(:report, :critical)

    assert_enqueued_with job: CreateReportsGeoJsonCacheJob do
      assert report.save
    end

    assert_enqueued_with job: CreateReportsGeoJsonCacheJob do
      assert report.clear!
    end
  end

  test "should not update geoJSON cache" do
    report = create(:report)
    assert_no_enqueued_jobs only: CreateReportsGeoJsonCacheJob do
      assert report.touch
    end

    report = build(:report, :critical)
    Report.skip_callback(:save, :after, :create_geo_json_cache, raise: false)
    assert_no_enqueued_jobs only: CreateReportsGeoJsonCacheJob do
      assert report.save
      assert report.clear!
      assert Report.create(build(:report).attributes)
    end

    Report.set_callback(:save, :after, :create_geo_json_cache, raise: false)
    assert_enqueued_with job: CreateReportsGeoJsonCacheJob do
      create(:report)
    end
  end

  test "should return possible report values and labels" do
    expected = [
      { value: 0, label: "clear" },
      { value: 1, label: "moderate" },
      { value: 2, label: "critical" },
    ]

    assert_equal expected, Report.formatted_levels
  end

  private

  def report_params(attributes)
    ActionController::Parameters
      .new(report: attributes)
      .require(:report).permit(:level, :longitude, :latitude, :session_id)
  end

  def map_errors(record, attribute)
    record.errors.details[attribute].map { |e| e[:error] }
  end
end
