# frozen_string_literal: true

require "test_helper"

class ScrapWebcamsJobTest < ActiveJob::TestCase
  test "should create webcams from scrapper" do
    mock_scrapper

    assert_difference "Webcam.count", 1 do
      WebcamScrapper.stub(:call, @mock) do
        ScrapWebcamsJob.perform_now
      end
    end
  end

  test "should update webcams from scrapper" do
    mock_scrapper
    webcam = create(:webcam, :scrapped, name: @scrapper_results.first[:name])

    assert_equal @scrapper_results.first[:name], webcam.name
    assert_not_equal @scrapper_results.first[:youtube_id], webcam.youtube_id

    assert_no_difference "Webcam.count" do
      WebcamScrapper.stub(:call, @mock) do
        ScrapWebcamsJob.perform_now
      end
    end

    assert_equal @scrapper_results.first[:youtube_id], webcam.reload.youtube_id
  end

  test "should not duplicate scrapped webcams" do
    mock_scrapper
    Webcam.create!(@scrapper_results.first)

    assert_no_difference "Webcam.count" do
      WebcamScrapper.stub(:call, @mock) do
        ScrapWebcamsJob.perform_now
      end
    end
  end

  test "should delete obsolete webcams" do
    mock_scrapper([])
    create(:webcam, :scrapped)

    assert_difference "Webcam.count", -1 do
      WebcamScrapper.stub(:call, @mock) do
        ScrapWebcamsJob.perform_now
      end
    end
  end

  test "should reschedule itself and only enqueue 1 geoJSON cache creation job" do
    mock_scrapper

    assert_difference "Webcam.count", 1 do
      WebcamScrapper.stub(:call, @mock) do
        ScrapWebcamsJob.perform_now
      end
    end

    assert_enqueued_jobs 2
    assert_enqueued_with(job: CreateWebcamsGeoJSONCacheJob)
    assert_enqueued_with(job: ScrapWebcamsJob)
    assert_in_delta 1, 1.day.from_now.to_i, enqueued_jobs.last[:at]
  end

  private

  def mock_scrapper(results = scrapper_results)
    @scrapper_results = results

    @mock = MiniTest::Mock.new
    @mock.expect(:call, @scrapper_results)
  end

  def scrapper_results
    [
      {
        name:       Faker::Address.street_name,
        kind:       :youtube,
        youtube_id: SecureRandom.hex,
        latitude:   Faker::Address.latitude,
        longitude:  Faker::Address.longitude,
        source:     WebcamScrapper::URL,
      },
    ]
  end
end
