# frozen_string_literal: true

require 'yaml'
require 'pathname'

class DirectoryInfo

  def initialize(old_directory, new_directory)
    @old_directory = old_directory
    @new_directory = new_directory
  end

  def source
    clean_input(@old_directory)
  end

  def destination
    clean_input(@new_directory)
  end

  private

  def clean_input(input)
    cleaned = input.split("/").reject(&:empty?).join("/")
    cleaned = "docs/" + cleaned unless cleaned.start_with?("docs/")
    cleaned
  end
end

class HubDoc

  attr_reader :file_path

  def initialize(file_path)
    @file_path = file_path
  end

  def add_redirect(new_dir, redirect_from)
    redirect_link = file_path
      .sub("#{new_dir}", redirect_from)
      .sub("docs", "")
      .sub("index.md", "")
      .sub(".md", "/")

    beginning, yaml, remaining = File.read(file_path).split("---", 3)

    if yaml.nil?
      # Every docs page should have frontmatter, so ensure that it's there
      # This should probably have manual intervention to determine the correct title.
      yaml = "layout: page\ntitle:#{new_dir}"
      remaining = "\n" + beginning
    end

    parsed = YAML.load(yaml)
    redirects = Array(parsed["redirect_from"])
    redirects << redirect_link
    parsed["redirect_from"] = redirects.uniq
    front_matter = YAML.dump(parsed, line_width: -1)
    begin
      File.write(file_path, front_matter.to_s + "---" + remaining.to_s)
    rescue TypeError
      puts "Unable to process #{file_path}"
    end
  end

end

if __FILE__ == $0
  info = DirectoryInfo.new(*ARGV)

  Dir.glob("#{info.destination}/**/*").each do |record|
    next if File.directory?(record)
    next unless File.extname(record) == ".md"
    puts "Adding redirect to #{record}"
    HubDoc.new(record).add_redirect(info.destination, info.source)
  end
end