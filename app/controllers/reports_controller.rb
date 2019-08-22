# frozen_string_literal: true

class ReportsController < ApplicationController
  def index
    scope = if params[:level].present?
              Report.where(level: params[:level])
            else
              Report.all
            end

    @reports = scope.decorate

    render json: @reports.as_geo_json
  end
end
