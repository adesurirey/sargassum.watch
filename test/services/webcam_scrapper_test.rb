# frozen_string_literal: true

require "test_helper"

class WebcamScrapperTest < ActiveSupport::TestCase
  setup do
    @base_request = stub_webcamsdemexico_html
    @coordinates_request = stub_webcamsdemexico_json
    @cancun_request = stub_cancun
    @mahahual_request = stub_mahahual
    @cancun_youtube_thumbnail_request = stub_cancun_youtube_thumbnail
    @mahahual_image_request = stub_mahahual_image
  end

  test "should request all resources once" do
    WebcamScrapper.call

    assert_requested @base_request
    assert_requested @coordinates_request
    assert_requested @cancun_request
    assert_requested @mahahual_request
    assert_requested @cancun_youtube_thumbnail_request
    assert_requested @mahahual_image_request
  end

  test "should return results as webcams attributes" do
    results = WebcamScrapper.call

    assert_kind_of Array, results
    assert_equal 2, results.size

    youtube = results.first
    assert_kind_of Hash, youtube
    assert_kind_of String, youtube[:name]
    assert_equal :youtube, youtube[:kind]
    assert_kind_of String, youtube[:youtube_id]
    assert_kind_of Float, youtube[:latitude]
    assert_kind_of Float, youtube[:longitude]
    assert_equal WebcamScrapper::URL, youtube[:source]

    image = results.last
    assert_kind_of Hash, image
    assert_kind_of String, image[:name]
    assert_equal :image, image[:kind]
    assert_kind_of String, image[:url]
    assert_kind_of Float, image[:latitude]
    assert_kind_of Float, image[:longitude]
    assert_equal WebcamScrapper::URL, image[:source]
  end

  test "should raise when source doesn't respond" do
    @base_request = stub_webcamsdemexico_html_error

    assert_raises WebcamScrapper::RequestError do
      WebcamScrapper.call
    end
  end

  test "should raise when webcam doesn't respond" do
    @cancun_request = stub_cancun_error

    assert_raises WebcamScrapper::RequestError do
      WebcamScrapper.call
    end
  end

  test "should ignore deleted resources" do
    @cancun_youtube_thumbnail_request = stub_cancun_youtube_thumbnail_error

    results = WebcamScrapper.call

    assert_equal 1, results.size
  end

  private

  def stub_webcamsdemexico_html
    url = WebcamScrapper::URL + WebcamScrapper::SEARCH_PATH

    stub_request(:get, url)
      .with(headers: { "User-Agent" => ClientConcern::USER_AGENT })
      .to_return(
        status: 200,
        body:   file_fixture("webcamsdemexico.html").read,
      )
  end

  def stub_webcamsdemexico_html_error
    url = WebcamScrapper::URL + WebcamScrapper::SEARCH_PATH

    stub_request(:get, url).to_return(status: 403)
  end

  def stub_webcamsdemexico_json
    url = WebcamScrapper::URL + WebcamScrapper::COORDINATES_PATH

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("webcamsdemexico.json").read,
      )
  end

  def stub_cancun
    url = "http://webcamsdemexico.com/webcam-cancun"

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("webcam-cancun.html").read,
      )
  end

  def stub_cancun_error
    url = "http://webcamsdemexico.com/webcam-cancun"

    stub_request(:get, url)
      .to_return(status: 404)
  end

  def stub_mahahual
    url = "http://webcamsdemexico.com/webcam-mahahual"

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("webcam-mahahual.html").read,
      )
  end

  def stub_cancun_youtube_thumbnail
    url = "https://img.youtube.com/vi/5Fti8SDUaLo/mqdefault.jpg"

    stub_request(:get, url).to_return(status: 200)
  end

  def stub_cancun_youtube_thumbnail_error
    url = "https://img.youtube.com/vi/5Fti8SDUaLo/mqdefault.jpg"

    stub_request(:get, url).to_return(status: 404)
  end

  def stub_mahahual_image
    url = "http://webcamsdemexico.net/mahahual1/live.jpg"

    stub_request(:get, url).to_return(status: 200)
  end
end
