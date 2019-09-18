# frozen_string_literal: true

# WARNING:
# Required kml files are not commited in this repository,
# add your own files to db/data/ or ask for it to the owner of the repo.

puts "Cleaning db..."

Report.delete_all

puts "Seeding reports..."

def report_parser_results(kml) # rubocop:disable Metrics/AbcSize
  puts " "
  puts kml.name.to_s.underline
  puts "#{kml.placemarks.size} valid placemarks"
  puts "#{kml.errors.size} invalid placemarks".light_yellow

  kml.errors.each do |error|
    puts "— #{error}".yellow
  end
end

def seed_form_file!(file_name, level)
  file_path = Rails.root.join("db", "data", file_name)
  attributes = {
    level:   level,
    user_id: SecureRandom.hex,
  }

  kml = Assets::KML.new(file_path, attributes)
  Report.skip_callback(:save, :after, :create_geo_json_cache, raise: false)
  Report.create!(kml.placemarks)

  report_parser_results(kml)
end

start_time = Time.zone.now

# Reports for 2019
seed_form_file!("2019_beaches_with_sargassum.kml", :critical)
seed_form_file!("2019_beaches_without_sargassum.kml", :clear)

# Reports for 2018
seed_form_file!("2018_beaches_with_sargassum.kml", :moderate)
seed_form_file!("2018_beaches_without_sargassum.kml", :clear)

elapsed_time = (Time.zone.now - start_time).round

puts " "
puts "Done in #{elapsed_time} seconds.".light_green
puts ""
puts "#{Report.count} reports created".underline
puts "#{Report.clear.count} clear reports"
puts "#{Report.moderate.count} moderate reports"
puts "#{Report.critical.count} critical reports"
