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
        private readonly Logger logger;
        private readonly List<Timer> runningTimers;
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
            executeScript?.Dispose();
            scriptEngine?.Dispose();
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
            LoadScript("dist/bundle.js");
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
            return default;
        }

        #endregion

        #region IGameEngine Members

        public string Input { get; private set; } = "";

        public string EndLine { get; private set; } = Environment.NewLine;

        public string NonBreakingSpace { get; private set; } = " ";

        public string DefaultColor { get => "|" + DefaultColorCode; }

        private char DefaultColorCode { get; set; } = 'W';

        public void Output(object message, bool isNewLine = true)
        {
            TryCatch(() =>
            {
                string messageWithBreakes = AddLineBreaks(message.ToString(), isNewLine);
                AnalyzeAndWrite(messageWithBreakes);
            });
        }

        private string AddLineBreaks(string message, bool addNewLine, int lineLength = 120)
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
                else if (c == '|')
                {
                    currentIndex++;
                    output.Append(message[currentIndex]);
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

        private void AnalyzeAndWrite(string message)
        {
            ChangeColor(DefaultColorCode);
            for (int i = 0; i < message.Length; i++)
            {
                if (message[i] != '|')
                {
                    System.Console.Write(message[i]);
                }
                else
                {
                    i++;
                    ChangeColor(message[i]);
                }
            }
        }

        private void ChangeColor(char code)
        {
            ConsoleColor color = ConsoleColor.White;
            switch (code)
            {
                case 'b':
                    color = ConsoleColor.DarkBlue;
                    break;
                case 'g':
                    color = ConsoleColor.DarkGreen;
                    break;
                case 'c':
                    color = ConsoleColor.DarkCyan;
                    break;
                case 'r':
                    color = ConsoleColor.DarkRed;
                    break;
                case 'p':
                    color = ConsoleColor.DarkMagenta;
                    break;
                case 'y':
                    color = ConsoleColor.DarkYellow;
                    break;
                case 's':
                    color = ConsoleColor.DarkGray;
                    break;
                case 'S':
                    color = ConsoleColor.Gray;
                    break;
                case 'B':
                    color = ConsoleColor.Blue;
                    break;
                case 'G':
                    color = ConsoleColor.Green;
                    break;
                case 'C':
                    color = ConsoleColor.Cyan;
                    break;
                case 'R':
                    color = ConsoleColor.Red;
                    break;
                case 'P':
                    color = ConsoleColor.Magenta;
                    break;
                case 'Y':
                    color = ConsoleColor.Yellow;
                    break;
                case 'W':
                    color = ConsoleColor.White;
                    break;
                default:
                    break;
            }
            System.Console.ForegroundColor = color;
        }

        public void OutputPrinter(object message, bool isNewLine = true, int delay = 60)
        {
            TryCatch(() =>
            {
                message = AddLineBreaks(message.ToString(), isNewLine);
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

        public void StartTimer(Action callback, int ms)
        {
            if (callback == null)
            {
                return;
            }

            Timer timer = null;
            timer = new Timer(state =>
            {
                try
                {
                    TryCatch(() => callback());
                }
                finally
                {
                    lock (runningTimers)
                    {
                        if (timer != null)
                        {
                            runningTimers.Remove(timer);
                            timer.Dispose();
                        }
                    }
                }
            }, null, ms, Timeout.Infinite);

            lock (runningTimers)
            {
                runningTimers.Add(timer);
            }
        }

        #endregion
    }
}
