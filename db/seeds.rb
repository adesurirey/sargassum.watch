# frozen_string_literal: true

def puts_errors(kml)
  kml.errors.each do |error|
    puts "— #{error}".yellow
  end
end

def report_parser_results(kml)
  puts ""
  puts kml.name.to_s.underline
  puts "#{kml.placemarks.size} valid placemarks"
  puts "#{kml.errors.size} invalid placemarks".light_yellow
  puts_errors(kml)
end

def report_attibutes(kind)
  {
    level:   kind == :with ? :critical : :clear,
    user_id: SecureRandom.hex,
    source:  "http://sargassummonitoring.com",
  }
end

def skip_callback
  Report.skip_callback(:commit, :after, :create_geojson_cache, raise: false)
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

def seed(year, kind)
  attributes = report_attibutes(kind)

  file = Scrapper.call(kind: kind, year: year)
  kml = Assets::KML.new(file, attributes)

  random_seed(kml.placemarks, kind)

  report_parser_results(kml)
end

puts "[1/3] Cleaning db..."

Report.delete_all
Dataset.delete_all

puts "[2/3] Seeding reports..."

start_time = Time.zone.now

# Reports for 2019
seed("2019", :with)
seed("2019", :without)

# Reports for 2018
seed("2018", :with)
seed("2018", :without)

elapsed_time = (Time.zone.now - start_time).round

puts ""
puts "Done in #{elapsed_time} seconds.".light_green
puts ""
puts "#{Report.count} reports created".underline
puts "#{Report.clear.count} clear reports"
puts "#{Report.moderate.count} moderate reports"
puts "#{Report.na.count} na reports"
puts "#{Report.critical.count} critical reports"

puts ""
puts "[3/3] Starting reports monthly packing job..."

start_time = Time.zone.now

PackLastMonthReportsJob.perform_now

elapsed_time = (Time.zone.now - start_time).round

puts ""
puts "Done in #{elapsed_time} seconds.".light_green
puts ""
puts "#{Dataset.count} dataset created with #{Dataset.last.count} features".underline
puts "#{Report.count} reports remaining"
