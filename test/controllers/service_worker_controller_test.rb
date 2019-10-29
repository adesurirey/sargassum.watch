# frozen_string_literal: true

require "test_helper"

class ServiceWorkerControllerTest < ActionDispatch::IntegrationTest
  test "should get service worker as js" do
    get service_worker_path, headers: { "Accept" => "text/javascript" }
    assert_response :success
  end

  test "should get manifest as json" do
    get manifest_path, headers: json_headers
    assert_response :success

    body = JSON.parse @response.body

    assert_equal "sargassum.watch", body["name"]
    assert_equal "sargassum", body["short_name"]
    assert_equal "/", body["start_url"]
    assert_equal 2, body["icons"].size
    assert_not_nil body["icons"].first["src"]
    assert_not_nil body["icons"].first["sizes"]
    assert_not_nil body["icons"].first["type"]
  end
end
