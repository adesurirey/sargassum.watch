# frozen_string_literal: true

ActiveAdmin.register ScrapperLog do
  menu label: "Scrapper logs", priority: 3

  actions :all, except: [:new, :edit, :destroy]

  filter :file_name
  filter :level, as: :select, collection: -> { ScrapperLog.levels }
  filter :created_at
  filter :updated_at

  index do
    id_column
    column(:file_name) { |log| log.file_name.truncate(36) }
    column(:level) { |log| status_tag(log.level, class: log.level) }
    column(:valid, &:valid_placemarks_count)
    column(:invalid, &:invalid_placemarks_count)
    column(:total, &:total_created_reports_count)
    column(:last, &:last_created_reports_count)
    column :updated_at
    actions
  end

  show do
    panel "Datails" do
      attributes_table_for scrapper_log do
        row(:level) { |log| status_tag(log.level, class: log.level) }
        row :valid_placemarks_count
        row :invalid_placemarks_count
        row :total_created_reports_count
        row :last_created_reports_count
        row :created_at
        row :updated_at
      end
    end

    tabs do
      tab :parsing_failures do
        pre do
          simple_format(JSON.pretty_generate(scrapper_log.parsing_failures))
        end
      end
    end
  end
end
