using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DungeonCrawler2.Engine;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;

namespace DungeonCrawler2
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting engine");
            using (GameEngine gameEngine = new GameEngine())
            {
                Console.WriteLine("Loading scripts");
                gameEngine.Init();
                gameEngine.Run();
            }
            Console.WriteLine("Finish");
            Console.ReadKey();
        }
    }
}
