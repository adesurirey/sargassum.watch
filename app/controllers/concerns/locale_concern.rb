# frozen_string_literal: true

module LocaleConcern
  extend ActiveSupport::Concern

  included do
    before_action :set_locale

    private

    def set_locale
      I18n.locale = params[:locale] || I18n.default_locale
    end

    def default_url_options
      { locale: I18n.locale == I18n.default_locale ? nil : I18n.locale }
    end
  end
end
