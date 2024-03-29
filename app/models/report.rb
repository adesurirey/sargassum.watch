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

class Report < ApplicationRecord
  include LevelvableConcern
  include GeolocatableConcern
  include ReverseGeocodableConcern
  include CachableGeoJSONConcern

  MAX_UPDATE_TIME = 1.hour

  has_one_attached :photo, dependent: false

  validate :timestamps_are_past
  validates :user_id, presence: true, length: { is: 32 }

  default_scope { order(updated_at: :asc) }

  scope :original, -> { where(source: nil) }
  scope :scrapped, -> { where.not(source: nil) }

  class << self
    def cached_geojson
      datasets = Dataset.where(end_at: 1.year.ago.beginning_of_day..DateTime.current)
      reports = all.with_attached_photo

      Rails.cache.fetch(cache_key(datasets, reports)) do
        Assets::GeoJSON.generate(datasets: datasets, reports: reports)
      end
    end

    def find_or_initialize_for_scrapper(placemark)
      already_scrapped(placemark) || new(placemark)
    end

    def create_geojson_cache
      CreateReportsGeoJSONCacheJob.perform_later
    end

    def formatted_levels
      levels.map { |k, v| { value: v, label: k } }
    end

    private

    def cache_key(datasets, reports)
      { serializer: "reports", stat_record: last_update(datasets, reports) }
    end

    def last_update(datasets, reports)
      return reports.maximum(:updated_at) if datasets.empty?
      return datasets.maximum(:updated_at) if reports.empty?

      [datasets.maximum(:updated_at), reports.maximum(:updated_at)].max
    end

    def already_scrapped(placemark)
      fail ArgumentError, "Placemark has no level" unless placemark[:level].present?

      attributes = placemark.slice(:created_at, :level, :latitude, :longitude)
      find_by(attributes)
    end
  end

  def can_update?(user_id_param)
    user_id == user_id_param && Time.current < can_update_until
  end

  def can_update_until
    updated_at + MAX_UPDATE_TIME
  end

  private

  def timestamps_are_past
    errors.add(:created_at) if created_at.present? && created_at > Time.current
    errors.add(:updated_at) if updated_at.present? && updated_at > Time.current
  end
end
