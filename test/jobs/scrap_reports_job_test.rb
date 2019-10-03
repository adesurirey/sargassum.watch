# frozen_string_literal: true

require "test_helper"

class ScrapReportsJobTest < ActiveJob::TestCase
  test "should create n/a reports form google map placemarks" do
    request = stub_scrapper(:with)

    assert_difference "Report.count", 60 do
      ScrapReportsJob.perform_now(:with)
    end

    assert_requested request
    assert_equal 60, Report.na.count
    assert_equal 0, Report.clear.count
  end

  test "should create clear reports form google map placemarks" do
    request = stub_scrapper(:without)

    assert_difference "Report.count", 60 do
      ScrapReportsJob.perform_now(:without)
    end

    assert_requested request
    assert_equal 0,  Report.na.count
    assert_equal 60, Report.clear.count
  end

  test "should not create already scrapped reports" do
    stub_scrapper(:with)

    assert_difference "Report.count", 60 do
      ScrapReportsJob.perform_now(:with)
    end

    assert_no_difference "Report.count" do
      ScrapReportsJob.perform_now(:with)
    end
  end

  test "should not create again already packed reports" do
    stub_scrapper(:with)

    assert_difference "Report.count", 60 do
      ScrapReportsJob.perform_now(:with)
    end

    Dataset.pack_reports!(name: "All", reports: Report.all)

    assert_no_difference "Report.count" do
      ScrapReportsJob.perform_now(:with)
    end
  end

  test "should create or update a scrapper log" do
    stub_scrapper(:with)

    assert_difference "ScrapperLog.count", +1 do
      ScrapReportsJob.perform_now(:with)
    end

    scrapper_log = ScrapperLog.last
    assert_equal "na", scrapper_log.level
    assert_equal 60, scrapper_log.last_created_reports_count
    assert_equal 60, scrapper_log.total_created_reports_count

    assert_no_difference "ScrapperLog.count" do
      ScrapReportsJob.perform_now(:with)
    end

    scrapper_log = ScrapperLog.last
    assert_equal "na", scrapper_log.level
    assert_equal 0, scrapper_log.last_created_reports_count
    assert_equal 60, scrapper_log.total_created_reports_count
  end

  test "should reschedule itself and only enqueue 1 geoJSON cache creation job" do
    stub_scrapper(:with)

    ScrapReportsJob.perform_now(:with)

    assert_enqueued_jobs 2
    assert_enqueued_with(job: CreateReportsGeoJSONCacheJob)
    assert_enqueued_with(job: ScrapReportsJob)
    assert_in_delta 1, 12.hours.from_now.to_i, enqueued_jobs.last[:at]
  end

  private

  def stub_scrapper(kind)
    url = Scrapper::URLS[Time.current.year][kind]

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("valid_placemarks.kml").read,
      )
  end
end
