# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include AuthConcern
  include LocaleConcern
  include RavenConcern

  private

  def set_js_environment
    gon.push(
      appENV:               ENV.fetch("APP_ENV"),
      sentryPublicDSN:      ENV.fetch("SENTRY_PUBLIC_DSN"),
      release:              ENV.fetch("RELEASE") { nil },
      mapboxApiAccessToken: ENV.fetch("MAPBOX_API_ACCESS_TOKEN"),
    )
  end

  def set_admin_timezone
    Time.zone = "Paris"
  end
end
