# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :init_session

  # Sessions are lazily loaded.
  # If we don't access sessions in our action's code, they will not be loaded.
  # See https://github.com/rails/rails/issues/10813
  #
  def init_session
    session.delete "init"
  end
end
