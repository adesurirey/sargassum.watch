# frozen_string_literal: true

# == Schema Information
#
# Table name: datasets
#
#  id         :bigint           not null, primary key
#  count      :integer          not null
#  end_at     :datetime         not null
#  features   :binary           not null
#  name       :string           not null
#  start_at   :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require "test_helper"

class DatasetTest < ActiveSupport::TestCase
  test "should be valid" do
    create_reports

    set = Dataset.new(
      name:     "September 2019",
      count:    200,
      start_at: 2.month.ago,
      end_at:   1.month.ago,
      features: @reports,
    )

    assert set.valid?
    assert set.save

    assert_equal Report.all.decorate.map(&:as_geojson), set.features
  end

  test "should have a name" do
    create_reports

    set = Dataset.new(
      count:    200,
      start_at: 2.month.ago,
      end_at:   1.month.ago,
      features: @reports,
    )

    assert_not set.valid?
    assert_equal 1, set.errors.size
    assert set.errors.details[:name]
  end

  test "should have correct dates" do
    create_reports

    set = Dataset.new(
      name:     "September 2019",
      count:    200,
      features: @reports,
    )

    assert_not set.valid?
    assert_equal 2, set.errors.size
    assert set.errors.details[:start_at]
    assert set.errors.details[:end_at]

    set.start_at = DateTime.current
    set.end_at = 1.month.ago

    assert_not set.valid?
    assert_equal 1, set.errors.size
    assert set.errors.details[:end_at]
  end

  test "should have valid features" do
    set = Dataset.new(
      name:     "September 2019",
      count:    200,
      start_at: 2.month.ago,
      end_at:   1.month.ago,
    )

    assert_not set.valid?
    assert_equal 1, set.errors.size
    assert set.errors.details[:features]

    set.features = {}

    assert_not set.valid?
    assert_equal 2, set.errors.size
    assert_equal 2, set.errors.details[:features].size
  end

  test "should create from a reports and destroy packed reports" do
    query = -> { Report.where("created_at < ?", Report::MIN_DISTANCE_FROM_LAST_REPORT_IN_TIME) }

    first_report = create(:report, created_at: 1.month.ago)
    create(:report, created_at: 2.week.ago)
    last_report = create(:report, created_at: 2.day.ago)

    reports = query.call
    assert_equal 3, reports.size

    assert_nothing_raised do
      Dataset.pack_reports!(name: "All frozen reports", reports: reports)
    end

    set = Dataset.last
    assert_equal "All frozen reports", set.name
    assert_equal 3, set.count
    assert_equal first_report.updated_at, set.start_at
    assert_equal last_report.updated_at, set.end_at
    assert_equal 0, query.call.size
  end

  test "should not destroy reports when creation fails" do
    create_list(:report, 2)
    corrupted_report = build(:report, updated_at: 1.day.from_now)
    corrupted_report.save(validate: false)

    assert_no_difference "Report.count" do
      assert_no_difference "Dataset.count" do
        assert_raises ActiveRecord::RecordInvalid do
          Dataset.pack_reports!(name: "All", reports: Report.all)
        end
      end
    end
  end

  test "should update reports geoJSON cache" do
    create_list(:report, 2)

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      Dataset.pack_reports!(name: "All", reports: Report.all)
    end

    assert_enqueued_with job: CreateReportsGeoJSONCacheJob do
      Dataset.last.destroy
    end
  end

  private

  def create_reports(count = 2)
    create(:report, updated_at: 1.day.ago)
    create_list(:report, count - 1)
    @reports = Report.all.decorate.map(&:as_geojson)
  end
end
