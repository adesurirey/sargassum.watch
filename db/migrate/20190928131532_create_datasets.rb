# frozen_string_literal: true

class CreateDatasets < ActiveRecord::Migration[6.0]
  def change
    create_table :datasets do |t|
      t.string :name, null: false
      t.integer :count, null: false
      t.datetime :start_date, null: false
      t.datetime :end_date, null: false
      t.binary :features, null: false

      t.timestamps
    end
  end
end
