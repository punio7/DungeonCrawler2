﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DungeonCrawler2.Engine
{
    public interface IGameEngine
    {
        string Input { get; }
        void Output(object message);
        void LoadScript(string location);
        string LoadData(string location);
        void Reload();
        void Exit();
    }
}