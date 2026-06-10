import { Close } from '../commands/Close';
import { Down } from '../commands/Down';
import { Drop } from '../commands/Drop';
import { East } from '../commands/East';
import { Eval } from '../commands/Eval';
import { Examine } from '../commands/Examine';
import { Go } from '../commands/Go';
import { Inventory } from '../commands/Inventory';
import { Json } from '../commands/Json';
import { Load } from '../commands/Load';
import { Look } from '../commands/Look';
import { NoCommand } from '../commands/NoCommand';
import { North } from '../commands/North';
import { Open } from '../commands/Open';
import { Reload } from '../commands/Reload';
import { Save } from '../commands/Save';
import { Scan } from '../commands/Scan';
import { South } from '../commands/South';
import { Take } from '../commands/Take';
import { Test } from '../commands/Test';
import { Put } from '../commands/Put';
import { Unlock } from '../commands/Unlock';
import { Up } from '../commands/Up';
import { West } from '../commands/West';
import { CommandsManager } from './CommandsManager';
import { Lock } from '../commands/Lock';
import { Remove } from '../commands/Remove';
import { Wear } from '../commands/Wear';
import { Equipment } from '../commands/Equipment';
import { Hold } from '../commands/Hold';
import { Wield } from '../commands/Wield';
import { Help } from '../commands/Help';

export function InitCommands() {
    CommandsManager.SetDefaultCommand(new NoCommand());

    CommandsManager.RegisterCommand('Close', new Close());

    CommandsManager.RegisterCommand('Down', new Down());
    CommandsManager.RegisterCommand('Drop', new Drop());

    CommandsManager.RegisterCommand('East', new East());
    CommandsManager.RegisterCommand('Examine', new Examine());
    CommandsManager.RegisterCommand('Eval', new Eval());
    CommandsManager.RegisterCommand('Equipment', new Equipment());

    CommandsManager.RegisterCommand('Go', new Go());

    CommandsManager.RegisterCommand('Help', new Help());
    CommandsManager.RegisterCommand('Hold', new Hold());

    CommandsManager.RegisterCommand('Inventory', new Inventory());

    CommandsManager.RegisterCommand('Json', new Json());

    CommandsManager.RegisterCommand('Look', new Look());
    CommandsManager.RegisterCommand('Lock', new Lock());
    CommandsManager.RegisterCommand('Load', new Load());

    CommandsManager.RegisterCommand('North', new North());

    CommandsManager.RegisterCommand('Open', new Open());

    CommandsManager.RegisterCommand('Remove', new Remove());
    CommandsManager.RegisterCommand('Reload', new Reload());

    CommandsManager.RegisterCommand('South', new South());
    CommandsManager.RegisterCommand('Scan', new Scan());
    CommandsManager.RegisterCommand('Save', new Save());

    CommandsManager.RegisterCommand('Take', new Take());
    CommandsManager.RegisterCommand('Test', new Test());
    CommandsManager.RegisterCommand('Put', new Put());

    CommandsManager.RegisterCommand('Up', new Up());
    CommandsManager.RegisterCommand('Unlock', new Unlock());

    CommandsManager.RegisterCommand('West', new West());
    CommandsManager.RegisterCommand('Wear', new Wear());
    CommandsManager.RegisterCommand('Wield', new Wield());
}
