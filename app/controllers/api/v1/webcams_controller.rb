# frozen_string_literal: true

class Api::V1::WebcamsController < Api::V1::BaseController
  def index
    render json: Webcam.cached_geojson
  end
end
