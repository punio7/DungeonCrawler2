"use strict";
class Go extends Command {
    ExecuteBody(command, commandCallback) {
        
        let direction = null;
        if (command.getArgument(1) !== null) {
            direction = Directions.parseShort(command.getArgument(1).toLowerCase());
        }
        if (direction === null) {
            Engine.Output(Local.Commands.Go.WrongDirection);
            return;
        }

        this.goToDirection(direction, commandCallback);
    }

    goToDirection(direction, commandCallback) {
        let exit = Game.GetRoom(Game.Player.getLocation()).getExit(direction);

        if (exit === null || exit.isHidden()) {
            Engine.Output(Local.Commands.Go.NoPassage);
            return;
        }

        if (exit.isClosed()) {
            Engine.Output(Local.Commands.Go.PassageClosed);
            return;
        }

        let newRoom = Game.GetRoom(exit.GetRoomId());
        Game.Player.setPreviousLocation(Game.Player.getLocation());
        this.changePlayerLocation(newRoom, commandCallback);
    }

    changePlayerLocation(room, commandCallback) {
        Game.Player.Location = room.Id;
        room.IsVisited = true;

        this.onEnterGlobalEvents(room,
            () => this.afterOnEnterGlobalEvents(room, commandCallback),
            commandCallback);
    }

    afterOnEnterGlobalEvents(room, commandCallback) {
        Commands.Look.lookRoom(room);
        //TODO: Zdarzenia przy wejściu
        commandCallback.CallIfNotCalled();
    }

    /**
     * 
     * @param {Room} room
     * @param {Function} continueCallback
     * @param {CommandCallback} finishCallback
     */
    onEnterGlobalEvents(room, continueCallback, finishCallback) {
        if (room.getOnFirstEnterEvent() !== null) {
            let interrupt = Game.InvokeGlobalEvent(room.getOnFirstEnterEvent(),
                new GlobalEventArgs(GlobalEventType.BeforeRoomEnter, room, finishCallback, continueCallback));
            delete room.OnFirstEnterEvent;
            if (interrupt === true) {
                finishCallback.interruptFlow = true;
                return;
            }
        }

        if (room.getOnEnterEvent() !== null) {
            let interrupt = Game.InvokeGlobalEvent(room.getOnEnterEvent(),
                new GlobalEventArgs(GlobalEventType.BeforeRoomEnter, room, finishCallback, continueCallback));
            if (interrupt === true) {
                finishCallback.interruptFlow = true;
                return;
            }
        }

        continueCallback();
    }
};