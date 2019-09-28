# frozen_string_literal: true

require "test_helper"

class PackLastMonthReportsJobTest < ActiveJob::TestCase
  test "should pack previous month reports and reschedule" do
    now = Time.current

    create(:report)
    create_list(:report, 2, updated_at: now.prev_month)
    clear_enqueued_jobs

    assert_difference "Dataset.count", 1 do
      assert_difference "Report.count", -2 do
        PackLastMonthReportsJob.perform_now
      end
    end

    assert_enqueued_jobs 1
    assert_enqueued_with(job: PackLastMonthReportsJob)

    expected_next_call = now.next_month.end_of_day.to_i
    assert_in_delta 1, expected_next_call, enqueued_jobs.last[:at]

    assert_equal 1, Report.count
    assert_equal 1, Dataset.count
  end
end
