using System;
using System.IO;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

Add a = new Add();

int aa = a.add(2,3);

string yml = System.IO.File.ReadAllText(@"../../docs/_data/workshops.yml");

var deserializer = new DeserializerBuilder()
    .WithNamingConvention(UnderscoredNamingConvention.Instance)  // see height_in_inches in sample yml 
    .Build();

//yml contains a string containing your YAML
var workshops = deserializer.Deserialize<Workshop[]>(yml);

foreach(var workshop in workshops){
    Console.WriteLine("WOrkshop Title: " + workshop.Title);
}


public class Workshop {
    public string Title { get; set;}
}

