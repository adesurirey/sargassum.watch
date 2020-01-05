# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include AuthConcern
  include LocaleConcern
  include RavenConcern

  private

  def set_admin_timezone
    Time.zone = "Paris"
  end
end
