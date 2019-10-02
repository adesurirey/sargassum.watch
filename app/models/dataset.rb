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

class Dataset < ApplicationRecord
  attribute :features, :binary_array

  before_validation :count_features

  validates :name, presence: true, uniqueness: true
  validates :count, numericality: true
  validates :start_at, presence: true
  validates :end_at, presence: true
  validate :validate_date_range
  validates :features, presence: true
  validate :validate_features_array

  after_commit { Report.create_geojson_cache }

  class << self
    def pack_reports!(name:, reports:)
      ordered_reports = reports.order(updated_at: :asc)

      transaction do
        create!(
          name:     name,
          start_at: ordered_reports.first.updated_at,
          end_at:   ordered_reports.last.updated_at,
          features: reports.decorate.map(&:as_geojson),
        )

        reports.delete_all
      end
    end
  end

  private

  def count_features
    self.count = features.size
  end

  def validate_date_range
    errors.add(:start_at) if start_at && start_at > Time.current
    errors.add(:end_at) if end_at && (end_at < start_at || end_at > Time.current)
  end

  def validate_features_array
    errors.add(:features) if features && features.class != Array
  end
end
