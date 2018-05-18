using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DungeonCrawler2.Console.Engine;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using NLog;

namespace DungeonCrawler2.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            NLogConfiguration.Configure();
            Logger logger = LogManager.GetLogger(typeof(Program).FullName);

            logger.Debug("Starting engine");
            using (GameEngine gameEngine = new GameEngine())
            {
                logger.Debug("Initialize");
                gameEngine.Init();
                logger.Debug("Ready to go");
                gameEngine.Run();
            }
            logger.Debug("Finish");
            System.Console.ReadKey();
        }
    }
}
