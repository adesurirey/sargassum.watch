# frozen_string_literal: true

class ReportsController < ApplicationController
  def index
    @reports = Report.where(filters).select(Report.geo_attributes).decorate
    render json: @reports.as_geo_json
  end

  def create
    @report = Report.find_or_initialize_by(report_params)

    if @report.save
      status = @report.id_previously_changed? ? :created : :ok
      render json: @report.decorate.as_geo_json, status: status
    else
      render json: { errors: @report.errors.as_json }, status: :unprocessable_entity
    end
  end

  private

  def filters
    {
      level:      params[:level].presence,
      updated_at: time_range_from_param.presence,
    }.compact
  end

  def time_range_from_param
    return if params[:range].blank?

    case params[:range].to_sym
    when :last_24_hours then 24.hours.ago..
    when :last_7_days then 7.days.ago..
    when :last_30_days then 30.days.ago..
    when :last_12_months then 12.months.ago..
    end
  end

  def report_params
    params.require(:report)
          .permit(:latitude, :longitude, :level)
          .merge(session_id: session.id)
  end
end
