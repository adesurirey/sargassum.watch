# frozen_string_literal: true

class PagesController < ApplicationController
  skip_before_action :authenticate_user

  def home
    gon.push(
      mapboxApiAccessToken: ENV.fetch("MAPBOX_API_ACCESS_TOKEN"),
      levels:               Report.formatted_levels,
      quickLooks:           QUICK_LOOKS,
      webcams:              ENV.fetch("WEBCAMS_URL"),
      mapStyle:             map_style,
      contact:              ENV.fetch("CONTACT_EMAIL") { "hello@sargassum.watch" },
    )
  end

  private

  def map_style
    cookies[:map_style] || "map"
  end
end
