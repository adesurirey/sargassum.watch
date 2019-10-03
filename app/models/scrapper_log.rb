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

  private

  def format_file_name!
    file_name&.strip!
  end

  def sum_created_reports
    self.total_created_reports_count =
      total_created_reports_count_was + last_created_reports_count
  end
end
