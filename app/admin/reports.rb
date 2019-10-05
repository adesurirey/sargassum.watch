# frozen_string_literal: true

ActiveAdmin.register Report do
  menu priority: 1

  decorate_with ReportDecorator

  permit_params :name, :latitude, :longitude, :level, :user_id, :source

  scope :all, default: true
  scope :original
  scope :scrapped

  filter :user_id
  filter :level, as: :select, collection: -> { Report.levels }
  filter :source
  filter :name
  filter :created_at
  filter :updated_at

  index do
    id_column
    column(:name) { |report| report.name.truncate(22) }
    column(:level) { |report| status_tag(report.level, class: report.level) }
    column :user_id
    column :created_at
    column :updated_at
    actions
  end

  show do
    panel "Datails" do
      attributes_table_for report do
        row(:level) { |report| status_tag(report.level, class: report.level) }
        row :latitude
        row :longitude
        row :user_id
        row :created_at
        row :updated_at
        row :source
      end
    end

    tabs do
      tab :geoJSON do
        pre do
          simple_format(JSON.pretty_generate(report.as_geojson))
        end
      end
    end
  end
end