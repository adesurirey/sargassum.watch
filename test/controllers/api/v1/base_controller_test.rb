# frozen_string_literal: true

require "test_helper"

class Api::V1::BaseControllerTest < ActionDispatch::IntegrationTest
  setup do
    @report = create(:report)
  end

  test "should intercept 500 errors" do
    error = proc do |_|
      fail ArgumentError, "Some internal error"
    end

    raven_mock = Minitest::Mock.new
    raven_mock.expect :call, nil, [ArgumentError]

    Raven.stub :capture_exception, raven_mock do
      Report.stub :find, error do
        patch api_v1_report_path(@report.id)
      end
    end

    raven_mock.verify
    assert_response :internal_server_error
    assert_equal "Internal server error", body["message"]
  end

  test "should intercept 404 errors" do
    error = proc do |id|
      fail ActiveRecord::RecordNotFound, "No report found with id #{id}"
    end

    Report.stub :find, error do
      patch api_v1_report_path(@report.id)
    end

    assert_response :not_found
    assert_equal "No report found with id #{@report.id}", body["message"]
  end
end
