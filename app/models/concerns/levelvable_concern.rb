# frozen_string_literal: true

module LevelvableConcern
  extend ActiveSupport::Concern

  included do
    enum level: { clear: 0, moderate: 1, na: 2, critical: 3 }

    validates :level, presence: true

    scope :infested, -> { where.not(level: :clear) }
  end
end
