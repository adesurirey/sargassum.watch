# frozen_string_literal: true

ActiveAdmin.register Dataset do
  menu priority: 2

  actions :all, except: [:new, :edit, :destroy]

  filter :name
  filter :start_at
  filter :end_at
  filter :created_at

  index do
    id_column
    column(:name) { |dataset| dataset.name.truncate(36) }
    column :start_at
    column :end_at
    column :count
    column :created_at
    actions
  end

  show do
    panel "Datails" do
      attributes_table_for dataset do
        row :count
        row :start_at
        row :end_at
        row :created_at
        row :updated_at
      end
    end
  end
end
