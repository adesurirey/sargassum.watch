# frozen_string_literal: true

class PagesController < ApplicationController
  before_action :set_js_environment, only: [:home]
  before_action :set_first_visit, only: [:home]
  before_action :set_settings, only: [:home]

  def home
    gon.push(
      levels:     Report.formatted_levels,
      quickLooks: QUICK_LOOKS,
      mapStyle:   @map_style,
      interval:   @interval,
      firstVisit: @first_visit,
      contact:    ENV.fetch("CONTACT_EMAIL") { "hello@sargassum.watch" },
    )
  end

  private

  def set_first_visit
    @first_visit = cookies[:known_user].blank?

    cookies.permanent[:known_user] = 1
  end

  def set_settings
    @map_style = cookies[:map_style] || "map"
    @interval = cookies[:interval]
  end
end
