# frozen_string_literal: true

class ScrapWebcamsJob < ApplicationJob
  queue_as :default

  def perform
    @results = WebcamScrapper.call

    Webcam.transaction do
      create_webcams!
    end

    teardown
  end

  private

  def create_webcams!
    @results.each do |result|
      webcam = Webcam.find_or_initialize_for_scrapper(result)
      next unless webcam.new_record?

      Webcam.without_cache_callback { webcam.save! }
    end
  end

  def teardown
    refresh_webcams_cache
    reschedule
  end

  def refresh_webcams_cache
    Webcam.create_geojson_cache
  end

  def reschedule
    ScrapWebcamsJob.set(wait_until: 1.day.from_now).perform_later
  end
end
