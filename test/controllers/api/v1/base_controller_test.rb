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

  test "should log 422 errors" do # rubocop:disable Metrics/BlockLength
    user_id = SecureRandom.hex

    raven_mock = Minitest::Mock.new
    raven_mock.expect :call, nil, [
      "Unprocessable entity Report",
      record: {
        "id"         => nil,
        "name"       => nil,
        "latitude"   => nil,
        "longitude"  => nil,
        "level"      => "clear",
        "user_id"    => user_id.to_s,
        "created_at" => nil,
        "updated_at" => nil,
        "source"     => nil,
        "skip_cache" => false,
      },
      errors: {
        latitude:  ["is not a number"],
        longitude: ["is not a number"],
      },
    ]

    Raven.stub :capture_message, raven_mock do
      post api_v1_reports_path,
           headers: auth_headers(user_id),
           params:  { report: { level: "clear" } }
    end

    raven_mock.verify
    assert_response :unprocessable_entity
    assert_kind_of Hash, body["errors"]
  end
end
