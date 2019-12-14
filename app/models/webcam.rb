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

class Webcam < ApplicationRecord
  include GeolocatableConcern
  include ReverseGeocodableConcern
  include CachableGeoJSONConcern

  enum kind: { youtube: 0, image: 1 }, _suffix: true

  validates :kind, presence: true
  validates :name, presence: true, uniqueness: true, if: :scrapped?
  validates :youtube_id, presence: true, uniqueness: true, if: :youtube_kind?
  validates :url, presence: true, uniqueness: true, if: :image_kind?

  scope :scrapped, -> { where(source: WebcamScrapper::URL) }

  class << self
    def cached_geojson
      Rails.cache.fetch(cache_key(all)) do
        all.decorate.to_geojson
      end
    end

    def create_geojson_cache
      CreateWebcamsGeoJSONCacheJob.perform_later
    end

    def find_or_initialize_for_scrapper(attributes)
      already_scrapped(attributes) || new(attributes)
    end

    private

    def cache_key(webcams)
      { serializer: "webcams", stat_record: webcams.maximum(:updated_at) }
    end

    def already_scrapped(attributes)
      find_by(attributes.slice(:name))
    end
  end

  def available?
    if youtube_kind?
      youtube_live?
    else
      image_live?
    end
  end

  def scrapped?
    source == WebcamScrapper::URL
  end

  private

  def image_live?
    Faraday.get(url.presence).status == 200
  end

  def youtube_live?
    Yt::Video.new(id: youtube_id).live_broadcast_content == "live"
  end
end
