# frozen_string_literal: true

class PackLastMonthReportsJob < ApplicationJob
  queue_as :default

  def perform
    ensure_two_weeks_of_unpacked_reports

    now = Time.current
    pack_end_at = now.change(day: 1).beginning_of_day
    pack_name = pack_end_at.strftime("%^B %Y")
    packed_reports = Report.where("updated_at < ?", pack_end_at)

    Dataset.pack_reports!(name: pack_name, reports: packed_reports)

    reschedule_for_next_month(now)
  end

  private

  def ensure_two_weeks_of_unpacked_reports
    return if Time.current.day >= 14

    fail StandardError, "Keep two weeks of unpacked reports for relevant scrapper results"
  end

  def reschedule_for_next_month(now)
    PackLastMonthReportsJob.set(wait_until: now.next_month.end_of_day).perform_later
  end
end
