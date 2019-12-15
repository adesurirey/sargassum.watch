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
#  source     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :string           not null
#
# Indexes
#
#  index_reports_on_latitude_and_longitude  (latitude,longitude)
#

require "test_helper"

class ReportTest < ActiveSupport::TestCase
  test "should be valid" do
    clear = Report.new(
      latitude:  Faker::Address.latitude,
      longitude: Faker::Address.longitude,
      level:     :clear,
      user_id:   SecureRandom.hex,
    )
    moderate = Report.new(
      latitude:  Faker::Address.latitude,
      longitude: Faker::Address.longitude,
      level:     :moderate,
      user_id:   SecureRandom.hex,
    )
    critical = Report.new(
      latitude:  Faker::Address.latitude,
      longitude: Faker::Address.longitude,
      level:     :critical,
      user_id:   SecureRandom.hex,
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
    assert_includes map_errors(report, :user_id), :blank

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

    assert_equal report.longitude, report.geojson_coordinates.first
    assert_equal report.latitude, report.geojson_coordinates.last
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
      longitude: coords[:longitude],
      latitude:  coords[:latitude],
      user_id:   report.user_id,
      level:     "clear",
    )

    result = Report.find_or_initialize_for_user(params)

    assert_equal report, result
    assert result.level_changed?
  end

  test "should find an already scrapped report by placemark attributes" do
    report = create(:report, :sugiton, :critical)

    placemark = {
      created_at: report.created_at,
      level:      report.level,
      longitude:  report.longitude,
      latitude:   report.latitude,
      user_id:    SecureRandom.hex,
    }

    result = Report.find_or_initialize_for_scrapper(placemark)

    assert_equal report, result
  end

  test "should initialize a valid new record from params" do
    report = create(:report, :sugiton, :critical)
    coords = coordinates_hash(:morgiou)
    params = report_params(
      longitude: coords[:longitude],
      latitude:  coords[:latitude],
      user_id:   report.user_id,
      level:     :clear,
    )

    result = Report.find_or_initialize_for_user(params)

    assert result.new_record?
    assert result.valid?
  end

  test "should initialize a new record by placemark attributes" do
    coords = coordinates_hash(:morgiou)

    placemark = {
      created_at: 2.days.ago,
      level:      :clear,
      longitude:  coords[:longitude],
      latitude:   coords[:latitude],
      user_id:    SecureRandom.hex,
    }

    result = Report.find_or_initialize_for_scrapper(placemark)

    assert result.new_record?
    assert result.valid?
  end

  test "should return all reports and datasets as geoJSON" do
    create_list(:report, 10, :clear)
    Dataset.pack_reports!(name: "all", reports: Report.all)
    create_list(:report, 10, :critical)

    geojson = Report.cached_geojson
    assert_kind_of String, geojson

    geojson = Oj.load geojson
    assert_equal 20, geojson["features"].size
  end

  test "should update geoJSON cache" do
    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      create(:report)
    end

    report = build(:report, :critical)

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      assert report.save
    end

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      assert report.clear!
    end

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      assert report.update(name: "New name")
    end

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      assert report.destroy
    end
  end

  test "should not update geoJSON cache" do
    Report.without_cache_callback do
      assert_no_enqueued_jobs only: CreateReportsGeoJSONCacheJob do
        create(:report)
      end
    end

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      create(:report)
    end
  end

  test "should return possible report values and labels" do
    expected = [
      { value: 0, label: "clear" },
      { value: 1, label: "moderate" },
      { value: 2, label: "na" },
      { value: 3, label: "critical" },
    ]

    assert_equal expected, Report.formatted_levels
  end

  test "can have a source" do
    report = build(:report, source: "sargassummonitoring.com")
    assert_equal "sargassummonitoring.com", report.source
  end

  test "should have source scopes" do
    scrapped = create(:report, source: "some source")
    original = create(:report, source: nil)

    assert_equal 1, Report.scrapped.size
    assert_equal scrapped, Report.scrapped.first
    assert_equal 1, Report.original.size
    assert_equal original, Report.original.first
  end

  test "should have a photo attachment" do
    report = build(:report)

    assert_not report.photo.attached?
  end

  test "should be updatable" do
    report = create(:report)
    params = report_params(
      user_id:   report.user_id,
      latitude:  report.latitude,
      longitude: report.longitude + 0.0005,
    )

    assert report.can_update?(params)
  end

  test "should not be updatable" do
    report = create(:report)
    params = report_params(
      user_id:   report.user_id,
      latitude:  report.latitude,
      longitude: report.longitude,
    )

    assert_not report.can_update?(params.merge(user_id: SecureRandom.hex))
    assert_not report.can_update?(params.merge(longitude: report.longitude + 1))

    report.update!(updated_at: 1.day.ago)
    assert_not report.can_update?(params)
  end

  private

  def report_params(attributes)
    ActionController::Parameters
      .new(report: attributes)
      .require(:report).permit(:level, :longitude, :latitude, :user_id)
  end

  def map_errors(record, attribute)
    record.errors.details[attribute].map { |e| e[:error] }
  end
end
