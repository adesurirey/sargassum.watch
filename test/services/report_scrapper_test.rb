# frozen_string_literal: true

require "test_helper"

class ReportScrapperTest < ActiveSupport::TestCase
  test "should return an URL" do
    url = ReportScrapper.url(year: 2019, kind: :with)

    assert_equal ENV.fetch("REPORT_SCRAPPER_URL_2019_WITH"), url
  end

  test "should return a KML instance from Google maps" do
    request = stub_scrapper(kind: :with, year: 2019)

    kml = ReportScrapper.call(kind: :with, year: 2019)
    assert_requested request

    assert_kind_of Assets::KML, kml
  end

  test "should accept custom kml placemarks attributes" do
    stub_scrapper(kind: :with, year: 2019)

    kml = ReportScrapper.call(kind: :with, year: 2019, attributes: { level: :na })

    assert_equal :na, kml.placemarks.first[:level]
  end

  private

  def stub_scrapper(kind:, year:)
    url = ReportScrapper.url(year: year, kind: kind)

    stub_request(:get, url)
      .with(headers: { "User-Agent" => ClientConcern::USER_AGENT })
      .to_return(
        status: 200,
        body:   file_fixture("valid_placemarks.kml").read,
      )
  end
end
