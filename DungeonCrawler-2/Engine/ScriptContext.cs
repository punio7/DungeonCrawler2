using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript.V8;

namespace DungeonCrawler2.Engine
{
    public static class ScriptContext
    {
        public static V8ScriptEngine Current { get; set; }
    }
}
