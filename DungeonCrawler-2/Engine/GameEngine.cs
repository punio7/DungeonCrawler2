using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using NLog;

namespace DungeonCrawler2.Engine
{
    public class GameEngine : IGameEngine, IDisposable
    {
        private HashSet<string> loadedScripts;
        private V8ScriptEngine scriptEngine;
        private V8Script executeScript;
        private Logger logger;

        private bool ExitRaised { get; set; }

        public GameEngine()
        {
            loadedScripts = new HashSet<string>();
            logger = LogManager.GetLogger(this.GetType().FullName);
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
            V8ScriptEngineFlags flags = V8ScriptEngineFlags.None;
#if DEBUG
            flags |= V8ScriptEngineFlags.EnableDebugging;
            flags |= V8ScriptEngineFlags.EnableRemoteDebugging;
#endif
            scriptEngine = new V8ScriptEngine(flags);
            loadedScripts = new HashSet<string>();
            scriptEngine.AddHostObject("Engine", new GameEngineProxy(this));
            LoadScript("src/Init.js");
            executeScript = scriptEngine.Compile("Execute(Engine.Input);");
        }

        internal void Execute(string command)
        {
#if DEBUG
            if (command.ToLower() == "reload")
            {
                Reload();
                return;
            }
#endif
            Input = command;
            scriptEngine.Execute(executeScript);
        }

        internal void Run()
        {
            while (!ExitRaised)
            {
                TryCatch(() =>
                {
                    string command = Console.ReadLine();
                    Execute(command);
                });
            }
        }

        private void TryCatch(Action action)
        {
            try
            {
                action();
            }
            catch (ScriptEngineException see)
            {
                logger.Error(see.ErrorDetails);
            }
            catch (Exception e)
            {
                logger.Error(e);
            }
        }

        private T TryCatch<T>(Func<T> function)
        {
            try
            {
                return function();
            }
            catch (ScriptEngineException see)
            {
                logger.Error(see.ErrorDetails);
            }
            catch (Exception e)
            {
                logger.Error(e);
            }
            return default(T);
        }

        #endregion

        #region IGameEngine Members

        public string Input { get; private set; } = "";

        public void Output(object message)
        {
            TryCatch(() =>
            {
                Console.WriteLine(message);
            });
        }

        public void LoadScript(string location)
        {
            TryCatch(() =>
            {
                if (!loadedScripts.Contains(location))
                {
                    if (location.StartsWith("src"))
                    {
                        location = @"..\..\" + location;
                    }
                    var file = new FileInfo(location);
                    logger.Debug(string.Format("Loading script file {0}", file.FullName));

                    var script = File.ReadAllText(file.FullName);
                    scriptEngine.Execute(file.Name, script);
                    loadedScripts.Add(location);
                }
            });
        }

        public string LoadData(string location)
        {
            return TryCatch(() =>
            {
                if (location.StartsWith("res"))
                {
                    location = @"..\..\" + location;
                }

                var file = new FileInfo(location);
                logger.Debug(string.Format("Loading data file {0}", file.FullName));

                var data = File.ReadAllText(file.FullName); ;
                return data;
            });
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
