# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :authenticate_user

  private

  def authenticate_user
    return if user_id

    @user_id = cookies[:user_id] = request.headers["HTTP_X_FINGERPRINT"]
  end

  def user_id
    @user_id ||= cookies[:user_id]
  end

  def set_admin_timezone
    Time.zone = "Paris"
  end
end
