# frozen_string_literal: true

require "test_helper"

class CreateWebcamsGeoJSONCacheJobTest < ActiveJob::TestCase
  test "should call cached_geojson" do
    mock = MiniTest::Mock.new
    mock.expect(:call, "{}")

    Webcam.stub(:cached_geojson, mock) do
      CreateWebcamsGeoJSONCacheJob.perform_now
    end

    mock.verify
  end
end
