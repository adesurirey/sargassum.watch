# frozen_string_literal: true

class ReportsController < ApplicationController
  def index
    @reports = Report.all.decorate

    render json: @reports.as_geo_json
  end
end
