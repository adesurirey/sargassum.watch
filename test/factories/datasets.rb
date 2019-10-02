# frozen_string_literal: true

# == Schema Information
#
# Table name: datasets
#
#  id         :bigint           not null, primary key
#  count      :integer          not null
#  end_at     :datetime         not null
#  features   :binary           not null
#  name       :string           not null
#  start_at   :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :dataset do
    name { "Some reports packed" }
    count { nil }
    start_at { nil }
    end_at { nil }
    features { nil }
  end
end
