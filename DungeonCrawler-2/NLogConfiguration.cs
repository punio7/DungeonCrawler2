using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.Config;
using NLog.Targets;

namespace DungeonCrawler2
{
    public static class NLogConfiguration
    {
        public static void Configure()
        {
            LoggingConfiguration config = new LoggingConfiguration();

            ColoredConsoleTarget consoleErrorTarget = new ColoredConsoleTarget();
            config.AddTarget("console-error", consoleErrorTarget);

            ColoredConsoleTarget consoleInfoTarget = new ColoredConsoleTarget();
            config.AddTarget("console-info", consoleErrorTarget);

            FileTarget fileTarget = new FileTarget();
            config.AddTarget("file", fileTarget);

            consoleInfoTarget.Layout = "${level}|${message}";
            consoleErrorTarget.Layout = "${level}|${stacktrace}\r\n\t${message}";
            fileTarget.FileName = @"log-error.txt";
            fileTarget.Layout = "${date:format=HH\\:mm\\:ss}|${level}|${stacktrace}\r\n\t${message}";

#if DEBUG
            config.LoggingRules.Add(new LoggingRule("*", LogLevel.Trace, LogLevel.Warn, consoleInfoTarget));
#endif
            config.LoggingRules.Add(new LoggingRule("*", LogLevel.Error, consoleErrorTarget));

            //#if !DEBUG
            config.LoggingRules.Add(new LoggingRule("*", LogLevel.Error, fileTarget));
            //#endif

            LogManager.Configuration = config;
        }
    }
}
