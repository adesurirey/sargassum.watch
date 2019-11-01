# frozen_string_literal: true

require "test_helper"

class ScrapViajefestJobTest < ActiveJob::TestCase
  setup do
    @request = stub_scrapper
  end

  test "should create reports form scrapper results" do
    assert_difference "Report.count", 133 do
      ScrapViajefestJob.perform_now
    end

    assert_requested @request
    assert_equal 0, Report.na.count
    assert_equal 122, Report.clear.count
    assert_equal 11, Report.moderate.count
    assert_equal 0, Report.critical.count
  end

  test "should not create already scrapped reports" do
    assert_difference "Report.count", 133 do
      ScrapViajefestJob.perform_now
    end

    assert_no_difference "Report.count" do
      ScrapViajefestJob.perform_now
    end
  end

  test "should not create again already packed reports" do
    assert_difference "Report.count", 133 do
      ScrapViajefestJob.perform_now
    end

    Dataset.pack_reports!(name: "All", reports: Report.all)

    assert_no_difference "Report.count" do
      ScrapViajefestJob.perform_now
    end
  end

  test "should create or update a scrapper log" do
    assert_difference "ScrapperLog.count", +1 do
      ScrapViajefestJob.perform_now
    end

    scrapper_log = ScrapperLog.last
    assert_equal "na", scrapper_log.level
    assert_equal 133, scrapper_log.last_created_reports_count
    assert_equal 133, scrapper_log.total_created_reports_count

    assert_no_difference "ScrapperLog.count" do
      ScrapViajefestJob.perform_now
    end

    scrapper_log.reload
    assert_equal "na", scrapper_log.level
    assert_equal 0, scrapper_log.last_created_reports_count
    assert_equal 133, scrapper_log.total_created_reports_count
  end

  test "should reschedule itself and only enqueue 1 geoJSON cache creation job" do
    ScrapViajefestJob.perform_now

    assert_enqueued_jobs 2
    assert_enqueued_with(job: CreateReportsGeoJSONCacheJob)
    assert_enqueued_with(job: ScrapViajefestJob)
    assert_in_delta 1, 1.day.from_now.to_i, enqueued_jobs.last[:at]
  end

  private

  def stub_scrapper
    url = ViajefestScrapper::URL

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("viajafest.html").read,
      )
  end
end
