# frozen_string_literal: true

class ServiceWorkerController < ApplicationController
  skip_before_action :authenticate_user

  protect_from_forgery except: :service_worker

  def service_worker; end

  def manifest; end
end
