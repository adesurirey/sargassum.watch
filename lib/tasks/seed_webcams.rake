# frozen_string_literal: true

namespace :one_shot do
  desc "Seed initial webcams"
  task seed_webcams: :environment do
    puts "Seeding webcams..."

    webcams = YAML.load_file(Rails.root.join("db", "data", "webcams.yml"))
    webcams.map! { |webcam| webcam.merge(skip_cache: true) }
    Webcam.create!(webcams)

    ScrapWebcamsJob.perform_later

    puts "Done.".light_green
    puts "#{Webcam.count} webcams created".underline
    puts "Scrapper will have created about 20 more webcams in a few minutes..."
  end
end
