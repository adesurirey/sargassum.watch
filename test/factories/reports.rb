# frozen_string_literal: true

# == Schema Information
#
# Table name: reports
#
#  id         :bigint           not null, primary key
#  latitude   :float            not null
#  level      :integer          not null
#  longitude  :float            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  session_id :string           not null
#

FactoryBot.define do
  factory :report do
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    level { :critical }
    session_id { SecureRandom.hex }

    trait :low do
      level  { :low }
    end

    trait :moderate do
      level  { :moderate }
    end

    trait :critical do
      level  { :critical }
    end
  end
end
