# frozen_string_literal: true

class CreateReports < ActiveRecord::Migration[6.0]
  def change
    create_table :reports do |t|
      t.string :name
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.integer :level, null: false
      t.string :user_id, null: false

      t.timestamps

      t.index [:latitude, :longitude]
    end
  end
end
