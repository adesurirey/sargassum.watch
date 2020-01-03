# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :push_environment

  def home
    gon.push(
      levels:     Report.formatted_levels,
      quickLooks: QUICK_LOOKS,
      mapStyle:   map_style,
      contact:    ENV.fetch("CONTACT_EMAIL") { "hello@sargassum.watch" },
      firstVisit: first_visit?,
    )
  end

  private

  def push_environment
    gon.push(
      appENV:               ENV.fetch("APP_ENV"),
      sentryPublicDSN:      ENV.fetch("SENTRY_PUBLIC_DSN"),
      release:              ENV.fetch("RELEASE") { nil },
      mapboxApiAccessToken: ENV.fetch("MAPBOX_API_ACCESS_TOKEN"),
    )
  end

  def first_visit?
    return false if cookies[:known_user]

    cookies.permanent[:known_user] = 1
    true
  end

  def map_style
    cookies[:map_style] || "map"
  end
end
