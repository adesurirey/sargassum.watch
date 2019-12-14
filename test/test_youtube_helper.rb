# frozen_string_literal: true

module TestYoutubeHelper
  def stub_youtube_available(id)
    response = youtube_response(live: true)

    stub_request(:get, youtube_url(id))
      .to_return(status: 200, body: response)
  end

  def stub_youtube_unavailable(id)
    response = youtube_response(live: false)

    stub_request(:get, youtube_url(id))
      .to_return(status: 200, body: response)
  end

  private

  def youtube_url(id)
    "https://www.googleapis.com/youtube/v3/videos?id=#{id}&key=#{ENV.fetch('YOUTUBE_API_KEY')}&part=snippet"
  end

  def youtube_response(live:)
    response = JSON.parse file_fixture("youtube_video.json").read
    response["items"].first["snippet"]["liveBroadcastContent"] = live ? "live" : "none"
    JSON.generate response
  end
end
