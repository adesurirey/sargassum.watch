# frozen_string_literal: true

# == Schema Information
#
# Table name: reports
#
#  id         :bigint           not null, primary key
#  latitude   :float            not null
#  level      :integer          not null
#  longitude  :float            not null
#  name       :string
#  source     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :string           not null
#
# Indexes
#
#  index_reports_on_latitude_and_longitude  (latitude,longitude)
#

FactoryBot.define do
  factory :report do
    name { Faker::Address.street_name }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    level { :critical }
    source { nil }
    user_id { SecureRandom.hex }

    trait :clear do
      level  { :clear }
    end

    trait :moderate do
      level  { :moderate }
    end

    trait :critical do
      level  { :critical }
    end

    trait :with_photo do
      photo do
        fixture_file_upload(
          Rails.root.join("test", "fixtures", "files", "photo.jpg"),
          "image/jpg",
        )
      end
    end

    trait :sugiton do
      name { "Calanque de Sugiton" }
      latitude { 43.217595 }
      longitude { 5.4557003 }
    end
  end
end
