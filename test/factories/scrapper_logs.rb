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

FactoryBot.define do
  factory :scrapper_log do
    file_name { "Some scrapped kml name" }
    level { :clear }
    valid_placemarks_count { 100 }
    invalid_placemarks_count { 1 }
    parsing_failures { ["Invalid date found in name: 32/10/2018 Tulum, Mexique"] }
    last_created_reports_count { 100 }
    total_created_reports_count { 100 }
  end
end
