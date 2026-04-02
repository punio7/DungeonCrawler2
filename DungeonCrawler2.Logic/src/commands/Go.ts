import { CommandCallback } from '../CommandCallback';
import { CommandParser } from '../CommandParser';
import { Commands } from '../CommandsManager';
import { DirectionHelper } from '../enums/Direction';
import { GlobalEventType } from '../enums/GlobalEventType';
import { Game, Local } from '../InitGameData';
import { GlobalEventArgs } from '../model/GlobalEventArgs';
import { Room } from '../model/Room';
import { Command } from './Command';

export class Go extends Command {
    ExecuteBody(command: CommandParser, commandCallback: CommandCallback) {
        let direction = null;
        let argument = command.getArgument(1);
        if (argument !== null) {
            direction = DirectionHelper.parseShort(argument.toLowerCase());
        }
        if (direction === null) {
            Engine.Output(Local.Commands.Go.WrongDirection);
            return;
        }

        this.goToDirection(direction, commandCallback);
    }

    goToDirection(direction: any, commandCallback: CommandCallback) {
        let exit = Game.GetRoom(Game.Player.getLocation()).getExit(direction);

        if (exit === null || exit.isHidden()) {
            Engine.Output(Local.Commands.Go.NoPassage);
            return;
        }

        if (exit.isClosed()) {
            Engine.Output(Local.Commands.Go.PassageClosed);
            return;
        }

        let newRoom = Game.GetRoom(exit.getRoomId());
        Game.Player.setPreviousLocation(Game.Player.getLocation());
        this.changePlayerLocation(newRoom, commandCallback);
    }

    changePlayerLocation(room: Room, commandCallback: CommandCallback) {
        Game.Player.Location = room.Id;
        room.IsVisited = true;

        this.onFirstEnterGlobalEvents(room, () => this.afterOnFirstEnterGlobalEvents(room, commandCallback), commandCallback);
    }

    onFirstEnterGlobalEvents(room: Room, continueCallback: Function, terminateCallback: CommandCallback) {
        if (room.getOnFirstEnterEvent() !== null) {
            let interrupt = Game.InvokeGlobalEvent(
                room.getOnFirstEnterEvent()!,
                new GlobalEventArgs(GlobalEventType.BeforeRoomEnter, room, terminateCallback, continueCallback),
            );
            delete room.OnFirstEnterEvent;
            if (interrupt) {
                terminateCallback.interruptFlow = true;
                return;
            }
        }
        
        continueCallback();
    }

    afterOnFirstEnterGlobalEvents(room: Room, commandCallback: CommandCallback) {
        Commands.Look.lookRoom(room);
        this.onEnterGlobalEvents(room, commandCallback);
    }

    onEnterGlobalEvents(room: Room, commandCallback: CommandCallback) {
        if (room.getOnEnterEvent() !== null) {
            let interrupt = Game.InvokeGlobalEvent(
                room.getOnEnterEvent()!,
                new GlobalEventArgs(GlobalEventType.BeforeRoomEnter, room, commandCallback, () => commandCallback.CallIfNotCalled()),
            );
            if (interrupt) {
                commandCallback.interruptFlow = true;
                return;
            }
        }

        commandCallback.CallIfNotCalled();
    }
}
