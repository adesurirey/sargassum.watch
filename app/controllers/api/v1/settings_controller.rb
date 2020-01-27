# frozen_string_literal: true

class Api::V1::SettingsController < Api::V1::BaseController
  def create
    setting_params.each do |key, value|
      cookies[key] = value
    end

    head :created
  end

  private

  def setting_params
    params.require(:setting).permit(:map_style, :interval)
  end
end
