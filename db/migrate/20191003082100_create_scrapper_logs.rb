# frozen_string_literal: true

class CreateScrapperLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :scrapper_logs do |t|
      t.string :file_name, null: false
      t.integer :level, null: false
      t.integer :valid_placemarks_count, null: false
      t.integer :invalid_placemarks_count, null: false
      t.integer :last_created_reports_count, null: false, default: 0
      t.integer :total_created_reports_count, null: false, default: 0
      t.text :parsing_failures, array: true, default: []

      t.timestamps
    end
  end
end
