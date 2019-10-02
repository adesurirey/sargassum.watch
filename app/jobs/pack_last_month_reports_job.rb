# frozen_string_literal: true

class PackLastMonthReportsJob < ApplicationJob
  queue_as :default

  def perform
    ensure_one_week_of_unpacked_reports

    now = Time.current
    pack_end_datetime = now.change(day: 1).beginning_of_day
    reports = Report.where("updated_at < ?", pack_end_datetime)

    Dataset.pack_reports!(name: pack_end_datetime.strftime("%^B %Y"), reports: reports)

    PackLastMonthReportsJob.set(wait_until: now.next_month.end_of_day).perform_later
  end

  private

  def ensure_one_week_of_unpacked_reports
    return if Time.current.day > 7

    fail StandardError, "Keep one week of unpacked reports for relevant scrapper results"
  end
end
