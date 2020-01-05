# frozen_string_literal: true

class Api::V1::BaseController < ActionController::API
  include ActionController::Cookies

  include AuthConcern
  include LocaleConcern
  include RavenConcern

  rescue_from StandardError,                with: :internal_server_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def internal_server_error(exception)
    Raven.capture_exception(exception)

    Rails.logger.error "#{exception.class}: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")

    render_error "Internal server error", :internal_server_error
  end

  def not_found(exception)
    render_error exception.message, :not_found
  end

  def unprocessable_entity(record)
    render json: { errors: record.errors.as_json }, status: :unprocessable_entity
  end


  end

  def render_error(message, status)
    render json: { message: message }, status: status
  end
end
