import { CommandParser } from '../commandsUtils/CommandParser';
import { Game, Local } from '../InitGameData';
import { Command } from './Command';

export class Equipment extends Command {
    ExecuteBody(command: CommandParser) {
        Engine.Output(Local.Commands.Equipment.YourEquipment);

        let eq = Game.Player.getEquipment().print();

        if (eq === '') {
            Engine.Output(Local.Commands.Equipment.NoEquipment.format(Engine.NonBreakingSpace.repeat(4)));
        } else {
            Engine.Output(eq);
        }
    }
}
