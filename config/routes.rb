Rails.application.routes.draw do
  resources :reports, only: [:index, :create], defaults: { format: :json }
end
