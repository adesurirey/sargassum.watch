# frozen_string_literal: true

class CreateWebcams < ActiveRecord::Migration[6.0]
  def change
    create_table :webcams do |t|
      t.string :name
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.integer :kind, null: false
      t.string :youtube_id
      t.string :url
      t.string :source

      t.timestamps
    end
  end
end
