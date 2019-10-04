# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.6.3"

gem "rails", "~> 6.0.0"

# Server
gem "puma", "~> 3.11"

# DB & adapters
gem "pg", ">= 0.18", "< 2.0"

# Structural
gem "draper"
gem "geocoder"

# Background jobs
gem "sidekiq"
gem "sidekiq-failures", "~> 1.0"

# HTTP
gem "faraday"

# Frontend
gem "autoprefixer-rails"
gem "gon"
gem "jbuilder", "~> 2.7"
gem "sass-rails", "~> 5"
gem "webpacker", "~> 4.0"

# Utils
gem "bootsnap", ">= 1.4.2", require: false
gem "colorize"

# Admin
gem "activeadmin"

group :development, :test do
  # Debugging tools
  gem "pry-byebug"
  gem "pry-rails"

  # Linters
  gem "rubocop", require: false

  # Auto-generated factories
  gem "factory_bot_rails"

  # Secrets
  gem "dotenv-rails"
end

group :development do
  # Debugging tools
  gem "listen", ">= 3.0.5", "< 3.2"
  gem "web-console", ">= 3.3.0"

  # Utils
  gem "annotate"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

group :test do
  # System testing
  gem "capybara", ">= 2.15"
  gem "selenium-webdriver"
  gem "webdrivers"

  # Coverage
  gem "simplecov", require: false

  # Mocks
  gem "webmock"

  # Utils
  gem "faker"
  gem "guard"
  gem "guard-minitest"
  gem "minitest-reporters"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
