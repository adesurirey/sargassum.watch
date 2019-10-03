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

class ScrapperLog < ApplicationRecord
  include LevelvableConcern

  before_validation :format_file_name!

  validates :file_name, presence: true, uniqueness: true
  validates :valid_placemarks_count, numericality: true
  validates :invalid_placemarks_count, numericality: true
  validates :last_created_reports_count, numericality: true

  after_validation :sum_created_reports

  class << self
    def create_or_update_from_kml!(kml:, created_reports_count:, level:)
      scrapper_log = find_or_initialize_by_kml(kml)

      scrapper_log.assign_attributes(
        level:                      level,
        last_created_reports_count: created_reports_count,
      )

      scrapper_log.tap(&:save!)
    end

    private

    def find_or_initialize_by_kml(kml)
      scrapper_log = find_or_initialize_by(file_name: kml.name)

      scrapper_log.assign_attributes(
        valid_placemarks_count:   kml.placemarks.size,
        invalid_placemarks_count: kml.errors.size,
        parsing_failures:         kml.errors,
      )

      scrapper_log
    end
  end

  private

  def format_file_name!
    file_name&.strip!
  end

  def sum_created_reports
    self.total_created_reports_count =
      total_created_reports_count_was + last_created_reports_count
  end
end
