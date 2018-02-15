using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DungeonCrawler2.Engine;
using Microsoft.ClearScript.V8;

namespace DungeonCrawler2
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting engine");
            using (var engine = new V8ScriptEngine())
            {
                Console.WriteLine("Loading scripts");
                var script = File.ReadAllText("src/commands/command.js");
                engine.Execute(script);
                script =  File.ReadAllText("src/commands/test.js");
                engine.Execute(script);

                engine.AddHostType("Engine", typeof(Engine.Engine));

                Console.WriteLine("Executing command");
                engine.Execute(@"let test = new Test();
                                 test.execute({name: 'name'});");

                //engine.Script.test.execute();
            }
            Console.WriteLine("Finish");
            Console.ReadKey();
        }
    }
}
