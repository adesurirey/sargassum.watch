# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    gon.levels = Report.formatted_levels
    gon.mapboxApiAccessToken = ENV.fetch("MAPBOX_API_ACCESS_TOKEN")
    gon.quickLooks = QUICK_LOOKS
  end
end
