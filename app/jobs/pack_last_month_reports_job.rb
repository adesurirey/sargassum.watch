# frozen_string_literal: true

class PackLastMonthReportsJob < ApplicationJob
  queue_as :default

  # This job should be started the second day of a month.
  # It will pack previous month reports and reschedule itself for next month.
  #
  def perform
    now = Time.current
    pack_end_datetime = now.change(day: 1).beginning_of_day
    reports = Report.where("updated_at < ?", pack_end_datetime)

    Dataset.pack_reports!(name: pack_end_datetime.strftime("%^B %Y"), reports: reports)

    PackLastMonthReportsJob.set(wait_until: now.next_month.end_of_day).perform_later
  end
end
