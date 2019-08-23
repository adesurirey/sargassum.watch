# frozen_string_literal: true

require "test_helper"

class CreateReportsGeoJsonCacheJobTest < ActiveJob::TestCase
  test "should call cached_geo_json" do
    mock = MiniTest::Mock.new
    mock.expect(:call, "{}")

    Report.stub(:cached_geo_json, mock) do
      CreateReportsGeoJsonCacheJob.perform_now
    end

    mock.verify
  end
end
