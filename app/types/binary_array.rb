# frozen_string_literal: true

class BinaryArray < ActiveRecord::Type::Binary
  def serialize(value)
    super value_to_binary(value.to_json)
  end

  def deserialize(value)
    super case value
          when NilClass
            []
          when ActiveModel::Type::Binary::Data
            value_to_array(value.to_s)
          else
            value_to_array(PG::Connection.unescape_bytea(value))
          end
  end

  private

  def value_to_array(value)
    JSON.parse(
      ActiveSupport::Gzip.decompress(value),
      symbolize_names: true,
    ) || []
  end

  def value_to_binary(value)
    ActiveSupport::Gzip.compress(value)
  end
end
