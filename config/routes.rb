Rails.application.routes.draw do
  root to: 'pages#home'

  resources :reports, only: [:index, :create], defaults: { format: :json }

  # Sidekiq Web UI, only for admins.
  middleware = Rack::Auth::Basic
  auth_proc = Proc.new do |username, password|
    # Protect against timing attacks:
    # - See https://codahale.com/a-lesson-in-timing-attacks/
    # - See https://thisdata.com/blog/timing-attacks-against-string-comparison/
    # - Use & (do not use &&) so that it doesn't short circuit.
    # - Use digests to stop length information leaking (see also ActiveSupport::SecurityUtils.variable_size_secure_compare)
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username.to_s), ::Digest::SHA256.hexdigest(ENV.fetch("ADMIN_USERNAME").to_s)) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password.to_s), ::Digest::SHA256.hexdigest(ENV.fetch("ADMIN_PASSWORD").to_s))
  end

  require "sidekiq/web"
  Sidekiq::Web.use middleware, &auth_proc
  mount Sidekiq::Web, at: "/sidekiq"

  ActiveAdmin.routes(self)

  get ':language', to: 'pages#home'
end
