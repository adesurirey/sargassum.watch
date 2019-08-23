# frozen_string_literal: true

class ReportsController < ApplicationController
  def index
    reports = Report.all.select(Report.geo_attributes)

    geo_json = Rails.cache.fetch(Report.cache_key(reports)) do
      reports.decorate.to_geo_json
    end

    render json: geo_json
  end

  def create
    report = Report.find_or_initialize_by(report_params)

    if report.save
      status = report.id_previously_changed? ? :created : :ok
      render json: report.decorate.as_geo_json, status: status
    else
      render json: { errors: report.errors.as_json }, status: :unprocessable_entity
    end
  end

  private

  def report_params
    params.require(:report)
          .permit(:latitude, :longitude, :level)
          .merge(session_id: session.id)
  end
end