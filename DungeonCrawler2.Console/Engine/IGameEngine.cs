using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DungeonCrawler2.Console.Engine
{
    public interface IGameEngine
    {
        string Input { get; }
        string EndLine { get; }
        string NonBreakingSpace { get; }
        void Output(object message, bool isNewLine = true);
        void LoadScript(string location);
        string LoadData(string location);
        void Reload();
        void Exit();
    }
}
