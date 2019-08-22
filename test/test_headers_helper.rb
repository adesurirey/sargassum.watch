# frozen_string_literal: true

module TestHeadersHelper
  def json_headers
    {
      "Accept" => "application/json",
      # by default, if we don't specificy ContentType,
      # Rails will encode automatically params as json
      # and set the ContentType accordingly.
      #
      # If we explicitly specify ContentType,
      # we would have to explicity encode params as json
      # so it's more convenient to leave Rails do this stuff for us.
      # "Content-Type" => "json",
    }
  end
end
