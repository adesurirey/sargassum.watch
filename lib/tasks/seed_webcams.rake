# frozen_string_literal: true

namespace :one_shot do
  desc "Seed initial webcams"
  task seed_webcams: :environment do
    puts "Seeding webcams..."

    webcams = YAML.load_file(Rails.root.join("db", "data", "webcams.yml"))

    Webcam.without_cache_callback do
      Webcam.create!(webcams)
    end

    Webcam.create_geojson_cache

    puts "Done.".light_green
    puts "#{Webcam.count} webcams created".underline
  end
end
