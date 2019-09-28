# frozen_string_literal: true

class AddSourceToReport < ActiveRecord::Migration[6.0]
  def change
    add_column :reports, :source, :string
  end
end
