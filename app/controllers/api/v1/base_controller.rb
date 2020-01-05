# frozen_string_literal: true

class Api::V1::BaseController < ActionController::API
  include ActionController::Cookies

  include AuthConcern
  include LocaleConcern
  include RavenConcern

  rescue_from StandardError,                with: :internal_server_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from PG::ConnectionBad,            with: :service_unavailable

  private

  def internal_server_error(exception)
    log_exception(exception)

    render_error "Internal server error", :internal_server_error
  end

  def not_found(exception)
    render_error exception.message, :not_found
  end

  def service_unavailable(exception)
    log_exception(exception)

    render_error "Service unavailable", :service_unavailable
  end

  def unprocessable_entity(record)
    render json: { errors: record.errors.as_json }, status: :unprocessable_entity
  end

  def log_exception(exception)
    Raven.capture_exception(exception)

    Rails.logger.error "#{exception.class}: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")
  end

  def render_error(message, status)
    render json: { message: message }, status: status
  end
end
