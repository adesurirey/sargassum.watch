# frozen_string_literal: true

ActiveAdmin.register Webcam do
  menu priority: 3

  decorate_with WebcamDecorator

  permit_params :name, :latitude, :longitude, :kind, :source, :url, :youtube_id

  filter :name
  filter :kind, as: :select, collection: -> { Webcam.kinds }
  filter :source, as: :select, collection: -> { Webcam.pluck(:source).uniq.compact }
  filter :youtube_id
  filter :url
  filter :created_at
  filter :updated_at

  index do
    id_column
    column(:name) { |webcam| webcam.name.truncate(15) }
    column :kind
    column :source
    column :created_at
    column :updated_at
    actions
  end

  show do
    panel "Datails" do
      attributes_table_for webcam do
        row :kind
        row("Youtube ID", &:youtube_id)
        row :url
        row :latitude
        row :longitude
        row :created_at
        row :updated_at
        row :source
      end
    end

    tabs do
      tab :geoJSON do
        pre do
          simple_format(JSON.pretty_generate(webcam.as_geojson))
        end
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :kind
      f.input :youtube_id, label: "Youtude ID"
      f.input :url
      f.input :name
      f.input :source
      f.input :latitude
      f.input :longitude
    end
    f.actions
  end
end
