# frozen_string_literal: true

class ScrapWebcamsJob < ApplicationJob
  queue_as :default

  def perform
    @results = WebcamScrapper.call

    Webcam.transaction do
      clean_webcams!
      create_webcams!
    end

    teardown
  end

  private

  def clean_webcams!
    outdated_cams = Webcam.scrapped.where.not(name: @results.pluck(:name))
    outdated_cams.delete_all
  end

  def create_webcams!
    @results.each do |result|
      webcam = Webcam.find_or_initialize_for_scrapper(result)
      webcam.skip_cache = true
      webcam.save!
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
