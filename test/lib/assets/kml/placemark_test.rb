# frozen_string_literal: true

require "test_helper"

class Assets::KML::PlacemarkTest < ActiveSupport::TestCase
  test "should return a hash with valid report attributes" do
    node = Nokogiri::XML(valid_kml).css("Placemark")
    placemark = Assets::KML::Placemark.new(node)

    assert_kind_of Hash, placemark.attributes
    assert_kind_of String, placemark.attributes[:name]
    assert_kind_of DateTime, placemark.attributes[:created_at]
    assert_kind_of DateTime, placemark.attributes[:updated_at]
    assert_kind_of Float, placemark.attributes[:latitude]
    assert_kind_of Float, placemark.attributes[:longitude]

    assert_equal placemark.attributes[:created_at], placemark.attributes[:updated_at]
  end

  test "should cleanup name and remove dates from it" do
    node = Nokogiri::XML(valid_kml).css("Placemark")
    placemark = Assets::KML::Placemark.new(node)

    assert_equal "Anses d'Arlet", placemark.attributes[:name]
  end

  test "should correctly parse coordinates" do
    node = Nokogiri::XML(valid_kml).css("Placemark")
    placemark = Assets::KML::Placemark.new(node)

    assert_equal(-61.0841083, placemark.attributes[:longitude])
    assert_equal(14.4986926, placemark.attributes[:latitude])
  end

  test "should correctly parse date" do
    node = Nokogiri::XML(valid_kml).css("Placemark")
    placemark = Assets::KML::Placemark.new(node)

    assert_equal "01/01/2019".to_datetime, placemark.attributes[:created_at]
    assert_equal "01/01/2019".to_datetime, placemark.attributes[:updated_at]
  end

  test "should raise when date is in future" do
    placemark = <<~KML
      <Placemark>
        <name>01/01/3000 Anses d'Arlet - Martinique </name>
        <Point>
          <coordinates>
            -61.0841083,14.4986926,0
          </coordinates>
        </Point>
      </Placemark>
    KML

    node = Nokogiri::XML(placemark).css("Placemark")

    assert_raises Assets::KML::Placemark::InvalidNodeError do
      Assets::KML::Placemark.new(node)
    end
  end

  private

  def valid_kml
    <<~KML
      <Placemark>
        <name>01/01/2019 Anses d'Arlet - Martinique </name>
        <Point>
          <coordinates>
            -61.0841083,14.4986926,0
          </coordinates>
        </Point>
      </Placemark>
    KML
  end
end
