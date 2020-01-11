# frozen_string_literal: true

namespace :heroku do
  desc "Run pre release tasks"
  task release: :environment do
    Rake::Task["db:migrate"].invoke

    Rake::Task["db:seed"].invoke if ENV.fetch("APP_ENV") != "production"
  end
end
