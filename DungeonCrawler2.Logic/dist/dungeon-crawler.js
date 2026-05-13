/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/GlobalEvents.ts"
/*!*****************************!*\
  !*** ./src/GlobalEvents.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalEvents = void 0;
const EngineUtils_1 = __webpack_require__(/*! ./commonLogic/EngineUtils */ "./src/commonLogic/EngineUtils.ts");
const InitGameData_1 = __webpack_require__(/*! ./InitGameData */ "./src/InitGameData.ts");
class GlobalEventsClass {
    TestGlobalEvent(args) {
        EngineUtils_1.EngineUtils.OutputPrinter(InitGameData_1.Local.GlobalEvents.TestGlobalEvent.Message, args.ContinueCommandCallback);
        return true;
    }
}
exports.GlobalEvents = new GlobalEventsClass();


/***/ },

/***/ "./src/InitGameData.ts"
/*!*****************************!*\
  !*** ./src/InitGameData.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Version = exports.Game = exports.Local = void 0;
exports.InitGameData = InitGameData;
exports.LoadGame = LoadGame;
const ItemTypes_json_1 = __webpack_require__(/*! ../res/ItemTypes.json */ "./res/ItemTypes.json");
const Items_json_1 = __webpack_require__(/*! ../res/Items.json */ "./res/Items.json");
const Characters_json_1 = __webpack_require__(/*! ../res/Characters.json */ "./res/Characters.json");
const Local_pl_json_1 = __webpack_require__(/*! ../res/Local.pl.json */ "./res/Local.pl.json");
const Game_json_1 = __webpack_require__(/*! ../res/Game.json */ "./res/Game.json");
const Game_1 = __webpack_require__(/*! ./model/Game */ "./src/model/Game.ts");
const ItemTypes_1 = __webpack_require__(/*! ./model/ItemTypes */ "./src/model/ItemTypes.ts");
const CharacterTemplates_1 = __webpack_require__(/*! ./model/CharacterTemplates */ "./src/model/CharacterTemplates.ts");
const ItemTemplates_1 = __webpack_require__(/*! ./model/ItemTemplates */ "./src/model/ItemTemplates.ts");
const GameData_1 = __webpack_require__(/*! ./model/GameData */ "./src/model/GameData.ts");
const RoomTemplates_1 = __webpack_require__(/*! ./model/RoomTemplates */ "./src/model/RoomTemplates.ts");
exports.Local = Local_pl_json_1.Local;
exports.Game = new Game_1.GameModel();
exports.Version = '';
function InitGameData() {
    exports.Game = new Game_1.GameModel();
    GameData_1.GameData.ItemTypes = new ItemTypes_1.ItemTypes(ItemTypes_json_1.ItemTypes);
    GameData_1.GameData.ItemTemplates = new ItemTemplates_1.ItemTemplates(Items_json_1.ItemsTemplates);
    GameData_1.GameData.CharacterTemplates = new CharacterTemplates_1.CharacterTemplates(Characters_json_1.CharactersTemplates);
    GameData_1.GameData.RoomTemplates = new RoomTemplates_1.RoomTemplates(Game_json_1.GameTemplate.Rooms);
    exports.Version = Engine.LoadData('version.txt').replace('\n', Engine.EndLine);
    exports.Game.Player.Location = exports.Game.StartingRoom;
}
function LoadGame(savedGame) {
    const game = JSON.parse(savedGame);
    exports.Game = new Game_1.GameModel();
    exports.Game.loadGame(game);
}


/***/ },

/***/ "./src/commands/Command.ts"
/*!*********************************!*\
  !*** ./src/commands/Command.ts ***!
  \*********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Command = void 0;
class Command {
    constructor() { }
    Execute(command, commandCallback) {
        this.ExecuteBody(command, commandCallback);
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    }
}
exports.Command = Command;


/***/ },

/***/ "./src/commands/Down.ts"
/*!******************************!*\
  !*** ./src/commands/Down.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Down = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Down extends Command_1.Command {
    ExecuteBody(_command, commandCallback) {
        CommandsManager_1.Commands.Go.goToDirection(Direction_1.Direction.down, commandCallback);
    }
}
exports.Down = Down;


/***/ },

/***/ "./src/commands/Drop.ts"
/*!******************************!*\
  !*** ./src/commands/Drop.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Drop = void 0;
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Drop extends Command_1.Command {
    ExecuteBody(command) {
        let argument = command.getArgument(1);
        if (argument === null) {
            Engine.Output(InitGameData_1.Local.Commands.Drop.NoArgument);
            return;
        }
        if (argument.toLowerCase() === 'all') {
            if (!InitGameData_1.Game.Player.getInventory().any()) {
                Engine.Output(InitGameData_1.Local.Commands.Drop.NoItems);
                return;
            }
            this.dropAll();
        }
        else {
            let item = InitGameData_1.Game.Player.getInventory().find(argument, command.getNumber(1));
            if (item === null) {
                Engine.Output(InitGameData_1.Local.Commands.Drop.NoItemFound.format(argument));
                return;
            }
            this.dropItem(item);
        }
    }
    dropAll() {
        while (InitGameData_1.Game.Player.getInventory().any()) {
            this.dropItem(InitGameData_1.Game.Player.getInventory().elementAt(0));
        }
    }
    dropItem(item) {
        InitGameData_1.Game.Player.getInventory().remove(item);
        InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location).getItems().add(item);
        Engine.Output(InitGameData_1.Local.Commands.Drop.Dropped.format(item.getName(GrammaCase_1.GrammaCase.Biernik)));
    }
}
exports.Drop = Drop;


/***/ },

/***/ "./src/commands/East.ts"
/*!******************************!*\
  !*** ./src/commands/East.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.East = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class East extends Command_1.Command {
    ExecuteBody(_, commandCallback) {
        CommandsManager_1.Commands.Go.goToDirection(Direction_1.Direction.east, commandCallback);
    }
}
exports.East = East;


/***/ },

/***/ "./src/commands/Eval.ts"
/*!******************************!*\
  !*** ./src/commands/Eval.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Eval = void 0;
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
class Eval extends Command_1.Command {
    ExecuteBody(command) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        let game = InitGameData_1.Game;
        Engine.Output(eval(argument));
    }
}
exports.Eval = Eval;


/***/ },

/***/ "./src/commands/Exam.ts"
/*!******************************!*\
  !*** ./src/commands/Exam.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exam = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Exam extends Command_1.Command {
    ExecuteBody(command) {
        let room = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location);
        let argument = command.getArgument(1);
        let number = command.getNumber(1);
        if (argument === null) {
            Engine.Output(InitGameData_1.Local.Commands.Exam.NoArgument);
            return;
        }
        let character = room.getCharacters().find(argument, number);
        if (character !== null) {
            this.examCharacter(character);
            return;
        }
        let item = InitGameData_1.Game.Player.getInventory().find(argument, number);
        if (item !== null) {
            this.examItem(item);
            return;
        }
        item = room.getItems().find(argument, number);
        if (item !== null) {
            this.examItem(item);
            return;
        }
        Engine.Output(InitGameData_1.Local.Commands.Exam.NoObject.format(argument));
    }
    examCharacter(character) {
        Engine.Output(InitGameData_1.Local.Commands.Look.YouLookAt.format(character.getName(GrammaCase_1.GrammaCase.Celownik)));
        Engine.Output(character.getDescription());
        Engine.Output(InitGameData_1.Local.Commands.Exam.HealthLevel.format(character.getName().startWithUpper(), character.getHealthLevel(true)));
        //TODO: ekwipunek
    }
    examItem(item) {
        Engine.Output(InitGameData_1.Local.Commands.Look.YouLookAt.format(item.getName(GrammaCase_1.GrammaCase.Celownik)));
        Engine.Output(item.getDescription());
        if (item.isContainer()) {
            if (item.isLocked()) {
                Engine.Output(InitGameData_1.Local.Commands.Exam.LockedContainer);
                return;
            }
            Engine.Output(InitGameData_1.Local.Commands.Exam.Contains);
            let items = item.getInventory();
            if (items.any()) {
                Engine.Output(items.printShortFormat());
                CommandsManager_1.Commands.Take.takeAllGold(item);
            }
            else {
                Engine.Output(InitGameData_1.Local.Commands.Inventory.NoItems.format(Engine.NonBreakingSpace.repeat(4)));
            }
        }
    }
}
exports.Exam = Exam;


/***/ },

/***/ "./src/commands/Go.ts"
/*!****************************!*\
  !*** ./src/commands/Go.ts ***!
  \****************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Go = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const GlobalEventType_1 = __webpack_require__(/*! ../enums/GlobalEventType */ "./src/enums/GlobalEventType.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const GlobalEventArgs_1 = __webpack_require__(/*! ../model/GlobalEventArgs */ "./src/model/GlobalEventArgs.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Go extends Command_1.Command {
    ExecuteBody(command, commandCallback) {
        let direction = null;
        let argument = command.getArgument(1);
        if (argument !== null) {
            direction = Direction_1.DirectionHelper.parseShort(argument.toLowerCase());
        }
        if (direction === null) {
            Engine.Output(InitGameData_1.Local.Commands.Go.WrongDirection);
            return;
        }
        this.goToDirection(direction, commandCallback);
    }
    goToDirection(direction, commandCallback) {
        let exit = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.getLocation()).getExit(direction);
        if (exit === null || exit.isHidden()) {
            Engine.Output(InitGameData_1.Local.Commands.Go.NoPassage);
            return;
        }
        if (exit.isClosed()) {
            Engine.Output(InitGameData_1.Local.Commands.Go.PassageClosed);
            return;
        }
        let newRoom = InitGameData_1.Game.getRoom(exit.getRoomId());
        InitGameData_1.Game.Player.setPreviousLocation(InitGameData_1.Game.Player.getLocation());
        this.changePlayerLocation(newRoom, commandCallback);
    }
    changePlayerLocation(room, commandCallback) {
        InitGameData_1.Game.Player.Location = room.Id;
        this.onFirstEnterGlobalEvents(room, () => this.afterOnFirstEnterGlobalEvents(room, commandCallback), commandCallback);
        room.IsVisited = true;
    }
    onFirstEnterGlobalEvents(room, continueCallback, terminateCallback) {
        if (room.getOnFirstEnterEvent() !== null && !room.IsVisited) {
            let interrupt = InitGameData_1.Game.invokeGlobalEvent(room.getOnFirstEnterEvent(), new GlobalEventArgs_1.GlobalEventArgs(GlobalEventType_1.GlobalEventType.BeforeRoomEnter, room, terminateCallback, continueCallback));
            if (interrupt) {
                terminateCallback.interruptFlow = true;
                return;
            }
        }
        continueCallback();
    }
    afterOnFirstEnterGlobalEvents(room, commandCallback) {
        CommandsManager_1.Commands.Look.lookRoom(room);
        this.onEnterGlobalEvents(room, commandCallback);
    }
    onEnterGlobalEvents(room, commandCallback) {
        if (room.getOnEnterEvent() !== null) {
            let interrupt = InitGameData_1.Game.invokeGlobalEvent(room.getOnEnterEvent(), new GlobalEventArgs_1.GlobalEventArgs(GlobalEventType_1.GlobalEventType.BeforeRoomEnter, room, commandCallback, () => commandCallback.CallIfNotCalled()));
            if (interrupt) {
                commandCallback.interruptFlow = true;
                return;
            }
        }
        commandCallback.CallIfNotCalled();
    }
}
exports.Go = Go;


/***/ },

/***/ "./src/commands/Inventory.ts"
/*!***********************************!*\
  !*** ./src/commands/Inventory.ts ***!
  \***********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Inventory = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Inventory extends Command_1.Command {
    ExecuteBody(command) {
        Engine.Output(InitGameData_1.Local.Commands.Inventory.YourItems);
        if (!InitGameData_1.Game.Player.getInventory().any()) {
            Engine.Output(InitGameData_1.Local.Commands.Inventory.NoItems.format(Engine.NonBreakingSpace.repeat(4)));
        }
        else {
            Engine.Output(InitGameData_1.Game.Player.getInventory().printShortFormat());
        }
    }
}
exports.Inventory = Inventory;


/***/ },

/***/ "./src/commands/Json.ts"
/*!******************************!*\
  !*** ./src/commands/Json.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Json = void 0;
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const GameData_1 = __webpack_require__(/*! ../model/GameData */ "./src/model/GameData.ts");
class Json extends Command_1.Command {
    ExecuteBody(command) {
        let argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        let game = InitGameData_1.Game;
        let gameData = GameData_1.GameData;
        Engine.Output(JSON.stringify(eval(argument)));
    }
}
exports.Json = Json;


/***/ },

/***/ "./src/commands/Load.ts"
/*!******************************!*\
  !*** ./src/commands/Load.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Load = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Load extends Command_1.Command {
    ExecuteBody(command) {
        let saveData = Engine.Load();
        Engine.Output(InitGameData_1.Local.Commands.Load.Loading);
        (0, InitGameData_1.LoadGame)(saveData);
        Engine.Output(InitGameData_1.Local.Commands.Load.Loaded);
        CommandsManager_1.Commands.Look.lookRoom();
    }
}
exports.Load = Load;


/***/ },

/***/ "./src/commands/Look.ts"
/*!******************************!*\
  !*** ./src/commands/Look.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Look = void 0;
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Look extends Command_1.Command {
    ExecuteBody(command) {
        let room = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location);
        if (!InitGameData_1.Game.Player.canSee()) {
            Engine.Output(InitGameData_1.Local.Commands.Look.CantSee);
            return;
        }
        let argument = command.getArgument(1);
        if (argument === null) {
            this.lookRoom(room);
            return;
        }
        let number = command.getNumber(1);
        let character = room.getCharacters().find(argument, number);
        if (character !== null) {
            this.lookCharacter(character);
            return;
        }
        let item = InitGameData_1.Game.Player.getInventory().find(argument, number);
        if (item !== null) {
            this.lookItem(item);
            return;
        }
        item = room.getItems().find(argument, number);
        if (item !== null) {
            this.lookItem(item);
            return;
        }
        Engine.Output(InitGameData_1.Local.Commands.Look.NoObject.format(argument));
    }
    lookRoom(room) {
        if (room === undefined) {
            room = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location);
        }
        let message = '';
        message += room.getName() + Engine.EndLine;
        message += this.exitsString(room) + Engine.EndLine;
        message += Engine.EndLine;
        message += room.getDescription();
        if (room.getCharacters().any()) {
            message += Engine.EndLine + Engine.EndLine + room.getCharacters().printLongFormat(false);
        }
        if (room.getItems().any()) {
            if (!room.getCharacters().any()) {
                message += Engine.EndLine;
            }
            message += Engine.EndLine + room.getItems().printLongFormat(true);
        }
        Engine.Output(message);
    }
    lookItem(item) {
        Engine.Output(InitGameData_1.Local.Commands.Look.YouLookAt.format(item.getName(GrammaCase_1.GrammaCase.Celownik)));
        Engine.Output(item.getDescription());
    }
    lookCharacter(character) {
        Engine.Output(InitGameData_1.Local.Commands.Look.YouLookAt.format(character.getName(GrammaCase_1.GrammaCase.Celownik)));
        Engine.Output(character.getDescription());
    }
    exitsString(room) {
        let returnString = '|g' + InitGameData_1.Local.Commands.Look.Exits + ': [ ';
        let firstExit = true;
        let directions = room.getExitsDirections();
        directions.forEach((direction) => {
            var _a;
            if (!firstExit) {
                returnString += ', ';
            }
            firstExit = false;
            if ((_a = room.getExit(direction)) === null || _a === void 0 ? void 0 : _a.isClosed()) {
                returnString += '*';
            }
            returnString += Direction_1.DirectionHelper.getLocale(direction);
        });
        returnString += ' ]|W';
        return returnString;
    }
}
exports.Look = Look;


/***/ },

/***/ "./src/commands/NoCommand.ts"
/*!***********************************!*\
  !*** ./src/commands/NoCommand.ts ***!
  \***********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoCommand = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class NoCommand extends Command_1.Command {
    ExecuteBody(_) {
        Engine.Output(InitGameData_1.Local.Commands.NoCommand.NoCommand);
    }
}
exports.NoCommand = NoCommand;


/***/ },

/***/ "./src/commands/North.ts"
/*!*******************************!*\
  !*** ./src/commands/North.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.North = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class North extends Command_1.Command {
    ExecuteBody(_, commandCallback) {
        CommandsManager_1.Commands.Go.goToDirection(Direction_1.Direction.north, commandCallback);
    }
}
exports.North = North;


/***/ },

/***/ "./src/commands/Open.ts"
/*!******************************!*\
  !*** ./src/commands/Open.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Open = void 0;
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Open extends Command_1.Command {
    ExecuteBody(command) {
        let direction = null;
        let argument = command.getArgument(1);
        if (argument === null) {
            Engine.Output(InitGameData_1.Local.Commands.Open.NoDirection);
            return;
        }
        direction = Direction_1.DirectionHelper.parseShort(argument.toLowerCase());
        if (direction === null) {
            Engine.Output(InitGameData_1.Local.Commands.Open.WrongDirection.format(argument));
            return;
        }
        this.openDirection(direction);
    }
    openDirection(direction) {
        var _a;
        let room = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.getLocation());
        let exit = room.getExit(direction);
        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            Engine.Output(InitGameData_1.Local.Commands.Open.NoDoor);
            return;
        }
        if (!exit.isClosed()) {
            Engine.Output(InitGameData_1.Local.Commands.Open.AlreadyOpen);
            return;
        }
        if (exit.isLocked()) {
            Engine.Output(InitGameData_1.Local.Commands.Open.Locked);
            return;
        }
        exit.Door.IsClosed = false;
        let nextRoom = InitGameData_1.Game.getRoom(exit.getRoomId());
        let nextDoor = (_a = nextRoom.getExitToRoom(room.Id)) === null || _a === void 0 ? void 0 : _a.Door;
        if (nextDoor) {
            nextDoor.IsClosed = false;
        }
        Engine.Output(InitGameData_1.Local.Commands.Open.Opened);
    }
}
exports.Open = Open;


/***/ },

/***/ "./src/commands/Reload.ts"
/*!********************************!*\
  !*** ./src/commands/Reload.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Reload = void 0;
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Reload extends Command_1.Command {
    ExecuteBody(command) {
        Engine.Reload();
    }
}
exports.Reload = Reload;


/***/ },

/***/ "./src/commands/Save.ts"
/*!******************************!*\
  !*** ./src/commands/Save.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Save = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Save extends Command_1.Command {
    ExecuteBody(command) {
        const json = JSON.stringify(InitGameData_1.Game);
        Engine.Save(json);
        Engine.Output(InitGameData_1.Local.Commands.Save.Saved);
    }
}
exports.Save = Save;


/***/ },

/***/ "./src/commands/Scan.ts"
/*!******************************!*\
  !*** ./src/commands/Scan.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scan = void 0;
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Scan extends Command_1.Command {
    ExecuteBody(command) {
        if (!InitGameData_1.Game.Player.canSee()) {
            Engine.Output(InitGameData_1.Local.Commands.Scan.CantSee);
            return;
        }
        let playerRoom = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location);
        Engine.Output(InitGameData_1.Local.Commands.Scan.LookingAroundYouSee);
        Engine.Output(InitGameData_1.Local.Commands.Scan.Here);
        Engine.Output(this.printCharacters(InitGameData_1.Game.Player.Location));
        Direction_1.DirectionHelper.forEach((direction) => {
            let exit = playerRoom.getExit(direction);
            if (exit !== null && !exit.isHidden()) {
                Engine.Output(InitGameData_1.Local.Commands.Scan.InDirection.format(Direction_1.DirectionHelper.getLocale(direction, GrammaCase_1.GrammaCase.Miejscownik)));
                if (exit.isClosed()) {
                    Engine.Output(Engine.NonBreakingSpace.repeat(4) + InitGameData_1.Local.Commands.Scan.ClosedDoor);
                }
                else {
                    Engine.Output(this.printCharacters(exit.RoomId));
                }
            }
        });
    }
    printCharacters(roomId) {
        let room = InitGameData_1.Game.getRoom(roomId);
        if (!room.getCharacters().any()) {
            return Engine.NonBreakingSpace.repeat(4) + InitGameData_1.Local.Commands.Scan.NoOneThere;
        }
        return room.getCharacters().printShortFormat(true);
    }
}
exports.Scan = Scan;


/***/ },

/***/ "./src/commands/South.ts"
/*!*******************************!*\
  !*** ./src/commands/South.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.South = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class South extends Command_1.Command {
    ExecuteBody(_, commandCallback) {
        CommandsManager_1.Commands.Go.goToDirection(Direction_1.Direction.south, commandCallback);
    }
}
exports.South = South;


/***/ },

/***/ "./src/commands/Take.ts"
/*!******************************!*\
  !*** ./src/commands/Take.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Take = void 0;
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Take extends Command_1.Command {
    ExecuteBody(command) {
        let argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(InitGameData_1.Local.Commands.Take.NoArgument);
            return;
        }
        let number1 = command.getNumber(1);
        let argument2 = command.getArgument(2);
        if (argument2 === null) {
            //pick up item from location
            if (argument1.toLowerCase() === 'all') {
                if (!InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location).getItems().any()) {
                    Engine.Output(InitGameData_1.Local.Commands.Take.NoItems);
                    return;
                }
                this.takeAllFromLocation();
            }
            else {
                let itemList = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location).getItems();
                let item = itemList.find(argument1, number1);
                if (item === null) {
                    Engine.Output(InitGameData_1.Local.Commands.Take.NoItemFound.format(argument1));
                    return;
                }
                this.takeItemFromLocation(item, itemList);
            }
        }
        else {
            //take item from container
            let number2 = command.getNumber(2);
            let container = InitGameData_1.Game.Player.getInventory().find(argument2, number2);
            if (container !== null) {
                this.takeItemFromContainer(argument1, number1, container);
                return;
            }
            let itemList = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location).getItems();
            container = itemList.find(argument2, number2);
            if (container !== null) {
                this.takeItemFromContainer(argument1, number1, container);
                return;
            }
            Engine.Output(InitGameData_1.Local.Commands.Take.NoItemFound.format(argument2));
        }
    }
    takeItemFromContainer(name, number, container) {
        if (!container.isContainer()) {
            Engine.Output(InitGameData_1.Local.Commands.Take.IsNoContainer.format(container.getName().startWithUpper()));
            return;
        }
        if (container.isLocked()) {
            Engine.Output(InitGameData_1.Local.Commands.Take.ContainerIsLocked.format(container.getName().startWithUpper()));
            return;
        }
        let item = container.getInventory().find(name, number);
        if (item === null) {
            Engine.Output(InitGameData_1.Local.Commands.Take.NoItemFoundInContainer.format(container.getName().startWithUpper(), name));
            return;
        }
        this.takeItem(item, container.getInventory());
        Engine.Output(InitGameData_1.Local.Commands.Take.TakeItemFromContainer.format(item.getName(), container.getName(GrammaCase_1.GrammaCase.Celownik).startWithUpper()));
    }
    takeItemFromLocation(item, itemList) {
        if (!item.isTakeable()) {
            Engine.Output(InitGameData_1.Local.Commands.Take.CannotPickUp.format(item.getName(GrammaCase_1.GrammaCase.Dopelniacz)));
            return false;
        }
        this.takeItem(item, itemList);
        Engine.Output(InitGameData_1.Local.Commands.Take.PickedUp.format(item.getName(GrammaCase_1.GrammaCase.Biernik)));
        return true;
    }
    takeAllFromLocation() {
        let itemList = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.Location).getItems();
        let i = 0;
        for (let item = itemList.elementAt(i); item != null; item = itemList.elementAt(i)) {
            if (!this.takeItemFromLocation(item, itemList)) {
                i++;
            }
        }
    }
    takeAllGold(container) {
        let itemList = container.getInventory();
        let gold = null;
        while ((gold = itemList.findById('gold')) !== null) {
            this.takeItem(gold, itemList);
            Engine.Output(InitGameData_1.Local.Commands.Take.TakeItemFromContainer.format(gold.getName(), container.getName(GrammaCase_1.GrammaCase.Celownik).startWithUpper()));
        }
    }
    takeItem(item, itemList) {
        itemList.remove(item);
        InitGameData_1.Game.Player.getInventory().add(item);
    }
}
exports.Take = Take;


/***/ },

/***/ "./src/commands/Test.ts"
/*!******************************!*\
  !*** ./src/commands/Test.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Test = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Test extends Command_1.Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() +
            ' ' +
            command.getNumber(1) +
            command.getArgument(1) +
            ' ' +
            command.getNumber(2) +
            command.getArgument(2) +
            ' ' +
            InitGameData_1.Game.getName() +
            ' aaa');
        Engine.Output('Nazywam się |b{0}|W. Tak |B{0}|W to właśnie moje imię. A nie, może to jednak |R{1}|W? Nieee, chyba |G{2}|W... Nie, to nie to... Wiem! |P{3}|W to moje prawdziwe imię!'.format('Game.Player.getName()', 'Wojtek Pędziwór', 'Skrzypek Nadachu', 'Zdziocho Moczywąs'));
        Engine.Output('Czas na kolor test!');
        Engine.Output('|bDark Blue{0}|BBlue'.format(Engine.NonBreakingSpace.repeat(3)));
        Engine.Output('|gDark Green{0}|GGreen'.format(Engine.NonBreakingSpace.repeat(2)));
        Engine.Output('|cDark Cyan{0}|CCyan'.format(Engine.NonBreakingSpace.repeat(3)));
        Engine.Output('|rDark Red{0}|RRed'.format(Engine.NonBreakingSpace.repeat(4)));
        Engine.Output('|pDark Purple |PPurple'.format(Engine.NonBreakingSpace));
        Engine.Output('|yDark Yellow |YYellow'.format(Engine.NonBreakingSpace));
        Engine.Output('|sDark Grey{0}|SGrey'.format(Engine.NonBreakingSpace.repeat(3)));
        throw 'Test exception';
    }
}
exports.Test = Test;


/***/ },

/***/ "./src/commands/Up.ts"
/*!****************************!*\
  !*** ./src/commands/Up.ts ***!
  \****************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Up = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Up extends Command_1.Command {
    ExecuteBody(_, commandCallback) {
        CommandsManager_1.Commands.Go.goToDirection(Direction_1.Direction.up, commandCallback);
    }
}
exports.Up = Up;


/***/ },

/***/ "./src/commands/West.ts"
/*!******************************!*\
  !*** ./src/commands/West.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.West = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class West extends Command_1.Command {
    ExecuteBody(_, commandCallback) {
        CommandsManager_1.Commands.Go.goToDirection(Direction_1.Direction.west, commandCallback);
    }
}
exports.West = West;


/***/ },

/***/ "./src/commandsUtils/CommandCallback.ts"
/*!**********************************************!*\
  !*** ./src/commandsUtils/CommandCallback.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandCallback = void 0;
class CommandCallback {
    constructor(callback) {
        this.callback = callback;
        this.callbackCalled = false;
        this.interruptFlow = false;
    }
    /** If command can cause interruptFlow, make sure to call this method at the end of command execution */
    CallIfNotCalled() {
        if (!this.callbackCalled) {
            this.callback();
            this.callbackCalled = true;
        }
    }
}
exports.CommandCallback = CommandCallback;


/***/ },

/***/ "./src/commandsUtils/CommandParser.ts"
/*!********************************************!*\
  !*** ./src/commandsUtils/CommandParser.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandParser = void 0;
class CommandParser {
    constructor(commandString) {
        this.commandString = commandString;
        this.parsedCommand = '';
        this.parsedArguments = null;
        this.parsedNumbers = null;
        this.parsedCount = null;
    }
    getCommand() {
        if (this.parsedCommand === '') {
            this.parseCommand();
        }
        this.parsedCommand = this.parsedCommand.toLowerCase();
        return this.parsedCommand;
    }
    parseCommand() {
        let spaceIndex = this.commandString.indexOf(' ');
        if (spaceIndex === -1) {
            this.parsedCommand = this.commandString;
        }
        else {
            this.parsedCommand = this.commandString.slice(0, spaceIndex);
        }
    }
    getArgument(index) {
        if (this.parsedArguments === null) {
            this.parseArguments();
        }
        if (this.parsedArguments === null || this.parsedArguments[index] === undefined) {
            return null;
        }
        return this.parsedArguments[index];
    }
    getNumber(index) {
        if (this.parsedNumbers === null) {
            this.parseArguments();
        }
        if (this.parsedNumbers === null || this.parsedNumbers[index] === undefined) {
            return 1;
        }
        return this.parsedNumbers[index];
    }
    getCount(index) {
        if (this.parsedCount === null) {
            this.parseArguments();
        }
        if (this.parsedCount === null || this.parsedCount[index] === undefined) {
            return null;
        }
        return this.parsedCount[index];
    }
    parseArguments() {
        this.parsedArguments = [];
        this.parsedNumbers = [];
        this.parsedCount = [];
        let startIndex = this.commandString.indexOf(' ');
        let endIndex;
        let currentCommand = this.commandString;
        let currentArgumentNumber = 0;
        while (startIndex !== -1) {
            startIndex++;
            currentArgumentNumber++;
            let parsedNumber = null;
            let parsedCount = null;
            //usuwamy niepotrzebne spacje
            while (startIndex < currentCommand.length && currentCommand[startIndex] === ' ') {
                startIndex++;
            }
            currentCommand = currentCommand.slice(startIndex);
            if (currentCommand === '') {
                break;
            }
            // wyciąganie numeru dla argumentu
            if (currentCommand[0].isNumber()) {
                let currentIndex = 1;
                while (currentIndex < currentCommand.length && currentCommand[currentIndex].isNumber()) {
                    currentIndex++;
                }
                if (currentCommand[currentIndex] === '.') {
                    parsedNumber = Number.parseInt(currentCommand.slice(0, currentIndex), 10);
                    this.parsedNumbers[currentArgumentNumber] = parsedNumber;
                    currentCommand = currentCommand.slice(currentIndex + 1);
                    if (currentCommand === '') {
                        break;
                    }
                }
            }
            //jezeli nie wskazano liczby, to domyślnie jest 1
            if (parsedNumber === null) {
                this.parsedNumbers[currentArgumentNumber] = 1;
            }
            if (parsedCount === null) {
                this.parsedCount[currentArgumentNumber] = 1;
            }
            //wyciąganie treści argumentu
            if (currentCommand[0] === '"') {
                startIndex = 1;
                endIndex = currentCommand.indexOf('"', 1);
            }
            else {
                startIndex = 0;
                endIndex = currentCommand.indexOf(' ', 1);
            }
            if (endIndex === -1) {
                endIndex = currentCommand.length;
            }
            this.parsedArguments[currentArgumentNumber] = currentCommand.slice(startIndex, endIndex);
            startIndex = endIndex;
        }
    }
}
exports.CommandParser = CommandParser;


/***/ },

/***/ "./src/commandsUtils/CommandTree.ts"
/*!******************************************!*\
  !*** ./src/commandsUtils/CommandTree.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandTree = void 0;
const Command_1 = __webpack_require__(/*! ../commands/Command */ "./src/commands/Command.ts");
class CommandTree {
    constructor() {
        this.root = { command: null };
    }
    AddNewCommand(name, object) {
        if (!name || name === '') {
            throw 'New command name cannot be null or empty';
        }
        this.ValidateCommandObject(object);
        let currentNode = this.root;
        name.toLowerCase()
            .split('')
            .forEach((currentChar) => {
            if (currentNode[currentChar] === undefined) {
                currentNode[currentChar] = { command: object };
            }
            currentNode = currentNode[currentChar];
        });
    }
    SetDefaultCommand(object) {
        this.ValidateCommandObject(object);
        this.root.command = object;
    }
    ValidateCommandObject(object) {
        if (object === undefined || object === null) {
            throw 'Command object cannot be null';
        }
        if (!(object instanceof Command_1.Command)) {
            throw 'Command object must extend Command class';
        }
    }
    GetCommand(name) {
        let currentNode = this.root;
        name.toLowerCase()
            .split('')
            .some((currentChar) => {
            if (currentNode[currentChar] === undefined) {
                //command not found- return default command
                currentNode = this.root;
                return true;
            }
            currentNode = currentNode[currentChar];
            return false;
        });
        return currentNode.command;
    }
}
exports.CommandTree = CommandTree;


/***/ },

/***/ "./src/commandsUtils/CommandsManager.ts"
/*!**********************************************!*\
  !*** ./src/commandsUtils/CommandsManager.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Commands = void 0;
const CommandCallback_1 = __webpack_require__(/*! ./CommandCallback */ "./src/commandsUtils/CommandCallback.ts");
const CommandParser_1 = __webpack_require__(/*! ./CommandParser */ "./src/commandsUtils/CommandParser.ts");
const Down_1 = __webpack_require__(/*! ../commands/Down */ "./src/commands/Down.ts");
const Drop_1 = __webpack_require__(/*! ../commands/Drop */ "./src/commands/Drop.ts");
const East_1 = __webpack_require__(/*! ../commands/East */ "./src/commands/East.ts");
const Eval_1 = __webpack_require__(/*! ../commands/Eval */ "./src/commands/Eval.ts");
const Exam_1 = __webpack_require__(/*! ../commands/Exam */ "./src/commands/Exam.ts");
const Go_1 = __webpack_require__(/*! ../commands/Go */ "./src/commands/Go.ts");
const Inventory_1 = __webpack_require__(/*! ../commands/Inventory */ "./src/commands/Inventory.ts");
const Json_1 = __webpack_require__(/*! ../commands/Json */ "./src/commands/Json.ts");
const Look_1 = __webpack_require__(/*! ../commands/Look */ "./src/commands/Look.ts");
const North_1 = __webpack_require__(/*! ../commands/North */ "./src/commands/North.ts");
const Reload_1 = __webpack_require__(/*! ../commands/Reload */ "./src/commands/Reload.ts");
const Save_1 = __webpack_require__(/*! ../commands/Save */ "./src/commands/Save.ts");
const Scan_1 = __webpack_require__(/*! ../commands/Scan */ "./src/commands/Scan.ts");
const South_1 = __webpack_require__(/*! ../commands/South */ "./src/commands/South.ts");
const Take_1 = __webpack_require__(/*! ../commands/Take */ "./src/commands/Take.ts");
const Test_1 = __webpack_require__(/*! ../commands/Test */ "./src/commands/Test.ts");
const Up_1 = __webpack_require__(/*! ../commands/Up */ "./src/commands/Up.ts");
const West_1 = __webpack_require__(/*! ../commands/West */ "./src/commands/West.ts");
const CommandTree_1 = __webpack_require__(/*! ./CommandTree */ "./src/commandsUtils/CommandTree.ts");
const Prompt_1 = __webpack_require__(/*! ../commonLogic/Prompt */ "./src/commonLogic/Prompt.ts");
const Load_1 = __webpack_require__(/*! ../commands/Load */ "./src/commands/Load.ts");
const EngineUtils_1 = __webpack_require__(/*! ../commonLogic/EngineUtils */ "./src/commonLogic/EngineUtils.ts");
const Open_1 = __webpack_require__(/*! ../commands/Open */ "./src/commands/Open.ts");
class CommandList {
    constructor() {
        this.Down = new Down_1.Down();
        this.Drop = new Drop_1.Drop();
        this.East = new East_1.East();
        this.Eval = new Eval_1.Eval();
        this.Exam = new Exam_1.Exam();
        this.Go = new Go_1.Go();
        this.Inventory = new Inventory_1.Inventory();
        this.Json = new Json_1.Json();
        this.Load = new Load_1.Load();
        this.Look = new Look_1.Look();
        this.North = new North_1.North();
        this.Open = new Open_1.Open();
        this.Reload = new Reload_1.Reload();
        this.South = new South_1.South();
        this.Save = new Save_1.Save();
        this.Scan = new Scan_1.Scan();
        this.Take = new Take_1.Take();
        this.Test = new Test_1.Test();
        this.Up = new Up_1.Up();
        this.West = new West_1.West();
    }
}
class CommandsManager extends CommandList {
    constructor() {
        super();
        this.Commands = {};
        this.Tree = new CommandTree_1.CommandTree();
        this.isCommandExecuting = false;
        this.commandQueue = [];
    }
    Execute(command) {
        this.commandQueue.push(command);
        if (command.isNullOrEmpty()) {
            EngineUtils_1.EngineUtils.SkipPrinter();
        }
        if (this.isCommandExecuting === false) {
            this.isCommandExecuting = true;
            this.ExecuteNext();
        }
    }
    ExecuteNext() {
        if (this.commandQueue.length <= 0) {
            this.isCommandExecuting = false;
            return;
        }
        let command = this.commandQueue[0];
        this.commandQueue.shift();
        let parser = new CommandParser_1.CommandParser(command);
        let commandName = parser.getCommand();
        if (commandName.isNullOrEmpty()) {
            this.AfterExecute();
            return;
        }
        let commandObject = this.Tree.GetCommand(commandName);
        if (commandObject === undefined || commandObject === null) {
            throw 'Command object for {0} not found'.format(commandName);
        }
        Engine.Output('');
        try {
            commandObject.Execute(parser, new CommandCallback_1.CommandCallback(() => this.AfterExecute()));
        }
        catch (e) {
            this.AfterExecute();
            throw e;
        }
    }
    AfterExecute() {
        Engine.Output('');
        Prompt_1.Prompt.Print();
        this.ExecuteNext();
    }
    SetDefaultCommand(commandObject) {
        this.Tree.SetDefaultCommand(commandObject);
    }
    RegisterCommand(name, object) {
        this.Tree.AddNewCommand(name, object);
        let commandList = this;
        commandList[name] = object;
    }
}
exports.Commands = new CommandsManager();


/***/ },

/***/ "./src/commandsUtils/RegisterCommands.ts"
/*!***********************************************!*\
  !*** ./src/commandsUtils/RegisterCommands.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InitCommands = InitCommands;
const Down_1 = __webpack_require__(/*! ../commands/Down */ "./src/commands/Down.ts");
const Drop_1 = __webpack_require__(/*! ../commands/Drop */ "./src/commands/Drop.ts");
const East_1 = __webpack_require__(/*! ../commands/East */ "./src/commands/East.ts");
const Eval_1 = __webpack_require__(/*! ../commands/Eval */ "./src/commands/Eval.ts");
const Exam_1 = __webpack_require__(/*! ../commands/Exam */ "./src/commands/Exam.ts");
const Go_1 = __webpack_require__(/*! ../commands/Go */ "./src/commands/Go.ts");
const Inventory_1 = __webpack_require__(/*! ../commands/Inventory */ "./src/commands/Inventory.ts");
const Json_1 = __webpack_require__(/*! ../commands/Json */ "./src/commands/Json.ts");
const Load_1 = __webpack_require__(/*! ../commands/Load */ "./src/commands/Load.ts");
const Look_1 = __webpack_require__(/*! ../commands/Look */ "./src/commands/Look.ts");
const NoCommand_1 = __webpack_require__(/*! ../commands/NoCommand */ "./src/commands/NoCommand.ts");
const North_1 = __webpack_require__(/*! ../commands/North */ "./src/commands/North.ts");
const Open_1 = __webpack_require__(/*! ../commands/Open */ "./src/commands/Open.ts");
const Reload_1 = __webpack_require__(/*! ../commands/Reload */ "./src/commands/Reload.ts");
const Save_1 = __webpack_require__(/*! ../commands/Save */ "./src/commands/Save.ts");
const Scan_1 = __webpack_require__(/*! ../commands/Scan */ "./src/commands/Scan.ts");
const South_1 = __webpack_require__(/*! ../commands/South */ "./src/commands/South.ts");
const Take_1 = __webpack_require__(/*! ../commands/Take */ "./src/commands/Take.ts");
const Test_1 = __webpack_require__(/*! ../commands/Test */ "./src/commands/Test.ts");
const Up_1 = __webpack_require__(/*! ../commands/Up */ "./src/commands/Up.ts");
const West_1 = __webpack_require__(/*! ../commands/West */ "./src/commands/West.ts");
const CommandsManager_1 = __webpack_require__(/*! ./CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
function InitCommands() {
    CommandsManager_1.Commands.SetDefaultCommand(new NoCommand_1.NoCommand());
    CommandsManager_1.Commands.RegisterCommand('Down', new Down_1.Down());
    CommandsManager_1.Commands.RegisterCommand('Drop', new Drop_1.Drop());
    CommandsManager_1.Commands.RegisterCommand('East', new East_1.East());
    CommandsManager_1.Commands.RegisterCommand('Exam', new Exam_1.Exam());
    CommandsManager_1.Commands.RegisterCommand('Eval', new Eval_1.Eval());
    CommandsManager_1.Commands.RegisterCommand('Go', new Go_1.Go());
    CommandsManager_1.Commands.RegisterCommand('Inventory', new Inventory_1.Inventory());
    CommandsManager_1.Commands.RegisterCommand('Json', new Json_1.Json());
    CommandsManager_1.Commands.RegisterCommand('Look', new Look_1.Look());
    CommandsManager_1.Commands.RegisterCommand('Load', new Load_1.Load());
    CommandsManager_1.Commands.RegisterCommand('North', new North_1.North());
    CommandsManager_1.Commands.RegisterCommand('Open', new Open_1.Open());
    CommandsManager_1.Commands.RegisterCommand('Reload', new Reload_1.Reload());
    CommandsManager_1.Commands.RegisterCommand('South', new South_1.South());
    CommandsManager_1.Commands.RegisterCommand('Scan', new Scan_1.Scan());
    CommandsManager_1.Commands.RegisterCommand('Save', new Save_1.Save());
    CommandsManager_1.Commands.RegisterCommand('Take', new Take_1.Take());
    CommandsManager_1.Commands.RegisterCommand('Test', new Test_1.Test());
    CommandsManager_1.Commands.RegisterCommand('Up', new Up_1.Up());
    CommandsManager_1.Commands.RegisterCommand('West', new West_1.West());
}


/***/ },

/***/ "./src/commonLogic/EngineUtils.ts"
/*!****************************************!*\
  !*** ./src/commonLogic/EngineUtils.ts ***!
  \****************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EngineUtils = void 0;
class EngineUtilsClass {
    constructor() {
        this.skipPrinter = false;
    }
    OutputPrinter(message, callback, delay = 60, isNewLine = true) {
        this.skipPrinter = false;
        this.printNext(message, callback, delay, isNewLine);
    }
    printNext(message, callback, delay, isNewLine) {
        if (message.isNullOrEmpty()) {
            if (isNewLine === true) {
                Engine.Output('');
            }
            callback();
            return;
        }
        if (this.skipPrinter === true) {
            delay = 0;
        }
        Engine.Output(message[0], false);
        Engine.StartTimer(() => {
            this.printNext(message.slice(1), callback, delay, isNewLine);
        }, delay);
    }
    SkipPrinter() {
        this.skipPrinter = true;
    }
}
exports.EngineUtils = new EngineUtilsClass();


/***/ },

/***/ "./src/commonLogic/InputFunctions.ts"
/*!*******************************************!*\
  !*** ./src/commonLogic/InputFunctions.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputFunctions = void 0;
const CommandsManager_1 = __webpack_require__(/*! ../commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const EngineUtils_1 = __webpack_require__(/*! ./EngineUtils */ "./src/commonLogic/EngineUtils.ts");
exports.InputFunctions = 'true';
function Execute(command) {
    CommandsManager_1.Commands.Execute(command);
}
function SkipPrinter() {
    EngineUtils_1.EngineUtils.SkipPrinter();
}
function ResumeExecution() {
    CommandsManager_1.Commands.ExecuteNext();
}
globalThis.Execute = Execute;
globalThis.SkipPrinter = SkipPrinter;
globalThis.ResumeExecution = ResumeExecution;


/***/ },

/***/ "./src/commonLogic/Prompt.ts"
/*!***********************************!*\
  !*** ./src/commonLogic/Prompt.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Prompt = void 0;
class PromptClass {
    Print() {
        Engine.Output('$ ', false);
    }
}
exports.Prompt = new PromptClass();


/***/ },

/***/ "./src/commonLogic/Random.ts"
/*!***********************************!*\
  !*** ./src/commonLogic/Random.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Random = void 0;
class RandomClass {
    nextInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
exports.Random = new RandomClass();


/***/ },

/***/ "./src/commonLogic/StringUtils.ts"
/*!****************************************!*\
  !*** ./src/commonLogic/StringUtils.ts ***!
  \****************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
String.prototype.format = function (...args) {
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};
String.prototype.startWithUpper = function () {
    return this[0].toUpperCase() + this.slice(1);
};
String.prototype.isNumber = function () {
    return /^\d+$/.test(this.toString());
};
String.prototype.isNullOrEmpty = function () {
    return this === null || this === '';
};


/***/ },

/***/ "./src/enums/Direction.ts"
/*!********************************!*\
  !*** ./src/enums/Direction.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DirectionHelper = exports.Direction = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const EnumHelper_1 = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
const GrammaCase_1 = __webpack_require__(/*! ./GrammaCase */ "./src/enums/GrammaCase.ts");
var Direction;
(function (Direction) {
    Direction["north"] = "north";
    Direction["south"] = "south";
    Direction["east"] = "east";
    Direction["west"] = "west";
    Direction["up"] = "up";
    Direction["down"] = "down";
})(Direction || (exports.Direction = Direction = {}));
class DirectionHelperClass extends EnumHelper_1.EnumHelper {
    constructor() {
        super(Direction);
    }
    getLocale(direction, grammaCase = GrammaCase_1.GrammaCase.Mianownik) {
        return InitGameData_1.Local.Directions[direction][grammaCase];
    }
}
exports.DirectionHelper = new DirectionHelperClass();


/***/ },

/***/ "./src/enums/EnumHelper.ts"
/*!*********************************!*\
  !*** ./src/enums/EnumHelper.ts ***!
  \*********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnumHelper = void 0;
class EnumHelper {
    constructor(source) {
        this.source = source;
    }
    parse(value) {
        if (this.source.hasOwnProperty(value)) {
            return this.source[value];
        }
        return null;
    }
    parseArray(values) {
        let array = [];
        values.forEach((key) => {
            let parsed = this.parse(key);
            if (parsed !== null) {
                array.push(parsed);
            }
        });
        return array;
    }
    contains(string) {
        if (this.source.hasOwnProperty(string)) {
            return true;
        }
        return false;
    }
    parseShort(string) {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key.startsWith(string)) {
                    return this.source[key];
                }
            }
        }
        return null;
    }
    getKey(value) {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (this.source[key] === value) {
                    return key;
                }
            }
        }
        return null;
    }
    forEach(callback) {
        for (const key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                callback(this.source[key], key);
            }
        }
    }
}
exports.EnumHelper = EnumHelper;


/***/ },

/***/ "./src/enums/EquipmentSlot.ts"
/*!************************************!*\
  !*** ./src/enums/EquipmentSlot.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EquipmentSlotHelper = exports.EquipmentSlot = void 0;
const EnumHelper_1 = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var EquipmentSlot;
(function (EquipmentSlot) {
    EquipmentSlot[EquipmentSlot["None"] = 0] = "None";
    EquipmentSlot[EquipmentSlot["Torso"] = 1] = "Torso";
    EquipmentSlot[EquipmentSlot["Arms"] = 2] = "Arms";
    EquipmentSlot[EquipmentSlot["Hands"] = 3] = "Hands";
    EquipmentSlot[EquipmentSlot["Legs"] = 4] = "Legs";
    EquipmentSlot[EquipmentSlot["Feets"] = 5] = "Feets";
    EquipmentSlot[EquipmentSlot["Head"] = 6] = "Head";
    EquipmentSlot[EquipmentSlot["MainHand"] = 7] = "MainHand";
    EquipmentSlot[EquipmentSlot["OffHand"] = 8] = "OffHand";
    EquipmentSlot[EquipmentSlot["Shirt"] = 9] = "Shirt";
    EquipmentSlot[EquipmentSlot["Pants"] = 10] = "Pants";
    EquipmentSlot[EquipmentSlot["Coat"] = 11] = "Coat";
    EquipmentSlot[EquipmentSlot["RightRing"] = 12] = "RightRing";
    EquipmentSlot[EquipmentSlot["LeftRing"] = 13] = "LeftRing";
    EquipmentSlot[EquipmentSlot["Necklace"] = 14] = "Necklace";
    EquipmentSlot[EquipmentSlot["Torch"] = 15] = "Torch";
})(EquipmentSlot || (exports.EquipmentSlot = EquipmentSlot = {}));
class EquipmentSlotHelperClass extends EnumHelper_1.EnumHelper {
    constructor() {
        super(EquipmentSlot);
    }
}
exports.EquipmentSlotHelper = new EquipmentSlotHelperClass();


/***/ },

/***/ "./src/enums/GlobalEventType.ts"
/*!**************************************!*\
  !*** ./src/enums/GlobalEventType.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalEventTypeHelper = exports.GlobalEventType = void 0;
const EnumHelper_1 = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var GlobalEventType;
(function (GlobalEventType) {
    GlobalEventType[GlobalEventType["BeforeRoomEnter"] = 1] = "BeforeRoomEnter";
})(GlobalEventType || (exports.GlobalEventType = GlobalEventType = {}));
class GlobalEventTypeHelperClass extends EnumHelper_1.EnumHelper {
    constructor() {
        super(GlobalEventType);
    }
}
exports.GlobalEventTypeHelper = new GlobalEventTypeHelperClass();


/***/ },

/***/ "./src/enums/GrammaCase.ts"
/*!*********************************!*\
  !*** ./src/enums/GrammaCase.ts ***!
  \*********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GrammaCaseHelper = exports.GrammaCase = void 0;
const EnumHelper_1 = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var GrammaCase;
(function (GrammaCase) {
    GrammaCase[GrammaCase["Mianownik"] = 0] = "Mianownik";
    GrammaCase[GrammaCase["Dopelniacz"] = 1] = "Dopelniacz";
    GrammaCase[GrammaCase["Celownik"] = 2] = "Celownik";
    GrammaCase[GrammaCase["Biernik"] = 3] = "Biernik";
    GrammaCase[GrammaCase["Narzednik"] = 4] = "Narzednik";
    GrammaCase[GrammaCase["Miejscownik"] = 5] = "Miejscownik";
    GrammaCase[GrammaCase["Wolacz"] = 6] = "Wolacz";
})(GrammaCase || (exports.GrammaCase = GrammaCase = {}));
class GrammaCaseHelperClass extends EnumHelper_1.EnumHelper {
    constructor() {
        super(GrammaCase);
    }
}
exports.GrammaCaseHelper = new GrammaCaseHelperClass();


/***/ },

/***/ "./src/enums/ItemType.ts"
/*!*******************************!*\
  !*** ./src/enums/ItemType.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypeHelper = exports.ItemType = void 0;
const EnumHelper_1 = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var ItemType;
(function (ItemType) {
    ItemType["Weapon1H"] = "Weapon1H";
    ItemType["Weapon2H"] = "Weapon2H";
    ItemType["Shield"] = "Shield";
    ItemType["Armor"] = "Armor";
    ItemType["Shoulders"] = "Shoulders";
    ItemType["Gloves"] = "Gloves";
    ItemType["Greaves"] = "Greaves";
    ItemType["Boots"] = "Boots";
    ItemType["Helmet"] = "Helmet";
    ItemType["Shirt"] = "Shirt";
    ItemType["Pants"] = "Pants";
    ItemType["WildShield"] = "WildShield";
    ItemType["WildArmor"] = "WildArmor";
    ItemType["WildShoulders"] = "WildShoulders";
    ItemType["WildGloves"] = "WildGloves";
    ItemType["WildGreaves"] = "WildGreaves";
    ItemType["WildBoots"] = "WildBoots";
    ItemType["WildHelmet"] = "WildHelmet";
    ItemType["Ring"] = "Ring";
    ItemType["Necklace"] = "Necklace";
    ItemType["Potion"] = "Potion";
    ItemType["Food"] = "Food";
    ItemType["Trash"] = "Trash";
    ItemType["Currency"] = "Currency";
    ItemType["Container"] = "Container";
    ItemType["StaticContainer"] = "StaticContainer";
    ItemType["Quest"] = "Quest";
    ItemType["Static"] = "Static";
    ItemType["Lever"] = "Lever";
})(ItemType || (exports.ItemType = ItemType = {}));
class ItemTypeHelperClass extends EnumHelper_1.EnumHelper {
    constructor() {
        super(ItemType);
    }
}
exports.ItemTypeHelper = new ItemTypeHelperClass();


/***/ },

/***/ "./src/factories/CharacterFactory.ts"
/*!*******************************************!*\
  !*** ./src/factories/CharacterFactory.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CharacterFactory = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Character_1 = __webpack_require__(/*! ../model/Character */ "./src/model/Character.ts");
const Equipment_1 = __webpack_require__(/*! ../model/Equipment */ "./src/model/Equipment.ts");
const GameData_1 = __webpack_require__(/*! ../model/GameData */ "./src/model/GameData.ts");
const ItemList_1 = __webpack_require__(/*! ../model/ItemList */ "./src/model/ItemList.ts");
class CharacterFactory {
    spawnCharacter(characterId) {
        let template = GameData_1.GameData.CharacterTemplates.getTemplate(characterId);
        let character = new Character_1.Character();
        character = this.LoadFromTemplate(character, template);
        return character;
    }
    LoadFromTemplate(character, template) {
        character.Id = template.Id;
        if (template.Inventory !== undefined) {
            let inventoryModel = new ItemList_1.ItemList();
            template.Inventory.forEach((itemDefinition) => {
                inventoryModel.add(InitGameData_1.Game.spawnItem(itemDefinition));
            });
            character.Inventory = inventoryModel;
        }
        if (template.Equipment !== undefined) {
            let equipmentModel = new Equipment_1.Equipment();
            template.Equipment.forEach((eq) => {
                equipmentModel.equip(eq.Slot, InitGameData_1.Game.spawnItem(eq.Item));
            });
            character.Equipment = equipmentModel;
        }
        return character;
    }
}
exports.CharacterFactory = CharacterFactory;


/***/ },

/***/ "./src/factories/ItemFactory.ts"
/*!**************************************!*\
  !*** ./src/factories/ItemFactory.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemFactory = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const GameData_1 = __webpack_require__(/*! ../model/GameData */ "./src/model/GameData.ts");
const Item_1 = __webpack_require__(/*! ../model/Item */ "./src/model/Item.ts");
const ItemList_1 = __webpack_require__(/*! ../model/ItemList */ "./src/model/ItemList.ts");
const Random_1 = __webpack_require__(/*! ../commonLogic/Random */ "./src/commonLogic/Random.ts");
const ItemLock_1 = __webpack_require__(/*! ../model/ItemLock */ "./src/model/ItemLock.ts");
class ItemFactory {
    spawnItem(itemDefinition) {
        let item = null;
        if (typeof itemDefinition === 'string') {
            return this.spawnItemByTemplateId(itemDefinition);
        }
        else {
            if (this.isItemChanceTemplate(itemDefinition)) {
                if (itemDefinition.Chance !== undefined) {
                    if (Random_1.Random.nextInt(1, 100) > itemDefinition.Chance) {
                        return null;
                    }
                }
                let templateId = itemDefinition.ItemId;
                item = this.spawnItemByTemplateId(templateId);
                if (itemDefinition.Stack !== undefined) {
                    item.setStack(this.stackValue(itemDefinition.Stack));
                }
                this.resolveInventory(itemDefinition, item);
                this.resolveLock(itemDefinition, item);
            }
            else {
                let selectedItemIndex = this.resolveRandomItemIndex(itemDefinition);
                let templateId = itemDefinition.ItemId[selectedItemIndex];
                if (templateId === null) {
                    return null;
                }
                item = this.spawnItemByTemplateId(templateId);
                if (itemDefinition.Stack !== undefined) {
                    if (itemDefinition.ItemId.length !== itemDefinition.Stack.length) {
                        throw 'Item definition has {0} specified ids but only {1} spiecified stacks'.format(itemDefinition.ItemId.length, itemDefinition.Stack.length);
                    }
                    item.setStack(this.stackValue(itemDefinition.Stack[selectedItemIndex]));
                }
            }
            return item;
        }
    }
    isItemChanceTemplate(itemDefinition) {
        return typeof itemDefinition !== 'string' && typeof itemDefinition.ItemId === 'string';
    }
    spawnItemByTemplateId(templateId) {
        let template = GameData_1.GameData.ItemTemplates.getTemplate(templateId);
        let item = new Item_1.Item();
        item.Id = template.Id;
        if (item.isContainer()) {
            item.Inventory = new ItemList_1.ItemList();
        }
        return item;
    }
    resolveRandomItemIndex(itemDefinition) {
        if (itemDefinition.ChanceList === undefined) {
            itemDefinition.ChanceList = [];
            itemDefinition.ItemId.forEach(() => {
                var _a;
                (_a = itemDefinition.ChanceList) === null || _a === void 0 ? void 0 : _a.push(1);
            });
        }
        if (itemDefinition.ItemId.length !== itemDefinition.ChanceList.length) {
            throw 'Item definition has {0} specified ids but only {1} spiecified chances in ChanceList'.format(itemDefinition.ItemId.length, itemDefinition.ChanceList.length);
        }
        let chanceSum = itemDefinition.ChanceList.reduce((a, b) => a + b);
        let selectedChance = Random_1.Random.nextInt(1, chanceSum);
        chanceSum = 0;
        for (let i = 0; i < itemDefinition.ChanceList.length; i++) {
            chanceSum += itemDefinition.ChanceList[i];
            if (selectedChance <= chanceSum) {
                return i;
            }
        }
        return 0; //should never occur
    }
    resolveInventory(itemDefinition, item) {
        if (itemDefinition.Inventory !== undefined) {
            let inventory = item.getInventory();
            if (inventory === null) {
                inventory = item.Inventory = new ItemList_1.ItemList();
            }
            itemDefinition.Inventory.forEach((itemDefinition) => {
                inventory === null || inventory === void 0 ? void 0 : inventory.add(InitGameData_1.Game.spawnItem(itemDefinition));
            });
        }
    }
    resolveLock(itemDefinition, item) {
        if (itemDefinition.Lock !== undefined) {
            item.Lock = new ItemLock_1.ItemLock(itemDefinition.Lock);
        }
    }
    stackValue(stack) {
        if (stack === undefined || stack === null) {
            return 1;
        }
        if (typeof stack === 'number') {
            return stack;
        }
        else {
            return Random_1.Random.nextInt(stack.Min, stack.Max);
        }
    }
    loadListFromTemplate(template) {
        let itemList = new ItemList_1.ItemList();
        if (template !== undefined) {
            template.forEach((itemDefinition) => {
                itemList.add(InitGameData_1.Game.spawnItem(itemDefinition));
            });
        }
        return itemList;
    }
}
exports.ItemFactory = ItemFactory;


/***/ },

/***/ "./src/factories/RoomFactory.ts"
/*!**************************************!*\
  !*** ./src/factories/RoomFactory.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomFactory = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const CharacterList_1 = __webpack_require__(/*! ../model/CharacterList */ "./src/model/CharacterList.ts");
const Room_1 = __webpack_require__(/*! ../model/Room */ "./src/model/Room.ts");
const RoomExit_1 = __webpack_require__(/*! ../model/RoomExit */ "./src/model/RoomExit.ts");
const RoomExitsList_1 = __webpack_require__(/*! ../model/RoomExitsList */ "./src/model/RoomExitsList.ts");
const RoomDoor_1 = __webpack_require__(/*! ../model/RoomDoor */ "./src/model/RoomDoor.ts");
const GameData_1 = __webpack_require__(/*! ../model/GameData */ "./src/model/GameData.ts");
class RoomFactory {
    spawnRoom(template) {
        let room = new Room_1.Room();
        room.Id = template.Id;
        return room;
    }
    loadFromData(room) {
        var _a;
        const template = GameData_1.GameData.RoomTemplates.getTemplate(room.Id);
        let exitsModel = new RoomExitsList_1.RoomExitsList();
        (_a = template.Exits) === null || _a === void 0 ? void 0 : _a.forEach((exit) => {
            let direction = exit.Direction;
            let roomExit = new RoomExit_1.RoomExit();
            roomExit.RoomId = exit.RoomId;
            roomExit.IsHidden = exit.isHidden;
            if (exit.Door !== undefined) {
                let door = (roomExit.Door = new RoomDoor_1.RoomDoor());
                door.IsLocked = exit.Door.IsLocked;
                door.IsClosed = exit.Door.IsClosed;
                door.KeyId = exit.Door.KeyId;
                if (door.IsLocked === undefined && door.KeyId !== undefined) {
                    door.IsLocked = true;
                }
            }
            exitsModel[direction] = roomExit;
        });
        room.Exits = exitsModel;
        room.Items = InitGameData_1.Game.ItemFactory.loadListFromTemplate(template.Items);
        if (template.Characters !== undefined) {
            let charactersModel = new CharacterList_1.CharacterList();
            template.Characters.forEach((characterId) => {
                charactersModel.add(InitGameData_1.Game.spawnCharacter(characterId));
            });
            room.Characters = charactersModel;
        }
    }
}
exports.RoomFactory = RoomFactory;


/***/ },

/***/ "./src/model/Character.ts"
/*!********************************!*\
  !*** ./src/model/Character.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Character = void 0;
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const EntityBase_1 = __webpack_require__(/*! ./EntityBase */ "./src/model/EntityBase.ts");
const Equipment_1 = __webpack_require__(/*! ./Equipment */ "./src/model/Equipment.ts");
const ItemList_1 = __webpack_require__(/*! ./ItemList */ "./src/model/ItemList.ts");
const CharacterStats_1 = __webpack_require__(/*! ./CharacterStats */ "./src/model/CharacterStats.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const GameData_1 = __webpack_require__(/*! ./GameData */ "./src/model/GameData.ts");
class Character extends EntityBase_1.EntityBase {
    constructor() {
        super(...arguments);
        this.Inventory = new ItemList_1.ItemList();
        this.Equipment = new Equipment_1.Equipment();
        this.Stats = new CharacterStats_1.CharacterStats();
    }
    getTemplate() {
        return GameData_1.GameData.CharacterTemplates.getTemplate(this.Id);
    }
    loadFromSave(savedCharacter) {
        Object.assign(this, savedCharacter);
        this.Inventory = new ItemList_1.ItemList();
        this.Inventory.loadFromSave(savedCharacter.Inventory);
        this.Equipment = new Equipment_1.Equipment();
        this.Equipment.loadFromSave(savedCharacter.Equipment);
        this.Stats = new CharacterStats_1.CharacterStats();
        this.Stats.loadFromSave(savedCharacter.Stats);
    }
    getName(grammaCase = GrammaCase_1.GrammaCase.Mianownik) {
        return this.getTemplate().Name[grammaCase];
    }
    getDescription() {
        return this.getTemplate().Description;
    }
    getIdle() {
        return this.getTemplate().Idle;
    }
    getInventory() {
        return this.Inventory;
    }
    getEquipment() {
        return this.Equipment;
    }
    hasLightSource() {
        return this.getEquipment().hasLightSource();
    }
    getHealthLevel(description) {
        let percentage = (this.Stats.currentHealth * 100) / this.Stats.health.total;
        let level;
        if (percentage >= 100) {
            level = description ? InitGameData_1.Local.Stats.HealthLevels.Full : '█████';
            return '|G' + level + Engine.DefaultColor;
        }
        if (percentage > 80) {
            level = description ? InitGameData_1.Local.Stats.HealthLevels.LightWounds : '█████';
            return '|g' + level + Engine.DefaultColor;
        }
        if (percentage > 60) {
            level = description ? InitGameData_1.Local.Stats.HealthLevels.MediumWounds : '████░';
            return '|Y' + level + Engine.DefaultColor;
        }
        if (percentage > 40) {
            level = description ? InitGameData_1.Local.Stats.HealthLevels.SeriousWounds : '███░░';
            return '|Y' + level + Engine.DefaultColor;
        }
        if (percentage > 20) {
            level = description ? InitGameData_1.Local.Stats.HealthLevels.HeavyWounds : '██░░░';
            return '|R' + level + Engine.DefaultColor;
        }
        if (percentage >= 0) {
            level = description ? InitGameData_1.Local.Stats.HealthLevels.NearDeath : '█░░░░';
            return '|R' + level + Engine.DefaultColor;
        }
        level = description ? InitGameData_1.Local.Stats.HealthLevels.Dead : '░░░░░';
        return '|R' + level + Engine.DefaultColor;
    }
}
exports.Character = Character;


/***/ },

/***/ "./src/model/CharacterList.ts"
/*!************************************!*\
  !*** ./src/model/CharacterList.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CharacterList = void 0;
const Character_1 = __webpack_require__(/*! ./Character */ "./src/model/Character.ts");
const EntityList_1 = __webpack_require__(/*! ./EntityList */ "./src/model/EntityList.ts");
class CharacterList extends EntityList_1.EntityList {
    constructor() {
        super();
    }
    loadFromSave(savedList) {
        this.Array = savedList.Array.map((item) => {
            let newChar = new Character_1.Character();
            newChar.loadFromSave(item);
            return newChar;
        });
    }
    hasLightSource() {
        return this.Array.some((c) => c.hasLightSource() === true);
    }
}
exports.CharacterList = CharacterList;


/***/ },

/***/ "./src/model/CharacterStats.ts"
/*!*************************************!*\
  !*** ./src/model/CharacterStats.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CharacterStats = void 0;
class Stat {
    constructor() {
        this.base = 0;
        this.race = 0;
        this.class = 0;
        this.bonus = 0;
        this.total = 0;
    }
}
class Attribute {
    constructor() {
        this.stat = 0;
        this.level = 0;
        this.eq = 0;
        this.bonus = 0;
        this.modifier = 0;
        this.total = 0;
    }
}
class CharacterStats {
    constructor() {
        this.level = 1;
        this.strength = new Stat();
        this.dexterity = new Stat();
        this.agility = new Stat();
        this.endurance = new Stat();
        this.vitality = new Stat();
        this.attack = new Attribute();
        this.defense = new Attribute();
        this.health = new Attribute();
        this.armor = new Attribute();
        this.fatigue = new Attribute();
        this.damage = new Attribute();
        this.currentHealth = 100;
        this.currentArmor = 0;
        this.health.total = 100;
    }
    loadFromSave(savedStats) {
        Object.assign(this, savedStats);
    }
}
exports.CharacterStats = CharacterStats;


/***/ },

/***/ "./src/model/CharacterTemplates.ts"
/*!*****************************************!*\
  !*** ./src/model/CharacterTemplates.ts ***!
  \*****************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CharacterTemplates = void 0;
class CharacterTemplates {
    constructor(characterTemplates) {
        if (characterTemplates === undefined) {
            return;
        }
        if (!Array.isArray(characterTemplates)) {
            throw 'Character templates must be an array';
        }
        characterTemplates.forEach((value, index) => {
            this.addNewCharacterTemplate(value);
        });
    }
    addNewCharacterTemplate(characterTemplate) {
        if (this[characterTemplate.Id] !== undefined) {
            throw 'Character template {0} is already defined!'.format(characterTemplate.Id);
        }
        this[characterTemplate.Id] = characterTemplate;
    }
    getTemplate(characterId) {
        if (this[characterId] === undefined) {
            throw 'No Character template defined for Id {0}!'.format(characterId);
        }
        return this[characterId];
    }
}
exports.CharacterTemplates = CharacterTemplates;


/***/ },

/***/ "./src/model/EntityBase.ts"
/*!*********************************!*\
  !*** ./src/model/EntityBase.ts ***!
  \*********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityBase = void 0;
class EntityBase {
    constructor() {
        this.Id = '';
    }
    loadFromSave(savedEntity) {
        Object.assign(this, savedEntity);
    }
}
exports.EntityBase = EntityBase;


/***/ },

/***/ "./src/model/EntityList.ts"
/*!*********************************!*\
  !*** ./src/model/EntityList.ts ***!
  \*********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityList = void 0;
class EntityList {
    constructor() {
        this.Array = [];
    }
    add(item) {
        if (item === null) {
            return;
        }
        this.Array.push(item);
    }
    remove(item) {
        let index = this.Array.indexOf(item);
        if (index > -1) {
            this.Array.splice(index, 1);
        }
    }
    any() {
        return this.Array.length > 0;
    }
    elementAt(index) {
        if (this.Array[index] === undefined) {
            return null;
        }
        return this.Array[index];
    }
    length() {
        return this.Array.length;
    }
    find(name, number = 1) {
        let found = null;
        this.Array.some((item) => {
            if (item.getName().search(name) >= 0) {
                if (number <= 1) {
                    found = item;
                    return true;
                }
                else {
                    number--;
                    return false;
                }
            }
        });
        return found;
    }
    findById(id, number = 1) {
        let found = null;
        this.Array.some((item) => {
            if (item.Id === id) {
                if (number <= 1) {
                    found = item;
                    return true;
                }
                else {
                    number--;
                    return false;
                }
            }
        });
        return found;
    }
    printLongFormat(indent = true) {
        return this.print(indent, true);
    }
    printShortFormat(indent = true) {
        return this.print(indent, false);
    }
    print(indent = true, longFormat = true) {
        let returnString = '';
        this.Array.forEach((entity) => {
            if (returnString !== '') {
                returnString += Engine.EndLine;
            }
            if (indent === true) {
                returnString += Engine.NonBreakingSpace.repeat(4);
            }
            returnString += entity.getName().startWithUpper();
            if (longFormat === true) {
                returnString += ' ' + entity.getIdle() + '.';
            }
        });
        return returnString;
    }
}
exports.EntityList = EntityList;


/***/ },

/***/ "./src/model/Equipment.ts"
/*!********************************!*\
  !*** ./src/model/Equipment.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Equipment = void 0;
const EquipmentSlot_1 = __webpack_require__(/*! ../enums/EquipmentSlot */ "./src/enums/EquipmentSlot.ts");
const Item_1 = __webpack_require__(/*! ./Item */ "./src/model/Item.ts");
class Equipment {
    constructor() {
        this.Array = [];
    }
    loadFromSave(savedEquipment) {
        this.Array = savedEquipment.Array.map((item) => {
            let newItem = new Item_1.Item();
            newItem.loadFromSave(item);
            return newItem;
        });
    }
    validateSlot(slot) {
        if (EquipmentSlot_1.EquipmentSlotHelper.getKey(slot) === null) {
            throw '{0} is not a proper equipment slot.'.format(slot);
        }
    }
    equip(slot, item) {
        if (item === null) {
            return;
        }
        this.validateSlot(slot);
        if (this.Array[slot] !== undefined) {
            throw 'Cannot equip, {0} already contains an item.'.format(EquipmentSlot_1.EquipmentSlotHelper.getKey(slot));
        }
        this.Array[slot] = item;
    }
    remove(slot) {
        this.validateSlot(slot);
        if (this.Array[slot] === undefined) {
            throw "Cannot remove, {0} doesn't contains an item.".format(EquipmentSlot_1.EquipmentSlotHelper.getKey(slot));
        }
        delete this.Array[slot];
    }
    get(slot) {
        this.validateSlot(slot);
        if (this.Array[slot] === undefined) {
            return null;
        }
        return this.Array[slot];
    }
    hasLightSource() {
        return this.Array.some((i) => i.isLightSource() === true);
    }
}
exports.Equipment = Equipment;


/***/ },

/***/ "./src/model/Game.ts"
/*!***************************!*\
  !*** ./src/model/Game.ts ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameModel = void 0;
const GlobalEvents_1 = __webpack_require__(/*! ../GlobalEvents */ "./src/GlobalEvents.ts");
const GameData_1 = __webpack_require__(/*! ./GameData */ "./src/model/GameData.ts");
const Player_1 = __webpack_require__(/*! ./Player */ "./src/model/Player.ts");
const Room_1 = __webpack_require__(/*! ./Room */ "./src/model/Room.ts");
const RoomFactory_1 = __webpack_require__(/*! ../factories/RoomFactory */ "./src/factories/RoomFactory.ts");
const ItemFactory_1 = __webpack_require__(/*! ../factories/ItemFactory */ "./src/factories/ItemFactory.ts");
const CharacterFactory_1 = __webpack_require__(/*! ../factories/CharacterFactory */ "./src/factories/CharacterFactory.ts");
class GameModel {
    constructor() {
        this.Player = new Player_1.Player();
        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];
        this.ItemFactory = new ItemFactory_1.ItemFactory();
        this.CharacterFactory = new CharacterFactory_1.CharacterFactory();
        this.RoomFactory = new RoomFactory_1.RoomFactory();
    }
    loadGame(savedGame) {
        this.Name = savedGame.Name;
        this.StartingRoom = savedGame.StartingRoom;
        for (let roomId in savedGame.Rooms) {
            this.Rooms[roomId] = new Room_1.Room();
            this.Rooms[roomId].loadFromSave(savedGame.Rooms[roomId]);
        }
        this.Player = new Player_1.Player();
        this.Player.loadFromSave(savedGame.Player);
    }
    getName() {
        return this.Name;
    }
    getRoom(roomId) {
        let room = this.Rooms[roomId];
        if (room === undefined) {
            const roomTemplate = GameData_1.GameData.RoomTemplates.getTemplate(roomId);
            room = this.Rooms[roomId] = this.RoomFactory.spawnRoom(roomTemplate);
            this.RoomFactory.loadFromData(room);
        }
        return room;
    }
    spawnItem(itemDefinition) {
        return this.ItemFactory.spawnItem(itemDefinition);
    }
    spawnCharacter(characterId) {
        return this.CharacterFactory.spawnCharacter(characterId);
    }
    getItemType(itemTypeName) {
        return GameData_1.GameData.ItemTypes.getItemType(itemTypeName);
    }
    invokeGlobalEvent(name, args) {
        let event = GlobalEvents_1.GlobalEvents[name];
        if (event === undefined || typeof event !== 'function') {
            throw "Global event with name {0} doesn't exist".format(name);
        }
        return event(args);
    }
}
exports.GameModel = GameModel;


/***/ },

/***/ "./src/model/GameData.ts"
/*!*******************************!*\
  !*** ./src/model/GameData.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameData = void 0;
const CharacterTemplates_1 = __webpack_require__(/*! ./CharacterTemplates */ "./src/model/CharacterTemplates.ts");
const ItemTemplates_1 = __webpack_require__(/*! ./ItemTemplates */ "./src/model/ItemTemplates.ts");
const ItemTypes_1 = __webpack_require__(/*! ./ItemTypes */ "./src/model/ItemTypes.ts");
const RoomTemplates_1 = __webpack_require__(/*! ./RoomTemplates */ "./src/model/RoomTemplates.ts");
class GameDataModel {
    constructor() {
        this.ItemTypes = new ItemTypes_1.ItemTypes(undefined);
        this.ItemTemplates = new ItemTemplates_1.ItemTemplates(undefined);
        this.CharacterTemplates = new CharacterTemplates_1.CharacterTemplates(undefined);
        this.RoomTemplates = new RoomTemplates_1.RoomTemplates(undefined);
    }
}
exports.GameData = new GameDataModel();


/***/ },

/***/ "./src/model/GlobalEventArgs.ts"
/*!**************************************!*\
  !*** ./src/model/GlobalEventArgs.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalEventArgs = void 0;
class GlobalEventArgs {
    constructor(type, sender, terminateCommandCallback, continueCommandCallback) {
        this.Type = type;
        this.Sender = sender;
        this.TerminateCommandCallback = terminateCommandCallback;
        this.ContinueCommandCallback = continueCommandCallback;
    }
}
exports.GlobalEventArgs = GlobalEventArgs;


/***/ },

/***/ "./src/model/Item.ts"
/*!***************************!*\
  !*** ./src/model/Item.ts ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Item = void 0;
const GrammaCase_1 = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
const ItemType_1 = __webpack_require__(/*! ../enums/ItemType */ "./src/enums/ItemType.ts");
const EntityBase_1 = __webpack_require__(/*! ./EntityBase */ "./src/model/EntityBase.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const GameData_1 = __webpack_require__(/*! ./GameData */ "./src/model/GameData.ts");
class Item extends EntityBase_1.EntityBase {
    constructor() {
        super();
    }
    getTemplate() {
        return GameData_1.GameData.ItemTemplates.getTemplate(this.Id);
    }
    getName(grammaCase = GrammaCase_1.GrammaCase.Mianownik) {
        let name = this.getTemplate().Name;
        if (!this.isStackable()) {
            return name[grammaCase] + Engine.DefaultColor;
        }
        else {
            return this.getStack() + ' ' + this.getPluralName(grammaCase) + Engine.DefaultColor;
        }
    }
    getPluralName(grammaCase = GrammaCase_1.GrammaCase.Mianownik) {
        let name = this.getTemplate().Name;
        if (!Array.isArray(name[0])) {
            return name[grammaCase];
        }
        else {
            switch (this.getStack()) {
                case 1:
                    return name[0][grammaCase];
                case 2:
                case 3:
                case 4:
                    return name[1][grammaCase];
                default:
                    return name[2][grammaCase];
            }
        }
    }
    getDescription() {
        return this.getTemplate().Description + Engine.DefaultColor;
    }
    getIdle() {
        if (this.getTemplate().Idle === undefined) {
            return InitGameData_1.Local.Commands.Look.DefaultIdle;
        }
        return this.getTemplate().Idle;
    }
    isLightSource() {
        return this.getTemplate().IsLightSource === true;
    }
    isStackable() {
        if (this.getTemplate().IsStackable === undefined) {
            return false;
        }
        return this.getTemplate().IsStackable;
    }
    getStack() {
        if (this.Stack === undefined) {
            return 1;
        }
        return this.Stack;
    }
    setStack(value) {
        if (this.isStackable()) {
            this.Stack = value;
        }
    }
    addStack(value) {
        if (this.isStackable()) {
            if (this.Stack === undefined) {
                this.Stack = 1;
            }
            this.Stack += value;
        }
    }
    getType() {
        return ItemType_1.ItemTypeHelper.parse(this.getTemplate().Type);
    }
    isTakeable() {
        switch (this.getType()) {
            case ItemType_1.ItemType.Static:
            case ItemType_1.ItemType.StaticContainer:
            case ItemType_1.ItemType.Lever:
                return false;
            default:
                return true;
        }
    }
    getInventory() {
        if (this.Inventory === undefined) {
            return null;
        }
        return this.Inventory;
    }
    isContainer() {
        let type = this.getTemplate().Type;
        return type == ItemType_1.ItemType.Container || type == ItemType_1.ItemType.StaticContainer;
    }
    isLocked() {
        var _a;
        return ((_a = this.Lock) === null || _a === void 0 ? void 0 : _a.IsLocked) === true;
    }
    setIsLocked(value) {
        if (this.Lock !== undefined) {
            this.Lock.IsLocked = value;
        }
    }
}
exports.Item = Item;


/***/ },

/***/ "./src/model/ItemList.ts"
/*!*******************************!*\
  !*** ./src/model/ItemList.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemList = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const EntityList_1 = __webpack_require__(/*! ./EntityList */ "./src/model/EntityList.ts");
const Item_1 = __webpack_require__(/*! ./Item */ "./src/model/Item.ts");
class ItemList extends EntityList_1.EntityList {
    constructor() {
        super();
    }
    loadFromSave(savedList) {
        this.Array = savedList.Array.map((item) => {
            let newItem = new Item_1.Item();
            newItem.loadFromSave(item);
            return newItem;
        });
    }
    add(item) {
        if (item === null) {
            return;
        }
        if (item.isStackable()) {
            let existingStack = InitGameData_1.Game.Player.getInventory().findById(item.Id);
            if (existingStack !== null) {
                existingStack.addStack(item.getStack());
                return;
            }
        }
        super.add(item);
    }
    hasLightSource() {
        return this.Array.some((i) => i.isLightSource() === true);
    }
}
exports.ItemList = ItemList;


/***/ },

/***/ "./src/model/ItemLock.ts"
/*!*******************************!*\
  !*** ./src/model/ItemLock.ts ***!
  \*******************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemLock = void 0;
class ItemLock {
    constructor(template) {
        this.IsLocked = true;
        this.KeyId = '';
        Object.assign(this, template);
    }
}
exports.ItemLock = ItemLock;


/***/ },

/***/ "./src/model/ItemTemplates.ts"
/*!************************************!*\
  !*** ./src/model/ItemTemplates.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTemplates = void 0;
class ItemTemplatesList {
}
class ItemTemplates {
    constructor(itemTemplates) {
        this.list = new ItemTemplatesList();
        if (itemTemplates === undefined) {
            return;
        }
        if (!Array.isArray(itemTemplates)) {
            throw 'Item templates must be an array';
        }
        itemTemplates.forEach((value, index) => {
            this.addNewItemTemplate(value);
        });
    }
    addNewItemTemplate(itemTemplate) {
        if (this.list[itemTemplate.Id] !== undefined) {
            throw 'Item template {0} is already defined!'.format(itemTemplate.Id);
        }
        this.list[itemTemplate.Id] = itemTemplate;
    }
    getTemplate(itemId) {
        if (this.list[itemId] === undefined) {
            throw 'No item template defined for {0}!'.format(itemId);
        }
        return this.list[itemId];
    }
}
exports.ItemTemplates = ItemTemplates;


/***/ },

/***/ "./src/model/ItemTypes.ts"
/*!********************************!*\
  !*** ./src/model/ItemTypes.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypes = void 0;
class ItemTypes {
    constructor(itemTypesTemplate) {
        if (itemTypesTemplate === undefined) {
            return;
        }
        if (!Array.isArray(itemTypesTemplate)) {
            throw 'Item types template must be an array';
        }
        itemTypesTemplate.forEach((value, index) => {
            this.AddNewItemType(value);
        });
    }
    AddNewItemType(itemType) {
        if (this[itemType.Id] !== undefined) {
            throw 'Item type {0} is already defined!'.format(itemType.Id);
        }
        this[itemType.Id] = itemType;
    }
    GetItemType(itemTypeName) {
        if (this[itemTypeName] === undefined) {
            throw 'Item type ' + itemTypeName + ' is not defined!';
        }
        return this[itemTypeName];
    }
}
exports.ItemTypes = ItemTypes;


/***/ },

/***/ "./src/model/Player.ts"
/*!*****************************!*\
  !*** ./src/model/Player.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Character_1 = __webpack_require__(/*! ./Character */ "./src/model/Character.ts");
class Player extends Character_1.Character {
    constructor() {
        super();
        this.Location = 0;
        this.PreviousLocation = 0;
    }
    loadFromSave(savedPlayer) {
        Object.assign(this, savedPlayer);
        super.loadFromSave(savedPlayer);
    }
    getLocation() {
        return this.Location;
    }
    setLocation(value) {
        this.Location = value;
    }
    getPreviousLocation() {
        return this.PreviousLocation;
    }
    setPreviousLocation(value) {
        this.PreviousLocation = value;
    }
    canSee() {
        let room = InitGameData_1.Game.getRoom(this.Location);
        return room.hasLightSource();
    }
}
exports.Player = Player;


/***/ },

/***/ "./src/model/Room.ts"
/*!***************************!*\
  !*** ./src/model/Room.ts ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Room = void 0;
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const CharacterList_1 = __webpack_require__(/*! ./CharacterList */ "./src/model/CharacterList.ts");
const GameData_1 = __webpack_require__(/*! ./GameData */ "./src/model/GameData.ts");
const ItemList_1 = __webpack_require__(/*! ./ItemList */ "./src/model/ItemList.ts");
const RoomExit_1 = __webpack_require__(/*! ./RoomExit */ "./src/model/RoomExit.ts");
const RoomExitsList_1 = __webpack_require__(/*! ./RoomExitsList */ "./src/model/RoomExitsList.ts");
class Room {
    constructor() {
        this.Id = 0;
        this.Exits = new RoomExitsList_1.RoomExitsList();
        this.IsVisited = false;
        this.Items = new ItemList_1.ItemList();
        this.Characters = new CharacterList_1.CharacterList();
    }
    loadFromSave(savedRoom) {
        Object.assign(this, savedRoom);
        this.Exits = new RoomExitsList_1.RoomExitsList();
        for (let exitKey in savedRoom.Exits) {
            this.Exits[exitKey] = new RoomExit_1.RoomExit();
            this.Exits[exitKey].loadFromSave(savedRoom.Exits[exitKey]);
        }
        this.Items = new ItemList_1.ItemList();
        this.Items.loadFromSave(savedRoom.Items);
        this.Characters = new CharacterList_1.CharacterList();
        this.Characters.loadFromSave(savedRoom.Characters);
    }
    getTemplate() {
        return GameData_1.GameData.RoomTemplates.getTemplate(this.Id);
    }
    getName() {
        return this.getTemplate().Name;
    }
    getDescription() {
        return this.getTemplate().Description;
    }
    getItems() {
        return this.Items;
    }
    getCharacters() {
        return this.Characters;
    }
    getExit(direction) {
        if (this.Exits[direction] === undefined) {
            return null;
        }
        return this.Exits[direction];
    }
    getExitToRoom(roomId) {
        for (let direction in this.Exits) {
            if (this.Exits[direction].getRoomId() === roomId) {
                return this.Exits[direction];
            }
        }
        return null;
    }
    getExitsDirections() {
        return Direction_1.DirectionHelper.parseArray(Object.keys(this.Exits));
    }
    hasLightSource() {
        if (this.getTemplate().IsNaturalLight) {
            return true;
        }
        if (this.getItems().hasLightSource()) {
            return true;
        }
        return this.getCharacters().hasLightSource();
    }
    getOnFirstEnterEvent() {
        if (this.getTemplate().OnFirstEnterEvent === undefined) {
            return null;
        }
        return this.getTemplate().OnFirstEnterEvent;
    }
    getOnEnterEvent() {
        if (this.getTemplate().OnEnterEvent === undefined) {
            return null;
        }
        return this.getTemplate().OnEnterEvent;
    }
}
exports.Room = Room;


/***/ },

/***/ "./src/model/RoomDoor.ts"
/*!*******************************!*\
  !*** ./src/model/RoomDoor.ts ***!
  \*******************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomDoor = void 0;
class RoomDoor {
    constructor() { }
    loadFromSave(savedDoor) {
        Object.assign(this, savedDoor);
    }
}
exports.RoomDoor = RoomDoor;


/***/ },

/***/ "./src/model/RoomExit.ts"
/*!*******************************!*\
  !*** ./src/model/RoomExit.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomExit = void 0;
const RoomDoor_1 = __webpack_require__(/*! ./RoomDoor */ "./src/model/RoomDoor.ts");
class RoomExit {
    constructor() {
        this.RoomId = 0;
    }
    loadFromSave(savedExit) {
        Object.assign(this, savedExit);
        if (savedExit.Door !== undefined) {
            this.Door = new RoomDoor_1.RoomDoor();
            this.Door.loadFromSave(savedExit.Door);
        }
    }
    getRoomId() {
        return this.RoomId;
    }
    isDoor() {
        return this.Door !== undefined;
    }
    isClosed() {
        var _a;
        return ((_a = this.Door) === null || _a === void 0 ? void 0 : _a.IsClosed) === true;
    }
    isLocked() {
        var _a;
        return ((_a = this.Door) === null || _a === void 0 ? void 0 : _a.IsLocked) === true;
    }
    isHidden() {
        return this.IsHidden === true;
    }
    getKeyId() {
        var _a;
        if (((_a = this.Door) === null || _a === void 0 ? void 0 : _a.KeyId) === undefined) {
            return null;
        }
        return this.Door.KeyId;
    }
}
exports.RoomExit = RoomExit;


/***/ },

/***/ "./src/model/RoomExitsList.ts"
/*!************************************!*\
  !*** ./src/model/RoomExitsList.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomExitsList = void 0;
class RoomExitsList {
}
exports.RoomExitsList = RoomExitsList;


/***/ },

/***/ "./src/model/RoomTemplates.ts"
/*!************************************!*\
  !*** ./src/model/RoomTemplates.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomTemplates = void 0;
class RoomTemplates {
    constructor(roomTemplates) {
        this.Templates = [];
        if (roomTemplates === undefined) {
            return;
        }
        if (!Array.isArray(roomTemplates)) {
            throw 'Room templates must be an array';
        }
        roomTemplates.forEach((value, index) => {
            this.addNewRoomTemplate(value);
        });
    }
    addNewRoomTemplate(roomTemplate) {
        if (this[roomTemplate.Id] !== undefined) {
            throw 'Room template {0} is already defined!'.format(roomTemplate.Id);
        }
        this[roomTemplate.Id] = roomTemplate;
        this.Templates[roomTemplate.Id] = roomTemplate;
    }
    getTemplate(roomId) {
        if (this[roomId] === undefined) {
            throw 'No Room template defined for Id {0}!'.format(roomId);
        }
        return this[roomId];
    }
}
exports.RoomTemplates = RoomTemplates;


/***/ },

/***/ "./res/Characters.json"
/*!*****************************!*\
  !*** ./res/Characters.json ***!
  \*****************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Character-Schema.json","CharactersTemplates":[{"Id":"cave-rat","Name":["szczur jaskiniowy","szczura jaskiniowego","szczurowi jaskiniowemu","szczura jaskiniowego","szczurem jaskiniowym","szczurze jaskiniowym","szczurze jaskiniowy"],"Description":"Szczury jaskiniowe są nieco większe od szczurów miejskich, są jednak porównywalnie obrzydliwe. Bure, mokre futerko pokrywa prawie jedno łokciowego gryzonia, który skrzętnie przeszukuje otoczenie w poszukiwaniu pożywienia. Odgłos małych pazurków uderzających w kamienną posadzkę towarzyszy każdemu ruchowi szczura.","Idle":"szpera dookoła","Equipment":[{"Slot":"Torso","Item":"rat-skin"}]},{"Id":"test-npc","Name":["testowy NPC","testowego NPC","testowemu NPC","testowego NPC","testowemu NPC","testowego NPC","testowy NPC"],"Description":"To tylko testowy NPC, nie oczekuj epickich opisów. Jedyne czego możesz się spodziewać to sztucznie wydłużone opisy mające na celu sprawdzenie wersalikowania opisów postaci.","Idle":"stoi i zachęca do rozmowy","Inventory":[{"ItemId":"gold","Stack":100},"sapphire-round"]}]}');

/***/ },

/***/ "./res/Game.json"
/*!***********************!*\
  !*** ./res/Game.json ***!
  \***********************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Game-Schema.json","GameTemplate":{"Name":"nazwa gry","StartingRoom":0,"Rooms":[{"Id":0,"Name":"Początek korytarza","Description":"Rozglądając się dookoła dostrzegasz głównie ciemność. Wąski słup światła wpadający z dziury w suficie jest jedynym źródłem światła. Miejsce to wygląda na jakiś stary, podziemny tunel. Przejście za twoimi plecami zostało zasypane gruzem, kamieniami i ziemią, którą teraz porastają chwasty i trawa. Patrząc wprost widzisz morze kamienia ginące w mroku poza światłem. Interesująca wydaje się jedynie dziura w podłodze, umieszczona bezpośrednia pod tą w suficie. Słup światła nurkuje do niej ginąc gdzieś dużo, dużo niżej.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":1}],"Items":["stick-wood",{"ItemId":"gold","Stack":10},{"ItemId":"stick-wood","Chance":100},{"ItemId":["stick-wood","stick-wood-2","gold"],"ChanceList":[33,33,34],"Stack":[1,1,50]}]},{"Id":1,"Name":"Podziemny korytarz","Description":"Korytarz wyłożony jest starymi kamiennymi płytami. Takie same płytki na ścianach, podłodze, suficie, od tego kamienia zaczyna kręcić ci się w głowie. Niektóre z nich powypadały ze swoich miejsc, tworzą teraz warstwę gruzu na podłodze. Większość z tych, które pozostały jest porośnięta mchem. Sztucznie uformowany kamień powoli poddaje się otaczającej go naturze.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":2},{"Direction":"south","RoomId":0}],"Characters":["cave-rat"],"Items":[{"ItemId":"wooden-chest","Inventory":["sapphire-round",{"ItemId":"gold","Stack":{"Min":20,"Max":100}}],"Lock":{"KeyId":"simple-iron-key"}}],"OnFirstEnterEvent":"TestGlobalEvent"},{"Id":2,"Name":"Podziemny korytarz","Description":"Im dalej od źródła światła tym bardziej korytarz pogłębia się ciemności i dostrzegasz coraz mniej. Cienie robią się nadzwyczaj długie, niknące w ciemności znajdującej się przed tobą. Refleksje światła na nieporośniętych mchem płytkach stają się coraz słabsze, natomiast podłoga wydaje się być pokryta dywanem mroku.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":3},{"Direction":"south","RoomId":1}]},{"Id":3,"Name":"Podziemny korytarz","Description":"Patrząc pod światło możesz podziwiać dzieło zniszczenia dokonane przez naturę. Grube korzenie strąciły kamienną kostkę z sufitu i wpełzły do korytarza. Część z nich wbiła się w ścianę, reszta natomiast smętnie wisi w powietrzu. Na podłodze leża potłuczone kawałki kamiennych płytek, które spadając z sufitu roztrzaskały się i porozlatywały na wszystkie strony. Zgromadzona na nich wilgoć odbija drobiny światła dobiegające z oddali, reszta natomiast ginie we wszechogarniającej ciemności.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":4},{"Direction":"south","RoomId":2}],"Items":[{"ItemId":"wooden-chest","Lock":{"KeyId":"simple-iron-key"},"Gold":{"Min":5,"Max":15},"Contains":["map","weak-healing-potion","leather-armor","leather-leggings","leather-shoulder-pads","leather-boots","leather-gloves"]}]},{"Id":4,"Name":"Koniec korytarza","Description":"Koniec korytarza jest kompletnie ciemny. Macając rękami na oślep określasz iż drzwi są przeciętnej wysokości, wykonane z drewna. Klamka jest umieszczona mniej więcej w połowie wysokości drzwi ma zakrzywiony kształt z gałką na końcu. Dotykając jej czujesz wygrawerowane na jej powierzchni zdobienia. Z powodu ciemności nie możesz określić z jakiego metalu jest wykonana.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":5,"Door":{"IsClosed":true}},{"Direction":"south","RoomId":3}],"Characters":["test-npc"]},{"Id":5,"Name":"Wejście do piwniczki","Description":"To niewielkie pomieszczenie wygląda na piwniczkę. Drewniana drabina zamocowana do wschodniej ściany prowadzi do zamkniętej klapy w suficie. Przy przeciwległej ścianie znajduje się podobna klapa prowadząca na dół. Ściany i podłogi pomieszczenia są wykonane z kamiennych cegieł, jednak te są czyste, nieporośnięte mchami. W północnej ścianie znajdują się drzwi prowadzące do dalszych piwniczek. Koło drzwi zamontowana w ścianie jest pochodnia rzucające jasne światło na całe pomieszczenie.","IsNaturalLight":true,"BackgroundMusic":"LVL1","Exits":[{"Direction":"north","RoomId":6,"Door":{"KeyId":"simple-iron-key"}},{"Direction":"south","RoomId":4,"Door":{"IsClosed":true}},{"Direction":"up","RoomId":17,"Door":{"KeyId":"bronze-key-lvl2"}},{"Direction":"down","RoomId":20,"Door":{"KeyId":"bronze-key-lvl2"}}],"Characters":["hooded-figure"]},{"Id":6,"Name":"Wyjście z piwniczki","Description":"Ściany i podłogi piwniczki podobnie jak cała piwnica są wymurowane staranną kamienną kostką. Wnętrza nie oświetla żadna pochodnia a blask bijący od wejście oświetla niewielką część pomieszczenia. Widać iż służyło ono do składowania trunków- całą piwniczkę zajmuje 5 długich, ciągnących się aż po zasięg światła, stojaków do przechowywania wina. W zasięgu wzroku nie dostrzegasz jednak żadnej butelki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":10},{"Direction":"south","RoomId":5,"Door":{"KeyId":"simple-iron-key"}},{"Direction":"east","RoomId":12},{"Direction":"west","RoomId":7}],"Characters":["cave-rat"]},{"Id":7,"Name":"Początek alejki stojaków","Description":"Przed tobą ciągną się dwa długie stojaki na wino. Są one wykonane z podniszczałego już drewna i sięgają od podłogi do sufitu. Stojak po twojej lewej przylega do ściany natomiast ten po prawej stoi niczym ściana działowa. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":8},{"Direction":"east","RoomId":6}]},{"Id":8,"Name":"Alejka pomiędzy stojakami","Description":"Po swojej lewej i prawej masz dwa drewniane stojaki na wino. Są one wykonane z podniszczałego już drewna i sięgają od podłogi do sufitu. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego w pobliżu nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Alejka ciągnie się prosto i ginie w mrokach. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":9},{"Direction":"south","RoomId":7}],"Items":["broken-glass-shards"]},{"Id":9,"Name":"Koniec alejki","Description":"Dotarłeś do końca alejki. Stojak po twojej prawej kończy się pozostawiając przejście do równoległych alejek. Na wprost ciebie kamienna ściana znaczy kraniec piwniczki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":15},{"Direction":"south","RoomId":8},{"Direction":"east","RoomId":11}],"Items":["empty-wine-bottle"],"Characters":["cave-rat"]},{"Id":10,"Name":"Alejka pomiędzy stojakami","Description":"Po swojej lewej i prawej masz dwa drewniane stojaki na wino. Są one wykonane z podniszczałego już drewna i sięgają od podłogi do sufitu. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego w pobliżu nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Alejka ciągnie się prosto i ginie w mrokach. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":11},{"Direction":"south","RoomId":6}],"Items":["broken-glass-shards"],"Characters":["cave-rat"]},{"Id":11,"Name":"Koniec alejki","Description":"Dotarłeś do końca alejki. Stojaki po twoich obu stronach kończą się pozostawiając przejście do równoległych alejek. Na wprost ciebie kamienna ściana znaczy kraniec piwniczki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":10},{"Direction":"east","RoomId":14},{"Direction":"west","RoomId":9}],"Characters":["cave-rat"]},{"Id":12,"Name":"Początek alejki stojaków","Description":"Przed tobą ciągną się dwa długie stojaki na wino. Są one wykonane z podniszczałego już drewna i sięgają od podłogi do sufitu. Stojak po twojej prawej przylega do ściany natomiast ten po lewej stoi niczym ściana działowa. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":13},{"Direction":"west","RoomId":6}],"Items":["broken-glass-shards"]},{"Id":13,"Name":"Alejka pomiędzy stojakami","Description":"Po swojej lewej i prawej masz dwa drewniane stojaki na wino. Są one wykonane z podniszczałego już drewna i sięgają od podłogi do sufitu. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego w pobliżu nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Alejka ciągnie się prosto i ginie w mrokach. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":14},{"Direction":"south","RoomId":12}],"Items":["broken-glass-shards"],"Characters":["cave-rat"]},{"Id":14,"Name":"Koniec alejki","Description":"Dotarłeś do końca alejki. Stojak po twojej lewej kończy się pozostawiając przejście do równoległych alejek. Na wprost ciebie kamienna ściana znaczy kraniec piwniczki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":13},{"Direction":"west","RoomId":11}]},{"Id":15,"Name":"Ukryte przejście","Description":"Ukryte przejście było najwidoczniej od początku zaplanowane- jego ściany są pokryte tą samą staranną kamienną kostką, jedynie bardziej zarośniętą mchem i porostami. Przejście jest wąskie ale wystarczająco wysokie aby można było przejść bez schylania się. Jednak pierwsze co rzuca ci się w oczy to mnogość ludzkich szczątków leżących na podłodze oraz złowieszczy smród śmierci.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":16},{"Direction":"south","RoomId":9}]},{"Id":16,"Name":"Legowisko ogara","Description":"Some description","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":15}],"Characters":["guard-dog"]},{"Id":20,"Name":"Wyjście z jaskiń","Description":"Znajdujesz się w wysokim podziemnym korytarzu, będącym częścią jakiejś jaskini. Podłoże jest nierówne, usłane kamieniami, a z niknącego w mroku sufitu zwisają pojedyncze stalagmity. Pieczara wyglądną na niemal nietkniętą przez człowieka, gdzieniegdzie pod ścianami poustawiano zagradzające przejście kamienie, ale to jedyne oznaki ingerencji w naturalny chaos. Korytarz w tym miejscu bierze ostry zakręt na wschód, jednak panująca ciemność nie pozwala ci dostrzec gdzie biegnie dalej. W zagłębieniu zakrętu stoi oparta o ścianę drabina, oświetlona przez światło dobywające się z góry.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":21},{"Direction":"east","RoomId":22},{"Direction":"up","RoomId":5,"Door":{"KeyId":"bronze-key-lvl2"}}],"OnFirstEnterEvent":"DescentIntoCaves"},{"Id":21,"Name":"Drzwi w jaskini","Description":"W tym miejscu korytarz szybko się zwęża i kurczy, a jedyne przejście prowadzi przez mocarne drewniane drzwi. Portal drzwi zakreśla idealnie owalny kształt i jest starannie wykonany z kamiennych cegiełek. Same drzwi wyglądają raczej prosto ale wytrzymale, ich powierzchnię zajmują wypukłe kwadraty, ale poza nimi nie ma żadnych zdobień. Drzewo nie wygląda staro i jest zapewne w świetnej kondycji. Z prawej strony drzwi znajduje się mosiężny uchwyt do ich otwierania, a poniżej niego duża dziura na klucz. Dookoła drzwi zauważasz mnóstwo grzybów, zajmujących wszystkie wgłębienia w ścianie i podłodze.","IsNaturalLight":true,"BackgroundMusic":"LVL2","Exits":[{"Direction":"north","RoomId":20},{"Direction":"south","RoomId":55,"Door":{"KeyId":"silver-key-lvl3"}}],"OnFirstEnterEvent":"ChasingGoblinInCaves","Characters":["goblin-gatherer"]},{"Id":22,"Name":"Korytarz w jaskini","Description":"Dwie duże skały niemal blokują przejście w tym miejscu, znajduje się jednak pomiędzy nimi wąskie przejście. Lekki wiatr przepływający przez jaskinie kumuluje się w tym miejscu, gwiżdżąc leciutko. Spoglądając przez zwężenie zauważasz iż korytarz znowu skręca, tym razem na północ.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":20},{"Direction":"north","RoomId":23}]},{"Id":23,"Name":"Rozwidlenie korytarza","Description":"Główny korytarz jaskini ciągnie się dalej na północ, jednak na zachodniej ścianie znajduje się dużej wielkości dziura prowadząca do jakiejś odnogi. Ponieważ nie czujesz żadnego wiatru dochodzącego z tamtego kierunku, wnioskujesz iż musi być ona ślepym zaułkiem.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":22},{"Direction":"east","RoomId":24},{"Direction":"north","RoomId":27}]},{"Id":24,"Name":"Korytarz w jaskini","Description":"Odnoga okazuje się być dużą dziurą utworzoną przy pęknięciu skały. Olbrzymią szczelinę w skale przywalił ogromny głaz, służący teraz za sufit. W efekcie powstała wąska ale całkiem wysoka dziura w skale. Jej ściany są proste i niemalże gładkie, miejscami znajdują się tylko bruzdy po przedwiecznym pęknięciu. Dno szczeliny zajęły drobne kamienie i ziemia, tworząc całkiem solidne, choć nierówne podłoże.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":23},{"Direction":"east","RoomId":25}]},{"Id":25,"Name":"Korytarz w jaskini","Description":"Idąc wzdłuż szczeliny zauważasz iż staje się ona coraz szersza, podłoże schodzi lekko w dół i staje się coraz bardziej wilgotne. W pewnym momencie pęknięcie zmienia kierunek, przez co szelina skręca na południe.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":24},{"Direction":"south","RoomId":26}],"Characters":["goblin-gatherer"]},{"Id":26,"Name":"Wilgotny zakątek","Description":"W tym miejscu widać koniec głazu będącego sufitem szczeliny- większe i mniejsze skały zasypały jej dalszą część a wraz z czasem uformowały niemalże litą ścianę. Utworzone w ten sposób pomieszczenie ma całkiem duże rozmiary, choć podłoga jest nierówna a w jej najgłębszym miejscu stoi spora kałuża wody. Wokół niej rośnie sporo mchu, a na nim nieznane ci gatunki grzybów.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":25}],"Items":["dog-rose"]},{"Id":27,"Name":"Korytarz w jaskini","Description":"Leżący na podłożu głaz utworzył w tym miejscu wysoki stopień. Wspinając się na niego dostrzegasz iż niewiele dalej korytarz skręca na zachód po czym ginie w mroku.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":23},{"Direction":"west","RoomId":28}]},{"Id":28,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":27},{"Direction":"west","RoomId":29}]},{"Id":29,"Name":"Rozwidlenie korytarza","Description":"W tym miejscu korytarz skręca w prawo, a w raz z nim strumień świeżego powietrza. Po lewej zauważasz jednak niedużą dziurę prowadzącą ku ciemności.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":28},{"Direction":"south","RoomId":30},{"Direction":"north","RoomId":31}],"Characters":["goblin-gatherer"]},{"Id":30,"Name":"Wilgotny zakątek","Description":"Pomieszczenie to wygląda nienaturalnie w porównaniu z całą resztą jaskini. Ściany są idealnie gładkie, proste i pozbawione nierówności. Tworzą one rodzaj pokoju wyrzeźbionego w skale, jednak nie znasz narzędzi które mogły by zrobić tak dokładnie. Podłoga jest mokra i pokryta gęstym mchem oraz grzybami. Ze sklepienia ciągle kapie woda, przez co czuć wyjątkową wilgoć.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":29}],"Items":["dog-rose"]},{"Id":31,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":29},{"Direction":"north","RoomId":32}]},{"Id":32,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":33},{"Direction":"south","RoomId":31}]},{"Id":33,"Name":"Wejście na cmentarz","Description":"Korytarz brnie nadal na przód, jednak po lewej stronie zauważasz sporej wielkości dziurę. Przyglądając się niej widzisz iż prowadzi ona do całkiem sporego pomieszczenia, znajdującego się tuż obok głównego korytarza.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":32},{"Direction":"west","RoomId":34},{"Direction":"north","RoomId":38}]},{"Id":34,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":33},{"Direction":"west","RoomId":35},{"Direction":"south","RoomId":37}]},{"Id":35,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":34},{"Direction":"south","RoomId":36}],"Characters":["goblin-gatherer"]},{"Id":36,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":35},{"Direction":"east","RoomId":37}],"Items":["rusted-helmet"]},{"Id":37,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":36},{"Direction":"north","RoomId":34}],"Items":["short-bronze-sword","bronze-sword","bronze-axe","bronze-war-hammer"]},{"Id":38,"Name":"Rozwidlenie korytarza","Description":"W tym miejscu korytarz ponownie się rozwidla, jego główna część wiedzie dalej na przód, wraz ze strumieniem czystego powietrza. Odnoga znajdująca się po prawej jest niemal tak duża jak główny korytarz i dochodzą z niej bliżej nie określone dźwięki.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":33},{"Direction":"north","RoomId":39},{"Direction":"east","RoomId":41}]},{"Id":39,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":38},{"Direction":"north","RoomId":40}],"Characters":["goblin-gatherer"]},{"Id":40,"Name":"Gruzowisko","Description":"Korytarz nagle kończy się zawaliskiem kamieni i skał. Dwa największe głazy przysypane masą mniejszych, tworzą ścianę nie do pokonania. Przyglądając się ścianom jaskini zauważasz dookoła liczne pęknięcia i szpary, zupełnie jakby sklepienie zawaliło się w tym miejscu. Nic nie wskazuje co było przyczyną zawalenia.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":39}]},{"Id":41,"Name":"Korytarz w jaskini","Description":"Ta odnoga jest tylko trochę mniejsza od głównego korytarza, jego wygląd jest jednak bardzo podobny. Ściany są chropowate i nierówne, podobnie jak podłoga, na której jednak zalega cienka warstwa ziemi i drobnych kamieni. Bez strumienia wiatru powietrze wydaje się duszne, oraz cieplejsze. Patrząc na przód widzisz iż korytarz jest kręty i często zmienia swój kierunek. Wydaje ci się, że dostrzegłeś błysk światła oraz jakieś odgłosy, dobywające się gdzieś zza zakrętu.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":38},{"Direction":"east","RoomId":42}]},{"Id":42,"Name":"Stróżówka goblinów","Description":"Ten kawałek korytarza został zajęty przez gobliny- małe i zajadłe jaskiniowe stworzenia. Wykorzystały one kręty korytarz do zorganizowania zasadzki na wszelkich zbliżających się intruzów Rozglądając się dookoła zauważasz dużo śladów ich dłuższej obecności- dogasające ognisko, pojemniki z wodą, oraz kupy szmat, które mogły służyć za posłanie.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":41},{"Direction":"south","RoomId":43}],"Characters":["goblin-guard"]},{"Id":43,"Name":"Stróżówka goblinów","Description":"Room 43.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":42},{"Direction":"east","RoomId":44}],"Characters":["goblin-guard"]},{"Id":44,"Name":"Stróżówka goblinów","Description":"Room 44.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":43},{"Direction":"south","RoomId":45}],"Characters":["goblin-guard"]},{"Id":45,"Name":"Wejście do jaskiń goblinów","Description":"Room 45.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":44},{"Direction":"east","RoomId":46}],"Characters":["goblin-shaman","goblin-berserker"]},{"Id":46,"Name":"Jaskinia goblinów","Description":"Room 46.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":45},{"Direction":"east","RoomId":47}],"Characters":["goblin-guard"]},{"Id":47,"Name":"Jaskinia goblinów","Description":"Room 47.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":46},{"Direction":"south","RoomId":48},{"Direction":"east","RoomId":50},{"Direction":"north","RoomId":52}],"Characters":["goblin-berserker"]},{"Id":48,"Name":"Wejście do skarbca goblinów","Description":"Room 48.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":47},{"Direction":"south","RoomId":49}],"Characters":["goblin-guard","goblin-guard"]},{"Id":49,"Name":"Skarbiec goblinów","Description":"Room 49.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":48}],"Event":"BlockedByGoblinGuards"},{"Id":50,"Name":"Wejście do namiotu szamana","Description":"Room 50.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":47},{"Direction":"east","RoomId":51}],"Characters":["goblin-berserker"]},{"Id":51,"Name":"Namiot szamana goblinów","Description":"Room 51.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":50}]},{"Id":52,"Name":"Jaskinia goblinów","Description":"Room 52.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":47},{"Direction":"east","RoomId":53}]},{"Id":53,"Name":"Wejście do pomieszczenia ze strumykiem","Description":"Room 54.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":52},{"Direction":"east","RoomId":54}],"Characters":["goblin-guard","goblin-guard"]},{"Id":54,"Name":"Pomieszczenie ze strumykiem","Description":"Room 54.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":53}],"Event":"BlockedByGoblinGuards"},{"Id":55,"Name":"Zamknięta część jaskini","Description":"Room 55.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":21,"Door":{"KeyId":"silver-key-lvl3"}},{"Direction":"south","RoomId":56}],"OnFirstEnterEvent":"PassingThroughDemonDoor"},{"Id":56,"Name":"Room 56","Description":"Room 56.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":55},{"Direction":"east","RoomId":57}]},{"Id":57,"Name":"Room 57","Description":"Room 57.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":56},{"Direction":"north","RoomId":58}]},{"Id":58,"Name":"Room 58","Description":"Room 58.","IsNaturalLight":true,"Exits":[{"Direction":"down","RoomId":65}]}]}}');

/***/ },

/***/ "./res/ItemTypes.json"
/*!****************************!*\
  !*** ./res/ItemTypes.json ***!
  \****************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/ItemType-Schema.json","ItemTypes":[{"Id":"Weapon1H","Slot":"MainHand","Name":["broń jednoręczna","broni jednoręcznej","broni jednoręcznej","broń jednoręczną","bronią jednoręczną","broni jednoręcznej","broni jednoręczna"]},{"Id":"Weapon2H","Slot":"MainHand","Name":["broń dwuręczna","broni dwuręcznej","broni dwuręcznej","broń dwuręczną","bronią dwuręczną","broni dwuręcznej","broni dwuręczna"]},{"Id":"Shield","Slot":"OffHand","Name":["tarcza","tarczy","tarczy","tarczę","tarczą","tarczy","tarczo"]},{"Id":"Armor","Slot":"Torso","Name":["pancerz","pancerza","pancerzowi","pancerz","pancerzem","pancerzu","pancerzu"]},{"Id":"Shoulders","Slot":"Arms","Name":["naramienniki","naramienników","naramiennikom","naramienniki","naramiennikami","naramiennikach","naramienniki"]},{"Id":"Gloves","Slot":"Hands","Name":["rękawice","rękawic","rękawicom","rękawice","rękawicami","rękawicach","rękawice"]},{"Id":"Greaves","Slot":"Legs","Name":["nagolenniki","nagolenników","nagolennikom","nagolenniki","nagolennikami","nagolennikach","nagolenniki"]},{"Id":"Boots","Slot":"Legs","Name":["buty","butów","butom","buty","butami","butach","buty"]}]}');

/***/ },

/***/ "./res/Items.json"
/*!************************!*\
  !*** ./res/Items.json ***!
  \************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Item-Schema.json","ItemsTemplates":[{"Id":"gold","Name":[["|Yzłota moneta","|Yzłotej monety","|Yzłotej monecie","|Yzłotą monetę","|Yzłotą monetą","|Yzłotej monecie","|Yzłota moneto"],["|Yzłote monety","|Yzłotych monet","|Yzłotym monetom","|Yzłote monety","|Yzłotymi monetami","|Yzłotych monetach","|Yzłote monety"],["|Yzłotych monet","|Yzłotych monet","|Yzłotym monetom","|Yzłotych monet","|Yzłotymi monetami","|Yzłotych monetach","|Yzłotych monet"]],"Description":"|YZłoto, złoto, złoto, złoto.","Type":"Currency","IsStackable":true},{"Id":"stick-wood","Name":["drewniany drąg","drewnianego drąga","drewnianemu drągowi","drewniany drąg","drewnianym drągiem","drewnianym drągu","drewniany drągu"],"Idle":"leży u twoich stóp","Description":"Ten kawał kija wygląda na oderwaną i wyschniętą gałęź jakiegoś drzewa. Nie jest on całkiem prosty, zawiera kilka sęków i nieregularności ale jest długi na kilka łokci i może całkiem sprawnie posłużyć jako improwizowana broń.","Type":"Weapon1H"},{"Id":"stick-wood-2","Name":["inny drewniany drąg","innego drewnianego drąga","innemu drewnianemu drągowi","inny drewniany drąg","innym drewnianym drągiem","innym drewnianym drągu","inny drewniany drągu"],"Idle":"leży u twoich stóp","Description":"Ten kawał kija wygląda na oderwaną i wyschniętą gałęź jakiegoś drzewa. Nie jest on całkiem prosty, zawiera kilka sęków i nieregularności ale jest długi na kilka łokci i może całkiem sprawnie posłużyć jako improwizowana broń.","Type":"Weapon1H"},{"Id":"rat-skin","Name":["szczurza skóra","szczurzej skóry","szczurzej skórze","szczurzą skórę","szczurzą skórą","szczurzej skórze","szczurza skóro"],"Description":"Skóra zdarta z jaskiniowego szczura.","Type":"WildArmor"},{"Id":"wooden-chest","Name":["drewniana skrzynia","drewnianej skrzyni","drewnianej skrzyni","drewnianą skrzynię","drewnianą skrzynią","drewnianej skrzyni","drewniana skrzynio"],"Description":"Solidna, dębowa skrzynia została wykonana z grubych, ręcznie ciosanych desek. Jej konstrukcję wzmacniają kute, żelazne okucia o surowym charakterze, chroniące narożniki przed uszkodzeniami. Na środku widnieje ciężki, stalowy rygiel z miejscem na masywną kłódkę, strzegącą zawartości przed niepowołanymi rękami. Drewno jest ciemne i wygładzone przez dekady użytkowania, a brak zdobień sugeruje jej użytkowy charakter.","Type":"StaticContainer","Idle":"stoi pod ścianą"},{"Id":"sapphire-round","Name":["okrągły szafir","okrągłego szafiru","okrągłemu szafirowi","okrągły szafir","okrągłym szafirem","okrągłym szafirze","okrągły szafirze"],"Description":"Szafir jest kamieniem szlachetnym o barwie ciemno niebieskiej. Zazwyczaj klejnoty szlifowane są w sześcienne lub inne kanciaste kształty, ten jednak jest uformowany w kształt kuli. Przyglądając się bliżej nie zauważasz żadnych śladów szlifowania, zachwyca cię również niezwykła perfekcja kuli.","Type":"Quest"},{"Id":"simple-iron-key","Name":["prosty klucz z żelaza","prostego klucza z żelaza","prostemu kluczowi z żelaza","prosty klucz z żelaza","prostym kluczem z żelaza","prostym kluczu z żelaza","prosty kluczu z żelaza"],"Description":"Ten prosty, żelazny klucz charakteryzuje się surową formą i śladami ręcznego kucia, które wskazują na jego użytkowy a nie ozdobny charakter. Jego długa, cylindryczna łodyga kończy się prostokątnym piórem z kilkoma precyzyjnymi nacięciami, dopasowanymi do mechanizmu zamka. Zwieńczenie stanowi koliste ucho, pozwalające na wygodne trzymanie narzędzia lub zawieszenie go na rzemieniu przy pasie.","Type":"Key"}]}');

/***/ },

/***/ "./res/Local.pl.json"
/*!***************************!*\
  !*** ./res/Local.pl.json ***!
  \***************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"Local":{"Directions":{"north":["północ","północy","północy","północ","północą","północy","północy"],"south":["południe","południa","południu","południe","południem","południu","południu"],"east":["wschód","wschodu","wschodowi","wschód","wschodem","wschodzie","wschodzie"],"west":["zachód","zachodu","zachodowi","zachód","zachodem","zachodzie","zachodzie"],"up":["góra","góry","górze","górę","górą","górze","góro"],"down":["dół","dołu","dołowi","dół","dołem","dole","dole"]},"Stats":{"HealthLevels":{"Full":"w pełni zdrowia","LightWounds":"lekko ranny","MediumWounds":"średnio rany","SeriousWounds":"poważnie ranny","HeavyWounds":"ciężko ranny","NearDeath":"bliski śmierci","Dead":"martwy"}},"Commands":{"Drop":{"NoArgument":"Co chcesz wyrzucić?","NoItems":"Przecież nic nie masz biedaku.","NoItemFound":"Nie masz czegoś takiego jak {0}.","Dropped":"Upuszczasz {0}."},"Exam":{"NoArgument":"Czemu chcesz się przyjęć?","NoObject":"Nie znajdujesz niczego takiego jak {0}.","Contains":"Zawiera w sobie:","LockedContainer":"Pojemnik jest zamknięty.","HealthLevel":"{0} jest {1}."},"Go":{"WrongDirection":"Może lepiej zostać tutaj i zjeść kilka pierogów?","NoPassage":"Nie możesz tam pójść.","PassageClosed":"Przejście jest zamknięte."},"Inventory":{"YourItems":"Obecnie przy sobie posiadasz:","NoItems":"{0}Ogólnie nic"},"Load":{"Loading":"Ładowanie gry...","Loaded":"Gra została załadowana."},"Look":{"CantSee":"Nic nie widzisz w tej ciemności.","NoObject":"Tu nie ma nic takiego jak {0}.","YouLookAt":"Przyglądasz się {0}.","Exits":"Wyjścia","DefaultIdle":"leży na ziemi"},"NoCommand":{"NoCommand":"Chyba ty."},"Open":{"NoDirection":"Otworzyć drzwi w którym kierunku?","WrongDirection":"{0} nie jest kierunkiem.","NoDoor":"Tam nie ma drzwi.","AlreadyOpen":"Drzwi są już otwarte.","Locked":"Drzwi są zamknięte na klucz.","Opened":"Otwierasz drzwi."},"Save":{"Saved":"Gra została zapisana."},"Scan":{"CantSee":"Nic nie widzisz w tej ciemności.","LookingAroundYouSee":"Rozglądając się dookoła dostrzegasz:","Here":"Tutaj:","InDirection":"Na {0}:","NoOneThere":"nikogo nie ma","ClosedDoor":"zamknięte drzwi"},"Take":{"NoArgument":"Wziąć co?","NoItems":"Nic tu nie ma.","NoItemFound":"Tutaj nie ma czegoś takiego jak {0}.","NoItemFoundInContainer":"{0} nie zawiera czegoś takiego jak {1}.","CannotPickUp":"Nie możesz podnieść {0}.","PickedUp":"Podnosisz {0}.","ContainerIsLocked":"{0} jest zamknięty.","IsNoContainer":"{0} nie jest pojemnikiem.","TakeItemFromContainer":"Wyjmujesz {0} z {1}."}},"GlobalEvents":{"TestGlobalEvent":{"Message":"Testing global events..."}}}}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/Init.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const CommandCallback_1 = __webpack_require__(/*! ./commandsUtils/CommandCallback */ "./src/commandsUtils/CommandCallback.ts");
const CommandsManager_1 = __webpack_require__(/*! ./commandsUtils/CommandsManager */ "./src/commandsUtils/CommandsManager.ts");
const Prompt_1 = __webpack_require__(/*! ./commonLogic/Prompt */ "./src/commonLogic/Prompt.ts");
const RegisterCommands_1 = __webpack_require__(/*! ./commandsUtils/RegisterCommands */ "./src/commandsUtils/RegisterCommands.ts");
const InitGameData_1 = __webpack_require__(/*! ./InitGameData */ "./src/InitGameData.ts");
__webpack_require__(/*! ./commonLogic/InputFunctions */ "./src/commonLogic/InputFunctions.ts");
__webpack_require__(/*! ./commonLogic/StringUtils */ "./src/commonLogic/StringUtils.ts");
function Init() {
    (0, InitGameData_1.InitGameData)();
    (0, RegisterCommands_1.InitCommands)();
    Engine.Output('Dungeon Crawler 2, wersja:');
    Engine.Output(InitGameData_1.Version);
    CommandsManager_1.Commands.Go.changePlayerLocation(InitGameData_1.Game.getRoom(InitGameData_1.Game.StartingRoom), new CommandCallback_1.CommandCallback(() => {
        Engine.Output('');
        Prompt_1.Prompt.Print();
    }));
}
globalThis.Init = Init;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RTdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLE9BQUUsRUFBRSxDQUFDLENBQUM7SUFFekMsMEJBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLElBQUkscUJBQVMsRUFBRSxDQUFDLENBQUM7SUFFdkQsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztJQUU3QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFFN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksYUFBSyxFQUFFLENBQUMsQ0FBQztJQUUvQywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxJQUFJLGVBQU0sRUFBRSxDQUFDLENBQUM7SUFFakQsMEJBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksYUFBSyxFQUFFLENBQUMsQ0FBQztJQUMvQywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFFN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztJQUM3QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLE9BQUUsRUFBRSxDQUFDLENBQUM7SUFFekMsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxF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QUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsc0JBQU8sQ0FBQyxDQUFDO0lBQ3ZCLDBCQUFRLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUM1QixtQkFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBSSxDQUFDLFlBQVksQ0FBQyxFQUMvQixJQUFJLGlDQUFlLENBQUMsR0FBRyxFQUFFO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsZUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUNMLENBQUM7QUFDTixDQUFDO0FBS0QsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvR2xvYmFsRXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9Jbml0R2FtZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0NvbW1hbmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0Rvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0Ryb3AudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0Vhc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0V2YWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0V4YW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0dvLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9JbnZlbnRvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0pzb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0xvYWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0xvb2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL05vQ29tbWFuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTm9ydGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL09wZW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1JlbG9hZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvU2F2ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvU2Nhbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvU291dGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1Rha2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1VwLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9XZXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0NvbW1hbmRUcmVlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHNVdGlscy9SZWdpc3RlckNvbW1hbmRzLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9FbmdpbmVVdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvSW5wdXRGdW5jdGlvbnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL1Byb21wdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvUmFuZG9tLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9TdHJpbmdVdGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRGlyZWN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9FbnVtSGVscGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9FcXVpcG1lbnRTbG90LnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9HbG9iYWxFdmVudFR5cGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0dyYW1tYUNhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0l0ZW1UeXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9mYWN0b3JpZXMvQ2hhcmFjdGVyRmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL0l0ZW1GYWN0b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9mYWN0b3JpZXMvUm9vbUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3Rlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvQ2hhcmFjdGVyTGlzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvQ2hhcmFjdGVyU3RhdHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3RlclRlbXBsYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvRW50aXR5QmFzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvRW50aXR5TGlzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvRXF1aXBtZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9HYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9HYW1lRGF0YS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2xvYmFsRXZlbnRBcmdzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtTGlzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbUxvY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW1UZW1wbGF0ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW1UeXBlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUGxheWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tRG9vci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbUV4aXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1Jvb21FeGl0c0xpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1Jvb21UZW1wbGF0ZXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9Jbml0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVuZ2luZVV0aWxzIH0gZnJvbSAnLi9jb21tb25Mb2dpYy9FbmdpbmVVdGlscyc7XHJcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudEFyZ3MgfSBmcm9tICcuL21vZGVsL0dsb2JhbEV2ZW50QXJncyc7XHJcblxyXG5jbGFzcyBHbG9iYWxFdmVudHNDbGFzcyB7XHJcbiAgICAvLyBJZiBnbG9iYWwgZXZlbnRzIHJldHVybnMgdHJ1ZSwgaXQgc2lnbmFscyBpbnRlcnJ1cHRpb24gb2YgY29tbWFuZCBleGVjdXRpb24gZmxvd1xyXG4gICAgLy8gc3VjaCBldmVudCBtdXN0IGNhbGwgb25lIG9mIHRoZSBzdXBwbGllZCBjYWxsYmFja3M6XHJcbiAgICAvLyAtIGFyZ3MuQ29udGludWVDb21tYW5kQ2FsbGJhY2sgaWYgdGhlIGV2ZW50IGRlY2lkZXMgaXQgd2FudCB0byByZXN1bWUgdGhlIGV4ZWN1dGlvbiBcclxuICAgIC8vICAgICAgb2YgdGhlIGNvbW1hbmQgaXQgd2FzIGludm9rZWQgYnlcclxuICAgIC8vIC0gYXJncy5GaW5pc2hDb21tYW5kQ2FsbGJhY2sgaWYgdGhlIGV2ZW50IGRlY2lkZXMgdG8gdGVybWluYXRlIHRoZSBleGVjdXRpb24gXHJcbiAgICAvLyAgICAgIG9mIHRoZSBjb21tYW5kIGl0IHdhcyBpbnZva2VkIGJ5XHJcbiAgICBbZ2xvYmFsRXZlbnROYW1lOiBzdHJpbmddOiAoYXJnczogR2xvYmFsRXZlbnRBcmdzKSA9PiBib29sZWFuO1xyXG4gICAgVGVzdEdsb2JhbEV2ZW50KGFyZ3M6IEdsb2JhbEV2ZW50QXJncykge1xyXG4gICAgICAgIEVuZ2luZVV0aWxzLk91dHB1dFByaW50ZXIoTG9jYWwuR2xvYmFsRXZlbnRzLlRlc3RHbG9iYWxFdmVudC5NZXNzYWdlLCBhcmdzLkNvbnRpbnVlQ29tbWFuZENhbGxiYWNrKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBHbG9iYWxFdmVudHMgPSBuZXcgR2xvYmFsRXZlbnRzQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgSXRlbVR5cGVzIH0gZnJvbSAnLi4vcmVzL0l0ZW1UeXBlcy5qc29uJztcclxuaW1wb3J0IHsgSXRlbXNUZW1wbGF0ZXMgfSBmcm9tICcuLi9yZXMvSXRlbXMuanNvbic7XHJcbmltcG9ydCB7IENoYXJhY3RlcnNUZW1wbGF0ZXMgfSBmcm9tICcuLi9yZXMvQ2hhcmFjdGVycy5qc29uJztcclxuaW1wb3J0IHsgTG9jYWwgYXMgTG9jYWxQbCB9IGZyb20gJy4uL3Jlcy9Mb2NhbC5wbC5qc29uJztcclxuaW1wb3J0IHsgR2FtZVRlbXBsYXRlIH0gZnJvbSAnLi4vcmVzL0dhbWUuanNvbic7XHJcbmltcG9ydCB7IEdhbWVNb2RlbCB9IGZyb20gJy4vbW9kZWwvR2FtZSc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlcyBhcyBJdGVtVHlwZXNMaXN0IH0gZnJvbSAnLi9tb2RlbC9JdGVtVHlwZXMnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZXMgfSBmcm9tICcuL21vZGVsL0NoYXJhY3RlclRlbXBsYXRlcyc7XHJcbmltcG9ydCB7IEl0ZW1UZW1wbGF0ZXMgfSBmcm9tICcuL21vZGVsL0l0ZW1UZW1wbGF0ZXMnO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vbW9kZWwvR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9Sb29tVGVtcGxhdGVzJztcclxuXHJcbmV4cG9ydCB2YXIgTG9jYWwgPSBMb2NhbFBsO1xyXG5leHBvcnQgdmFyIEdhbWU6IEdhbWVNb2RlbCA9IG5ldyBHYW1lTW9kZWwoKTtcclxuZXhwb3J0IHZhciBWZXJzaW9uID0gJyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSW5pdEdhbWVEYXRhKCkge1xyXG4gICAgR2FtZSA9IG5ldyBHYW1lTW9kZWwoKTtcclxuICAgIEdhbWVEYXRhLkl0ZW1UeXBlcyA9IG5ldyBJdGVtVHlwZXNMaXN0KEl0ZW1UeXBlcyk7XHJcbiAgICBHYW1lRGF0YS5JdGVtVGVtcGxhdGVzID0gbmV3IEl0ZW1UZW1wbGF0ZXMoSXRlbXNUZW1wbGF0ZXMpO1xyXG4gICAgR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzID0gbmV3IENoYXJhY3RlclRlbXBsYXRlcyhDaGFyYWN0ZXJzVGVtcGxhdGVzKTtcclxuICAgIEdhbWVEYXRhLlJvb21UZW1wbGF0ZXMgPSBuZXcgUm9vbVRlbXBsYXRlcyhHYW1lVGVtcGxhdGUuUm9vbXMpO1xyXG4gICAgVmVyc2lvbiA9IEVuZ2luZS5Mb2FkRGF0YSgndmVyc2lvbi50eHQnKS5yZXBsYWNlKCdcXG4nLCBFbmdpbmUuRW5kTGluZSk7XHJcblxyXG4gICAgR2FtZS5QbGF5ZXIuTG9jYXRpb24gPSBHYW1lLlN0YXJ0aW5nUm9vbTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIExvYWRHYW1lKHNhdmVkR2FtZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBnYW1lID0gSlNPTi5wYXJzZShzYXZlZEdhbWUpIGFzIEdhbWVNb2RlbDtcclxuICAgIEdhbWUgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbiAgICBHYW1lLmxvYWRHYW1lKGdhbWUpO1xyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tbWFuZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgRXhlY3V0ZShjb21tYW5kOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuRXhlY3V0ZUJvZHkoY29tbWFuZCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgICAgICBpZiAoIWNvbW1hbmRDYWxsYmFjay5pbnRlcnJ1cHRGbG93KSB7XHJcbiAgICAgICAgICAgIGNvbW1hbmRDYWxsYmFjay5DYWxsSWZOb3RDYWxsZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhYnN0cmFjdCBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjayk6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERvd24gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF9jb21tYW5kOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLmRvd24sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERyb3AgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkRyb3AuTm9Bcmd1bWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudC50b0xvd2VyQ2FzZSgpID09PSAnYWxsJykge1xyXG4gICAgICAgICAgICBpZiAoIUdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFueSgpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkRyb3AuTm9JdGVtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZHJvcEFsbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZmluZChhcmd1bWVudCwgY29tbWFuZC5nZXROdW1iZXIoMSkpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLk5vSXRlbUZvdW5kLmZvcm1hdChhcmd1bWVudCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRyb3BJdGVtKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcm9wQWxsKCkge1xyXG4gICAgICAgIHdoaWxlIChHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRyb3BJdGVtKEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmVsZW1lbnRBdCgwKSEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcm9wSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkucmVtb3ZlKGl0ZW0pO1xyXG4gICAgICAgIEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKS5hZGQoaXRlbSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLkRyb3BwZWQuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkJpZXJuaWspKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVhc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24uZWFzdCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCB7IEdhbWUgYXMgR2FtZVZhciB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZhbCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGdhbWUgPSBHYW1lVmFyO1xyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KGV2YWwoYXJndW1lbnQpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCB7IFRha2UgfSBmcm9tICcuL1Rha2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4YW0gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbik7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBsZXQgbnVtYmVyID0gY29tbWFuZC5nZXROdW1iZXIoMSk7XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkV4YW0uTm9Bcmd1bWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjaGFyYWN0ZXIgPSByb29tLmdldENoYXJhY3RlcnMoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChjaGFyYWN0ZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5leGFtQ2hhcmFjdGVyKGNoYXJhY3Rlcik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4YW1JdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gcm9vbS5nZXRJdGVtcygpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5leGFtSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLk5vT2JqZWN0LmZvcm1hdChhcmd1bWVudCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4YW1DaGFyYWN0ZXIoY2hhcmFjdGVyOiBDaGFyYWN0ZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suWW91TG9va0F0LmZvcm1hdChjaGFyYWN0ZXIuZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoY2hhcmFjdGVyLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLkV4YW0uSGVhbHRoTGV2ZWwuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpLFxyXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyLmdldEhlYWx0aExldmVsKHRydWUpLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy9UT0RPOiBla3dpcHVuZWtcclxuICAgIH1cclxuICAgIGV4YW1JdGVtKGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suWW91TG9va0F0LmZvcm1hdChpdGVtLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KGl0ZW0uZ2V0RGVzY3JpcHRpb24oKSk7XHJcbiAgICAgICAgaWYgKGl0ZW0uaXNDb250YWluZXIoKSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5pc0xvY2tlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkV4YW0uTG9ja2VkQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkV4YW0uQ29udGFpbnMpO1xyXG4gICAgICAgICAgICBsZXQgaXRlbXMgPSBpdGVtLmdldEludmVudG9yeSgpITtcclxuICAgICAgICAgICAgaWYgKGl0ZW1zLmFueSgpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KGl0ZW1zLnByaW50U2hvcnRGb3JtYXQoKSk7XHJcbiAgICAgICAgICAgICAgICBDb21tYW5kcy5UYWtlLnRha2VBbGxHb2xkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5JbnZlbnRvcnkuTm9JdGVtcy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50VHlwZSB9IGZyb20gJy4uL2VudW1zL0dsb2JhbEV2ZW50VHlwZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2xvYmFsRXZlbnRBcmdzIH0gZnJvbSAnLi4vbW9kZWwvR2xvYmFsRXZlbnRBcmdzJztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL21vZGVsL1Jvb20nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHbyBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gbnVsbDtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBEaXJlY3Rpb25IZWxwZXIucGFyc2VTaG9ydChhcmd1bWVudC50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkdvLldyb25nRGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nb1RvRGlyZWN0aW9uKGRpcmVjdGlvbiwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBnb1RvRGlyZWN0aW9uKGRpcmVjdGlvbjogYW55LCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBleGl0ID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLmdldExvY2F0aW9uKCkpLmdldEV4aXQoZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKGV4aXQgPT09IG51bGwgfHwgZXhpdC5pc0hpZGRlbigpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuR28uTm9QYXNzYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4aXQuaXNDbG9zZWQoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkdvLlBhc3NhZ2VDbG9zZWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmV3Um9vbSA9IEdhbWUuZ2V0Um9vbShleGl0LmdldFJvb21JZCgpKTtcclxuICAgICAgICBHYW1lLlBsYXllci5zZXRQcmV2aW91c0xvY2F0aW9uKEdhbWUuUGxheWVyLmdldExvY2F0aW9uKCkpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlUGxheWVyTG9jYXRpb24obmV3Um9vbSwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQbGF5ZXJMb2NhdGlvbihyb29tOiBSb29tLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIEdhbWUuUGxheWVyLkxvY2F0aW9uID0gcm9vbS5JZDtcclxuXHJcbiAgICAgICAgdGhpcy5vbkZpcnN0RW50ZXJHbG9iYWxFdmVudHMoXHJcbiAgICAgICAgICAgIHJvb20sXHJcbiAgICAgICAgICAgICgpID0+IHRoaXMuYWZ0ZXJPbkZpcnN0RW50ZXJHbG9iYWxFdmVudHMocm9vbSwgY29tbWFuZENhbGxiYWNrKSxcclxuICAgICAgICAgICAgY29tbWFuZENhbGxiYWNrLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcm9vbS5Jc1Zpc2l0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRmlyc3RFbnRlckdsb2JhbEV2ZW50cyhyb29tOiBSb29tLCBjb250aW51ZUNhbGxiYWNrOiBGdW5jdGlvbiwgdGVybWluYXRlQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChyb29tLmdldE9uRmlyc3RFbnRlckV2ZW50KCkgIT09IG51bGwgJiYgIXJvb20uSXNWaXNpdGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnJ1cHQgPSBHYW1lLmludm9rZUdsb2JhbEV2ZW50KFxyXG4gICAgICAgICAgICAgICAgcm9vbS5nZXRPbkZpcnN0RW50ZXJFdmVudCgpISxcclxuICAgICAgICAgICAgICAgIG5ldyBHbG9iYWxFdmVudEFyZ3MoR2xvYmFsRXZlbnRUeXBlLkJlZm9yZVJvb21FbnRlciwgcm9vbSwgdGVybWluYXRlQ2FsbGJhY2ssIGNvbnRpbnVlQ2FsbGJhY2spLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJydXB0KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXJtaW5hdGVDYWxsYmFjay5pbnRlcnJ1cHRGbG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGludWVDYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmdGVyT25GaXJzdEVudGVyR2xvYmFsRXZlbnRzKHJvb206IFJvb20sIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuTG9vay5sb29rUm9vbShyb29tKTtcclxuICAgICAgICB0aGlzLm9uRW50ZXJHbG9iYWxFdmVudHMocm9vbSwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVudGVyR2xvYmFsRXZlbnRzKHJvb206IFJvb20sIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHJvb20uZ2V0T25FbnRlckV2ZW50KCkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGludGVycnVwdCA9IEdhbWUuaW52b2tlR2xvYmFsRXZlbnQoXHJcbiAgICAgICAgICAgICAgICByb29tLmdldE9uRW50ZXJFdmVudCgpISxcclxuICAgICAgICAgICAgICAgIG5ldyBHbG9iYWxFdmVudEFyZ3MoR2xvYmFsRXZlbnRUeXBlLkJlZm9yZVJvb21FbnRlciwgcm9vbSwgY29tbWFuZENhbGxiYWNrLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRDYWxsYmFjay5DYWxsSWZOb3RDYWxsZWQoKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcnJ1cHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRDYWxsYmFjay5pbnRlcnJ1cHRGbG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29tbWFuZENhbGxiYWNrLkNhbGxJZk5vdENhbGxlZCgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEludmVudG9yeSBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuSW52ZW50b3J5LllvdXJJdGVtcyk7XHJcbiAgICAgICAgaWYgKCFHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkludmVudG9yeS5Ob0l0ZW1zLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoNCkpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLnByaW50U2hvcnRGb3JtYXQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuaW1wb3J0IHsgR2FtZSBhcyBHYW1lVmFyIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSnNvbiBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGdhbWUgPSBHYW1lVmFyO1xyXG4gICAgICAgIGxldCBnYW1lRGF0YSA9IEdhbWVEYXRhO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoSlNPTi5zdHJpbmdpZnkoZXZhbChhcmd1bWVudCkpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IExvYWRHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgc2F2ZURhdGEgPSBFbmdpbmUuTG9hZCgpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9hZC5Mb2FkaW5nKTtcclxuICAgICAgICBMb2FkR2FtZShzYXZlRGF0YSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb2FkLkxvYWRlZCk7XHJcbiAgICAgICAgQ29tbWFuZHMuTG9vay5sb29rUm9vbSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuLi9tb2RlbC9DaGFyYWN0ZXInO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9vayBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCFHYW1lLlBsYXllci5jYW5TZWUoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suQ2FudFNlZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va1Jvb20ocm9vbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBudW1iZXIgPSBjb21tYW5kLmdldE51bWJlcigxKTtcclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gcm9vbS5nZXRDaGFyYWN0ZXJzKCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va0NoYXJhY3RlcihjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXRlbSA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb29rSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbSA9IHJvb20uZ2V0SXRlbXMoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va0l0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9vay5Ob09iamVjdC5mb3JtYXQoYXJndW1lbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb29rUm9vbShyb29tPzogUm9vbSkge1xyXG4gICAgICAgIGlmIChyb29tID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcm9vbSA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gJyc7XHJcbiAgICAgICAgbWVzc2FnZSArPSByb29tLmdldE5hbWUoKSArIEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gdGhpcy5leGl0c1N0cmluZyhyb29tKSArIEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgbWVzc2FnZSArPSByb29tLmdldERlc2NyaXB0aW9uKCk7XHJcbiAgICAgICAgaWYgKHJvb20uZ2V0Q2hhcmFjdGVycygpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmUgKyBFbmdpbmUuRW5kTGluZSArIHJvb20uZ2V0Q2hhcmFjdGVycygpLnByaW50TG9uZ0Zvcm1hdChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyb29tLmdldEl0ZW1zKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgaWYgKCFyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lICsgcm9vbS5nZXRJdGVtcygpLnByaW50TG9uZ0Zvcm1hdCh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChtZXNzYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvb2tJdGVtKGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suWW91TG9va0F0LmZvcm1hdChpdGVtLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KGl0ZW0uZ2V0RGVzY3JpcHRpb24oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9va0NoYXJhY3RlcihjaGFyYWN0ZXI6IENoYXJhY3Rlcikge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9vay5Zb3VMb29rQXQuZm9ybWF0KGNoYXJhY3Rlci5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChjaGFyYWN0ZXIuZ2V0RGVzY3JpcHRpb24oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhpdHNTdHJpbmcocm9vbTogUm9vbSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJldHVyblN0cmluZyA9ICd8ZycgKyBMb2NhbC5Db21tYW5kcy5Mb29rLkV4aXRzICsgJzogWyAnO1xyXG4gICAgICAgIGxldCBmaXJzdEV4aXQgPSB0cnVlO1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb25zID0gcm9vbS5nZXRFeGl0c0RpcmVjdGlvbnMoKTtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXhpdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcsICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmlyc3RFeGl0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChyb29tLmdldEV4aXQoZGlyZWN0aW9uKT8uaXNDbG9zZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcqJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gRGlyZWN0aW9uSGVscGVyLmdldExvY2FsZShkaXJlY3Rpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVyblN0cmluZyArPSAnIF18Vyc7XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblN0cmluZztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb0NvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk5vQ29tbWFuZC5Ob0NvbW1hbmQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb3J0aCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5ub3J0aCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wZW4gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gbnVsbDtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5PcGVuLk5vRGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGlyZWN0aW9uID0gRGlyZWN0aW9uSGVscGVyLnBhcnNlU2hvcnQoYXJndW1lbnQudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk9wZW4uV3JvbmdEaXJlY3Rpb24uZm9ybWF0KGFyZ3VtZW50KSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3BlbkRpcmVjdGlvbihkaXJlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5EaXJlY3Rpb24oZGlyZWN0aW9uOiBEaXJlY3Rpb24pIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKTtcclxuICAgICAgICBsZXQgZXhpdCA9IHJvb20uZ2V0RXhpdChkaXJlY3Rpb24pO1xyXG4gICAgICAgIGlmIChleGl0ID09PSBudWxsIHx8IGV4aXQuaXNIaWRkZW4oKSB8fCAhZXhpdC5pc0Rvb3IoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk9wZW4uTm9Eb29yKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFleGl0LmlzQ2xvc2VkKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5PcGVuLkFscmVhZHlPcGVuKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4aXQuaXNMb2NrZWQoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk9wZW4uTG9ja2VkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBleGl0LkRvb3IhLklzQ2xvc2VkID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IG5leHRSb29tID0gR2FtZS5nZXRSb29tKGV4aXQuZ2V0Um9vbUlkKCkpO1xyXG4gICAgICAgIGxldCBuZXh0RG9vciA9IG5leHRSb29tLmdldEV4aXRUb1Jvb20ocm9vbS5JZCk/LkRvb3I7XHJcbiAgICAgICAgaWYgKG5leHREb29yKSB7XHJcbiAgICAgICAgICAgIG5leHREb29yLklzQ2xvc2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuT3Blbi5PcGVuZWQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWxvYWQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuUmVsb2FkKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F2ZSBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShHYW1lKTtcclxuICAgICAgICBFbmdpbmUuU2F2ZShqc29uKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlNhdmUuU2F2ZWQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NhbiBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGlmICghR2FtZS5QbGF5ZXIuY2FuU2VlKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TY2FuLkNhbnRTZWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwbGF5ZXJSb29tID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TY2FuLkxvb2tpbmdBcm91bmRZb3VTZWUpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuU2Nhbi5IZXJlKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KHRoaXMucHJpbnRDaGFyYWN0ZXJzKEdhbWUuUGxheWVyLkxvY2F0aW9uKSk7XHJcblxyXG4gICAgICAgIERpcmVjdGlvbkhlbHBlci5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgbGV0IGV4aXQgPSBwbGF5ZXJSb29tLmdldEV4aXQoZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGV4aXQgIT09IG51bGwgJiYgIWV4aXQuaXNIaWRkZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5TY2FuLkluRGlyZWN0aW9uLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGlyZWN0aW9uSGVscGVyLmdldExvY2FsZShkaXJlY3Rpb24sIEdyYW1tYUNhc2UuTWllanNjb3duaWspLFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4aXQuaXNDbG9zZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpICsgTG9jYWwuQ29tbWFuZHMuU2Nhbi5DbG9zZWREb29yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dCh0aGlzLnByaW50Q2hhcmFjdGVycyhleGl0LlJvb21JZCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcmludENoYXJhY3RlcnMocm9vbUlkOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbShyb29tSWQpO1xyXG4gICAgICAgIGlmICghcm9vbS5nZXRDaGFyYWN0ZXJzKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSArIExvY2FsLkNvbW1hbmRzLlNjYW4uTm9PbmVUaGVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByb29tLmdldENoYXJhY3RlcnMoKS5wcmludFNob3J0Rm9ybWF0KHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTb3V0aCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5zb3V0aCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRha2UgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQxID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQxID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Ob0FyZ3VtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG51bWJlcjEgPSBjb21tYW5kLmdldE51bWJlcigxKTtcclxuICAgICAgICBsZXQgYXJndW1lbnQyID0gY29tbWFuZC5nZXRBcmd1bWVudCgyKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vcGljayB1cCBpdGVtIGZyb20gbG9jYXRpb25cclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50MS50b0xvd2VyQ2FzZSgpID09PSAnYWxsJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlQWxsRnJvbUxvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUxpc3QgPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGl0ZW1MaXN0LmZpbmQoYXJndW1lbnQxLCBudW1iZXIxKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLk5vSXRlbUZvdW5kLmZvcm1hdChhcmd1bWVudDEpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VJdGVtRnJvbUxvY2F0aW9uKGl0ZW0sIGl0ZW1MaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGFrZSBpdGVtIGZyb20gY29udGFpbmVyXHJcbiAgICAgICAgICAgIGxldCBudW1iZXIyID0gY29tbWFuZC5nZXROdW1iZXIoMik7XHJcbiAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50MiwgbnVtYmVyMik7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFrZUl0ZW1Gcm9tQ29udGFpbmVyKGFyZ3VtZW50MSwgbnVtYmVyMSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1MaXN0ID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKS5nZXRJdGVtcygpO1xyXG4gICAgICAgICAgICBjb250YWluZXIgPSBpdGVtTGlzdC5maW5kKGFyZ3VtZW50MiwgbnVtYmVyMik7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFrZUl0ZW1Gcm9tQ29udGFpbmVyKGFyZ3VtZW50MSwgbnVtYmVyMSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLk5vSXRlbUZvdW5kLmZvcm1hdChhcmd1bWVudDIpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGFrZUl0ZW1Gcm9tQ29udGFpbmVyKG5hbWU6IHN0cmluZywgbnVtYmVyOiBudW1iZXIsIGNvbnRhaW5lcjogSXRlbSkge1xyXG4gICAgICAgIGlmICghY29udGFpbmVyLmlzQ29udGFpbmVyKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLklzTm9Db250YWluZXIuZm9ybWF0KGNvbnRhaW5lci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250YWluZXIuaXNMb2NrZWQoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuQ29udGFpbmVySXNMb2NrZWQuZm9ybWF0KGNvbnRhaW5lci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXRlbSA9IGNvbnRhaW5lci5nZXRJbnZlbnRvcnkoKSEuZmluZChuYW1lLCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5UYWtlLk5vSXRlbUZvdW5kSW5Db250YWluZXIuZm9ybWF0KGNvbnRhaW5lci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSwgbmFtZSksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YWtlSXRlbShpdGVtLCBjb250YWluZXIuZ2V0SW52ZW50b3J5KCkhKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5UYWtlLlRha2VJdGVtRnJvbUNvbnRhaW5lci5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICBpdGVtLmdldE5hbWUoKSxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspLnN0YXJ0V2l0aFVwcGVyKCksXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtOiBJdGVtLCBpdGVtTGlzdDogSXRlbUxpc3QpIHtcclxuICAgICAgICBpZiAoIWl0ZW0uaXNUYWtlYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5DYW5ub3RQaWNrVXAuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkRvcGVsbmlhY3opKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGFrZUl0ZW0oaXRlbSwgaXRlbUxpc3QpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5QaWNrZWRVcC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQmllcm5paykpKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0YWtlQWxsRnJvbUxvY2F0aW9uKCkge1xyXG4gICAgICAgIGxldCBpdGVtTGlzdCA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSA9IGl0ZW1MaXN0LmVsZW1lbnRBdChpKTsgaXRlbSAhPSBudWxsOyBpdGVtID0gaXRlbUxpc3QuZWxlbWVudEF0KGkpKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtLCBpdGVtTGlzdCkpIHtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWtlQWxsR29sZChjb250YWluZXI6IEl0ZW0pIHtcclxuICAgICAgICBsZXQgaXRlbUxpc3QgPSBjb250YWluZXIuZ2V0SW52ZW50b3J5KCkhO1xyXG4gICAgICAgIGxldCBnb2xkOiBJdGVtIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgd2hpbGUgKChnb2xkID0gaXRlbUxpc3QuZmluZEJ5SWQoJ2dvbGQnKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50YWtlSXRlbShnb2xkLCBpdGVtTGlzdCk7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5UYWtlLlRha2VJdGVtRnJvbUNvbnRhaW5lci5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICAgICAgZ29sZC5nZXROYW1lKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykuc3RhcnRXaXRoVXBwZXIoKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRha2VJdGVtKGl0ZW06IEl0ZW0sIGl0ZW1MaXN0OiBJdGVtTGlzdCkge1xyXG4gICAgICAgIGl0ZW1MaXN0LnJlbW92ZShpdGVtKTtcclxuICAgICAgICBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hZGQoaXRlbSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgY29tbWFuZC5nZXRDb21tYW5kKCkgK1xyXG4gICAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0TnVtYmVyKDEpICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0QXJndW1lbnQoMSkgK1xyXG4gICAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0TnVtYmVyKDIpICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0QXJndW1lbnQoMikgK1xyXG4gICAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICAgIEdhbWUuZ2V0TmFtZSgpICtcclxuICAgICAgICAgICAgICAgICcgYWFhJyxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICAnTmF6eXdhbSBzacSZIHxiezB9fFcuIFRhayB8QnswfXxXIHRvIHfFgmHFm25pZSBtb2plIGltacSZLiBBIG5pZSwgbW/FvGUgdG8gamVkbmFrIHxSezF9fFc/IE5pZWVlLCBjaHliYSB8R3syfXxXLi4uIE5pZSwgdG8gbmllIHRvLi4uIFdpZW0hIHxQezN9fFcgdG8gbW9qZSBwcmF3ZHppd2UgaW1pxJkhJy5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICAnR2FtZS5QbGF5ZXIuZ2V0TmFtZSgpJyxcclxuICAgICAgICAgICAgICAgICdXb2p0ZWsgUMSZZHppd8OzcicsXHJcbiAgICAgICAgICAgICAgICAnU2tyenlwZWsgTmFkYWNodScsXHJcbiAgICAgICAgICAgICAgICAnWmR6aW9jaG8gTW9jenl3xIVzJyxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ0N6YXMgbmEga29sb3IgdGVzdCEnKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KCd8YkRhcmsgQmx1ZXswfXxCQmx1ZScuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgzKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xnRGFyayBHcmVlbnswfXxHR3JlZW4nLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoMikpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KCd8Y0RhcmsgQ3lhbnswfXxDQ3lhbicuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgzKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xyRGFyayBSZWR7MH18UlJlZCcuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xwRGFyayBQdXJwbGUgfFBQdXJwbGUnLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3x5RGFyayBZZWxsb3cgfFlZZWxsb3cnLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xzRGFyayBHcmV5ezB9fFNHcmV5Jy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgdGhyb3cgJ1Rlc3QgZXhjZXB0aW9uJztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVXAgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24udXAsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24ud2VzdCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ29tbWFuZENhbGxiYWNrIHtcclxuICAgIGNhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgIGNhbGxiYWNrQ2FsbGVkOiBib29sZWFuO1xyXG4gICAgaW50ZXJydXB0RmxvdzogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICB0aGlzLmNhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbnRlcnJ1cHRGbG93ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIElmIGNvbW1hbmQgY2FuIGNhdXNlIGludGVycnVwdEZsb3csIG1ha2Ugc3VyZSB0byBjYWxsIHRoaXMgbWV0aG9kIGF0IHRoZSBlbmQgb2YgY29tbWFuZCBleGVjdXRpb24gKi9cclxuICAgIENhbGxJZk5vdENhbGxlZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FsbGJhY2tDYWxsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrQ2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIENvbW1hbmRQYXJzZXIge1xyXG4gICAgY29tbWFuZFN0cmluZzogc3RyaW5nO1xyXG4gICAgcGFyc2VkQ29tbWFuZDogc3RyaW5nO1xyXG4gICAgcGFyc2VkQXJndW1lbnRzOiBzdHJpbmdbXSB8IG51bGw7XHJcbiAgICBwYXJzZWROdW1iZXJzOiBudW1iZXJbXSB8IG51bGw7XHJcbiAgICBwYXJzZWRDb3VudDogbnVtYmVyW10gfCBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoY29tbWFuZFN0cmluZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kU3RyaW5nID0gY29tbWFuZFN0cmluZztcclxuICAgICAgICB0aGlzLnBhcnNlZENvbW1hbmQgPSAnJztcclxuICAgICAgICB0aGlzLnBhcnNlZEFyZ3VtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wYXJzZWROdW1iZXJzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcnNlZENvdW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb21tYW5kKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZENvbW1hbmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VDb21tYW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9IHRoaXMucGFyc2VkQ29tbWFuZC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlZENvbW1hbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VDb21tYW5kKCkge1xyXG4gICAgICAgIGxldCBzcGFjZUluZGV4ID0gdGhpcy5jb21tYW5kU3RyaW5nLmluZGV4T2YoJyAnKTtcclxuICAgICAgICBpZiAoc3BhY2VJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gdGhpcy5jb21tYW5kU3RyaW5nO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9IHRoaXMuY29tbWFuZFN0cmluZy5zbGljZSgwLCBzcGFjZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXJndW1lbnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZEFyZ3VtZW50cyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQXJndW1lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZEFyZ3VtZW50cyA9PT0gbnVsbCB8fCB0aGlzLnBhcnNlZEFyZ3VtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkQXJndW1lbnRzW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROdW1iZXIoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZE51bWJlcnMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUFyZ3VtZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYXJzZWROdW1iZXJzID09PSBudWxsIHx8IHRoaXMucGFyc2VkTnVtYmVyc1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkTnVtYmVyc1tpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q291bnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZENvdW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VBcmd1bWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQ291bnQgPT09IG51bGwgfHwgdGhpcy5wYXJzZWRDb3VudFtpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkQ291bnRbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlQXJndW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMucGFyc2VkQXJndW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5wYXJzZWROdW1iZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5wYXJzZWRDb3VudCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydEluZGV4ID0gdGhpcy5jb21tYW5kU3RyaW5nLmluZGV4T2YoJyAnKTtcclxuICAgICAgICBsZXQgZW5kSW5kZXg7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb21tYW5kID0gdGhpcy5jb21tYW5kU3RyaW5nO1xyXG4gICAgICAgIGxldCBjdXJyZW50QXJndW1lbnROdW1iZXIgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgc3RhcnRJbmRleCsrO1xyXG4gICAgICAgICAgICBjdXJyZW50QXJndW1lbnROdW1iZXIrKztcclxuICAgICAgICAgICAgbGV0IHBhcnNlZE51bWJlciA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBwYXJzZWRDb3VudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvL3VzdXdhbXkgbmllcG90cnplYm5lIHNwYWNqZVxyXG4gICAgICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGN1cnJlbnRDb21tYW5kLmxlbmd0aCAmJiBjdXJyZW50Q29tbWFuZFtzdGFydEluZGV4XSA9PT0gJyAnKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3VycmVudENvbW1hbmQgPSBjdXJyZW50Q29tbWFuZC5zbGljZShzdGFydEluZGV4KTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHd5Y2nEhWdhbmllIG51bWVydSBkbGEgYXJndW1lbnR1XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZFswXS5pc051bWJlcigpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggPCBjdXJyZW50Q29tbWFuZC5sZW5ndGggJiYgY3VycmVudENvbW1hbmRbY3VycmVudEluZGV4XS5pc051bWJlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmRbY3VycmVudEluZGV4XSA9PT0gJy4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KGN1cnJlbnRDb21tYW5kLnNsaWNlKDAsIGN1cnJlbnRJbmRleCksIDEwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnNbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IHBhcnNlZE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29tbWFuZCA9IGN1cnJlbnRDb21tYW5kLnNsaWNlKGN1cnJlbnRJbmRleCArIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2plemVsaSBuaWUgd3NrYXphbm8gbGljemJ5LCB0byBkb215xZtsbmllIGplc3QgMVxyXG4gICAgICAgICAgICBpZiAocGFyc2VkTnVtYmVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnNbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhcnNlZENvdW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZENvdW50W2N1cnJlbnRBcmd1bWVudE51bWJlcl0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3d5Y2nEhWdhbmllIHRyZcWbY2kgYXJndW1lbnR1XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZFswXSA9PT0gJ1wiJykge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IDE7XHJcbiAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGN1cnJlbnRDb21tYW5kLmluZGV4T2YoJ1wiJywgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gY3VycmVudENvbW1hbmQuaW5kZXhPZignICcsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gY3VycmVudENvbW1hbmQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcnNlZEFyZ3VtZW50c1tjdXJyZW50QXJndW1lbnROdW1iZXJdID0gY3VycmVudENvbW1hbmQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG4gICAgICAgICAgICBzdGFydEluZGV4ID0gZW5kSW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9jb21tYW5kcy9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kVHJlZSB7XHJcbiAgICByb290OiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSB7IGNvbW1hbmQ6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBBZGROZXdDb21tYW5kKG5hbWU6IHN0cmluZywgb2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lIHx8IG5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdOZXcgY29tbWFuZCBuYW1lIGNhbm5vdCBiZSBudWxsIG9yIGVtcHR5JztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5WYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gdGhpcy5yb290O1xyXG5cclxuICAgICAgICBuYW1lLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoY3VycmVudENoYXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZVtjdXJyZW50Q2hhcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXSA9IHsgY29tbWFuZDogb2JqZWN0IH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgU2V0RGVmYXVsdENvbW1hbmQob2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgdGhpcy5WYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yb290LmNvbW1hbmQgPSBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDb21tYW5kT2JqZWN0KG9iamVjdDogQ29tbWFuZCkge1xyXG4gICAgICAgIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCB8fCBvYmplY3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IGNhbm5vdCBiZSBudWxsJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgQ29tbWFuZCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IG11c3QgZXh0ZW5kIENvbW1hbmQgY2xhc3MnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBHZXRDb21tYW5kKG5hbWU6IHN0cmluZyk6IENvbW1hbmQge1xyXG4gICAgICAgIGxldCBjdXJyZW50Tm9kZSA9IHRoaXMucm9vdDtcclxuXHJcbiAgICAgICAgbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIC5zcGxpdCgnJylcclxuICAgICAgICAgICAgLnNvbWUoKGN1cnJlbnRDaGFyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGVbY3VycmVudENoYXJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbW1hbmQgbm90IGZvdW5kLSByZXR1cm4gZGVmYXVsdCBjb21tYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZS5jb21tYW5kO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4vQ29tbWFuZENhbGxiYWNrJztcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuL0NvbW1hbmRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL2NvbW1hbmRzL0NvbW1hbmQnO1xuaW1wb3J0IHsgRG93biB9IGZyb20gJy4uL2NvbW1hbmRzL0Rvd24nO1xuaW1wb3J0IHsgRHJvcCB9IGZyb20gJy4uL2NvbW1hbmRzL0Ryb3AnO1xuaW1wb3J0IHsgRWFzdCB9IGZyb20gJy4uL2NvbW1hbmRzL0Vhc3QnO1xuaW1wb3J0IHsgRXZhbCB9IGZyb20gJy4uL2NvbW1hbmRzL0V2YWwnO1xuaW1wb3J0IHsgRXhhbSB9IGZyb20gJy4uL2NvbW1hbmRzL0V4YW0nO1xuaW1wb3J0IHsgR28gfSBmcm9tICcuLi9jb21tYW5kcy9Hbyc7XG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9jb21tYW5kcy9JbnZlbnRvcnknO1xuaW1wb3J0IHsgSnNvbiB9IGZyb20gJy4uL2NvbW1hbmRzL0pzb24nO1xuaW1wb3J0IHsgTG9vayB9IGZyb20gJy4uL2NvbW1hbmRzL0xvb2snO1xuaW1wb3J0IHsgTm9ydGggfSBmcm9tICcuLi9jb21tYW5kcy9Ob3J0aCc7XG5pbXBvcnQgeyBSZWxvYWQgfSBmcm9tICcuLi9jb21tYW5kcy9SZWxvYWQnO1xuaW1wb3J0IHsgU2F2ZSB9IGZyb20gJy4uL2NvbW1hbmRzL1NhdmUnO1xuaW1wb3J0IHsgU2NhbiB9IGZyb20gJy4uL2NvbW1hbmRzL1NjYW4nO1xuaW1wb3J0IHsgU291dGggfSBmcm9tICcuLi9jb21tYW5kcy9Tb3V0aCc7XG5pbXBvcnQgeyBUYWtlIH0gZnJvbSAnLi4vY29tbWFuZHMvVGFrZSc7XG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvVGVzdCc7XG5pbXBvcnQgeyBVcCB9IGZyb20gJy4uL2NvbW1hbmRzL1VwJztcbmltcG9ydCB7IFdlc3QgfSBmcm9tICcuLi9jb21tYW5kcy9XZXN0JztcbmltcG9ydCB7IENvbW1hbmRUcmVlIH0gZnJvbSAnLi9Db21tYW5kVHJlZSc7XG5pbXBvcnQgeyBQcm9tcHQgfSBmcm9tICcuLi9jb21tb25Mb2dpYy9Qcm9tcHQnO1xuaW1wb3J0IHsgTG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL0xvYWQnO1xuaW1wb3J0IHsgRW5naW5lVXRpbHMgfSBmcm9tICcuLi9jb21tb25Mb2dpYy9FbmdpbmVVdGlscyc7XG5pbXBvcnQgeyBPcGVuIH0gZnJvbSAnLi4vY29tbWFuZHMvT3Blbic7XG5cbmNsYXNzIENvbW1hbmRMaXN0IHtcbiAgICBEb3duID0gbmV3IERvd24oKTtcbiAgICBEcm9wID0gbmV3IERyb3AoKTtcbiAgICBFYXN0ID0gbmV3IEVhc3QoKTtcbiAgICBFdmFsID0gbmV3IEV2YWwoKTtcbiAgICBFeGFtID0gbmV3IEV4YW0oKTtcbiAgICBHbyA9IG5ldyBHbygpO1xuICAgIEludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoKTtcbiAgICBKc29uID0gbmV3IEpzb24oKTtcbiAgICBMb2FkID0gbmV3IExvYWQoKTtcbiAgICBMb29rID0gbmV3IExvb2soKTtcbiAgICBOb3J0aCA9IG5ldyBOb3J0aCgpO1xuICAgIE9wZW4gPSBuZXcgT3BlbigpO1xuICAgIFJlbG9hZCA9IG5ldyBSZWxvYWQoKTtcbiAgICBTb3V0aCA9IG5ldyBTb3V0aCgpO1xuICAgIFNhdmUgPSBuZXcgU2F2ZSgpO1xuICAgIFNjYW4gPSBuZXcgU2NhbigpO1xuICAgIFRha2UgPSBuZXcgVGFrZSgpO1xuICAgIFRlc3QgPSBuZXcgVGVzdCgpO1xuICAgIFVwID0gbmV3IFVwKCk7XG4gICAgV2VzdCA9IG5ldyBXZXN0KCk7XG59XG5cbmludGVyZmFjZSBDb21tYW5kRGljdGlvbmFyeSB7XG4gICAgW2NvbW1hbmROYW1lOiBzdHJpbmddOiBDb21tYW5kO1xufVxuXG5jbGFzcyBDb21tYW5kc01hbmFnZXIgZXh0ZW5kcyBDb21tYW5kTGlzdCB7XG4gICAgVHJlZTogQ29tbWFuZFRyZWU7XG4gICAgaXNDb21tYW5kRXhlY3V0aW5nOiBib29sZWFuO1xuICAgIGNvbW1hbmRRdWV1ZTogYW55W107XG4gICAgQ29tbWFuZHM6IENvbW1hbmREaWN0aW9uYXJ5ID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5UcmVlID0gbmV3IENvbW1hbmRUcmVlKCk7XG4gICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gW107XG4gICAgfVxuXG4gICAgRXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaChjb21tYW5kKTtcbiAgICAgICAgaWYgKGNvbW1hbmQuaXNOdWxsT3JFbXB0eSgpKSB7XG4gICAgICAgICAgICBFbmdpbmVVdGlscy5Ta2lwUHJpbnRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzQ29tbWFuZEV4ZWN1dGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuRXhlY3V0ZU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEV4ZWN1dGVOZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRRdWV1ZVswXTtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUuc2hpZnQoKTtcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBDb21tYW5kUGFyc2VyKGNvbW1hbmQpO1xuICAgICAgICBsZXQgY29tbWFuZE5hbWUgPSBwYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIGlmIChjb21tYW5kTmFtZS5pc051bGxPckVtcHR5KCkpIHtcbiAgICAgICAgICAgIHRoaXMuQWZ0ZXJFeGVjdXRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29tbWFuZE9iamVjdCA9IHRoaXMuVHJlZS5HZXRDb21tYW5kKGNvbW1hbmROYW1lKTtcbiAgICAgICAgaWYgKGNvbW1hbmRPYmplY3QgPT09IHVuZGVmaW5lZCB8fCBjb21tYW5kT2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ29tbWFuZCBvYmplY3QgZm9yIHswfSBub3QgZm91bmQnLmZvcm1hdChjb21tYW5kTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBFbmdpbmUuT3V0cHV0KCcnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbW1hbmRPYmplY3QuRXhlY3V0ZShwYXJzZXIsIG5ldyBDb21tYW5kQ2FsbGJhY2soKCkgPT4gdGhpcy5BZnRlckV4ZWN1dGUoKSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLkFmdGVyRXhlY3V0ZSgpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEFmdGVyRXhlY3V0ZSgpIHtcbiAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XG4gICAgICAgIFByb21wdC5QcmludCgpO1xuICAgICAgICB0aGlzLkV4ZWN1dGVOZXh0KCk7XG4gICAgfVxuXG4gICAgU2V0RGVmYXVsdENvbW1hbmQoY29tbWFuZE9iamVjdDogQ29tbWFuZCkge1xuICAgICAgICB0aGlzLlRyZWUuU2V0RGVmYXVsdENvbW1hbmQoY29tbWFuZE9iamVjdCk7XG4gICAgfVxuXG4gICAgUmVnaXN0ZXJDb21tYW5kPENvbW1hbmROYW1lIGV4dGVuZHMga2V5b2YgQ29tbWFuZExpc3Q+KG5hbWU6IENvbW1hbmROYW1lLCBvYmplY3Q6IENvbW1hbmRMaXN0W0NvbW1hbmROYW1lXSkge1xuICAgICAgICB0aGlzLlRyZWUuQWRkTmV3Q29tbWFuZChuYW1lLCBvYmplY3QpO1xuICAgICAgICBsZXQgY29tbWFuZExpc3QgPSB0aGlzIGFzIENvbW1hbmRMaXN0O1xuICAgICAgICBjb21tYW5kTGlzdFtuYW1lXSA9IG9iamVjdDtcbiAgICB9XG59XG5cbmV4cG9ydCB2YXIgQ29tbWFuZHMgPSBuZXcgQ29tbWFuZHNNYW5hZ2VyKCk7XG4iLCJpbXBvcnQgeyBEb3duIH0gZnJvbSAnLi4vY29tbWFuZHMvRG93bic7XHJcbmltcG9ydCB7IERyb3AgfSBmcm9tICcuLi9jb21tYW5kcy9Ecm9wJztcclxuaW1wb3J0IHsgRWFzdCB9IGZyb20gJy4uL2NvbW1hbmRzL0Vhc3QnO1xyXG5pbXBvcnQgeyBFdmFsIH0gZnJvbSAnLi4vY29tbWFuZHMvRXZhbCc7XHJcbmltcG9ydCB7IEV4YW0gfSBmcm9tICcuLi9jb21tYW5kcy9FeGFtJztcclxuaW1wb3J0IHsgR28gfSBmcm9tICcuLi9jb21tYW5kcy9Hbyc7XHJcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL2NvbW1hbmRzL0ludmVudG9yeSc7XHJcbmltcG9ydCB7IEpzb24gfSBmcm9tICcuLi9jb21tYW5kcy9Kc29uJztcclxuaW1wb3J0IHsgTG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL0xvYWQnO1xyXG5pbXBvcnQgeyBMb29rIH0gZnJvbSAnLi4vY29tbWFuZHMvTG9vayc7XHJcbmltcG9ydCB7IE5vQ29tbWFuZCB9IGZyb20gJy4uL2NvbW1hbmRzL05vQ29tbWFuZCc7XHJcbmltcG9ydCB7IE5vcnRoIH0gZnJvbSAnLi4vY29tbWFuZHMvTm9ydGgnO1xyXG5pbXBvcnQgeyBPcGVuIH0gZnJvbSAnLi4vY29tbWFuZHMvT3Blbic7XHJcbmltcG9ydCB7IFJlbG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL1JlbG9hZCc7XHJcbmltcG9ydCB7IFNhdmUgfSBmcm9tICcuLi9jb21tYW5kcy9TYXZlJztcclxuaW1wb3J0IHsgU2NhbiB9IGZyb20gJy4uL2NvbW1hbmRzL1NjYW4nO1xyXG5pbXBvcnQgeyBTb3V0aCB9IGZyb20gJy4uL2NvbW1hbmRzL1NvdXRoJztcclxuaW1wb3J0IHsgVGFrZSB9IGZyb20gJy4uL2NvbW1hbmRzL1Rha2UnO1xyXG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvVGVzdCc7XHJcbmltcG9ydCB7IFVwIH0gZnJvbSAnLi4vY29tbWFuZHMvVXAnO1xyXG5pbXBvcnQgeyBXZXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvV2VzdCc7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi9Db21tYW5kc01hbmFnZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEluaXRDb21tYW5kcygpIHtcclxuICAgIENvbW1hbmRzLlNldERlZmF1bHRDb21tYW5kKG5ldyBOb0NvbW1hbmQoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdEb3duJywgbmV3IERvd24oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Ryb3AnLCBuZXcgRHJvcCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Vhc3QnLCBuZXcgRWFzdCgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRXhhbScsIG5ldyBFeGFtKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdFdmFsJywgbmV3IEV2YWwoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdHbycsIG5ldyBHbygpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0ludmVudG9yeScsIG5ldyBJbnZlbnRvcnkoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdKc29uJywgbmV3IEpzb24oKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdMb29rJywgbmV3IExvb2soKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0xvYWQnLCBuZXcgTG9hZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ05vcnRoJywgbmV3IE5vcnRoKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnT3BlbicsIG5ldyBPcGVuKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnUmVsb2FkJywgbmV3IFJlbG9hZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NvdXRoJywgbmV3IFNvdXRoKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdTY2FuJywgbmV3IFNjYW4oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NhdmUnLCBuZXcgU2F2ZSgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1Rha2UnLCBuZXcgVGFrZSgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVGVzdCcsIG5ldyBUZXN0KCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVXAnLCBuZXcgVXAoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdXZXN0JywgbmV3IFdlc3QoKSk7XHJcbn1cclxuIiwiY2xhc3MgRW5naW5lVXRpbHNDbGFzcyB7XHJcbiAgICBza2lwUHJpbnRlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIE91dHB1dFByaW50ZXIobWVzc2FnZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGRlbGF5ID0gNjAsIGlzTmV3TGluZSA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLnNraXBQcmludGVyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcmludE5leHQobWVzc2FnZSwgY2FsbGJhY2ssIGRlbGF5LCBpc05ld0xpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnROZXh0KG1lc3NhZ2U6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyLCBpc05ld0xpbmU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAobWVzc2FnZS5pc051bGxPckVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGlzTmV3TGluZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5za2lwUHJpbnRlciA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KG1lc3NhZ2VbMF0sIGZhbHNlKTtcclxuICAgICAgICBFbmdpbmUuU3RhcnRUaW1lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXh0KG1lc3NhZ2Uuc2xpY2UoMSksIGNhbGxiYWNrLCBkZWxheSwgaXNOZXdMaW5lKTtcclxuICAgICAgICB9LCBkZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgU2tpcFByaW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5za2lwUHJpbnRlciA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgRW5naW5lVXRpbHMgPSBuZXcgRW5naW5lVXRpbHNDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lVXRpbHMgfSBmcm9tICcuL0VuZ2luZVV0aWxzJztcclxuXHJcbmV4cG9ydCB2YXIgSW5wdXRGdW5jdGlvbnMgPSAndHJ1ZSc7XHJcblxyXG5mdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZykge1xyXG4gICAgQ29tbWFuZHMuRXhlY3V0ZShjb21tYW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gU2tpcFByaW50ZXIoKSB7XHJcbiAgICBFbmdpbmVVdGlscy5Ta2lwUHJpbnRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXN1bWVFeGVjdXRpb24oKSB7XHJcbiAgICBDb21tYW5kcy5FeGVjdXRlTmV4dCgpO1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBmdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBmdW5jdGlvbiBTa2lwUHJpbnRlcigpOiB2b2lkO1xyXG4gICAgZnVuY3Rpb24gUmVzdW1lRXhlY3V0aW9uKCk6IHZvaWQ7XHJcbn1cclxuZ2xvYmFsVGhpcy5FeGVjdXRlID0gRXhlY3V0ZTtcclxuZ2xvYmFsVGhpcy5Ta2lwUHJpbnRlciA9IFNraXBQcmludGVyO1xyXG5nbG9iYWxUaGlzLlJlc3VtZUV4ZWN1dGlvbiA9IFJlc3VtZUV4ZWN1dGlvbjtcclxuIiwiY2xhc3MgUHJvbXB0Q2xhc3Mge1xyXG4gICAgUHJpbnQoKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnJCAnLCBmYWxzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgUHJvbXB0ID0gbmV3IFByb21wdENsYXNzKCk7XHJcbiIsImNsYXNzIFJhbmRvbUNsYXNzIHtcclxuICAgIG5leHRJbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgUmFuZG9tID0gbmV3IFJhbmRvbUNsYXNzKCk7XHJcbiIsImV4cG9ydCB7fTtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGludGVyZmFjZSBTdHJpbmcge1xyXG4gICAgICAgIGZvcm1hdCguLi5hcmdzOiBhbnlbXSk6IHN0cmluZztcclxuICAgICAgICBzdGFydFdpdGhVcHBlcigpOiBzdHJpbmc7XHJcbiAgICAgICAgaXNOdW1iZXIoKTogYm9vbGVhbjtcclxuICAgICAgICBpc051bGxPckVtcHR5KCk6IGJvb2xlYW47XHJcbiAgICB9XHJcbn1cclxuXHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKC4uLmFyZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBudW1iZXI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9PSAndW5kZWZpbmVkJyA/IGFyZ3NbbnVtYmVyXSA6IG1hdGNoO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnN0YXJ0V2l0aFVwcGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbMF0udG9VcHBlckNhc2UoKSArIHRoaXMuc2xpY2UoMSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmlzTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIC9eXFxkKyQvLnRlc3QodGhpcy50b1N0cmluZygpKTtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUuaXNOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzID09PSBudWxsIHx8IHRoaXMgPT09ICcnO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tICcuL0VudW1IZWxwZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi9HcmFtbWFDYXNlJztcclxuXHJcbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XHJcbiAgICBub3J0aCA9ICdub3J0aCcsXHJcbiAgICBzb3V0aCA9ICdzb3V0aCcsXHJcbiAgICBlYXN0ID0gJ2Vhc3QnLFxyXG4gICAgd2VzdCA9ICd3ZXN0JyxcclxuICAgIHVwID0gJ3VwJyxcclxuICAgIGRvd24gPSAnZG93bicsXHJcbn1cclxuXHJcbmNsYXNzIERpcmVjdGlvbkhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxEaXJlY3Rpb24+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKERpcmVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxlKGRpcmVjdGlvbjogRGlyZWN0aW9uLCBncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICByZXR1cm4gTG9jYWwuRGlyZWN0aW9uc1tkaXJlY3Rpb25dW2dyYW1tYUNhc2VdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIERpcmVjdGlvbkhlbHBlciA9IG5ldyBEaXJlY3Rpb25IZWxwZXJDbGFzcygpO1xyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW51bUhlbHBlcjxFbnVtVHlwZT4ge1xyXG4gICAgc291cmNlOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlOiBzdHJpbmcpOiBFbnVtVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3ZhbHVlXSBhcyBFbnVtVHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBcnJheSh2YWx1ZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IGFycmF5OiBFbnVtVHlwZVtdID0gW107XHJcbiAgICAgICAgdmFsdWVzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyc2VkOiBFbnVtVHlwZSB8IG51bGwgPSB0aGlzLnBhcnNlKGtleSk7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZWQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gocGFyc2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBjb250YWlucyhzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eShzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VTaG9ydChzdHJpbmc6IHN0cmluZyk6IEVudW1UeXBlIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW2tleV0gYXMgRW51bVR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0S2V5KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlW2tleV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmb3JFYWNoKGNhbGxiYWNrOiB7ICh2YWx1ZTogRW51bVR5cGUsIGtleTogc3RyaW5nKTogdm9pZCB9KTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuc291cmNlW2tleV0sIGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gXCIuL0VudW1IZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEVxdWlwbWVudFNsb3Qge1xyXG4gICAgTm9uZSA9IDAsXHJcbiAgICBUb3JzbyA9IDEsXHJcbiAgICBBcm1zID0gMixcclxuICAgIEhhbmRzID0gMyxcclxuICAgIExlZ3MgPSA0LFxyXG4gICAgRmVldHMgPSA1LFxyXG4gICAgSGVhZCA9IDYsXHJcbiAgICBNYWluSGFuZCA9IDcsXHJcbiAgICBPZmZIYW5kID0gOCxcclxuICAgIFNoaXJ0ID0gOSxcclxuICAgIFBhbnRzID0gMTAsXHJcbiAgICBDb2F0ID0gMTEsXHJcbiAgICBSaWdodFJpbmcgPSAxMixcclxuICAgIExlZnRSaW5nID0gMTMsXHJcbiAgICBOZWNrbGFjZSA9IDE0LFxyXG4gICAgVG9yY2ggPSAxNSxcclxufVxyXG5cclxuY2xhc3MgRXF1aXBtZW50U2xvdEhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxFcXVpcG1lbnRTbG90PiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihFcXVpcG1lbnRTbG90KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBFcXVpcG1lbnRTbG90SGVscGVyID0gbmV3IEVxdWlwbWVudFNsb3RIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSBcIi4vRW51bUhlbHBlclwiO1xyXG5cclxuZXhwb3J0IGVudW0gR2xvYmFsRXZlbnRUeXBlIHtcclxuICAgIEJlZm9yZVJvb21FbnRlciA9IDEsXHJcbn1cclxuXHJcbmNsYXNzIEdsb2JhbEV2ZW50VHlwZUhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxHbG9iYWxFdmVudFR5cGU+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKEdsb2JhbEV2ZW50VHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR2xvYmFsRXZlbnRUeXBlSGVscGVyID0gbmV3IEdsb2JhbEV2ZW50VHlwZUhlbHBlckNsYXNzKCk7XHJcbiIsImltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tIFwiLi9FbnVtSGVscGVyXCI7XHJcblxyXG5leHBvcnQgZW51bSBHcmFtbWFDYXNlIHtcclxuICAgIE1pYW5vd25payA9IDAsIC8va29nbyBjbyBqZXN0XHJcbiAgICBEb3BlbG5pYWN6ID0gMSwgLy9rb2dvIGN6ZWdvIG5pZSBtYVxyXG4gICAgQ2Vsb3duaWsgPSAyLCAvL2tvbXUgY3plbXUgc2nEmSBwcnp5Z2zEhWRhbVxyXG4gICAgQmllcm5payA9IDMsIC8va29nbyBjbyB3aWR6xJksIHVwdXN6Y3phbVxyXG4gICAgTmFyemVkbmlrID0gNCwgLy96IGtpbSB6IGN6eW0gaWRlXHJcbiAgICBNaWVqc2Nvd25payA9IDUsIC8vbyBraW0gbyBjenltIG1vd2llXHJcbiAgICBXb2xhY3ogPSA2LCAvL28ga29nb8W8IHRvIG1vamUgc2tyb21uZSBvY3p5IG1hasSFIHphc3pjenl0IHBvc3RyemVnYcSHXHJcbn1cclxuXHJcbmNsYXNzIEdyYW1tYUNhc2VIZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8R3JhbW1hQ2FzZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoR3JhbW1hQ2FzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR3JhbW1hQ2FzZUhlbHBlciA9IG5ldyBHcmFtbWFDYXNlSGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gJy4vRW51bUhlbHBlcic7XHJcblxyXG5leHBvcnQgdHlwZSBJdGVtVHlwZTIgPVxyXG4gICAgfCAnV2VhcG9uMUgnXHJcbiAgICB8ICdXZWFwb24ySCdcclxuICAgIHwgJ1NoaWVsZCdcclxuICAgIHwgJ0FybW9yJ1xyXG4gICAgfCAnU2hvdWxkZXJzJ1xyXG4gICAgfCAnR2xvdmVzJ1xyXG4gICAgfCAnR3JlYXZlcydcclxuICAgIHwgJ0Jvb3RzJ1xyXG4gICAgfCAnSGVsbWV0J1xyXG4gICAgfCAnU2hpcnQnXHJcbiAgICB8ICdQYW50cydcclxuICAgIHwgJ1dpbGRTaGllbGQnXHJcbiAgICB8ICdXaWxkQXJtb3InXHJcbiAgICB8ICdXaWxkU2hvdWxkZXJzJ1xyXG4gICAgfCAnV2lsZEdsb3ZlcydcclxuICAgIHwgJ1dpbGRHcmVhdmVzJ1xyXG4gICAgfCAnV2lsZEJvb3RzJ1xyXG4gICAgfCAnV2lsZEhlbG1ldCdcclxuICAgIHwgJ1JpbmcnXHJcbiAgICB8ICdOZWNrbGFjZSdcclxuICAgIHwgJ1BvdGlvbidcclxuICAgIHwgJ0Zvb2QnXHJcbiAgICB8ICdUcmFzaCdcclxuICAgIHwgJ0N1cnJlbmN5J1xyXG4gICAgfCAnQ29udGFpbmVyJ1xyXG4gICAgfCAnU3RhdGljQ29udGFpbmVyJ1xyXG4gICAgfCAnUXVlc3QnXHJcbiAgICB8ICdTdGF0aWMnXHJcbiAgICB8ICdMZXZlcic7XHJcblxyXG5leHBvcnQgZW51bSBJdGVtVHlwZSB7XHJcbiAgICBXZWFwb24xSCA9ICdXZWFwb24xSCcsXHJcbiAgICBXZWFwb24ySCA9ICdXZWFwb24ySCcsXHJcbiAgICBTaGllbGQgPSAnU2hpZWxkJyxcclxuICAgIEFybW9yID0gJ0FybW9yJyxcclxuICAgIFNob3VsZGVycyA9ICdTaG91bGRlcnMnLFxyXG4gICAgR2xvdmVzID0gJ0dsb3ZlcycsXHJcbiAgICBHcmVhdmVzID0gJ0dyZWF2ZXMnLFxyXG4gICAgQm9vdHMgPSAnQm9vdHMnLFxyXG4gICAgSGVsbWV0ID0gJ0hlbG1ldCcsXHJcbiAgICBTaGlydCA9ICdTaGlydCcsXHJcbiAgICBQYW50cyA9ICdQYW50cycsXHJcbiAgICBXaWxkU2hpZWxkID0gJ1dpbGRTaGllbGQnLFxyXG4gICAgV2lsZEFybW9yID0gJ1dpbGRBcm1vcicsXHJcbiAgICBXaWxkU2hvdWxkZXJzID0gJ1dpbGRTaG91bGRlcnMnLFxyXG4gICAgV2lsZEdsb3ZlcyA9ICdXaWxkR2xvdmVzJyxcclxuICAgIFdpbGRHcmVhdmVzID0gJ1dpbGRHcmVhdmVzJyxcclxuICAgIFdpbGRCb290cyA9ICdXaWxkQm9vdHMnLFxyXG4gICAgV2lsZEhlbG1ldCA9ICdXaWxkSGVsbWV0JyxcclxuICAgIFJpbmcgPSAnUmluZycsXHJcbiAgICBOZWNrbGFjZSA9ICdOZWNrbGFjZScsXHJcbiAgICBQb3Rpb24gPSAnUG90aW9uJyxcclxuICAgIEZvb2QgPSAnRm9vZCcsXHJcbiAgICBUcmFzaCA9ICdUcmFzaCcsXHJcbiAgICBDdXJyZW5jeSA9ICdDdXJyZW5jeScsXHJcbiAgICBDb250YWluZXIgPSAnQ29udGFpbmVyJyxcclxuICAgIFN0YXRpY0NvbnRhaW5lciA9ICdTdGF0aWNDb250YWluZXInLFxyXG4gICAgUXVlc3QgPSAnUXVlc3QnLFxyXG4gICAgU3RhdGljID0gJ1N0YXRpYycsXHJcbiAgICBMZXZlciA9ICdMZXZlcicsXHJcbn1cclxuXHJcbmNsYXNzIEl0ZW1UeXBlSGVscGVyQ2xhc3MgZXh0ZW5kcyBFbnVtSGVscGVyPEl0ZW1UeXBlPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihJdGVtVHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgSXRlbVR5cGVIZWxwZXIgPSBuZXcgSXRlbVR5cGVIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi4vbW9kZWwvQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgRXF1aXBtZW50IH0gZnJvbSAnLi4vbW9kZWwvRXF1aXBtZW50JztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi4vbW9kZWwvSXRlbUxpc3QnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9DaGFyYWN0ZXJUZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyRmFjdG9yeSB7XHJcbiAgICBzcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzLmdldFRlbXBsYXRlKGNoYXJhY3RlcklkKTtcclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcigpO1xyXG4gICAgICAgIGNoYXJhY3RlciA9IHRoaXMuTG9hZEZyb21UZW1wbGF0ZShjaGFyYWN0ZXIsIHRlbXBsYXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcclxuICAgIH1cclxuXHJcbiAgICBMb2FkRnJvbVRlbXBsYXRlKGNoYXJhY3RlcjogQ2hhcmFjdGVyLCB0ZW1wbGF0ZTogQ2hhcmFjdGVyVGVtcGxhdGUpIHtcclxuICAgICAgICBjaGFyYWN0ZXIuSWQgPSB0ZW1wbGF0ZS5JZDtcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkludmVudG9yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnZlbnRvcnlNb2RlbCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5JbnZlbnRvcnkuZm9yRWFjaCgoaXRlbURlZmluaXRpb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5TW9kZWwuYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXIuSW52ZW50b3J5ID0gaW52ZW50b3J5TW9kZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVtcGxhdGUuRXF1aXBtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGVxdWlwbWVudE1vZGVsID0gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5FcXVpcG1lbnQuZm9yRWFjaCgoZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIGVxdWlwbWVudE1vZGVsLmVxdWlwKGVxLlNsb3QsIEdhbWUuc3Bhd25JdGVtKGVxLkl0ZW0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlci5FcXVpcG1lbnQgPSBlcXVpcG1lbnRNb2RlbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IEl0ZW1DaGFuY2VPbmVPZlRlbXBsYXRlLCBJdGVtQ2hhbmNlVGVtcGxhdGUsIEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50LCBTdGFjayB9IGZyb20gJy4uL3RlbXBsYXRlcy9Db21tb24nO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvSXRlbVRlbXBsYXRlJztcclxuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi4vY29tbW9uTG9naWMvUmFuZG9tJztcclxuaW1wb3J0IHsgSXRlbUxvY2sgfSBmcm9tICcuLi9tb2RlbC9JdGVtTG9jayc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUZhY3Rvcnkge1xyXG4gICAgc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uOiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCk6IEl0ZW0gfCBudWxsIHtcclxuICAgICAgICBsZXQgaXRlbSA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbURlZmluaXRpb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJdGVtQ2hhbmNlVGVtcGxhdGUoaXRlbURlZmluaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uQ2hhbmNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUmFuZG9tLm5leHRJbnQoMSwgMTAwKSA+IGl0ZW1EZWZpbml0aW9uLkNoYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZDtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZCh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5TdGFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRTdGFjayh0aGlzLnN0YWNrVmFsdWUoaXRlbURlZmluaXRpb24uU3RhY2spKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUludmVudG9yeShpdGVtRGVmaW5pdGlvbiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVMb2NrKGl0ZW1EZWZpbml0aW9uLCBpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleCA9IHRoaXMucmVzb2x2ZVJhbmRvbUl0ZW1JbmRleChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZFtzZWxlY3RlZEl0ZW1JbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLlN0YWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdJdGVtIGRlZmluaXRpb24gaGFzIHswfSBzcGVjaWZpZWQgaWRzIGJ1dCBvbmx5IHsxfSBzcGllY2lmaWVkIHN0YWNrcycuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLlN0YWNrLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRTdGFjayh0aGlzLnN0YWNrVmFsdWUoaXRlbURlZmluaXRpb24uU3RhY2tbc2VsZWN0ZWRJdGVtSW5kZXhdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzSXRlbUNoYW5jZVRlbXBsYXRlKGl0ZW1EZWZpbml0aW9uOiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCk6IGl0ZW1EZWZpbml0aW9uIGlzIEl0ZW1DaGFuY2VUZW1wbGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtRGVmaW5pdGlvbiAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZCA9PT0gJ3N0cmluZyc7XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQ6IHN0cmluZyk6IEl0ZW0ge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZTogSXRlbVRlbXBsYXRlID0gR2FtZURhdGEuSXRlbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICBsZXQgaXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgaXRlbS5JZCA9IHRlbXBsYXRlLklkO1xyXG4gICAgICAgIGlmIChpdGVtLmlzQ29udGFpbmVyKCkpIHtcclxuICAgICAgICAgICAgaXRlbS5JbnZlbnRvcnkgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlUmFuZG9tSXRlbUluZGV4KGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlT25lT2ZUZW1wbGF0ZSk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5DaGFuY2VMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZC5mb3JFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3Q/LnB1c2goMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gZGVmaW5pdGlvbiBoYXMgezB9IHNwZWNpZmllZCBpZHMgYnV0IG9ubHkgezF9IHNwaWVjaWZpZWQgY2hhbmNlcyBpbiBDaGFuY2VMaXN0Jy5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5JdGVtSWQubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhbmNlU3VtID0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5yZWR1Y2UoKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBhICsgYik7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2hhbmNlID0gUmFuZG9tLm5leHRJbnQoMSwgY2hhbmNlU3VtKTtcclxuICAgICAgICBjaGFuY2VTdW0gPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGFuY2VTdW0gKz0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkQ2hhbmNlIDw9IGNoYW5jZVN1bSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7IC8vc2hvdWxkIG5ldmVyIG9jY3VyXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlSW52ZW50b3J5KGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlVGVtcGxhdGUsIGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSW52ZW50b3J5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGludmVudG9yeSA9IGl0ZW0uZ2V0SW52ZW50b3J5KCk7XHJcbiAgICAgICAgICAgIGlmIChpbnZlbnRvcnkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeSA9IGl0ZW0uSW52ZW50b3J5ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSW52ZW50b3J5LmZvckVhY2goKGl0ZW1EZWZpbml0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeT8uYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc29sdmVMb2NrKGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlVGVtcGxhdGUsIGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uTG9jayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uTG9jayA9IG5ldyBJdGVtTG9jayhpdGVtRGVmaW5pdGlvbi5Mb2NrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGFja1ZhbHVlKHN0YWNrOiBTdGFjayk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHN0YWNrID09PSB1bmRlZmluZWQgfHwgc3RhY2sgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhY2sgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGFjaztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUmFuZG9tLm5leHRJbnQoc3RhY2suTWluLCBzdGFjay5NYXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkTGlzdEZyb21UZW1wbGF0ZSh0ZW1wbGF0ZT86IEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50W10pIHtcclxuICAgICAgICBsZXQgaXRlbUxpc3QgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICBpZiAodGVtcGxhdGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5mb3JFYWNoKChpdGVtRGVmaW5pdGlvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtTGlzdC5hZGQoR2FtZS5zcGF3bkl0ZW0oaXRlbURlZmluaXRpb24pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtTGlzdDtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyTGlzdCB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlckxpc3QnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL21vZGVsL1Jvb20nO1xyXG5pbXBvcnQgeyBSb29tRXhpdCB9IGZyb20gJy4uL21vZGVsL1Jvb21FeGl0JztcclxuaW1wb3J0IHsgUm9vbUV4aXRzTGlzdCB9IGZyb20gJy4uL21vZGVsL1Jvb21FeGl0c0xpc3QnO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvUm9vbVRlbXBsYXRlJztcclxuaW1wb3J0IHsgUm9vbURvb3IgfSBmcm9tICcuLi9tb2RlbC9Sb29tRG9vcic7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21GYWN0b3J5IHtcclxuICAgIHNwYXduUm9vbSh0ZW1wbGF0ZTogUm9vbVRlbXBsYXRlKSB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBuZXcgUm9vbSgpO1xyXG4gICAgICAgIHJvb20uSWQgPSB0ZW1wbGF0ZS5JZDtcclxuICAgICAgICByZXR1cm4gcm9vbTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbURhdGEocm9vbTogUm9vbSkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gR2FtZURhdGEuUm9vbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZShyb29tLklkKTtcclxuICAgICAgICBsZXQgZXhpdHNNb2RlbCA9IG5ldyBSb29tRXhpdHNMaXN0KCk7XHJcbiAgICAgICAgdGVtcGxhdGUuRXhpdHM/LmZvckVhY2goKGV4aXQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IGV4aXQuRGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBsZXQgcm9vbUV4aXQgPSBuZXcgUm9vbUV4aXQoKTtcclxuICAgICAgICAgICAgcm9vbUV4aXQuUm9vbUlkID0gZXhpdC5Sb29tSWQ7XHJcbiAgICAgICAgICAgIHJvb21FeGl0LklzSGlkZGVuID0gZXhpdC5pc0hpZGRlbjtcclxuICAgICAgICAgICAgaWYgKGV4aXQuRG9vciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG9vciA9IChyb29tRXhpdC5Eb29yID0gbmV3IFJvb21Eb29yKCkpO1xyXG4gICAgICAgICAgICAgICAgZG9vci5Jc0xvY2tlZCA9IGV4aXQuRG9vci5Jc0xvY2tlZDtcclxuICAgICAgICAgICAgICAgIGRvb3IuSXNDbG9zZWQgPSBleGl0LkRvb3IuSXNDbG9zZWQ7XHJcbiAgICAgICAgICAgICAgICBkb29yLktleUlkID0gZXhpdC5Eb29yLktleUlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkb29yLklzTG9ja2VkID09PSB1bmRlZmluZWQgJiYgZG9vci5LZXlJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9vci5Jc0xvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXhpdHNNb2RlbFtkaXJlY3Rpb25dID0gcm9vbUV4aXQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcm9vbS5FeGl0cyA9IGV4aXRzTW9kZWw7XHJcblxyXG4gICAgICAgIHJvb20uSXRlbXMgPSBHYW1lLkl0ZW1GYWN0b3J5LmxvYWRMaXN0RnJvbVRlbXBsYXRlKHRlbXBsYXRlLkl0ZW1zKTtcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkNoYXJhY3RlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyc01vZGVsID0gbmV3IENoYXJhY3Rlckxpc3QoKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUuQ2hhcmFjdGVycy5mb3JFYWNoKChjaGFyYWN0ZXJJZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyc01vZGVsLmFkZChHYW1lLnNwYXduQ2hhcmFjdGVyKGNoYXJhY3RlcklkKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByb29tLkNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJzTW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgRW50aXR5QmFzZSB9IGZyb20gJy4vRW50aXR5QmFzZSc7XHJcbmltcG9ydCB7IEVxdWlwbWVudCB9IGZyb20gJy4vRXF1aXBtZW50JztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyU3RhdHMgfSBmcm9tICcuL0NoYXJhY3RlclN0YXRzJztcclxuaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9DaGFyYWN0ZXJUZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgRW50aXR5QmFzZSB7XHJcbiAgICBJbnZlbnRvcnk6IEl0ZW1MaXN0ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICBFcXVpcG1lbnQ6IEVxdWlwbWVudCA9IG5ldyBFcXVpcG1lbnQoKTtcclxuICAgIFN0YXRzOiBDaGFyYWN0ZXJTdGF0cyA9IG5ldyBDaGFyYWN0ZXJTdGF0cygpO1xyXG5cclxuICAgIHByaXZhdGUgZ2V0VGVtcGxhdGUoKTogQ2hhcmFjdGVyVGVtcGxhdGUge1xyXG4gICAgICAgIHJldHVybiBHYW1lRGF0YS5DaGFyYWN0ZXJUZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGhpcy5JZCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkQ2hhcmFjdGVyOiBDaGFyYWN0ZXIpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkQ2hhcmFjdGVyKTtcclxuICAgICAgICB0aGlzLkludmVudG9yeSA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuSW52ZW50b3J5LmxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3Rlci5JbnZlbnRvcnkpO1xyXG4gICAgICAgIHRoaXMuRXF1aXBtZW50ID0gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgIHRoaXMuRXF1aXBtZW50LmxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3Rlci5FcXVpcG1lbnQpO1xyXG4gICAgICAgIHRoaXMuU3RhdHMgPSBuZXcgQ2hhcmFjdGVyU3RhdHMoKTtcclxuICAgICAgICB0aGlzLlN0YXRzLmxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3Rlci5TdGF0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLk5hbWVbZ3JhbW1hQ2FzZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGVzY3JpcHRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5EZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZGxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuSWRsZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbnZlbnRvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSW52ZW50b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVxdWlwbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FcXVpcG1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RXF1aXBtZW50KCkuaGFzTGlnaHRTb3VyY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIZWFsdGhMZXZlbChkZXNjcmlwdGlvbjogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCBwZXJjZW50YWdlID0gKHRoaXMuU3RhdHMuY3VycmVudEhlYWx0aCAqIDEwMCkgLyB0aGlzLlN0YXRzLmhlYWx0aC50b3RhbDtcclxuICAgICAgICBsZXQgbGV2ZWw6IHN0cmluZztcclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+PSAxMDApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5GdWxsIDogJ+KWiOKWiOKWiOKWiOKWiCc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfEcnICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDgwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuTGlnaHRXb3VuZHMgOiAn4paI4paI4paI4paI4paIJztcclxuICAgICAgICAgICAgcmV0dXJuICd8ZycgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJjZW50YWdlID4gNjApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5NZWRpdW1Xb3VuZHMgOiAn4paI4paI4paI4paI4paRJztcclxuICAgICAgICAgICAgcmV0dXJuICd8WScgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJjZW50YWdlID4gNDApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5TZXJpb3VzV291bmRzIDogJ+KWiOKWiOKWiOKWkeKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFknICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDIwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuSGVhdnlXb3VuZHMgOiAn4paI4paI4paR4paR4paRJztcclxuICAgICAgICAgICAgcmV0dXJuICd8UicgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJjZW50YWdlID49IDApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5OZWFyRGVhdGggOiAn4paI4paR4paR4paR4paRJztcclxuICAgICAgICAgICAgcmV0dXJuICd8UicgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuRGVhZCA6ICfilpHilpHilpHilpHilpEnO1xyXG4gICAgICAgIHJldHVybiAnfFInICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4vQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgRW50aXR5TGlzdCB9IGZyb20gJy4vRW50aXR5TGlzdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyTGlzdCBleHRlbmRzIEVudGl0eUxpc3Q8Q2hhcmFjdGVyPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZExpc3Q6IENoYXJhY3Rlckxpc3QpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gc2F2ZWRMaXN0LkFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3Q2hhciA9IG5ldyBDaGFyYWN0ZXIoKTtcclxuICAgICAgICAgICAgbmV3Q2hhci5sb2FkRnJvbVNhdmUoaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdDaGFyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5LnNvbWUoKGMpID0+IGMuaGFzTGlnaHRTb3VyY2UoKSA9PT0gdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgU3RhdCB7XHJcbiAgICBiYXNlOiBudW1iZXIgPSAwO1xyXG4gICAgcmFjZTogbnVtYmVyID0gMDtcclxuICAgIGNsYXNzOiBudW1iZXIgPSAwO1xyXG4gICAgYm9udXM6IG51bWJlciA9IDA7XHJcbiAgICB0b3RhbDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuY2xhc3MgQXR0cmlidXRlIHtcclxuICAgIHN0YXQ6IG51bWJlciA9IDA7XHJcbiAgICBsZXZlbDogbnVtYmVyID0gMDtcclxuICAgIGVxOiBudW1iZXIgPSAwO1xyXG4gICAgYm9udXM6IG51bWJlciA9IDA7XHJcbiAgICBtb2RpZmllcjogbnVtYmVyID0gMDtcclxuICAgIHRvdGFsOiBudW1iZXIgPSAwO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyU3RhdHMge1xyXG4gICAgbGV2ZWw6IG51bWJlciA9IDE7XHJcblxyXG4gICAgc3RyZW5ndGg6IFN0YXQgPSBuZXcgU3RhdCgpO1xyXG4gICAgZGV4dGVyaXR5OiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIGFnaWxpdHk6IFN0YXQgPSBuZXcgU3RhdCgpO1xyXG4gICAgZW5kdXJhbmNlOiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIHZpdGFsaXR5OiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuXHJcbiAgICBhdHRhY2s6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGRlZmVuc2U6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGhlYWx0aDogQXR0cmlidXRlID0gbmV3IEF0dHJpYnV0ZSgpO1xyXG4gICAgYXJtb3I6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGZhdGlndWU6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGRhbWFnZTogQXR0cmlidXRlID0gbmV3IEF0dHJpYnV0ZSgpO1xyXG5cclxuICAgIGN1cnJlbnRIZWFsdGg6IG51bWJlciA9IDEwMDtcclxuICAgIGN1cnJlbnRBcm1vcjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhlYWx0aC50b3RhbCA9IDEwMDtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRTdGF0czogQ2hhcmFjdGVyU3RhdHMpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkU3RhdHMpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJUZW1wbGF0ZXMge1xyXG4gICAgW3RlbXBsYXRlSWQ6IHN0cmluZ106IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKGNoYXJhY3RlclRlbXBsYXRlcz86IGFueSkge1xyXG4gICAgICAgIGlmIChjaGFyYWN0ZXJUZW1wbGF0ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2hhcmFjdGVyVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2hhcmFjdGVyIHRlbXBsYXRlcyBtdXN0IGJlIGFuIGFycmF5JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJhY3RlclRlbXBsYXRlcy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdDaGFyYWN0ZXJUZW1wbGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTmV3Q2hhcmFjdGVyVGVtcGxhdGUoY2hhcmFjdGVyVGVtcGxhdGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzW2NoYXJhY3RlclRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdDaGFyYWN0ZXIgdGVtcGxhdGUgezB9IGlzIGFscmVhZHkgZGVmaW5lZCEnLmZvcm1hdChjaGFyYWN0ZXJUZW1wbGF0ZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXNbY2hhcmFjdGVyVGVtcGxhdGUuSWRdID0gY2hhcmFjdGVyVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUoY2hhcmFjdGVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzW2NoYXJhY3RlcklkXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdObyBDaGFyYWN0ZXIgdGVtcGxhdGUgZGVmaW5lZCBmb3IgSWQgezB9IScuZm9ybWF0KGNoYXJhY3RlcklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbY2hhcmFjdGVySWRdO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnRpdHlCYXNlIHtcclxuICAgIElkOiBzdHJpbmcgPSAnJztcclxuICAgIGFic3RyYWN0IGdldE5hbWUoKTogc3RyaW5nO1xyXG4gICAgYWJzdHJhY3QgZ2V0SWRsZSgpOiBzdHJpbmc7XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkRW50aXR5OiBFbnRpdHlCYXNlKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZEVudGl0eSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW50aXR5QmFzZSB9IGZyb20gJy4vRW50aXR5QmFzZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5TGlzdDxUeXBlIGV4dGVuZHMgRW50aXR5QmFzZT4ge1xyXG4gICAgQXJyYXk6IFR5cGVbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQXJyYXkgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQoaXRlbTogVHlwZSkge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5BcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShpdGVtOiBUeXBlKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5BcnJheS5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW55KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5Lmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudEF0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5BcnJheVtpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXlbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZChuYW1lOiBzdHJpbmcsIG51bWJlciA9IDEpOiBUeXBlIHwgbnVsbCB7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gbnVsbDtcclxuICAgICAgICB0aGlzLkFycmF5LnNvbWUoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZ2V0TmFtZSgpLnNlYXJjaChuYW1lKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG51bWJlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQnlJZChpZDogc3RyaW5nLCBudW1iZXIgPSAxKTogVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGxldCBmb3VuZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5BcnJheS5zb21lKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLklkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bWJlciA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBudW1iZXItLTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnRMb25nRm9ybWF0KGluZGVudCA9IHRydWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcmludChpbmRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50U2hvcnRGb3JtYXQoaW5kZW50ID0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByaW50KGluZGVudCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50KGluZGVudCA9IHRydWUsIGxvbmdGb3JtYXQgPSB0cnVlKSB7XHJcbiAgICAgICAgbGV0IHJldHVyblN0cmluZyA9ICcnO1xyXG4gICAgICAgIHRoaXMuQXJyYXkuZm9yRWFjaCgoZW50aXR5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXR1cm5TdHJpbmcgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZGVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9IEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gZW50aXR5LmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpO1xyXG4gICAgICAgICAgICBpZiAobG9uZ0Zvcm1hdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcgJyArIGVudGl0eS5nZXRJZGxlKCkgKyAnLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVxdWlwbWVudFNsb3QsIEVxdWlwbWVudFNsb3RIZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9FcXVpcG1lbnRTbG90JztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRXF1aXBtZW50IHtcclxuICAgIEFycmF5OiBJdGVtW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkRXF1aXBtZW50OiBFcXVpcG1lbnQpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gc2F2ZWRFcXVpcG1lbnQuQXJyYXkubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdJdGVtID0gbmV3IEl0ZW0oKTtcclxuICAgICAgICAgICAgbmV3SXRlbS5sb2FkRnJvbVNhdmUoaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdJdGVtO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlU2xvdChzbG90OiBFcXVpcG1lbnRTbG90KSB7XHJcbiAgICAgICAgaWYgKEVxdWlwbWVudFNsb3RIZWxwZXIuZ2V0S2V5KHNsb3QpID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93ICd7MH0gaXMgbm90IGEgcHJvcGVyIGVxdWlwbWVudCBzbG90LicuZm9ybWF0KHNsb3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlcXVpcChzbG90OiBFcXVpcG1lbnRTbG90LCBpdGVtOiBJdGVtIHwgbnVsbCkge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNsb3Qoc2xvdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuQXJyYXlbc2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGVxdWlwLCB7MH0gYWxyZWFkeSBjb250YWlucyBhbiBpdGVtLicuZm9ybWF0KEVxdWlwbWVudFNsb3RIZWxwZXIuZ2V0S2V5KHNsb3QpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuQXJyYXlbc2xvdF0gPSBpdGVtO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShzbG90OiBFcXVpcG1lbnRTbG90KSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNsb3Qoc2xvdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuQXJyYXlbc2xvdF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkNhbm5vdCByZW1vdmUsIHswfSBkb2Vzbid0IGNvbnRhaW5zIGFuIGl0ZW0uXCIuZm9ybWF0KEVxdWlwbWVudFNsb3RIZWxwZXIuZ2V0S2V5KHNsb3QpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLkFycmF5W3Nsb3RdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChzbG90OiBFcXVpcG1lbnRTbG90KSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNsb3Qoc2xvdCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5W3Nsb3RdO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5LnNvbWUoKGkpID0+IGkuaXNMaWdodFNvdXJjZSgpID09PSB0cnVlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHbG9iYWxFdmVudHMgfSBmcm9tICcuLi9HbG9iYWxFdmVudHMnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50QXJncyB9IGZyb20gJy4vR2xvYmFsRXZlbnRBcmdzJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4vUm9vbSc7XHJcbmltcG9ydCB7IFJvb21GYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzL1Jvb21GYWN0b3J5JztcclxuaW1wb3J0IHsgSXRlbUZhY3RvcnkgfSBmcm9tICcuLi9mYWN0b3JpZXMvSXRlbUZhY3RvcnknO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJGYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzL0NoYXJhY3RlckZhY3RvcnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNb2RlbCB7XHJcbiAgICBOYW1lOiBzdHJpbmc7XHJcbiAgICBTdGFydGluZ1Jvb206IG51bWJlcjtcclxuICAgIFJvb21zOiBSb29tW107XHJcbiAgICBQbGF5ZXIgPSBuZXcgUGxheWVyKCk7XHJcblxyXG4gICAgSXRlbUZhY3Rvcnk6IEl0ZW1GYWN0b3J5O1xyXG4gICAgQ2hhcmFjdGVyRmFjdG9yeTogQ2hhcmFjdGVyRmFjdG9yeTtcclxuICAgIFJvb21GYWN0b3J5OiBSb29tRmFjdG9yeTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSAnJztcclxuICAgICAgICB0aGlzLlN0YXJ0aW5nUm9vbSA9IDA7XHJcbiAgICAgICAgdGhpcy5Sb29tcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLkl0ZW1GYWN0b3J5ID0gbmV3IEl0ZW1GYWN0b3J5KCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJGYWN0b3J5ID0gbmV3IENoYXJhY3RlckZhY3RvcnkoKTtcclxuICAgICAgICB0aGlzLlJvb21GYWN0b3J5ID0gbmV3IFJvb21GYWN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEdhbWUoc2F2ZWRHYW1lOiBHYW1lTW9kZWwpIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSBzYXZlZEdhbWUuTmFtZTtcclxuICAgICAgICB0aGlzLlN0YXJ0aW5nUm9vbSA9IHNhdmVkR2FtZS5TdGFydGluZ1Jvb207XHJcbiAgICAgICAgZm9yIChsZXQgcm9vbUlkIGluIHNhdmVkR2FtZS5Sb29tcykge1xyXG4gICAgICAgICAgICB0aGlzLlJvb21zW3Jvb21JZF0gPSBuZXcgUm9vbSgpO1xyXG4gICAgICAgICAgICB0aGlzLlJvb21zW3Jvb21JZF0ubG9hZEZyb21TYXZlKHNhdmVkR2FtZS5Sb29tc1tyb29tSWRdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5QbGF5ZXIgPSBuZXcgUGxheWVyKCk7XHJcbiAgICAgICAgdGhpcy5QbGF5ZXIubG9hZEZyb21TYXZlKHNhdmVkR2FtZS5QbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSb29tKHJvb21JZDogbnVtYmVyKTogUm9vbSB7XHJcbiAgICAgICAgbGV0IHJvb20gPSB0aGlzLlJvb21zW3Jvb21JZF07XHJcbiAgICAgICAgaWYgKHJvb20gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCByb29tVGVtcGxhdGUgPSBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzLmdldFRlbXBsYXRlKHJvb21JZCk7XHJcbiAgICAgICAgICAgIHJvb20gPSB0aGlzLlJvb21zW3Jvb21JZF0gPSB0aGlzLlJvb21GYWN0b3J5LnNwYXduUm9vbShyb29tVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLlJvb21GYWN0b3J5LmxvYWRGcm9tRGF0YShyb29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvb207XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uOiBhbnkpOiBJdGVtIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXRlbUZhY3Rvcnkuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZDogc3RyaW5nKTogQ2hhcmFjdGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5DaGFyYWN0ZXJGYWN0b3J5LnNwYXduQ2hhcmFjdGVyKGNoYXJhY3RlcklkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJdGVtVHlwZShpdGVtVHlwZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEdhbWVEYXRhLkl0ZW1UeXBlcy5nZXRJdGVtVHlwZShpdGVtVHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGludm9rZUdsb2JhbEV2ZW50KG5hbWU6IHN0cmluZywgYXJnczogR2xvYmFsRXZlbnRBcmdzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGV2ZW50ID0gR2xvYmFsRXZlbnRzW25hbWVdO1xyXG4gICAgICAgIGlmIChldmVudCA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBldmVudCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkdsb2JhbCBldmVudCB3aXRoIG5hbWUgezB9IGRvZXNuJ3QgZXhpc3RcIi5mb3JtYXQobmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnQoYXJncyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGVzIH0gZnJvbSAnLi9DaGFyYWN0ZXJUZW1wbGF0ZXMnO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGVzIH0gZnJvbSAnLi9JdGVtVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgSXRlbVR5cGVzIH0gZnJvbSAnLi9JdGVtVHlwZXMnO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGVzIH0gZnJvbSAnLi9Sb29tVGVtcGxhdGVzJztcclxuXHJcbmNsYXNzIEdhbWVEYXRhTW9kZWwge1xyXG4gICAgSXRlbVR5cGVzOiBJdGVtVHlwZXM7XHJcbiAgICBJdGVtVGVtcGxhdGVzOiBJdGVtVGVtcGxhdGVzO1xyXG4gICAgQ2hhcmFjdGVyVGVtcGxhdGVzOiBDaGFyYWN0ZXJUZW1wbGF0ZXM7XHJcbiAgICBSb29tVGVtcGxhdGVzOiBSb29tVGVtcGxhdGVzO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5JdGVtVHlwZXMgPSBuZXcgSXRlbVR5cGVzKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5JdGVtVGVtcGxhdGVzID0gbmV3IEl0ZW1UZW1wbGF0ZXModW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLkNoYXJhY3RlclRlbXBsYXRlcyA9IG5ldyBDaGFyYWN0ZXJUZW1wbGF0ZXModW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLlJvb21UZW1wbGF0ZXMgPSBuZXcgUm9vbVRlbXBsYXRlcyh1bmRlZmluZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEdhbWVEYXRhID0gbmV3IEdhbWVEYXRhTW9kZWwoKTtcclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdsb2JhbEV2ZW50QXJncyB7XHJcbiAgICBUeXBlOiBudW1iZXI7XHJcbiAgICBTZW5kZXI6IGFueTtcclxuICAgIFRlcm1pbmF0ZUNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrO1xyXG4gICAgQ29udGludWVDb21tYW5kQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgdHlwZTogbnVtYmVyLFxyXG4gICAgICAgIHNlbmRlcjogYW55LFxyXG4gICAgICAgIHRlcm1pbmF0ZUNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrLFxyXG4gICAgICAgIGNvbnRpbnVlQ29tbWFuZENhbGxiYWNrOiBGdW5jdGlvbixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuVHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5TZW5kZXIgPSBzZW5kZXI7XHJcbiAgICAgICAgdGhpcy5UZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2sgPSB0ZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5Db250aW51ZUNvbW1hbmRDYWxsYmFjayA9IGNvbnRpbnVlQ29tbWFuZENhbGxiYWNrO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcbmltcG9ydCB7IEl0ZW1UeXBlLCBJdGVtVHlwZUhlbHBlciB9IGZyb20gJy4uL2VudW1zL0l0ZW1UeXBlJztcbmltcG9ydCB7IEVudGl0eUJhc2UgfSBmcm9tICcuL0VudGl0eUJhc2UnO1xuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuL0l0ZW1MaXN0JztcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcbmltcG9ydCB7IEl0ZW1Mb2NrIH0gZnJvbSAnLi9JdGVtTG9jayc7XG5pbXBvcnQgeyBJdGVtVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvSXRlbVRlbXBsYXRlJztcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XG5cbmV4cG9ydCBjbGFzcyBJdGVtIGV4dGVuZHMgRW50aXR5QmFzZSB7XG4gICAgU3RhY2s/OiBudW1iZXI7XG4gICAgSW52ZW50b3J5PzogSXRlbUxpc3Q7XG4gICAgTG9jaz86IEl0ZW1Mb2NrO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUZW1wbGF0ZSgpOiBJdGVtVGVtcGxhdGUge1xuICAgICAgICByZXR1cm4gR2FtZURhdGEuSXRlbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZSh0aGlzLklkKTtcbiAgICB9XG5cbiAgICBnZXROYW1lKGdyYW1tYUNhc2UgPSBHcmFtbWFDYXNlLk1pYW5vd25paykge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lO1xuICAgICAgICBpZiAoIXRoaXMuaXNTdGFja2FibGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWVbZ3JhbW1hQ2FzZV0gKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhY2soKSArICcgJyArIHRoaXMuZ2V0UGx1cmFsTmFtZShncmFtbWFDYXNlKSArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQbHVyYWxOYW1lKGdyYW1tYUNhc2UgPSBHcmFtbWFDYXNlLk1pYW5vd25paykge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobmFtZVswXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lW2dyYW1tYUNhc2VdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmdldFN0YWNrKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lWzBdW2dyYW1tYUNhc2VdO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZVsxXVtncmFtbWFDYXNlXTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZVsyXVtncmFtbWFDYXNlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldERlc2NyaXB0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLkRlc2NyaXB0aW9uICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcbiAgICB9XG5cbiAgICBnZXRJZGxlKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLklkbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIExvY2FsLkNvbW1hbmRzLkxvb2suRGVmYXVsdElkbGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5JZGxlITtcbiAgICB9XG5cbiAgICBpc0xpZ2h0U291cmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLklzTGlnaHRTb3VyY2UgPT09IHRydWU7XG4gICAgfVxuXG4gICAgaXNTdGFja2FibGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFRlbXBsYXRlKCkuSXNTdGFja2FibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuSXNTdGFja2FibGU7XG4gICAgfVxuXG4gICAgZ2V0U3RhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLlN0YWNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLlN0YWNrO1xuICAgIH1cblxuICAgIHNldFN0YWNrKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGFja2FibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5TdGFjayA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU3RhY2sodmFsdWU6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5pc1N0YWNrYWJsZSgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5TdGFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TdGFjayA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLlN0YWNrICs9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIEl0ZW1UeXBlSGVscGVyLnBhcnNlKHRoaXMuZ2V0VGVtcGxhdGUoKS5UeXBlKTtcbiAgICB9XG5cbiAgICBpc1Rha2VhYmxlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXRpYzpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhdGljQ29udGFpbmVyOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5MZXZlcjpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SW52ZW50b3J5KCk6IEl0ZW1MaXN0IHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLkludmVudG9yeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5JbnZlbnRvcnk7XG4gICAgfVxuXG4gICAgaXNDb250YWluZXIoKSB7XG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5nZXRUZW1wbGF0ZSgpLlR5cGU7XG4gICAgICAgIHJldHVybiB0eXBlID09IEl0ZW1UeXBlLkNvbnRhaW5lciB8fCB0eXBlID09IEl0ZW1UeXBlLlN0YXRpY0NvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBpc0xvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTG9jaz8uSXNMb2NrZWQgPT09IHRydWU7XG4gICAgfVxuXG4gICAgc2V0SXNMb2NrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuTG9jayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLkxvY2suSXNMb2NrZWQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBFbnRpdHlMaXN0IH0gZnJvbSAnLi9FbnRpdHlMaXN0JztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUxpc3QgZXh0ZW5kcyBFbnRpdHlMaXN0PEl0ZW0+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkTGlzdDogSXRlbUxpc3QpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gc2F2ZWRMaXN0LkFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgICAgIG5ld0l0ZW0ubG9hZEZyb21TYXZlKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3SXRlbTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQoaXRlbTogSXRlbSB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpdGVtLmlzU3RhY2thYmxlKCkpIHtcclxuICAgICAgICAgICAgbGV0IGV4aXN0aW5nU3RhY2sgPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kQnlJZChpdGVtLklkKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nU3RhY2sgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nU3RhY2suYWRkU3RhY2soaXRlbS5nZXRTdGFjaygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5hZGQoaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXkuc29tZSgoaSkgPT4gaS5pc0xpZ2h0U291cmNlKCkgPT09IHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IExvY2tUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9Db21tb24nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1Mb2NrIHtcclxuICAgIElzTG9ja2VkOiBib29sZWFuO1xyXG4gICAgS2V5SWQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHRlbXBsYXRlOiBMb2NrVGVtcGxhdGUpIHtcclxuICAgICAgICB0aGlzLklzTG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLktleUlkID0gJyc7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XHJcblxyXG5jbGFzcyBJdGVtVGVtcGxhdGVzTGlzdCB7XHJcbiAgICBbdGVtcGxhdGVJZDogc3RyaW5nXTogSXRlbVRlbXBsYXRlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbVRlbXBsYXRlcyB7XHJcbiAgICBsaXN0OiBJdGVtVGVtcGxhdGVzTGlzdCA9IG5ldyBJdGVtVGVtcGxhdGVzTGlzdCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1UZW1wbGF0ZXM6IEl0ZW1UZW1wbGF0ZVtdIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1UZW1wbGF0ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdGVtcGxhdGVzIG11c3QgYmUgYW4gYXJyYXknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbVRlbXBsYXRlcy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdJdGVtVGVtcGxhdGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5ld0l0ZW1UZW1wbGF0ZShpdGVtVGVtcGxhdGU6IEl0ZW1UZW1wbGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmxpc3RbaXRlbVRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoaXRlbVRlbXBsYXRlLklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0W2l0ZW1UZW1wbGF0ZS5JZF0gPSBpdGVtVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUoaXRlbUlkOiBzdHJpbmcpOiBJdGVtVGVtcGxhdGUge1xyXG4gICAgICAgIGlmICh0aGlzLmxpc3RbaXRlbUlkXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdObyBpdGVtIHRlbXBsYXRlIGRlZmluZWQgZm9yIHswfSEnLmZvcm1hdChpdGVtSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0W2l0ZW1JZF07XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEl0ZW1UeXBlcyB7XHJcbiAgICBbaXRlbVR5cGVJZDogc3RyaW5nXTogYW55O1xyXG4gICAgY29uc3RydWN0b3IoaXRlbVR5cGVzVGVtcGxhdGU6IGFueSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChpdGVtVHlwZXNUZW1wbGF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpdGVtVHlwZXNUZW1wbGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdHlwZXMgdGVtcGxhdGUgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtVHlwZXNUZW1wbGF0ZS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5BZGROZXdJdGVtVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgQWRkTmV3SXRlbVR5cGUoaXRlbVR5cGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzW2l0ZW1UeXBlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHR5cGUgezB9IGlzIGFscmVhZHkgZGVmaW5lZCEnLmZvcm1hdChpdGVtVHlwZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXNbaXRlbVR5cGUuSWRdID0gaXRlbVR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgR2V0SXRlbVR5cGUoaXRlbVR5cGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpc1tpdGVtVHlwZU5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdHlwZSAnICsgaXRlbVR5cGVOYW1lICsgJyBpcyBub3QgZGVmaW5lZCEnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1tpdGVtVHlwZU5hbWVdO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2hhcmFjdGVyIHtcclxuICAgIExvY2F0aW9uOiBudW1iZXIgPSAwO1xyXG4gICAgUHJldmlvdXNMb2NhdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZFBsYXllcjogUGxheWVyKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZFBsYXllcik7XHJcbiAgICAgICAgc3VwZXIubG9hZEZyb21TYXZlKHNhdmVkUGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRMb2NhdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkxvY2F0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExvY2F0aW9uKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLkxvY2F0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJldmlvdXNMb2NhdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLlByZXZpb3VzTG9jYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJldmlvdXNMb2NhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5QcmV2aW91c0xvY2F0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuU2VlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKHRoaXMuTG9jYXRpb24pO1xyXG4gICAgICAgIHJldHVybiByb29tLmhhc0xpZ2h0U291cmNlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJMaXN0IH0gZnJvbSAnLi9DaGFyYWN0ZXJMaXN0JztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgUm9vbUV4aXQgfSBmcm9tICcuL1Jvb21FeGl0JztcclxuaW1wb3J0IHsgUm9vbUV4aXRzTGlzdCB9IGZyb20gJy4vUm9vbUV4aXRzTGlzdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgUm9vbSB7XHJcbiAgICBJZDogbnVtYmVyID0gMDtcclxuICAgIEV4aXRzOiBSb29tRXhpdHNMaXN0ID0gbmV3IFJvb21FeGl0c0xpc3QoKTtcclxuICAgIElzVmlzaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgSXRlbXM6IEl0ZW1MaXN0ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICBDaGFyYWN0ZXJzOiBDaGFyYWN0ZXJMaXN0ID0gbmV3IENoYXJhY3Rlckxpc3QoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkUm9vbTogUm9vbSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRSb29tKTtcclxuICAgICAgICB0aGlzLkV4aXRzID0gbmV3IFJvb21FeGl0c0xpc3QoKTtcclxuICAgICAgICBmb3IgKGxldCBleGl0S2V5IGluIHNhdmVkUm9vbS5FeGl0cykge1xyXG4gICAgICAgICAgICB0aGlzLkV4aXRzW2V4aXRLZXldID0gbmV3IFJvb21FeGl0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuRXhpdHNbZXhpdEtleV0ubG9hZEZyb21TYXZlKHNhdmVkUm9vbS5FeGl0c1tleGl0S2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuSXRlbXMgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB0aGlzLkl0ZW1zLmxvYWRGcm9tU2F2ZShzYXZlZFJvb20uSXRlbXMpO1xyXG4gICAgICAgIHRoaXMuQ2hhcmFjdGVycyA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJzLmxvYWRGcm9tU2F2ZShzYXZlZFJvb20uQ2hhcmFjdGVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIEdhbWVEYXRhLlJvb21UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGhpcy5JZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGVzY3JpcHRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5EZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJdGVtcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFyYWN0ZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkNoYXJhY3RlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhpdChkaXJlY3Rpb246IERpcmVjdGlvbik6IFJvb21FeGl0IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKHRoaXMuRXhpdHNbZGlyZWN0aW9uXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5FeGl0c1tkaXJlY3Rpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4aXRUb1Jvb20ocm9vbUlkOiBudW1iZXIpOiBSb29tRXhpdCB8IG51bGwge1xyXG4gICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiB0aGlzLkV4aXRzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkV4aXRzW2RpcmVjdGlvbl0uZ2V0Um9vbUlkKCkgPT09IHJvb21JZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuRXhpdHNbZGlyZWN0aW9uXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeGl0c0RpcmVjdGlvbnMoKTogRGlyZWN0aW9uW10ge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3Rpb25IZWxwZXIucGFyc2VBcnJheShPYmplY3Qua2V5cyh0aGlzLkV4aXRzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VGVtcGxhdGUoKS5Jc05hdHVyYWxMaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0SXRlbXMoKS5oYXNMaWdodFNvdXJjZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGFyYWN0ZXJzKCkuaGFzTGlnaHRTb3VyY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPbkZpcnN0RW50ZXJFdmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLk9uRmlyc3RFbnRlckV2ZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuT25GaXJzdEVudGVyRXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T25FbnRlckV2ZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldFRlbXBsYXRlKCkuT25FbnRlckV2ZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuT25FbnRlckV2ZW50O1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBSb29tRG9vciB7XHJcbiAgICBJc0xvY2tlZD86IGJvb2xlYW47XHJcbiAgICBJc0Nsb3NlZD86IGJvb2xlYW47XHJcbiAgICBLZXlJZD86IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWREb29yOiBSb29tRG9vcikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWREb29yKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSb29tRG9vciB9IGZyb20gJy4vUm9vbURvb3InO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21FeGl0IHtcclxuICAgIFJvb21JZDogbnVtYmVyID0gMDtcclxuICAgIElzSGlkZGVuPzogYm9vbGVhbjtcclxuICAgIERvb3I/OiBSb29tRG9vcjtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRFeGl0OiBSb29tRXhpdCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRFeGl0KTtcclxuICAgICAgICBpZiAoc2F2ZWRFeGl0LkRvb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLkRvb3IgPSBuZXcgUm9vbURvb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5Eb29yLmxvYWRGcm9tU2F2ZShzYXZlZEV4aXQuRG9vcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFJvb21JZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Sb29tSWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEb29yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkRvb3IgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBpc0Nsb3NlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yPy5Jc0Nsb3NlZCA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0xvY2tlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yPy5Jc0xvY2tlZCA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0hpZGRlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Jc0hpZGRlbiA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRLZXlJZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5Eb29yPy5LZXlJZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yLktleUlkITtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSb29tRXhpdCB9IGZyb20gJy4vUm9vbUV4aXQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21FeGl0c0xpc3Qge1xyXG4gICAgW2RpcmVjdGlvbjogc3RyaW5nXTogUm9vbUV4aXQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgUm9vbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL1Jvb21UZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUm9vbVRlbXBsYXRlcyB7XHJcbiAgICBbdGVtcGxhdGVJZDogbnVtYmVyXTogUm9vbVRlbXBsYXRlO1xyXG4gICAgVGVtcGxhdGVzOiBSb29tVGVtcGxhdGVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJvb21UZW1wbGF0ZXM/OiBhbnkpIHtcclxuICAgICAgICBpZiAocm9vbVRlbXBsYXRlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShyb29tVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUm9vbSB0ZW1wbGF0ZXMgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb29tVGVtcGxhdGVzLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Jvb21UZW1wbGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTmV3Um9vbVRlbXBsYXRlKHJvb21UZW1wbGF0ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXNbcm9vbVRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdSb29tIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQocm9vbVRlbXBsYXRlLklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpc1tyb29tVGVtcGxhdGUuSWRdID0gcm9vbVRlbXBsYXRlO1xyXG4gICAgICAgIHRoaXMuVGVtcGxhdGVzW3Jvb21UZW1wbGF0ZS5JZF0gPSByb29tVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUocm9vbUlkOiBudW1iZXIpOiBSb29tVGVtcGxhdGUge1xyXG4gICAgICAgIGlmICh0aGlzW3Jvb21JZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gUm9vbSB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBJZCB7MH0hJy5mb3JtYXQocm9vbUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbcm9vbUlkXTtcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgUHJvbXB0IH0gZnJvbSAnLi9jb21tb25Mb2dpYy9Qcm9tcHQnO1xyXG5pbXBvcnQgeyBJbml0Q29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmRzVXRpbHMvUmVnaXN0ZXJDb21tYW5kcyc7XHJcbmltcG9ydCB7IEdhbWUsIEluaXRHYW1lRGF0YSwgVmVyc2lvbiB9IGZyb20gJy4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0ICcuL2NvbW1vbkxvZ2ljL0lucHV0RnVuY3Rpb25zJztcclxuaW1wb3J0ICcuL2NvbW1vbkxvZ2ljL1N0cmluZ1V0aWxzJztcclxuXHJcbmZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgICBJbml0R2FtZURhdGEoKTtcclxuICAgIEluaXRDb21tYW5kcygpO1xyXG4gICAgRW5naW5lLk91dHB1dCgnRHVuZ2VvbiBDcmF3bGVyIDIsIHdlcnNqYTonKTtcclxuICAgIEVuZ2luZS5PdXRwdXQoVmVyc2lvbik7XHJcbiAgICBDb21tYW5kcy5Hby5jaGFuZ2VQbGF5ZXJMb2NhdGlvbihcclxuICAgICAgICBHYW1lLmdldFJvb20oR2FtZS5TdGFydGluZ1Jvb20pLFxyXG4gICAgICAgIG5ldyBDb21tYW5kQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KCcnKTtcclxuICAgICAgICAgICAgUHJvbXB0LlByaW50KCk7XHJcbiAgICAgICAgfSksXHJcbiAgICApO1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBmdW5jdGlvbiBJbml0KCk6IHZvaWQ7XHJcbn1cclxuZ2xvYmFsVGhpcy5Jbml0ID0gSW5pdDtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9