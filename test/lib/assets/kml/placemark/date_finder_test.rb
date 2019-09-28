# frozen_string_literal: true

require "test_helper"

class Assets::KML::Placemark::DateFinderTest < ActiveSupport::TestCase
  test "should find well fomatted dates" do
    date = Assets::KML::Placemark::DateFinder.call("01/06/2018 Marie Galante")
    assert_equal "01/06/2018", date
  end

  test "should find 019 year fomatted dates and correct it" do
    date = Assets::KML::Placemark::DateFinder.call("01/06/019 Marie Galante")
    assert_equal "01/06/2019", date
  end

  test "should find no day dates and correct it" do
    date = Assets::KML::Placemark::DateFinder.call("06/2019 Marie Galante")
    assert_equal "15/06/2019", date
  end
end
