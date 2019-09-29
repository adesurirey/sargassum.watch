# frozen_string_literal: true

require "test_helper"

class ScrapperTest < ActiveSupport::TestCase
  test "should return a kml file from Google maps" do
    request = stub_scrapper(kind: :with, year: "2019")

    Scrapper.call(kind: :with, year: "2019")
    assert_requested request
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
