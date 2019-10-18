SimpleCov.start "rails" do
  add_filter "/mailers/"
  add_filter "/admin/"

  groups.delete("Mailers")
  groups.delete("Models")

  add_group "Models", ["app/models", "app/decorators"]
  add_group "Services", ["app/services"]
end
