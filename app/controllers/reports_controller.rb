# frozen_string_literal: true

class ReportsController < ApplicationController
  before_action :authenticate_user, only: [:create, :update]

  def index
    render json: Report.cached_geojson
  end

  def create
    @report = Report.find_or_initialize_for_user(report_params)

    if @report.save
      status = @report.id_previously_changed? ? :created : :ok
      render_report(status, can_update: true)
    else
      render json: { errors: @report.errors.as_json }, status: :unprocessable_entity
    end
  end

  def update
    @report = Report.find(params[:id])

    if @report.can_update?(report_params)
      @report.photo.attach(report_params[:photo])
      render_report(:ok, can_update: true)
    else
      head :forbidden
    end
  end

  private

  def render_report(status, can_update: false)
    json = @report.decorate.as_geojson.deep_merge!(
      properties: { canUpdate: can_update },
    )

    render json: json, status: status
  end

  def report_params
    params.require(:report)
          .permit(:latitude, :longitude, :level, :photo)
          .merge(user_id: user_id)
  end
end
