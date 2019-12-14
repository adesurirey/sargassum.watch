# frozen_string_literal: true

require "test_helper"

class CheckWebcamsJobTest < ActiveJob::TestCase
  test "should destroy non available webcams" do
    webcams = create_list(:webcam, 5, :youtube)
    clear_enqueued_jobs

    webcams.each_with_index do |webcam, index|
      if index.zero?
        stub_youtube_unavailable(webcam.youtube_id)
      else
        stub_youtube_available(webcam.youtube_id)
      end
    end

    assert_difference "Webcam.count", -1 do
      CheckWebcamsJob.perform_now
    end

    assert_enqueued_jobs 2
    assert_enqueued_with(job: CreateWebcamsGeoJSONCacheJob)
    assert_enqueued_with(job: CheckWebcamsJob)
    assert_in_delta 1, 1.day.from_now.to_i, enqueued_jobs.last[:at]
  end
end
