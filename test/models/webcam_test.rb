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

  test "should have a corresponding source" do
    webcam = build(:webcam, :youtube, youtube_id: nil)
    assert_not webcam.valid?
    assert_includes map_errors(webcam, :youtube_id), :blank

    webcam = build(:webcam, :image, url: nil)
    assert_not webcam.valid?
    assert_includes map_errors(webcam, :url), :blank
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

  private

  def map_errors(record, attribute)
    record.errors.details[attribute].map { |e| e[:error] }
  end
end
