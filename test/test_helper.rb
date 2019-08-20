# frozen_string_literal: true

ENV["RAILS_ENV"] ||= "test"
require "simplecov" if ENV.key?("COVERAGE")

require_relative "../config/environment"
require "rails/test_help"

Minitest::Reporters.use! [Minitest::Reporters::ProgressReporter.new]

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  # parallelize(workers: :number_of_processors)

  fixtures :all

  include FactoryBot::Syntax::Methods

  def teardown
    Rails.cache.clear
  end
end
