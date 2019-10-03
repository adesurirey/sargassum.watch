# frozen_string_literal: true

require "test_helper"

class ScrapperTest < ActiveSupport::TestCase
  test "should return a KML instance from Google maps" do
    request = stub_scrapper(kind: :with, year: 2019)

    kml = Scrapper.call(kind: :with, year: 2019)
    assert_requested request

    assert_kind_of Assets::KML, kml
  end

  test "should accept custom kml placemarks attributes" do
    stub_scrapper(kind: :with, year: 2019)

    kml = Scrapper.call(kind: :with, year: 2019, attributes: { level: :na })

    assert_equal :na, kml.placemarks.first[:level]
  end

  private

  def stub_scrapper(kind:, year:)
    url = Scrapper::URLS[year][kind]

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("valid_placemarks.kml").read,
      )
  end
end
