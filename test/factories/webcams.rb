# frozen_string_literal: true

# == Schema Information
#
# Table name: webcams
#
#  id         :bigint           not null, primary key
#  kind       :integer          not null
#  latitude   :float            not null
#  longitude  :float            not null
#  name       :string
#  source     :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  youtube_id :string
#

FactoryBot.define do
  factory :webcam do
    name { Faker::Address.street_name }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    kind { :youtube }
    youtube_id { SecureRandom.hex }
    url { nil }
    source { nil }

    trait :youtube do
      kind { :youtube }
      youtube_id { SecureRandom.hex }
      url { nil }
    end

    trait :image do
      kind { :image }
      youtube_id { nil }
      url { "http://webcams.com/#{SecureRandom.hex}.jpg" }
    end

    trait :scrapped do
      source { WebcamsDeMexicoScrapper::URL }
    end
  end
end
