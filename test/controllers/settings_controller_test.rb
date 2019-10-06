# frozen_string_literal: true

require "test_helper"

class SettingsControllerTest < ActionDispatch::IntegrationTest
  test "should create a setting cookie" do
    post settings_path,
         params:  { setting: { map_style: "satellite" } },
         headers: json_headers

    assert_response :ok
  end
end
