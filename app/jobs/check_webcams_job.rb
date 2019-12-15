# frozen_string_literal: true

class CheckWebcamsJob < ApplicationJob
  queue_as :default

  def perform
    Webcam.find_each do |webcam|
      webcam.skip_cache = true

      if webcam.available?
        webcam.touch
      else
        webcam.destroy
      end
    end

    teardown
  end

  private

  def teardown
    refresh_webcams_cache
    reschedule
  end

  def refresh_webcams_cache
    Webcam.create_geojson_cache
  end

  def reschedule
    CheckWebcamsJob.set(wait_until: 1.day.from_now).perform_later
  end
end
