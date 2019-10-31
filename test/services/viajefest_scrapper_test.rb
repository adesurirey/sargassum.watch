# frozen_string_literal: true

require "test_helper"

class ViajefestScrapperTest < ActiveSupport::TestCase
  test "should return results as reports attributes" do
    request = stub_viajafest_html
    results = ViajefestScrapper.call
    assert_requested request

    assert_kind_of Array, results
    assert_equal 133, results.size

    assert results.all? do |result|
      result.keys == [:name, :level, :latitude, :longitude, :source]
    end

    result = results.first
    assert_kind_of Hash, result
    assert_kind_of String, result[:name]
    assert_kind_of Symbol, result[:level]
    assert_kind_of Float, result[:latitude]
    assert_kind_of Float, result[:longitude]
    assert_kind_of DateTime, result[:created_at]
    assert_kind_of DateTime, result[:updated_at]
    assert_equal ViajefestScrapper::URL, result[:source]
  end

  test "should return valid reports date" do
    stub_viajafest_html

    expected_date = DateTime.parse "Thu, 31 Oct 2019 09:08:00 +0000"
    results = ViajefestScrapper.call

    assert_equal expected_date, results.first[:created_at]
    assert_equal expected_date, results.first[:updated_at]
    assert results.all? do |result|
      result[:created_at] == expected_date
    end
  end

  test "should fail if results count is not equal to source count" do
    request = stub_viajafest_html_wrong_count

    assert_raises ViajefestScrapper::BadCountError do
      ViajefestScrapper.call
    end

    assert_requested request
  end

  test "should fail for unknown colors" do
    request = stub_viajafest_html_unknown_color

    assert_raises ViajefestScrapper::UnknownColorError do
      ViajefestScrapper.call
    end

    assert_requested request
  end

  private

  def stub_viajafest_html
    url = ViajefestScrapper::URL

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   file_fixture("viajafest.html").read,
      )
  end

  def stub_viajafest_html_wrong_count
    url = ViajefestScrapper::URL

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   bad_count_html,
      )
  end

  def stub_viajafest_html_unknown_color
    url = ViajefestScrapper::URL

    stub_request(:get, url)
      .to_return(
        status: 200,
        body:   unknown_color_html,
      )
  end

  def bad_count_html
    <<~TEXT
      <div class="beach-count key clearfix">
        <div class="header">
          <h2>Quintana Roo</h2>
          <p>&#128467; jueves 31 octubre, 2019, 9:08 am<br>Playas observadas: 2</strong></p>
        </div>
      </div>
      <script>
        L.circle([21.563096, -87.33594], { color: '#15d268' }).addTo(zones);
        L.circle([21.563096, -87.33594], { className: 'beachCircle', color: '#15d268' }).addTo(beaches).bindTooltip(
          "Punta Mosquito",
          { interactive: true }
        );
      </script>
    TEXT
  end

  def unknown_color_html
    <<~TEXT
      <div class="beach-count key clearfix">
        <div class="header">
          <h2>Quintana Roo</h2>
          <p>&#128467; jueves 31 octubre, 2019, 9:08 am<br>Playas observadas: 1</strong></p>
        </div>
      </div>
      <script>
        L.circle([21.563096, -87.33594], { color: '#333' }).addTo(zones);
        L.circle([21.563096, -87.33594], { className: 'beachCircle', color: '#333' }).addTo(beaches).bindTooltip(
          "Punta Mosquito",
          { interactive: true }
        );
      </script>
    TEXT
  end
end
