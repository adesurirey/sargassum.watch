# frozen_string_literal: true

ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      column do
        panel "👀 Last scrappings" do
          logs = ScrapperLog.last(2)

          div.h2 do
            logs.each do |log|
              status_tag(l(log.updated_at, format: :short), class: log.level)
            end
          end
        end
      end
    end

    columns do
      column do
        panel "👀 Total reports" do
          h2.h1 do
            number_with_delimiter Report.count + Dataset.pluck(:count).reduce(0, :+)
          end
        end
      end
      column do
        panel "👀 Uniq reporters since #{l Dataset.last.created_at, format: :long}" do
          h2.h1 { number_with_delimiter Report.pluck(:user_id).uniq.count }
        end
      end
    end
  end
end
