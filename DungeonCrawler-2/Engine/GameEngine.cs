using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript.V8;

namespace DungeonCrawler2.Engine
{
    public class GameEngine : IGameEngine, IDisposable
    {
        private HashSet<string> loadedScripts;
        private V8ScriptEngine scriptEngine;
        private V8Script executeScript;

        private bool ExitRaised { get; set; }

        public GameEngine()
        {
            loadedScripts = new HashSet<string>();
        }

        public void Dispose()
        {
            if (executeScript != null)
            {
                executeScript.Dispose();
            }
            if (scriptEngine != null)
            {
                scriptEngine.Dispose();
            }
        }

        #region Internal Members

        internal void Init()
        {
            Dispose();
            scriptEngine = new V8ScriptEngine();
            loadedScripts = new HashSet<string>();
            scriptEngine.AddHostObject("Engine", new GameEngineProxy(this));
            LoadScript("src/Init.js");
            executeScript = scriptEngine.Compile("Execute(Engine.Input);");
        }

        internal void Execute(string command)
        {
            Input = command;
            scriptEngine.Execute(executeScript);
        }

        internal void Run()
        {
            while (!ExitRaised)
            {
                try
                {
                    string command = Console.ReadLine();
                    Execute(command);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
        }

        #endregion

        #region IGameEngine Members

        public string Input { get; private set; } = "";

        public void Output(object message)
        {
            Console.WriteLine(message);
        }

        public void LoadScript(string location)
        {
            if (!loadedScripts.Contains(location))
            {
                if (location.StartsWith("src"))
                {
                    location = @"..\..\" + location;
                }
                var file = new FileInfo(location);
                Console.WriteLine(string.Format("Loading script file {0}", file.FullName));

                var script = File.ReadAllText(file.FullName);
                scriptEngine.Execute(location, script);
                loadedScripts.Add(location);
            }
        }

        public string LoadData(string location)
        {
            if (location.StartsWith("res"))
            {
                location = @"..\..\" + location;
            }

            var file = new FileInfo(location);
            Console.WriteLine(string.Format("Loading data file {0}", file.FullName));

            var data = File.ReadAllText(file.FullName); ;
            return data;
        }

        public void Exit()
        {
            ExitRaised = true;
        }

        public void Reload()
        {
            Init();
        }

        #endregion
    }
}
