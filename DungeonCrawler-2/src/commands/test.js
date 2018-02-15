"use strict";
class Test extends Command {
    executeBody() {
        Engine.Output("hello world " + this.game.name);
    }
};