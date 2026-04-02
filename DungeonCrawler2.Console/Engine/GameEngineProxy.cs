using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript;

namespace DungeonCrawler2.Console.Engine
{
    /// <summary>
    /// Wystawia funkcje GameEngine dostępne z poziomu skryptu
    /// </summary>
    public class GameEngineProxy : IGameEngine
    {
        private readonly GameEngine gameEngine;

        public GameEngineProxy(GameEngine gameEngine)
        {
            this.gameEngine = gameEngine;
        }
        public string Input => gameEngine.Input;
        public string EndLine => gameEngine.EndLine;
        public string NonBreakingSpace => gameEngine.NonBreakingSpace;
        public string DefaultColor => gameEngine.DefaultColor;
        public void Output(object message, bool isNewLine = true) => gameEngine.Output(message, isNewLine);
        public void OutputPrinter(object message, bool isNewLine = true, int delay = 60) => gameEngine.OutputPrinter(message, isNewLine, delay);
        public void LoadScript(string location) => gameEngine.LoadScript(location);
        public string LoadData(string location) => gameEngine.LoadData(location);
        public void Exit() => gameEngine.Exit();
        public void Reload() => gameEngine.Reload();
        public void StartTimer(Action callback, int ms) => gameEngine.StartTimer(callback, ms);

        public void StartTimer(object callback, object msValue)
        {
            if (callback == null)
            {
                return;
            }

            int ms = 0;
            try
            {
                if (msValue != null)
                {
                    ms = Convert.ToInt32(msValue);
                }
            }
            catch
            {
                ms = 0;
            }

            Action action = null;
            if (callback is ScriptObject scriptObj)
            {
                action = () =>
                {
                    scriptObj.Invoke(false);
                };
            }
            else if (callback is Delegate del)
            {
                action = () =>
                {
                    del.DynamicInvoke();
                };
            }
            else
            {
                dynamic dynamic = callback;
                action = () =>
                {
                    dynamic();
                };
            }

            gameEngine.StartTimer(action, ms);
        }
    }
}
