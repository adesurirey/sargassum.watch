# frozen_string_literal: true

class Api::V1::ReportsController < Api::V1::BaseController
  before_action :authenticate_user, only: [:create, :update]
  before_action :set_report, only: [:update]

  def index
    render json: Report.cached_geojson
  end

  def create
    @report = Report.new(report_params)

    if @report.save
      render_report(:created, can_update: true)
    else
      unprocessable_entity(@report)
    end
  end

  def update
    if @report.can_update?(user_id)
      @report.photo.attach(params[:photo])
      render_report(:ok)
    else
      head :forbidden
    end
  end

  private

  def set_report
    @report = Report.find(params[:id])
  end

  def render_report(status, can_update: false)
    json = @report.decorate.as_geojson

    if can_update
      json.deep_merge!(
        properties: { canUpdateUntil: @report.can_update_until.httpdate },
      )
    end

    render json: json, status: status
  end

  def report_params
    params.require(:report)
          .permit(:latitude, :longitude, :level)
          .merge(user_id: user_id)
  end
end
