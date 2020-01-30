# frozen_string_literal: true

module ClientConcern
  extend ActiveSupport::Concern

  USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130"

  included do
    private

    def headers
      { "User-Agent" => USER_AGENT }
    end
  end
end
