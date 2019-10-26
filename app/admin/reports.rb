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
  filter :source, as: :select, collection: -> { Report.pluck(:source).uniq.compact }
  filter :name
  filter :created_at
  filter :updated_at

  controller do
    prepend_before_action :authenticate_admin, only: :new

    private

    def authenticate_admin
      return if admin_id

      @admin_id = cookies.signed.permanent[:admin_id] = SecureRandom.hex
    end

    def admin_id
      @admin_id ||= cookies.signed[:admin_id]
    end

    def build_new_resource
      Report.new(user_id: admin_id)
    end
  end

  action_item :red_sargazo, only: :index do
    link_to "New RedSargazo", new_red_sargazo_admin_reports_path
  end

  collection_action :new_red_sargazo, method: [:get, :post] do
    if request.get?
      @locations = RED_SARGAZO_LOCATIONS.map { |report| Report.new(report) }
      render "admin/reports/new_red_sargazo"
    else
      user_id = SecureRandom.hex
      reports = params.require(:red_sargazo).permit(reports: {}).to_h[:reports]

      reports = reports.map do |_, attributes|
        attributes.merge(
          user_id:    user_id,
          created_at: params[:red_sargazo][:created_at],
          updated_at: params[:red_sargazo][:created_at],
          source:     "https://www.facebook.com/RedSargazo",
        )
      end

      Report.transaction do
        Report.without_cache_callback do
          Report.create!(reports)
        end
      end

      CreateReportsGeoJSONCacheJob.perform_later
      redirect_to admin_reports_path, notice: "#{reports.size} reports created !"
    end
  end

  index do
    id_column
    column(:name) { |report| report.name.truncate(15) }
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
