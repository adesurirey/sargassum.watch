# frozen_string_literal: true

module AuthConcern
  extend ActiveSupport::Concern

  included do
    private

    def authenticate_user
      return if user_id

      @user_id =
        cookies.signed.permanent[:user_id] =
          request.headers["HTTP_X_FINGERPRINT"]
    end

    def user_id
      @user_id ||= cookies.signed[:user_id]
    end
  end
end
