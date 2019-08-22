# frozen_string_literal: true

ENV["RAILS_ENV"] ||= "test"
require "simplecov" if ENV.key?("COVERAGE")

require_relative "../config/environment"
require "rails/test_help"

Minitest::Reporters.use! [Minitest::Reporters::ProgressReporter.new]

require "test_geocoder_stubs"
require "test_coordinates_helper"
require "test_headers_helper"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  # parallelize(workers: :number_of_processors)

  fixtures :all

  include FactoryBot::Syntax::Methods
  include TestCoordinatesHelper
  include TestHeadersHelper
end

class ActionDispatch::IntegrationTest
  include TestHeadersHelper

  def teardown
    Rails.cache.clear
  end

  def body
    response.parsed_body
  end
end

require "webmock/minitest"
WebMock.disable_net_connect!(allow_localhost: true)
