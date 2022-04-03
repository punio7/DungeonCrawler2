import { Down } from './commands/Down';
import { Drop } from './commands/Drop';
import { East } from './commands/East';
import { Eval } from './commands/Eval';
import { Go } from './commands/Go';
import { Inventory } from './commands/Inventory';
import { Json } from './commands/Json';
import { Look } from './commands/Look';
import { NoCommand } from './commands/NoCommand';
import { North } from './commands/North';
import { Reload } from './commands/Reload';
import { Scan } from './commands/Scan';
import { South } from './commands/South';
import { Take } from './commands/Take';
import { Test } from './commands/Test';
import { Up } from './commands/Up';
import { West } from './commands/West';
import { Commands } from './CommandsManager';

export function InitCommands() {
    Commands.SetDefaultCommand(new NoCommand());

    Commands.RegisterCommand('Down', new Down());
    Commands.RegisterCommand('Drop', new Drop());

    Commands.RegisterCommand('East', new East());
    Commands.RegisterCommand('Eval', new Eval());

    Commands.RegisterCommand('Go', new Go());

    Commands.RegisterCommand('Inventory', new Inventory());

    Commands.RegisterCommand('Json', new Json());

    Commands.RegisterCommand('Look', new Look());

    Commands.RegisterCommand('North', new North());

    Commands.RegisterCommand('Reload', new Reload());

    Commands.RegisterCommand('South', new South());
    Commands.RegisterCommand('Scan', new Scan());

    Commands.RegisterCommand('Take', new Take());
    Commands.RegisterCommand('Test', new Test());

    Commands.RegisterCommand('Up', new Up());

    Commands.RegisterCommand('West', new West());
}
