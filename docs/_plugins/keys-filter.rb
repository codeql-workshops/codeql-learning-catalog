module Jekyll
  module KeysFilter
    def keys(input)
      input.keys
    end

    def values(input)
      input.values
    end

    def klass(input)
      input.class.name
    end

    def instance_id(input)
      input.object_id
    end
  end
end

Liquid::Template.register_filter(Jekyll::KeysFilter)
