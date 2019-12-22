# frozen_string_literal: true

class ReportsController < ApplicationController
  before_action :authenticate_user, only: [:create, :update]
  before_action :set_report, only: [:update]

  def index
    render json: Report.cached_geojson
  end

  def create
    @report = Report.find_or_initialize_for_user(report_params)

    if @report.save
      render_report(status: report_status, can_update: true)
    else
      render_errors
    end
  end

  def update
    if @report.can_update?(update_params)
      @report.photo.attach(params[:photo])
      render_report(can_update: true)
    else
      head :forbidden
    end
  end

  private

  def set_report
    @report = Report.find(params[:id])
  end

  def report_status
    if @report.id_previously_changed?
      :created
    else
      :ok
    end
  end

  def render_report(status: :ok, can_update: false)
    json = @report.decorate.as_geojson.deep_merge!(
      properties: { canUpdate: can_update },
    )

    render json: json, status: status
  end

  def render_errors
    render json: { errors: @report.errors.as_json }, status: :unprocessable_entity
  end

  def report_params
    params.require(:report)
          .permit(:latitude, :longitude, :level)
          .merge(user_id: user_id)
  end

  def update_params
    params.permit(:latitude, :longitude)
          .merge(user_id: user_id)
  end
end
