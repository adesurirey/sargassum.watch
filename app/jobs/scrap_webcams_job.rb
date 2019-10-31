# frozen_string_literal: true

class ScrapWebcamsJob < ApplicationJob
  queue_as :default

  def perform
    @webcams = Webcam.scrapped
    @results = WebcamsDeMexicoScrapper.call

    Webcam.transaction do
      update_or_delete_obsolete_webcams!
      create_webcams!
    end

    teardown
  end

  private

  def update_or_delete_obsolete_webcams!
    @webcams.each do |webcam|
      match = @results.find { |result| result[:name] == webcam.name }

      if match.present?
        Webcam.without_cache_callback { webcam.update!(match) }
      else
        Webcam.without_cache_callback { webcam.destroy! }
      end
    end
  end

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
