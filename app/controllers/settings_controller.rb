# frozen_string_literal: true

class SettingsController < ApplicationController
  def create
    setting_params.each do |key, value|
      cookies[key] = value
    end

    head :ok
  end

  private

  def setting_params
    params.require(:setting).permit(:map_style)
  end
end
