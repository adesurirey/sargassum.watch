# frozen_string_literal: true

Pry.config.color = true

# Usage:
# $ sugiton
# report = _
Pry::Commands.block_command "sugiton", "Returns a new report instance at Sugiton", keep_retval: true do
  Report.new(
    level:      :low,
    latitude:   43.210479,
    longitude:  5.4468282,
    session_id: SecureRandom.hex,
  )
end
