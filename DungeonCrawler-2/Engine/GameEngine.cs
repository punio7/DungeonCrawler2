using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript.V8;

namespace DungeonCrawler2.Engine
{
    public class GameEngine
    {
        private HashSet<string> loadedScripts;

        public GameEngine()
        {
            loadedScripts = new HashSet<string>();
        }

        public void Output(string message)
        {
            Console.WriteLine(message);
        }

        public void LoadScript(string location)
        {
            if (!loadedScripts.Contains(location))
            {
                var script = File.ReadAllText(location);
                ScriptContext.Current.Execute(location, script); 
            }
        }

        public void Init()
        {
            LoadScript("src/Init.js");
        }
    }
}
