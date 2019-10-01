# frozen_string_literal: true

class ReportsController < ApplicationController
  skip_before_action :authenticate_user, only: :index

  def index
    render json: Report.cached_geojson
  end

  def create
    report = Report.find_or_initialize_by(report_params)

    if report.save
      status = report.id_previously_changed? ? :created : :ok
      render json: report.decorate.as_geojson, status: status
    else
      render json: { errors: report.errors.as_json }, status: :unprocessable_entity
    end
  end

  private

  def report_params
    params.require(:report)
          .permit(:latitude, :longitude, :level)
          .merge(user_id: user_id)
  end
end
