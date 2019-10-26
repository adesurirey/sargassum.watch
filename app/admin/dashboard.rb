# frozen_string_literal: true

ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      column do
        panel "👀 Last report scrappings" do
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
        since = Dataset.any? ? l(Dataset.last.created_at, format: :long) : "the beginning"

        panel "👀 Uniq reporters since #{since}" do
          h2.h1 do
            number_with_delimiter Report.original.pluck(:user_id).uniq.count
          end
        end
      end
    end

    columns do
      last_webcam = Webcam.order(created_at: :asc).last

      column do
        panel "👀 Total webcams" do
          h2.h1 do
            number_with_delimiter Webcam.count
          end
        end
      end
      column do
        panel "👀 Last webcam create" do

          h2.h1 do
            l(last_webcam.created_at, format: :short)
          end
        end
      end
      column do
        panel "👀 Last webcam update" do

          h2.h1 do
            l(last_webcam.updated_at, format: :short)
          end
        end
      end
    end
  end
end
