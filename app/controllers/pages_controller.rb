# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    gon.mapboxApiAccessToken = ENV.fetch("MAPBOX_API_ACCESS_TOKEN")
    gon.levels = Report.formatted_levels
  end
end
