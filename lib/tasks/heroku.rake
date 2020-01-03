# frozen_string_literal: true

namespace :heroku do
  desc "prepare heroku staging"
  task bootstrap: :environment do
    fail "Invalid environment error" unless ENV.fetch("APP_ENV") == "staging"

    Rake::Task["db:schema:load"].invoke
    Rake::Task["db:seed"].invoke
  end
end
