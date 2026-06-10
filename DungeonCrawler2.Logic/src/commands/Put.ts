import { CommandParser } from '../commandsUtils/CommandParser';
import { GramaCase } from '../enums/GramaCase';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';

export class Put extends Command {
    ExecuteBody(command: CommandParser) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(Local.Commands.Put.NoArgument);
            return;
        }

        let argument2 = command.getArgument(2);
        if (argument2 === null) {
            Engine.Output(Local.Commands.Put.NoContainer);
            return;
        }

        let number1 = command.getNumber(1);
        let number2 = command.getNumber(2);

        let item = Game.Player.getInventory().find(argument1, number1);
        if (item === null) {
            Engine.Output(Local.Commands.Put.NoItemFound.format(argument1));
            return;
        }

        let container = Game.Player.getInventory().find(argument2, number2);
        if (container === null) {
            container = Game.getRoom(Game.Player.Location).getItems().find(argument2, number2);
        }

        if (container === null) {
            Engine.Output(Local.Commands.Put.NoItemFound.format(argument2));
            return;
        }

        if (!container.isContainer()) {
            Engine.Output(Local.Commands.Put.IsNoContainer.format(container.getName().startWithUpper()));
            return;
        }

        if (container.isLocked()) {
            Engine.Output(Local.Commands.Put.ContainerIsLocked.format(container.getName().startWithUpper()));
            return;
        }

        if (container === item) {
            Engine.Output(Local.Commands.Put.CannotPutIntoSelf.format(item.getName(GramaCase.Dopelniacz)));
            return;
        }

        let inventory = container.getInventory();
        if (inventory === null) {
            Engine.Output(Local.Commands.Put.IsNoContainer.format(container.getName().startWithUpper()));
            return;
        }

        Game.Player.getInventory().remove(item);
        inventory.add(item);
        Engine.Output(
            Local.Commands.Put.PutItemIntoContainer.format(
                item.getName(GramaCase.Biernik),
                container.getName(GramaCase.Dopelniacz),
            ),
        );
    }
}
