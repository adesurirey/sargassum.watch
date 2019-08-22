Rails.application.routes.draw do
  resources :reports, only: [:index], defaults: { format: :json }
end
