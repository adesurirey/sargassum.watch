# frozen_string_literal: true

class RenameDatestsDates < ActiveRecord::Migration[6.0]
  def change
    rename_column :datasets, :start_date, :start_at
    rename_column :datasets, :end_date, :end_at
  end
end
