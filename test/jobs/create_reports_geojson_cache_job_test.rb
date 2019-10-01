# frozen_string_literal: true

require "test_helper"

class CreateReportsGeoJSONCacheJobTest < ActiveJob::TestCase
  test "should call cached_geojson" do
    mock = MiniTest::Mock.new
    mock.expect(:call, "{}")

    Report.stub(:cached_geojson, mock) do
      CreateReportsGeoJSONCacheJob.perform_now
    end

    mock.verify
  end
end
