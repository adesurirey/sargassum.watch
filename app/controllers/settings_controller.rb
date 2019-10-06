# frozen_string_literal: true

class SettingsController < ApplicationController
  def create
    cookies[key] = setting_params[key]
    head :ok
  end

  private

  def setting_params
    params.require(:setting).permit(:map_style)
  end

  def key
    setting_params.keys.first
  end
end
