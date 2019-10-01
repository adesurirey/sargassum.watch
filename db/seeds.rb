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

def report_attibutes(kind)
  {
    level:   kind == :with ? :critical : :clear,
    user_id: SecureRandom.hex,
    source:  "http://sargassummonitoring.com",
  }
end

def skip_callback
  Report.skip_callback(:save, :after, :create_geojson_cache, raise: false)
end

def create_reports(placemarks)
  skip_callback
  Report.create!(placemarks)
end

def random_level(kind)
  if kind == :with
    [:moderate, :na, :critical].sample
  else
    :clear
  end
end

def random_seed(placemarks, kind)
  placemarks.in_groups_of(100, false) do |grouped_placemarks|
    level = random_level(kind)
    grouped_placemarks.each { |placemark| placemark.merge!(level: level) }

    create_reports(grouped_placemarks)
  end
end

def seed_form_file!(file_name, kind)
  file_path = Rails.root.join("db", "data", file_name)
  attributes = report_attibutes(kind)
  kml = Assets::KML.new(file_path, attributes)

  random_seed(kml.placemarks, kind)

  report_parser_results(kml)
end

start_time = Time.zone.now

# Reports for 2019
seed_form_file!("2019_beaches_with_sargassum.kml", :with)
seed_form_file!("2019_beaches_without_sargassum.kml", :without)

# Reports for 2018
seed_form_file!("2018_beaches_with_sargassum.kml", :with)
seed_form_file!("2018_beaches_without_sargassum.kml", :without)

elapsed_time = (Time.zone.now - start_time).round

puts " "
puts "Done in #{elapsed_time} seconds.".light_green
puts ""
puts "#{Report.count} reports created".underline
puts "#{Report.clear.count} clear reports"
puts "#{Report.moderate.count} moderate reports"
puts "#{Report.na.count} na reports"
puts "#{Report.critical.count} critical reports"

puts " "
puts "Starting reports monthly packing job..."
PackLastMonthReportsJob.perform_now

puts "#{Dataset.count} dataset created with #{Dataset.last.count} features"
puts "#{Report.count} reports remaining"
