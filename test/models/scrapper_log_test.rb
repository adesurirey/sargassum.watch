# frozen_string_literal: true

# == Schema Information
#
# Table name: scrapper_logs
#
#  id                          :bigint           not null, primary key
#  file_name                   :string           not null
#  invalid_placemarks_count    :integer          not null
#  last_created_reports_count  :integer          default(0), not null
#  level                       :integer          not null
#  parsing_failures            :text             default([]), is an Array
#  total_created_reports_count :integer          default(0), not null
#  valid_placemarks_count      :integer          not null
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#

require "test_helper"

class ScrapperLogTest < ActiveSupport::TestCase
  test "should be valid" do
    log = ScrapperLog.new(
      file_name:                  "Some scrapped kml name",
      level:                      :na,
      valid_placemarks_count:     200,
      invalid_placemarks_count:   0,
      last_created_reports_count: 200,
    )

    assert log.valid?

    log = ScrapperLog.new(
      file_name:                  "Some scrapped kml name",
      level:                      :na,
      valid_placemarks_count:     200,
      invalid_placemarks_count:   1,
      last_created_reports_count: 200,
      parsing_failures:           ["No date found in name: CHECK OUR NEW WEBSITE!!"],
    )

    assert log.valid?
  end

  test "should not be valid" do
    log = ScrapperLog.new

    assert_not log.valid?

    assert_equal 4, log.errors.details.size
    assert_not_empty log.errors.details[:file_name]
    assert_not_empty log.errors.details[:level]
    assert_not_empty log.errors.details[:valid_placemarks_count]
    assert_not_empty log.errors.details[:invalid_placemarks_count]
  end

  test "should format file name" do
    log = create(:scrapper_log, file_name: " Martinique - 2019 ")
    assert_equal "Martinique - 2019", log.file_name
  end

  test "should sum total created reports on update" do
    log = create(:scrapper_log, last_created_reports_count: 100)
    assert_equal 100, log.total_created_reports_count

    assert log.update(last_created_reports_count: 50)
    assert_equal 150, log.total_created_reports_count

    assert log.update(last_created_reports_count: 200)
    assert_equal 350, log.total_created_reports_count
  end
end
