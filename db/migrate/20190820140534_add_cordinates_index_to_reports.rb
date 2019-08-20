# frozen_string_literal: true

class AddCordinatesIndexToReports < ActiveRecord::Migration[6.0]
  def change
    add_index :reports, [:latitude, :longitude]
  end
end
