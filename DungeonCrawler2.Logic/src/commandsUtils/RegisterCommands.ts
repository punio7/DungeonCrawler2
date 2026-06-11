import { NoCommand } from '../commands/NoCommand';
import { Commands, CommandsManager } from './CommandsManager';

export function InitCommands() {
    CommandsManager.SetDefaultCommand(new NoCommand());

    CommandsManager.RegisterCommand('close', Commands.Close);
    CommandsManager.RegisterCommand('commands', Commands.Help);

    CommandsManager.RegisterCommand('down', Commands.Down);
    CommandsManager.RegisterCommand('drop', Commands.Drop);

    CommandsManager.RegisterCommand('east', Commands.East);
    CommandsManager.RegisterCommand('examine', Commands.Examine);
    CommandsManager.RegisterCommand('eval', Commands.Eval);
    CommandsManager.RegisterCommand('equipment', Commands.Equipment);

    CommandsManager.RegisterCommand('go', Commands.Go);
    CommandsManager.RegisterCommand('get', Commands.Take);

    CommandsManager.RegisterCommand('help', Commands.Help);
    CommandsManager.RegisterCommand('hold', Commands.Hold);

    CommandsManager.RegisterCommand('inventory', Commands.Inventory);

    CommandsManager.RegisterCommand('json', Commands.Json);

    CommandsManager.RegisterCommand('look', Commands.Look);
    CommandsManager.RegisterCommand('lock', Commands.Lock);
    CommandsManager.RegisterCommand('load', Commands.Load);

    CommandsManager.RegisterCommand('manual', Commands.Help);

    CommandsManager.RegisterCommand('north', Commands.North);

    CommandsManager.RegisterCommand('open', Commands.Open);

    CommandsManager.RegisterCommand('remove', Commands.Remove);
    CommandsManager.RegisterCommand('reload', Commands.Reload);

    CommandsManager.RegisterCommand('south', Commands.South);
    CommandsManager.RegisterCommand('scan', Commands.Scan);
    CommandsManager.RegisterCommand('save', Commands.Save);

    CommandsManager.RegisterCommand('take', Commands.Take);
    CommandsManager.RegisterCommand('test', Commands.Test);

    CommandsManager.RegisterCommand('put', Commands.Put);
    CommandsManager.RegisterCommand('pickup', Commands.Take);

    CommandsManager.RegisterCommand('up', Commands.Up);
    CommandsManager.RegisterCommand('unlock', Commands.Unlock);

    CommandsManager.RegisterCommand('west', Commands.West);
    CommandsManager.RegisterCommand('wear', Commands.Wear);
    CommandsManager.RegisterCommand('wield', Commands.Wield);
}
