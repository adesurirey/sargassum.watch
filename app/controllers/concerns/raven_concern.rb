# frozen_string_literal: true

module RavenConcern
  extend ActiveSupport::Concern

  included do
    before_action :set_raven_context

    private

    def set_raven_context
      Raven.user_context(id: user_id)
      Raven.extra_context(params: params.to_unsafe_h, url: request.url)
    end
  end
end
