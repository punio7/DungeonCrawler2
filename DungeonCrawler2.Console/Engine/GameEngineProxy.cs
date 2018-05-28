using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DungeonCrawler2.Console.Engine
{
    /// <summary>
    /// Wystawia funkcje GameEngine dostępne z poziomu skryptu
    /// </summary>
    public class GameEngineProxy : IGameEngine
    {
        private GameEngine gameEngine;

        public GameEngineProxy(GameEngine gameEngine)
        {
            this.gameEngine = gameEngine;
        }
        public string Input => gameEngine.Input;
        public string EndLine => gameEngine.EndLine;
        public string NonBreakingSpace => gameEngine.NonBreakingSpace;
        public void Output(object message, bool isNewLine = true) => gameEngine.Output(message, isNewLine);
        public void LoadScript(string location) => gameEngine.LoadScript(location);
        public string LoadData(string location) => gameEngine.LoadData(location);
        public void Exit() => gameEngine.Exit();
        public void Reload() => gameEngine.Reload();
    }
}
