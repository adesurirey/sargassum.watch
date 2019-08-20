SimpleCov.start "rails" do
  add_filter "/channels/" # unused

  groups.delete("Channels")
  groups.delete("Models")

  add_group "Models", ["app/models", "app/decorators"]

  add_group "Helpers" do |src_file|
    next false unless src_file.project_filename.include?("app/helpers")
    !src_file.project_filename.include?("admin")
  end

  add_group "Libraries" do |src_file|
    next false unless src_file.project_filename.include?("/lib/")
    !src_file.project_filename.include?("lib/engine/")
  end
end
