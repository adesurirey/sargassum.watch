# frozen_string_literal: true

puts "Cleaning DB..."

Report.delete_all

puts "Seeding reports..."

def file_path(file_name)
  Rails.root.join("db", "data", file_name)
end

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
  file_path = file_path(file_name)
  attributes = {
    level:      level == :infested ? [:moderate, :critical].sample : level,
    session_id: file_path.basename.to_s,
  }
  kml = Assets::KML.new(file_path, attributes)

  Report.create!(kml.placemarks)
  report_parser_results(kml)
end

start_time = Time.zone.now

seed_form_file!("2019_beaches_with_sargassum.kml", :infested)
seed_form_file!("2019_beaches_without_sargassum.kml", :low)

seed_form_file!("2018_beaches_with_sargassum.kml", :infested)
seed_form_file!("2018_beaches_without_sargassum.kml", :low)

elapsed_time = (Time.zone.now - start_time).round

puts " "
puts "Done in #{elapsed_time} seconds."
puts ""
puts "#{Report.count} reports created in #{elapsed_time} seconds".underline
puts "#{Report.low.count} low reports"
puts "#{Report.moderate.count} moderate reports"
puts "#{Report.critical.count} critical reports"
