# frozen_string_literal: true

# == Schema Information
#
# Table name: webcams
#
#  id         :bigint           not null, primary key
#  kind       :integer          not null
#  latitude   :float            not null
#  longitude  :float            not null
#  name       :string
#  source     :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  youtube_id :string
#

require "test_helper"

class WebcamTest < ActiveSupport::TestCase
  test "should be valid" do
    youtube = Webcam.new(
      latitude:   Faker::Address.latitude,
      longitude:  Faker::Address.longitude,
      kind:       :youtube,
      youtube_id: SecureRandom.hex,
    )
    image = Webcam.new(
      latitude:  Faker::Address.latitude,
      longitude: Faker::Address.longitude,
      kind:      :image,
      url:       "http://webcams.com/live.jpg",
    )

    assert youtube.valid?
    assert image.valid?
  end

  test "should not be valid" do
    webcam = Webcam.new

    assert_not webcam.valid?
    assert_includes map_errors(webcam, :latitude), :not_a_number
    assert_includes map_errors(webcam, :longitude), :not_a_number
    assert_includes map_errors(webcam, :kind), :blank

    webcam.latitude = 180
    webcam.longitude = -200

    assert_not webcam.valid?
    assert_includes map_errors(webcam, :latitude), :less_than_or_equal_to
    assert_includes map_errors(webcam, :longitude), :greater_than_or_equal_to
  end

  test "should have a kind corresponding media source" do
    webcam = build(:webcam, :youtube, youtube_id: nil)
    assert_not webcam.valid?
    assert_includes map_errors(webcam, :youtube_id), :blank

    webcam = build(:webcam, :image, url: nil)
    assert_not webcam.valid?
    assert_includes map_errors(webcam, :url), :blank
  end

  test "should have a uniq media source" do
    webcam = create(:webcam, :youtube)
    new_webcam = build(:webcam, :youtube, youtube_id: webcam.youtube_id)
    assert_not new_webcam.valid?
    assert_includes map_errors(new_webcam, :youtube_id), :taken

    webcam = create(:webcam, :image)
    new_webcam = build(:webcam, :image, url: webcam.url)
    assert_not new_webcam.valid?
    assert_includes map_errors(new_webcam, :url), :taken
  end

  test "can have a source string" do
    webcam = build(:webcam, :youtube)
    webcam.source = "http://webcamsdemexico.com"
    assert webcam.valid?
  end

  test "should return a valid geoJSON coordinates array" do
    webcam = build(:webcam)

    assert_equal webcam.longitude, webcam.geojson_coordinates.first
    assert_equal webcam.latitude, webcam.geojson_coordinates.last
  end

  test "should return a valid geocoder coordinates array" do
    webcam = build(:webcam)

    assert_equal webcam.latitude, webcam.geocoder_coordinates.first
    assert_equal webcam.longitude, webcam.geocoder_coordinates.last
  end

  test "should not trigger a geocoder lookup when name is set" do
    webcam = build(:webcam)
    init_name = webcam.name

    assert webcam.save
    assert_equal init_name, webcam.name
  end

  test "should return all webcams as geoJSON" do
    create_list(:webcam, 10)

    geojson = Webcam.cached_geojson
    assert_kind_of String, geojson

    geojson = Oj.load geojson
    assert_equal 10, geojson["features"].size
  end

  test "should update geoJSON cache" do
    assert_enqueued_with job: CreateWebcamsGeoJSONCacheJob do
      create(:webcam)
    end

    webcam = build(:webcam, :youtube)

    assert_enqueued_with job: CreateWebcamsGeoJSONCacheJob do
      assert webcam.save
    end

    assert_enqueued_with job: CreateWebcamsGeoJSONCacheJob do
      assert webcam.update(name: "New name")
    end

    assert_enqueued_with job: CreateWebcamsGeoJSONCacheJob do
      assert webcam.destroy
    end
  end

  test "should not update geoJSON cache" do
    assert_no_enqueued_jobs only: CreateWebcamsGeoJSONCacheJob do
      create(:webcam, skip_cache: true)
    end

    assert_enqueued_with job: CreateWebcamsGeoJSONCacheJob do
      create(:webcam)
    end
  end

  test "should return webcam availability" do
    available_youtube = create(:webcam, :youtube)
    unavailable_youtube = create(:webcam, :youtube)

    available_image = create(:webcam, :image)

    youtube_unavailable = stub_youtube_unavailable(unavailable_youtube.youtube_id)
    youtube_available = stub_youtube_available(available_youtube.youtube_id)
    image_available = stub_image_available(available_image.url)

    assert available_youtube.available?
    assert available_image.available?
    assert_not unavailable_youtube.available?

    assert_requested youtube_available
    assert_requested youtube_unavailable
    assert_requested image_available
  end

  test "should retry when live image request" do
    webcam = create(:webcam, :image)

    request = stub_request(:get, webcam.url)
              .to_return(status: 503).times(1).then
              .to_return(status: 200)

    assert webcam.available?
    assert_requested request, times: 2
  end

  private

  def stub_image_available(url)
    stub_request(:get, url).to_return(status: 200)
  end

  def map_errors(record, attribute)
    record.errors.details[attribute].map { |e| e[:error] }
  end
end
