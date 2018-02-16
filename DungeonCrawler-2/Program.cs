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
            using (var script = new V8ScriptEngine())
            {
                ScriptContext.Current = script;
                Console.WriteLine("Loading scripts");
                GameEngine gameEngine = new GameEngine();
                script.AddHostObject("Engine", gameEngine);
                gameEngine.Init();

                Console.WriteLine("Executing command");
                script.Execute(@"Commands.Execute({name: 'name'}, 'test');");
            }
            Console.WriteLine("Finish");
            Console.ReadKey();
        }
    }
}
