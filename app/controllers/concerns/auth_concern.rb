# frozen_string_literal: true

module AuthConcern
  extend ActiveSupport::Concern

  included do
    private

    # Passive authentication:
    #
    # user_id should be generated by fingerprinting user's browser on the client side
    # to provide a 99% uniq and stable id, through public and private sessions.
    #
    # Due to some browsers like Brave preventing fingerprints,
    # we fallback here on a randomly generated id.
    #
    def authenticate_user
      return if user_id

      @user_id =
        cookies.signed.permanent[:user_id] =
          request.headers["HTTP_X_FINGERPRINT"] || SecureRandom.hex
    end

    def user_id
      @user_id ||= cookies.signed[:user_id]
    end
  end
end
