# frozen_string_literal: true

class WebcamsController < ApplicationController
  def index
    render json: Webcam.cached_geojson
  end
end
