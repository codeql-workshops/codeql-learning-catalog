# frozen_string_literal: true

module Jekyll
  class NavTree < Jekyll::Generator
    def generate(site)
      # only care about html_pages
      html_pages = site.pages.select do |page|
        page.html? || page.url.end_with?("/")
      end

      # only care about pages that are under one of the
      # top level directories AND not explicitly excluded from the nav
      top_level_dirs_list = site.config["top_level_nav"] || []
      nav_pages = html_pages.select do |page|
        top_dir = page.path.split("/").compact.first
        included_in_nav_top_dir = top_level_dirs_list.include?(top_dir)
        not_excluded_from_nav = (page.data["nav_exclude"] != true)

        included_in_nav_top_dir && not_excluded_from_nav
      end

      # group the pages into a hash tree where the values are always either
      # a hash or a Jekyll::Page instance
      # e.g.
      # {
      #   "github" => {
      #     "foo" => {
      #       "index.md" => <Jekyll::Page>,
      #       "bar.md" => <Jekyll::Page>,
      #       "baz" => {
      #         "index.md" => <Jekyll::Page>,
      #       }
      #     }
      #     "oof.md" => <Jekyll::Page>,
      #     "index.md" => <Jekyll::Page>,
      #   },
      #   "it" => {
      #     "index.md" => <Jekyll::Page>,
      #   }
      # }
      grouped = {}
      nav_pages.each do |page|
        path_el = page.path.split("/").compact
        next if path_el.count < 2 # reject 404.html, sitemap.md, index.md, etc

        current = grouped
        path_el.each do |path_el|
          if path_el.include?(".md")
            current[path_el] = page
          else
            current = if current[path_el]
              current[path_el]
            else
              current[path_el] = {}
            end
          end
        end
      end

      # sort each level of the tree alphabetically by title
      sorted = deeply_sort_hash(grouped)

      # add tree to site object
      site.data["nav_tree"] = sorted
    end

    def deeply_sort_hash(object)
      return object unless object.is_a?(Hash)
      hash = Hash.new
      object.each { |k, v| hash[k] = deeply_sort_hash(v) }
      sorted = hash.sort_by do |k,v|
        if v.is_a?(Jekyll::Page)
          v.data["title"]
        else
          index_page = v["index.md"]
          index_page&.data&.[]("title") || k.capitalize
        end
      end
      hash.class[sorted]
    end
  end
end
