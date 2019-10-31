# frozen_string_literal: true

class BaseService
  private

  def request
    Faraday.get @url
  end
end
