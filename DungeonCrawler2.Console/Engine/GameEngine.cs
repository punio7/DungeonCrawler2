using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using NLog;

namespace DungeonCrawler2.Console.Engine
{
    public class GameEngine : IGameEngine, IDisposable
    {
        private HashSet<string> loadedScripts;
        private V8ScriptEngine scriptEngine;
        private V8Script executeScript;
        private Logger logger;
        private List<Timer> runningTimers;
        int currentLineLength = 0;

        private bool ExitRaised { get; set; }

        public GameEngine()
        {
            loadedScripts = new HashSet<string>();
            logger = LogManager.GetLogger(this.GetType().FullName);
            runningTimers = new List<Timer>();
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
            scriptEngine.Execute("Init()");
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
                    string command = System.Console.ReadLine();
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

        public string EndLine { get; private set; } = Environment.NewLine;

        public string NonBreakingSpace { get; private set; } = " ";

        public void Output(object message, bool isNewLine = true)
        {
            TryCatch(() =>
            {
                message = addLineBreaks(message.ToString(), isNewLine);
                System.Console.Write(message);
            });
        }

        private string addLineBreaks(string message, bool addNewLine, int lineLength = 120)
        {
            StringBuilder output = new StringBuilder();

            int lastWhiteSpaceIndex = 0;
            for (int currentIndex = 0; currentIndex < message.Length; currentIndex++)
            {
                char c = message[currentIndex];
                output.Append(c);
                if (Char.IsWhiteSpace(c))
                {
                    lastWhiteSpaceIndex = currentIndex;
                }
                if (currentLineLength >= lineLength - 1)
                {
                    output[lastWhiteSpaceIndex] = '\n';
                    currentLineLength = currentIndex - lastWhiteSpaceIndex;
                }

                if (c == '\n')
                {
                    currentLineLength = 0;
                }
                else if (c == '\t')
                {
                    currentLineLength += currentLineLength % 8;
                }
                else
                {
                    currentLineLength++;
                }
            }
            if (addNewLine)
            {
                output.Append(EndLine);
                currentLineLength = 0;
            }

            return output.ToString();
        }

        public void OutputPrinter(object message, bool isNewLine = true, int delay = 60)
        {
            TryCatch(() =>
            {
                message = addLineBreaks(message.ToString(), isNewLine);
                foreach (var c in message.ToString())
                {
                    System.Console.Write(c);
                    if (!Char.IsWhiteSpace(c))
                    {
                        Thread.Sleep(delay);
                    }
                }
            });
        }

        public void LoadScript(string location)
        {
            TryCatch(() =>
            {
                if (!loadedScripts.Contains(location))
                {
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

        public void StartTimer(int interval, TimerCallback callback)
        {
            var timer = new Timer(callback);
            runningTimers.Add(timer);
            //timer.
        }

        #endregion
    }
}
