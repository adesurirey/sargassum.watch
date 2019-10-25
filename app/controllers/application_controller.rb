# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :set_raven_context
  before_action :set_locale

  private

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def default_url_options
    { locale: I18n.locale == I18n.default_locale ? nil : I18n.locale }
  end

  def authenticate_user
    return if user_id

    @user_id =
      cookies.signed.permanent[:user_id] =
        request.headers["HTTP_X_FINGERPRINT"]
  end

  def user_id
    @user_id ||= cookies.signed[:user_id]
  end

  def set_admin_timezone
    Time.zone = "Paris"
  end

  def set_raven_context
    Raven.user_context(id: user_id)
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end
end
