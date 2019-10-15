# frozen_string_literal: true

def url(offset = 50)
  "https://webcamstravel.p.rapidapi.com/webcams/list/category=beach/limit=50,#{offset}&show=webcams:player,location,url"
end

def request(url)
  headers = {
    "x-rapidapi-host": "webcamstravel.p.rapidapi.com",
    "x-rapidapi-key": ENV.fetch('RAPID_API_KEY'),
  }

  response = Faraday.get url, nil, headers
  body = JSON.parse response.body

  OpenStruct.new(body)
end

def map_results(results)
  results["webcams"].map do |cam|
    lon, lat = cam['location'].values_at('longitude', 'latitude')

    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat]
      },
      properties: {
        lookerUrl: cam['player']['day']['embed']
      }
    }
  end
end

def feature_collection(features)
  {
    "type": "FeatureCollection",
    "features": features,
  }
end

namespace :webcams do
  desc "Print formatted beach webcams"
  task print: :environment do
    offset = 0
    response = request(url(offset))
    results = map_results(response.result)
    total = response.result["total"]

    while results.size < total
      offset += 50
      response = request(url(offset))
      results.push(map_results(response.result)).flatten!

      puts "#{results.size}/#{total}"
    end

    puts "TOTAL = #{results.size}"
    puts "--"

    puts feature_collection(results).to_json
  end
end
