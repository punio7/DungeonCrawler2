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

        let newRoom = Game.GetRoom(exit.GetRoomId());
        Game.Player.setPreviousLocation(Game.Player.getLocation());
        this.changePlayerLocation(newRoom, commandCallback);
    }

    changePlayerLocation(room: Room, commandCallback: CommandCallback) {
        Game.Player.Location = room.Id;
        room.IsVisited = true;

        this.onEnterGlobalEvents(room, () => this.afterOnEnterGlobalEvents(room, commandCallback), commandCallback);
    }

    afterOnEnterGlobalEvents(room: Room, commandCallback: CommandCallback) {
        Commands.Look.lookRoom(room);
        //TODO: Zdarzenia przy wejściu
        commandCallback.CallIfNotCalled();
    }

    onEnterGlobalEvents(room: Room, continueCallback: Function, finishCallback: CommandCallback) {
        if (room.getOnFirstEnterEvent() !== null) {
            let interrupt = Game.InvokeGlobalEvent(
                room.getOnFirstEnterEvent(),
                new GlobalEventArgs(GlobalEventType.BeforeRoomEnter, room, finishCallback, continueCallback),
            );
            delete room.OnFirstEnterEvent;
            if (interrupt === true) {
                finishCallback.interruptFlow = true;
                return;
            }
        }

        if (room.getOnEnterEvent() !== null) {
            let interrupt = Game.InvokeGlobalEvent(
                room.getOnEnterEvent(),
                new GlobalEventArgs(GlobalEventType.BeforeRoomEnter, room, finishCallback, continueCallback),
            );
            if (interrupt === true) {
                finishCallback.interruptFlow = true;
                return;
            }
        }

        continueCallback();
    }
}
