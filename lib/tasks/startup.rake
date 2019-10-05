# frozen_string_literal: true

def report_attibutes(kind)
  {
    level:   kind == :with ? :na : :clear,
    user_id: SecureRandom.hex,
    source:  "http://sargassummonitoring.com",
  }
end

def seed(year, kind) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  attributes = report_attibutes(kind)
  kml = Scrapper.call(kind: kind, year: year, attributes: attributes)
  reports = kml.placemarks.map { |mark| Report.new(mark) }
  features = ReportsDecorator.decorate(reports).map(&:as_geojson)

  features.each do |feature|
    feature[:properties].merge!(id: SecureRandom.uuid)
  end

  Dataset.create!(
    name:     "🚀 #{kml.name}",
    start_at: reports.min_by(&:created_at).created_at,
    end_at:   reports.max_by(&:created_at).created_at,
    features: features,
  )

  ScrapperLog.create_or_update_from_kml!(
    kml:                   kml,
    created_reports_count: reports.size,
    level:                 attributes[:level],
  )
end

namespace :one_shot do
  desc "Seed first reports and launch jobs"
  task startup: :environment do
    puts "Ready to launch app? (y/N)"
    print "> "
    answer = $stdin.gets.chomp
    unless %(y yes).include?(answer.downcase)
      puts "OK, aborting."
      exit 0
    end

    puts "[1/6] Seeding 2018 clear reports pack..."
    seed(2018, :without)

    puts "[2/6] Seeding 2018 n/a reports pack..."
    seed(2018, :with)

    puts "[3/6] Seeding 2019 clear reports pack..."
    seed(2019, :without)

    puts "[4/6] Seeding 2019 n/a reports pack..."
    seed(2019, :with)

    puts "[5/6] Starting reports monthly packing job..."
    if Time.current.day < 15
      PackLastMonthReportsJob.set(wait_until: Time.current.change(day: 15)).perform_later
    else
      PackLastMonthReportsJob.perform_later
    end

    puts "[6/6] Starting scrapper jobs..."
    wait_until = if Time.current > Time.current.at_noon
                   Time.current.at_midnight
                 else
                   Time.current.at_noon
                 end

    ScrapReportsJob.set(wait_until: wait_until).perform_later(:with)
    ScrapReportsJob.set(wait_until: wait_until).perform_later(:without)

    puts "Done."
    puts "#{Dataset.count} datasets created.".underline
    puts "Have a nice trip sargassum.watch 🚀"
  end
end
