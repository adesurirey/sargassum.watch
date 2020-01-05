# frozen_string_literal: true

require "test_helper"

class Api::V1::SettingsControllerTest < ActionDispatch::IntegrationTest
  test "should create a setting cookie" do
    post api_v1_settings_path,
         params:  { setting: { map_style: "satellite" } },
         headers: json_headers

    assert_response :created
  end
end
