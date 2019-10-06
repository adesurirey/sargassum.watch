# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    gon.push(
      levels:               Report.formatted_levels,
      mapboxApiAccessToken: ENV.fetch("MAPBOX_API_ACCESS_TOKEN"),
      quickLooks:           QUICK_LOOKS,
      webcams:              WEBCAMS,
      mapStyle:             map_style,
    )
  end

  private

  def map_style
    cookies[:map_style] || "map"
  end
end
