# frozen_string_literal: true

require "test_helper"

class WebcamDecoratorTest < Draper::TestCase
  test "should return a valid geoJSON feature" do
    webcam = create(:webcam, :youtube).decorate
    feature = webcam.as_geojson

    assert_kind_of Hash, feature
    assert feature.key?(:type)
    assert feature.key?(:geometry)
    assert feature.key?(:properties)

    assert_equal "Feature", feature[:type]

    geometry = feature[:geometry]
    assert_equal "Point", geometry[:type]
    assert_equal webcam.geojson_coordinates, geometry[:coordinates]

    properties = feature[:properties]
    assert_equal webcam.id, properties[:id]
    assert_equal webcam.youtube_id, properties[:youtubeId]
  end

  test "should return json" do
    webcam = create(:webcam).decorate
    assert_kind_of String, webcam.to_geojson
  end

  test "should return valid source" do
    image = create(:webcam, :image).decorate
    properties = image.as_geojson[:properties]
    assert_equal image.url, properties[:liveImageUrl]
    assert_nil properties[:youtubeId]

    youtube = create(:webcam, :youtube).decorate
    properties = youtube.as_geojson[:properties]
    assert_equal youtube.youtube_id, properties[:youtubeId]
    assert_nil properties[:liveImageUrl]
  end
end
