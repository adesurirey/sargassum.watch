# frozen_string_literal: true

ENV["RAILS_ENV"] ||= "test"
require "simplecov" if ENV.key?("COVERAGE")

require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"

Minitest::Reporters.use! [Minitest::Reporters::ProgressReporter.new]

FactoryBot::SyntaxRunner.class_eval do
  include ActionDispatch::TestProcess
end

require "test_geocoder_stubs"
require "test_coordinates_helper"
require "test_headers_helper"
require "test_youtube_helper"

module RemoveUploadedFiles
  def after_teardown
    super
    remove_uploaded_files
  end

  private

  def remove_uploaded_files
    FileUtils.rm_rf(Rails.root.join("tmp", "storage"))
  end
end

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  # parallelize(workers: :number_of_processors)

  prepend RemoveUploadedFiles

  fixtures :all

  include FactoryBot::Syntax::Methods
  include ActiveJob::TestHelper
  include TestCoordinatesHelper
  include TestYoutubeHelper

  def teardown
    WebMock.reset!
  end
end

class ActionDispatch::IntegrationTest
  prepend RemoveUploadedFiles

  include TestHeadersHelper

  def teardown
    Rails.cache.clear
    WebMock.reset!
  end

  def body
    response.parsed_body
  end
end

require "webmock/minitest"
WebMock.disable_net_connect!(allow_localhost: true)
