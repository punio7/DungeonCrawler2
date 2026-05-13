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

/***/ "./src/commands/Close.ts"
/*!*******************************!*\
  !*** ./src/commands/Close.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Close = void 0;
const Direction_1 = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
const InitGameData_1 = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
const Command_1 = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
class Close extends Command_1.Command {
    ExecuteBody(command) {
        let direction = null;
        let argument = command.getArgument(1);
        if (argument === null) {
            Engine.Output(InitGameData_1.Local.Commands.Close.NoDirection);
            return;
        }
        direction = Direction_1.DirectionHelper.parseShort(argument.toLowerCase());
        if (direction === null) {
            Engine.Output(InitGameData_1.Local.Commands.Close.WrongDirection.format(argument));
            return;
        }
        this.closeDirection(direction);
    }
    closeDirection(direction) {
        var _a;
        let room = InitGameData_1.Game.getRoom(InitGameData_1.Game.Player.getLocation());
        let exit = room.getExit(direction);
        if (exit === null || exit.isHidden() || !exit.isDoor()) {
            Engine.Output(InitGameData_1.Local.Commands.Close.NoDoor);
            return;
        }
        if (exit.isClosed()) {
            Engine.Output(InitGameData_1.Local.Commands.Close.AlreadyClosed);
            return;
        }
        exit.Door.IsClosed = true;
        let nextRoom = InitGameData_1.Game.getRoom(exit.getRoomId());
        let nextDoor = (_a = nextRoom.getExitToRoom(room.Id)) === null || _a === void 0 ? void 0 : _a.Door;
        if (nextDoor) {
            nextDoor.IsClosed = true;
        }
        Engine.Output(InitGameData_1.Local.Commands.Close.Closed);
    }
}
exports.Close = Close;


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
const Close_1 = __webpack_require__(/*! ../commands/Close */ "./src/commands/Close.ts");
class CommandList {
    constructor() {
        this.Close = new Close_1.Close();
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
const Close_1 = __webpack_require__(/*! ../commands/Close */ "./src/commands/Close.ts");
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
    CommandsManager_1.Commands.RegisterCommand('Close', new Close_1.Close());
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
                        throw 'Item definition has {0} specified ids but only {1} specified stacks'.format(itemDefinition.ItemId.length, itemDefinition.Stack.length);
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
            throw 'Item definition has {0} specified ids but only {1} specified chances in ChanceList'.format(itemDefinition.ItemId.length, itemDefinition.ChanceList.length);
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
                    door.IsClosed = true;
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

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Character-Schema.json","CharactersTemplates":[{"Id":"cave-rat","Name":["szczur jaskiniowy","szczura jaskiniowego","szczurowi jaskiniowemu","szczura jaskiniowego","szczurem jaskiniowym","szczurze jaskiniowym","szczurze jaskiniowy"],"Description":"Szczury jaskiniowe są nieco większe od szczurów miejskich, są jednak porównywalnie obrzydliwe. Bure, mokre futerko pokrywa prawie jedno łokciowego gryzonia, który skrzętnie przeszukuje otoczenie w poszukiwaniu pożywienia. Odgłos małych pazurków uderzających w kamienną posadzkę towarzyszy każdemu ruchowi szczura.","Idle":"szpera dookoła","Equipment":[{"Slot":"Torso","Item":"rat-skin"}]},{"Id":"test-npc","Name":["testowy NPC","testowego NPC","testowemu NPC","testowego NPC","testowemu NPC","testowego NPC","testowy NPC"],"Description":"To tylko testowy NPC, nie oczekuj epickich opisów. Jedyne czego możesz się spodziewać to sztucznie wydłużone opisy mające na celu sprawdzenie wersalikowania opisów postaci.","Idle":"stoi i zachęca do rozmowy","Inventory":[{"ItemId":"gold","Stack":100},"sapphire-round"]},{"Id":"stranger","Name":["zakapturzona postać","zakapturzonej postaci","zakapturzonej postaci","zakapturzonej postaci","zakapturzoną postać","zakapturzonej postaci","zakapturzona postać"],"Description":"Wpatrując się w zakapturzonego człowieka nie dostrzegasz w nim nic nadzwyczajnego. Nosi on długie brązowe szaty, które dokładnie zakrywają jego ciało. Kaptur całkowicie zasłania mu twarz. Nieznajomy wpatruje się cały czas w podłogę, nie wykonując przy tym nawet najmniejszych ruchów.","Idle":"wpatruje się w podłogę","Inventory":["short-sword-bronze","bronze-key"]}]}');

/***/ },

/***/ "./res/Game.json"
/*!***********************!*\
  !*** ./res/Game.json ***!
  \***********************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Game-Schema.json","GameTemplate":{"Name":"nazwa gry","StartingRoom":0,"Rooms":[{"Id":0,"Name":"Początek korytarza","Description":"Rozglądając się dookoła dostrzegasz głównie ciemność. Wąski słup światła wpadający z dziury w suficie jest jedynym źródłem światła. Miejsce to wygląda na jakiś stary, podziemny tunel. Przejście za twoimi plecami zostało zasypane gruzem, kamieniami i ziemią, którą teraz porastają chwasty i trawa. Patrząc wprost widzisz morze kamienia ginące w mroku poza światłem. Interesująca wydaje się jedynie dziura w podłodze, umieszczona bezpośrednia pod tą w suficie. Słup światła nurkuje do niej ginąc gdzieś dużo, dużo niżej.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":1}],"Items":["stick-wood",{"ItemId":"gold","Stack":10}]},{"Id":1,"Name":"Podziemny korytarz","Description":"Korytarz wyłożony jest starymi kamiennymi płytami. Takie same płytki na ścianach, podłodze, suficie, od tego kamienia zaczyna kręcić ci się w głowie. Niektóre z nich powypadały ze swoich miejsc, tworzą teraz warstwę gruzu na podłodze. Większość z tych, które pozostały jest porośnięta mchem. Sztucznie uformowany kamień powoli poddaje się otaczającej go naturze.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":2},{"Direction":"south","RoomId":0}],"Characters":["cave-rat"],"Items":[{"ItemId":"wooden-chest","Inventory":["sapphire-round",{"ItemId":"gold","Stack":{"Min":20,"Max":100}}],"Lock":{"KeyId":"simple-iron-key"}}],"OnFirstEnterEvent":"TestGlobalEvent"},{"Id":2,"Name":"Podziemny korytarz","Description":"Im dalej od źródła światła tym bardziej korytarz pogłębia się ciemności i dostrzegasz coraz mniej. Cienie robią się nadzwyczaj długie, niknące w ciemności znajdującej się przed tobą. Refleksje światła na nieporośniętych mchem płytkach stają się coraz słabsze, natomiast podłoga wydaje się być pokryta dywanem mroku.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":3},{"Direction":"south","RoomId":1}]},{"Id":3,"Name":"Podziemny korytarz","Description":"Patrząc pod światło możesz podziwiać dzieło zniszczenia dokonane przez naturę. Grube korzenie strąciły kamienną kostkę z sufitu i wpełzły do korytarza. Część z nich wbiła się w ścianę, reszta natomiast smętnie wisi w powietrzu. Na podłodze leża potłuczone kawałki kamiennych płytek, które spadając z sufitu roztrzaskały się i porozlatywały na wszystkie strony. Zgromadzona na nich wilgoć odbija drobiny światła dobiegające z oddali, reszta natomiast ginie we wszechogarniającej ciemności.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":4},{"Direction":"south","RoomId":2}],"Items":[{"ItemId":"wooden-chest","Lock":{"KeyId":"simple-iron-key"},"Gold":{"Min":5,"Max":15},"Contains":["map","weak-healing-potion","leather-armor","leather-leggings","leather-shoulder-pads","leather-boots","leather-gloves"]}]},{"Id":4,"Name":"Koniec korytarza","Description":"Koniec korytarza jest kompletnie ciemny. Macając rękami na oślep określasz iż drzwi są przeciętnej wysokości, wykonane z drewna. Klamka jest umieszczona mniej więcej w połowie wysokości drzwi ma zakrzywiony kształt z gałką na końcu. Dotykając jej czujesz wygrawerowane na jej powierzchni zdobienia. Z powodu ciemności nie możesz określić z jakiego metalu jest wykonana.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":5,"Door":{"IsClosed":true}},{"Direction":"south","RoomId":3}],"Characters":["test-npc"]},{"Id":5,"Name":"Wejście do piwniczki","Description":"To niewielkie pomieszczenie wygląda na piwniczkę. Drewniana drabina zamocowana do wschodniej ściany prowadzi do zamkniętej klapy w suficie. Przy przeciwległej ścianie znajduje się podobna klapa prowadząca na dół. Ściany i podłogi pomieszczenia są wykonane z kamiennych cegieł, jednak te są czyste, nieporośnięte mchami. W północnej ścianie znajdują się drzwi prowadzące do dalszych piwniczek. Koło drzwi zamontowana w ścianie jest pochodnia rzucające jasne światło na całe pomieszczenie.","IsNaturalLight":true,"BackgroundMusic":"LVL1","Exits":[{"Direction":"north","RoomId":6,"Door":{"KeyId":"simple-iron-key"}},{"Direction":"south","RoomId":4,"Door":{"IsClosed":true}},{"Direction":"up","RoomId":17,"Door":{"KeyId":"bronze-key"}},{"Direction":"down","RoomId":20,"Door":{"KeyId":"bronze-key"}}],"Characters":["stranger"],"Items":["simple-iron-key","bronze-key"]},{"Id":6,"Name":"Wyjście z piwniczki","Description":"Ściany i podłogi piwniczki podobnie jak cała piwnica są wymurowane staranną kamienną kostką. Wnętrza nie oświetla żadna pochodnia a blask bijący od wejście oświetla niewielką część pomieszczenia. Widać iż służyło ono do składowania trunków- całą piwniczkę zajmuje 5 długich, ciągnących się aż po zasięg światła, stojaków do przechowywania wina. W zasięgu wzroku nie dostrzegasz jednak żadnej butelki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":10},{"Direction":"south","RoomId":5,"Door":{"KeyId":"simple-iron-key"}},{"Direction":"east","RoomId":12},{"Direction":"west","RoomId":7}],"Characters":["cave-rat"]},{"Id":7,"Name":"Początek alejki stojaków","Description":"Przed tobą ciągną się dwa długie stojaki na wino. Są one wykonane z podniszczonego już drewna i sięgają od podłogi do sufitu. Stojak po twojej lewej przylega do ściany natomiast ten po prawej stoi niczym ściana działowa. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":8},{"Direction":"east","RoomId":6}]},{"Id":8,"Name":"Alejka pomiędzy stojakami","Description":"Po swojej lewej i prawej masz dwa drewniane stojaki na wino. Są one wykonane z podniszczonego już drewna i sięgają od podłogi do sufitu. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego w pobliżu nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Alejka ciągnie się prosto i ginie w mrokach. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":9},{"Direction":"south","RoomId":7}],"Items":["broken-glass-shards"]},{"Id":9,"Name":"Koniec alejki","Description":"Dotarłeś do końca alejki. Stojak po twojej prawej kończy się pozostawiając przejście do równoległych alejek. Na wprost ciebie kamienna ściana znaczy kraniec piwniczki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":15},{"Direction":"south","RoomId":8},{"Direction":"east","RoomId":11}],"Items":["empty-wine-bottle"],"Characters":["cave-rat"]},{"Id":10,"Name":"Alejka pomiędzy stojakami","Description":"Po swojej lewej i prawej masz dwa drewniane stojaki na wino. Są one wykonane z podniszczonego już drewna i sięgają od podłogi do sufitu. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego w pobliżu nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Alejka ciągnie się prosto i ginie w mrokach. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":11},{"Direction":"south","RoomId":6}],"Items":["broken-glass-shards"],"Characters":["cave-rat"]},{"Id":11,"Name":"Koniec alejki","Description":"Dotarłeś do końca alejki. Stojaki po twoich obu stronach kończą się pozostawiając przejście do równoległych alejek. Na wprost ciebie kamienna ściana znaczy kraniec piwniczki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":10},{"Direction":"east","RoomId":14},{"Direction":"west","RoomId":9}],"Characters":["cave-rat"]},{"Id":12,"Name":"Początek alejki stojaków","Description":"Przed tobą ciągną się dwa długie stojaki na wino. Są one wykonane z podniszczonego już drewna i sięgają od podłogi do sufitu. Stojak po twojej prawej przylega do ściany natomiast ten po lewej stoi niczym ściana działowa. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":13},{"Direction":"west","RoomId":6}],"Items":["broken-glass-shards"]},{"Id":13,"Name":"Alejka pomiędzy stojakami","Description":"Po swojej lewej i prawej masz dwa drewniane stojaki na wino. Są one wykonane z podniszczonego już drewna i sięgają od podłogi do sufitu. Deski stojaków krzyżują się ze sobą tworząc kratę w której przechowuje się trunki. Niestety żadnego w pobliżu nie dostrzegasz. Pomiędzy stojakami jest alejka wystarczająco szeroka aby jedna osoba mogła swobodnie spacerować pomiędzy nimi. Alejka ciągnie się prosto i ginie w mrokach. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":14},{"Direction":"south","RoomId":12}],"Items":["broken-glass-shards"],"Characters":["cave-rat"]},{"Id":14,"Name":"Koniec alejki","Description":"Dotarłeś do końca alejki. Stojak po twojej lewej kończy się pozostawiając przejście do równoległych alejek. Na wprost ciebie kamienna ściana znaczy kraniec piwniczki. Ciche szuranie i piski rozchodzą się po pomieszczeniu.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":13},{"Direction":"west","RoomId":11}]},{"Id":15,"Name":"Ukryte przejście","Description":"Ukryte przejście było najwidoczniej od początku zaplanowane- jego ściany są pokryte tą samą staranną kamienną kostką, jedynie bardziej zarośniętą mchem i porostami. Przejście jest wąskie ale wystarczająco wysokie aby można było przejść bez schylania się. Jednak pierwsze co rzuca ci się w oczy to mnogość ludzkich szczątków leżących na podłodze oraz złowieszczy smród śmierci.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":16},{"Direction":"south","RoomId":9}]},{"Id":16,"Name":"Legowisko ogara","Description":"Some description","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":15}],"Characters":["guard-dog"]},{"Id":20,"Name":"Wyjście z jaskiń","Description":"Znajdujesz się w wysokim podziemnym korytarzu, będącym częścią jakiejś jaskini. Podłoże jest nierówne, usłane kamieniami, a z niknącego w mroku sufitu zwisają pojedyncze stalagmity. Pieczara wyglądną na niemal nietkniętą przez człowieka, gdzieniegdzie pod ścianami poustawiano zagradzające przejście kamienie, ale to jedyne oznaki ingerencji w naturalny chaos. Korytarz w tym miejscu bierze ostry zakręt na wschód, jednak panująca ciemność nie pozwala ci dostrzec gdzie biegnie dalej. W zagłębieniu zakrętu stoi oparta o ścianę drabina, oświetlona przez światło dobywające się z góry.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":21},{"Direction":"east","RoomId":22},{"Direction":"up","RoomId":5,"Door":{"KeyId":"bronze-key-lvl2"}}],"OnFirstEnterEvent":"DescentIntoCaves"},{"Id":21,"Name":"Drzwi w jaskini","Description":"W tym miejscu korytarz szybko się zwęża i kurczy, a jedyne przejście prowadzi przez mocarne drewniane drzwi. Portal drzwi zakreśla idealnie owalny kształt i jest starannie wykonany z kamiennych cegiełek. Same drzwi wyglądają na proste ale wytrzymałe, ich powierzchnię zajmują wypukłe kwadraty, ale poza nimi nie ma żadnych zdobień. Drzewo nie wygląda staro i jest zapewne w świetnej kondycji. Z prawej strony drzwi znajduje się mosiężny uchwyt do ich otwierania, a poniżej niego duża dziura na klucz. Dookoła drzwi zauważasz mnóstwo grzybów, zajmujących wszystkie wgłębienia w ścianie i podłodze.","IsNaturalLight":true,"BackgroundMusic":"LVL2","Exits":[{"Direction":"north","RoomId":20},{"Direction":"south","RoomId":55,"Door":{"KeyId":"silver-key-lvl3"}}],"OnFirstEnterEvent":"ChasingGoblinInCaves","Characters":["goblin-gatherer"]},{"Id":22,"Name":"Korytarz w jaskini","Description":"Dwie duże skały niemal blokują przejście w tym miejscu, znajduje się jednak pomiędzy nimi wąskie przejście. Lekki wiatr przepływający przez jaskinie kumuluje się w tym miejscu, gwiżdżąc leciutko. Spoglądając przez zwężenie zauważasz iż korytarz znowu skręca, tym razem na północ.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":20},{"Direction":"north","RoomId":23}]},{"Id":23,"Name":"Rozwidlenie korytarza","Description":"Główny korytarz jaskini ciągnie się dalej na północ, jednak na zachodniej ścianie znajduje się dużej wielkości dziura prowadząca do jakiejś odnogi. Ponieważ nie czujesz żadnego wiatru dochodzącego z tamtego kierunku, wnioskujesz iż musi być ona ślepym zaułkiem.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":22},{"Direction":"east","RoomId":24},{"Direction":"north","RoomId":27}]},{"Id":24,"Name":"Korytarz w jaskini","Description":"Odnoga okazuje się być dużą dziurą utworzoną przy pęknięciu skały. Olbrzymią szczelinę w skale przywalił ogromny głaz, służący teraz za sufit. W efekcie powstała wąska ale całkiem wysoka dziura w skale. Jej ściany są proste i niemalże gładkie, miejscami znajdują się tylko bruzdy po przedwiecznym pęknięciu. Dno szczeliny zajęły drobne kamienie i ziemia, tworząc całkiem solidne, choć nierówne podłoże.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":23},{"Direction":"east","RoomId":25}]},{"Id":25,"Name":"Korytarz w jaskini","Description":"Idąc wzdłuż szczeliny zauważasz iż staje się ona coraz szersza, podłoże schodzi lekko w dół i staje się coraz bardziej wilgotne. W pewnym momencie pęknięcie zmienia kierunek, przez co szczelina skręca na południe.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":24},{"Direction":"south","RoomId":26}],"Characters":["goblin-gatherer"]},{"Id":26,"Name":"Wilgotny zakątek","Description":"W tym miejscu widać koniec głazu będącego sufitem szczeliny- większe i mniejsze skały zasypały jej dalszą część a wraz z czasem uformowały niemalże litą ścianę. Utworzone w ten sposób pomieszczenie ma całkiem duże rozmiary, choć podłoga jest nierówna a w jej najgłębszym miejscu stoi spora kałuża wody. Wokół niej rośnie sporo mchu, a na nim nieznane ci gatunki grzybów.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":25}],"Items":["dog-rose"]},{"Id":27,"Name":"Korytarz w jaskini","Description":"Leżący na podłożu głaz utworzył w tym miejscu wysoki stopień. Wspinając się na niego dostrzegasz iż niewiele dalej korytarz skręca na zachód po czym ginie w mroku.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":23},{"Direction":"west","RoomId":28}]},{"Id":28,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":27},{"Direction":"west","RoomId":29}]},{"Id":29,"Name":"Rozwidlenie korytarza","Description":"W tym miejscu korytarz skręca w prawo, a w raz z nim strumień świeżego powietrza. Po lewej zauważasz jednak niedużą dziurę prowadzącą ku ciemności.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":28},{"Direction":"south","RoomId":30},{"Direction":"north","RoomId":31}],"Characters":["goblin-gatherer"]},{"Id":30,"Name":"Wilgotny zakątek","Description":"Pomieszczenie to wygląda nienaturalnie w porównaniu z całą resztą jaskini. Ściany są idealnie gładkie, proste i pozbawione nierówności. Tworzą one rodzaj pokoju wyrzeźbionego w skale, jednak nie znasz narzędzi które mogły by zrobić tak dokładnie. Podłoga jest mokra i pokryta gęstym mchem oraz grzybami. Ze sklepienia ciągle kapie woda, przez co czuć wyjątkową wilgoć.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":29}],"Items":["dog-rose"]},{"Id":31,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":29},{"Direction":"north","RoomId":32}]},{"Id":32,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":33},{"Direction":"south","RoomId":31}]},{"Id":33,"Name":"Wejście na cmentarz","Description":"Korytarz brnie nadal na przód, jednak po lewej stronie zauważasz sporej wielkości dziurę. Przyglądając się niej widzisz iż prowadzi ona do całkiem sporego pomieszczenia, znajdującego się tuż obok głównego korytarza.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":32},{"Direction":"west","RoomId":34},{"Direction":"north","RoomId":38}]},{"Id":34,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":33},{"Direction":"west","RoomId":35},{"Direction":"south","RoomId":37}]},{"Id":35,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"east","RoomId":34},{"Direction":"south","RoomId":36}],"Characters":["goblin-gatherer"]},{"Id":36,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":35},{"Direction":"east","RoomId":37}],"Items":["rusted-helmet"]},{"Id":37,"Name":"Cmentarz w jaskini","Description":"Pomieszczenie za dziurą okazało się być o wiele większe niż przewidywałeś. Jego sklepienie jest wysokie na dobre kilkanaście łokci, a objętościowo pomieściłby dobre kilkadziesiąt ludzi. Wydaje się, że pełni ono rolę pewnego rodzaju cmentarza- w całym pomieszczeniu znajduje się kilkanaście małych, usypanych z kamieni kurhanów. Ułożone są równo, jednak wykonano byle jak. Nic w pokoju nie wskazuje co jest pochowane w kurhanach.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":36},{"Direction":"north","RoomId":34}],"Items":["short-bronze-sword","bronze-sword","bronze-axe","bronze-war-hammer"]},{"Id":38,"Name":"Rozwidlenie korytarza","Description":"W tym miejscu korytarz ponownie się rozwidla, jego główna część wiedzie dalej na przód, wraz ze strumieniem czystego powietrza. Odnoga znajdująca się po prawej jest niemal tak duża jak główny korytarz i dochodzą z niej bliżej nie określone dźwięki.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":33},{"Direction":"north","RoomId":39},{"Direction":"east","RoomId":41}]},{"Id":39,"Name":"Korytarz w jaskini","Description":"Korytarz w jaskini jest całkiem szeroki i wysoki, umożliwiając ci swobodne chodzenie. Ściany jaskini są chropowate, pełne drobnych pęknięć i bruzd. Drobne kamienie wyścielają nierówną podłogę korytarza. Powietrze jest czyste, chłodne i wilgotne. Dominującą ciszę zakłóca tylko głos wiatru przelatującego przez korytarz oraz okresowe kapanie wody gdzieś z oddali.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":38},{"Direction":"north","RoomId":40}],"Characters":["goblin-gatherer"]},{"Id":40,"Name":"Gruzowisko","Description":"Korytarz nagle kończy się zawaliskiem kamieni i skał. Dwa największe głazy przysypane masą mniejszych, tworzą ścianę nie do pokonania. Przyglądając się ścianom jaskini zauważasz dookoła liczne pęknięcia i szpary, zupełnie jakby sklepienie zawaliło się w tym miejscu. Nic nie wskazuje co było przyczyną zawalenia.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":39}]},{"Id":41,"Name":"Korytarz w jaskini","Description":"Ta odnoga jest tylko trochę mniejsza od głównego korytarza, jego wygląd jest jednak bardzo podobny. Ściany są chropowate i nierówne, podobnie jak podłoga, na której jednak zalega cienka warstwa ziemi i drobnych kamieni. Bez strumienia wiatru powietrze wydaje się duszne, oraz cieplejsze. Patrząc na przód widzisz iż korytarz jest kręty i często zmienia swój kierunek. Wydaje ci się, że dostrzegłeś błysk światła oraz jakieś odgłosy, dobywające się gdzieś zza zakrętu.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":38},{"Direction":"east","RoomId":42}]},{"Id":42,"Name":"Stróżówka goblinów","Description":"Ten kawałek korytarza został zajęty przez gobliny- małe i zajadłe jaskiniowe stworzenia. Wykorzystały one kręty korytarz do zorganizowania zasadzki na wszelkich zbliżających się intruzów Rozglądając się dookoła zauważasz dużo śladów ich dłuższej obecności- dogasające ognisko, pojemniki z wodą, oraz kupy szmat, które mogły służyć za posłanie.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":41},{"Direction":"south","RoomId":43}],"Characters":["goblin-guard"]},{"Id":43,"Name":"Stróżówka goblinów","Description":"Room 43.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":42},{"Direction":"east","RoomId":44}],"Characters":["goblin-guard"]},{"Id":44,"Name":"Stróżówka goblinów","Description":"Room 44.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":43},{"Direction":"south","RoomId":45}],"Characters":["goblin-guard"]},{"Id":45,"Name":"Wejście do jaskiń goblinów","Description":"Room 45.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":44},{"Direction":"east","RoomId":46}],"Characters":["goblin-shaman","goblin-berserker"]},{"Id":46,"Name":"Jaskinia goblinów","Description":"Room 46.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":45},{"Direction":"east","RoomId":47}],"Characters":["goblin-guard"]},{"Id":47,"Name":"Jaskinia goblinów","Description":"Room 47.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":46},{"Direction":"south","RoomId":48},{"Direction":"east","RoomId":50},{"Direction":"north","RoomId":52}],"Characters":["goblin-berserker"]},{"Id":48,"Name":"Wejście do skarbca goblinów","Description":"Room 48.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":47},{"Direction":"south","RoomId":49}],"Characters":["goblin-guard","goblin-guard"]},{"Id":49,"Name":"Skarbiec goblinów","Description":"Room 49.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":48}],"Event":"BlockedByGoblinGuards"},{"Id":50,"Name":"Wejście do namiotu szamana","Description":"Room 50.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":47},{"Direction":"east","RoomId":51}],"Characters":["goblin-berserker"]},{"Id":51,"Name":"Namiot szamana goblinów","Description":"Room 51.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":50}]},{"Id":52,"Name":"Jaskinia goblinów","Description":"Room 52.","IsNaturalLight":true,"Exits":[{"Direction":"south","RoomId":47},{"Direction":"east","RoomId":53}]},{"Id":53,"Name":"Wejście do pomieszczenia ze strumykiem","Description":"Room 54.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":52},{"Direction":"east","RoomId":54}],"Characters":["goblin-guard","goblin-guard"]},{"Id":54,"Name":"Pomieszczenie ze strumykiem","Description":"Room 54.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":53}],"Event":"BlockedByGoblinGuards"},{"Id":55,"Name":"Zamknięta część jaskini","Description":"Room 55.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":21,"Door":{"KeyId":"silver-key-lvl3"}},{"Direction":"south","RoomId":56}],"OnFirstEnterEvent":"PassingThroughDemonDoor"},{"Id":56,"Name":"Room 56","Description":"Room 56.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":55},{"Direction":"east","RoomId":57}]},{"Id":57,"Name":"Room 57","Description":"Room 57.","IsNaturalLight":true,"Exits":[{"Direction":"west","RoomId":56},{"Direction":"north","RoomId":58}]},{"Id":58,"Name":"Room 58","Description":"Room 58.","IsNaturalLight":true,"Exits":[{"Direction":"down","RoomId":65}]}]}}');

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

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Item-Schema.json","ItemsTemplates":[{"Id":"gold","Name":[["|Yzłota moneta","|Yzłotej monety","|Yzłotej monecie","|Yzłotą monetę","|Yzłotą monetą","|Yzłotej monecie","|Yzłota moneto"],["|Yzłote monety","|Yzłotych monet","|Yzłotym monetom","|Yzłote monety","|Yzłotymi monetami","|Yzłotych monetach","|Yzłote monety"],["|Yzłotych monet","|Yzłotych monet","|Yzłotym monetom","|Yzłotych monet","|Yzłotymi monetami","|Yzłotych monetach","|Yzłotych monet"]],"Description":"|YZłoto, złoto, złoto, złoto.","Type":"Currency","IsStackable":true},{"Id":"stick-wood","Name":["drewniany drąg","drewnianego drąga","drewnianemu drągowi","drewniany drąg","drewnianym drągiem","drewnianym drągu","drewniany drągu"],"Idle":"leży u twoich stóp","Description":"Ten kawał kija wygląda na oderwaną i wyschniętą gałąź jakiegoś drzewa. Nie jest on całkiem prosty, zawiera kilka sęków i nieregularności ale jest długi na kilka łokci i może całkiem sprawnie posłużyć jako improwizowana broń.","Type":"Weapon1H"},{"Id":"short-sword-bronze","Name":["krótki miecz z brązu","krótkiego miecza z brązu","krótkiemu mieczowi z brązu","krótki miecz z brązu","krótkim mieczem z brązu","krótkim mieczu z brązu","krótki mieczu z brązu"],"Description":"Ten krótki miecz z brązu został wykonany z cienkiego, ale bardzo wytrzymałościowego metalu. Jego rękojeść jest otoczona cienką warstwą drewna, a ostrze jest o wiele dłuższe niż przeciętny.","Type":"Weapon1H"},{"Id":"rat-skin","Name":["szczurza skóra","szczurzej skóry","szczurzej skórze","szczurzą skórę","szczurzą skórą","szczurzej skórze","szczurza skóro"],"Description":"Skóra zdarta z jaskiniowego szczura.","Type":"WildArmor"},{"Id":"wooden-chest","Name":["drewniana skrzynia","drewnianej skrzyni","drewnianej skrzyni","drewnianą skrzynię","drewnianą skrzynią","drewnianej skrzyni","drewniana skrzynio"],"Description":"Solidna, dębowa skrzynia została wykonana z grubych, ręcznie ciosanych desek. Jej konstrukcję wzmacniają kute, żelazne okucia o surowym charakterze, chroniące narożniki przed uszkodzeniami. Na środku widnieje ciężki, stalowy rygiel z miejscem na masywną kłódkę, strzegącą zawartości przed niepowołanymi rękami. Drewno jest ciemne i wygładzone przez dekady użytkowania, a brak zdobień sugeruje jej użytkowy charakter.","Type":"StaticContainer","Idle":"stoi pod ścianą"},{"Id":"sapphire-round","Name":["okrągły szafir","okrągłego szafiru","okrągłemu szafirowi","okrągły szafir","okrągłym szafirem","okrągłym szafirze","okrągły szafirze"],"Description":"Szafir jest kamieniem szlachetnym o barwie ciemno niebieskiej. Zazwyczaj klejnoty szlifowane są w sześcienne lub inne kanciaste kształty, ten jednak jest uformowany w kształt kuli. Przyglądając się bliżej nie zauważasz żadnych śladów szlifowania, zachwyca cię również niezwykła perfekcja kuli.","Type":"Quest"},{"Id":"simple-iron-key","Name":["prosty klucz z żelaza","prostego klucza z żelaza","prostemu kluczowi z żelaza","prosty klucz z żelaza","prostym kluczem z żelaza","prostym kluczu z żelaza","prosty kluczu z żelaza"],"Description":"Ten prosty, żelazny klucz charakteryzuje się surową formą i śladami ręcznego kucia, które wskazują na jego użytkowy a nie ozdobny charakter. Jego długa, cylindryczna łodyga kończy się prostokątnym piórem z kilkoma precyzyjnymi nacięciami, dopasowanymi do mechanizmu zamka. Zwieńczenie stanowi koliste ucho, pozwalające na wygodne trzymanie narzędzia lub zawieszenie go na rzemieniu przy pasie.","Type":"Key"},{"Id":"bronze-key","Name":["klucz z brązu","klucza z brązu","kluczowi z brązu","klucz z brązu","kluczem z brązu","kluczu z brązu","kluczu z brązu"],"Description":"Ten klucz z brązu prezentuje sobą kompromis między estetyką a kosztem wykonania. Jest niewielkich rozmiarów, z łatwością chowa Ci się w dłoni. Pióro jest proste, z widocznie ręcznie wykonanymi nacięciami, lekko odkształconymi od używania i miękkości materiału. Trzon jest wąski a główka jest ręcznie wycięta w ozdobny wzór, który mimo swojej prostoty nadaje kluczowi nieco elegancji. Brązowy kolor z delikatnym patynowaniem świadczy o jego wieku i niezbyt częstym użytkowaniu.","Type":"Key"}]}');

/***/ },

/***/ "./res/Local.pl.json"
/*!***************************!*\
  !*** ./res/Local.pl.json ***!
  \***************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"Local":{"Directions":{"north":["północ","północy","północy","północ","północą","północy","północy"],"south":["południe","południa","południu","południe","południem","południu","południu"],"east":["wschód","wschodu","wschodowi","wschód","wschodem","wschodzie","wschodzie"],"west":["zachód","zachodu","zachodowi","zachód","zachodem","zachodzie","zachodzie"],"up":["góra","góry","górze","górę","górą","górze","góro"],"down":["dół","dołu","dołowi","dół","dołem","dole","dole"]},"Stats":{"HealthLevels":{"Full":"w pełni zdrowia","LightWounds":"lekko ranny","MediumWounds":"średnio rany","SeriousWounds":"poważnie ranny","HeavyWounds":"ciężko ranny","NearDeath":"bliski śmierci","Dead":"martwy"}},"Commands":{"Close":{"NoDirection":"Zamknąć drzwi w którym kierunku?","WrongDirection":"{0} nie jest kierunkiem.","NoDoor":"Tam nie ma drzwi.","AlreadyClosed":"Drzwi są już zamknięte.","Closed":"Zamykasz drzwi."},"Drop":{"NoArgument":"Co chcesz wyrzucić?","NoItems":"Przecież nic nie masz biedaku.","NoItemFound":"Nie masz czegoś takiego jak {0}.","Dropped":"Upuszczasz {0}."},"Exam":{"NoArgument":"Czemu chcesz się przyjęć?","NoObject":"Nie znajdujesz niczego takiego jak {0}.","Contains":"Zawiera w sobie:","LockedContainer":"Pojemnik jest zamknięty.","HealthLevel":"{0} jest {1}."},"Go":{"WrongDirection":"Może lepiej zostać tutaj i zjeść kilka pierogów?","NoPassage":"Nie możesz tam pójść.","PassageClosed":"Przejście jest zamknięte."},"Inventory":{"YourItems":"Obecnie przy sobie posiadasz:","NoItems":"{0}Ogólnie nic"},"Load":{"Loading":"Ładowanie gry...","Loaded":"Gra została załadowana."},"Look":{"CantSee":"Nic nie widzisz w tej ciemności.","NoObject":"Tu nie ma nic takiego jak {0}.","YouLookAt":"Przyglądasz się {0}.","Exits":"Wyjścia","DefaultIdle":"leży na ziemi"},"NoCommand":{"NoCommand":"Chyba ty."},"Open":{"NoDirection":"Otworzyć drzwi w którym kierunku?","WrongDirection":"{0} nie jest kierunkiem.","NoDoor":"Tam nie ma drzwi.","AlreadyOpen":"Drzwi są już otwarte.","Locked":"Drzwi są zamknięte na klucz.","Opened":"Otwierasz drzwi."},"Save":{"Saved":"Gra została zapisana."},"Scan":{"CantSee":"Nic nie widzisz w tej ciemności.","LookingAroundYouSee":"Rozglądając się dookoła dostrzegasz:","Here":"Tutaj:","InDirection":"Na {0}:","NoOneThere":"nikogo nie ma","ClosedDoor":"zamknięte drzwi"},"Take":{"NoArgument":"Wziąć co?","NoItems":"Nic tu nie ma.","NoItemFound":"Tutaj nie ma czegoś takiego jak {0}.","NoItemFoundInContainer":"{0} nie zawiera czegoś takiego jak {1}.","CannotPickUp":"Nie możesz podnieść {0}.","PickedUp":"Podnosisz {0}.","ContainerIsLocked":"{0} jest zamknięty.","IsNoContainer":"{0} nie jest pojemnikiem.","TakeItemFromContainer":"Wyjmujesz {0} z {1}."}},"GlobalEvents":{"TestGlobalEvent":{"Message":"Testing global events..."}}}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsZUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUNMLENBQUM7QUFDTixDQUFDO0FBS0QsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvR2xvYmFsRXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9Jbml0R2FtZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0Nsb3NlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Db21tYW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Eb3duLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Ecm9wLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9FYXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9FdmFsLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9FeGFtLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Hby50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvSW52ZW50b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Kc29uLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Mb2FkLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Mb29rLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Ob0NvbW1hbmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL05vcnRoLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9PcGVuLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9SZWxvYWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1NhdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1NjYW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1NvdXRoLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9UYWtlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9UZXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9VcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvV2VzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHNVdGlscy9Db21tYW5kVHJlZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvUmVnaXN0ZXJDb21tYW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvRW5naW5lVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL0lucHV0RnVuY3Rpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9Qcm9tcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL1JhbmRvbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvU3RyaW5nVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0RpcmVjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRW51bUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRXF1aXBtZW50U2xvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvR2xvYmFsRXZlbnRUeXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9HcmFtbWFDYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9JdGVtVHlwZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL0NoYXJhY3RlckZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZhY3Rvcmllcy9JdGVtRmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL1Jvb21GYWN0b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9DaGFyYWN0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3Rlckxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3RlclN0YXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9DaGFyYWN0ZXJUZW1wbGF0ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VudGl0eUJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VudGl0eUxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VxdWlwbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2FtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2FtZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0dsb2JhbEV2ZW50QXJncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbUxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW1Mb2NrLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbURvb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1Jvb21FeGl0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tRXhpdHNMaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvSW5pdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbmdpbmVVdGlscyB9IGZyb20gJy4vY29tbW9uTG9naWMvRW5naW5lVXRpbHMnO1xyXG5pbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2xvYmFsRXZlbnRBcmdzIH0gZnJvbSAnLi9tb2RlbC9HbG9iYWxFdmVudEFyZ3MnO1xyXG5cclxuY2xhc3MgR2xvYmFsRXZlbnRzQ2xhc3Mge1xyXG4gICAgLy8gSWYgZ2xvYmFsIGV2ZW50cyByZXR1cm5zIHRydWUsIGl0IHNpZ25hbHMgaW50ZXJydXB0aW9uIG9mIGNvbW1hbmQgZXhlY3V0aW9uIGZsb3dcclxuICAgIC8vIHN1Y2ggZXZlbnQgbXVzdCBjYWxsIG9uZSBvZiB0aGUgc3VwcGxpZWQgY2FsbGJhY2tzOlxyXG4gICAgLy8gLSBhcmdzLkNvbnRpbnVlQ29tbWFuZENhbGxiYWNrIGlmIHRoZSBldmVudCBkZWNpZGVzIGl0IHdhbnQgdG8gcmVzdW1lIHRoZSBleGVjdXRpb24gXHJcbiAgICAvLyAgICAgIG9mIHRoZSBjb21tYW5kIGl0IHdhcyBpbnZva2VkIGJ5XHJcbiAgICAvLyAtIGFyZ3MuRmluaXNoQ29tbWFuZENhbGxiYWNrIGlmIHRoZSBldmVudCBkZWNpZGVzIHRvIHRlcm1pbmF0ZSB0aGUgZXhlY3V0aW9uIFxyXG4gICAgLy8gICAgICBvZiB0aGUgY29tbWFuZCBpdCB3YXMgaW52b2tlZCBieVxyXG4gICAgW2dsb2JhbEV2ZW50TmFtZTogc3RyaW5nXTogKGFyZ3M6IEdsb2JhbEV2ZW50QXJncykgPT4gYm9vbGVhbjtcclxuICAgIFRlc3RHbG9iYWxFdmVudChhcmdzOiBHbG9iYWxFdmVudEFyZ3MpIHtcclxuICAgICAgICBFbmdpbmVVdGlscy5PdXRwdXRQcmludGVyKExvY2FsLkdsb2JhbEV2ZW50cy5UZXN0R2xvYmFsRXZlbnQuTWVzc2FnZSwgYXJncy5Db250aW51ZUNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR2xvYmFsRXZlbnRzID0gbmV3IEdsb2JhbEV2ZW50c0NsYXNzKCk7XHJcbiIsImltcG9ydCB7IEl0ZW1UeXBlcyB9IGZyb20gJy4uL3Jlcy9JdGVtVHlwZXMuanNvbic7XHJcbmltcG9ydCB7IEl0ZW1zVGVtcGxhdGVzIH0gZnJvbSAnLi4vcmVzL0l0ZW1zLmpzb24nO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJzVGVtcGxhdGVzIH0gZnJvbSAnLi4vcmVzL0NoYXJhY3RlcnMuanNvbic7XHJcbmltcG9ydCB7IExvY2FsIGFzIExvY2FsUGwgfSBmcm9tICcuLi9yZXMvTG9jYWwucGwuanNvbic7XHJcbmltcG9ydCB7IEdhbWVUZW1wbGF0ZSB9IGZyb20gJy4uL3Jlcy9HYW1lLmpzb24nO1xyXG5pbXBvcnQgeyBHYW1lTW9kZWwgfSBmcm9tICcuL21vZGVsL0dhbWUnO1xyXG5pbXBvcnQgeyBJdGVtVHlwZXMgYXMgSXRlbVR5cGVzTGlzdCB9IGZyb20gJy4vbW9kZWwvSXRlbVR5cGVzJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9DaGFyYWN0ZXJUZW1wbGF0ZXMnO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9JdGVtVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL21vZGVsL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlcyB9IGZyb20gJy4vbW9kZWwvUm9vbVRlbXBsYXRlcyc7XHJcblxyXG5leHBvcnQgdmFyIExvY2FsID0gTG9jYWxQbDtcclxuZXhwb3J0IHZhciBHYW1lOiBHYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbmV4cG9ydCB2YXIgVmVyc2lvbiA9ICcnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEluaXRHYW1lRGF0YSgpIHtcclxuICAgIEdhbWUgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbiAgICBHYW1lRGF0YS5JdGVtVHlwZXMgPSBuZXcgSXRlbVR5cGVzTGlzdChJdGVtVHlwZXMpO1xyXG4gICAgR2FtZURhdGEuSXRlbVRlbXBsYXRlcyA9IG5ldyBJdGVtVGVtcGxhdGVzKEl0ZW1zVGVtcGxhdGVzKTtcclxuICAgIEdhbWVEYXRhLkNoYXJhY3RlclRlbXBsYXRlcyA9IG5ldyBDaGFyYWN0ZXJUZW1wbGF0ZXMoQ2hhcmFjdGVyc1RlbXBsYXRlcyk7XHJcbiAgICBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzID0gbmV3IFJvb21UZW1wbGF0ZXMoR2FtZVRlbXBsYXRlLlJvb21zKTtcclxuICAgIFZlcnNpb24gPSBFbmdpbmUuTG9hZERhdGEoJ3ZlcnNpb24udHh0JykucmVwbGFjZSgnXFxuJywgRW5naW5lLkVuZExpbmUpO1xyXG5cclxuICAgIEdhbWUuUGxheWVyLkxvY2F0aW9uID0gR2FtZS5TdGFydGluZ1Jvb207XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2FkR2FtZShzYXZlZEdhbWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgZ2FtZSA9IEpTT04ucGFyc2Uoc2F2ZWRHYW1lKSBhcyBHYW1lTW9kZWw7XHJcbiAgICBHYW1lID0gbmV3IEdhbWVNb2RlbCgpO1xyXG4gICAgR2FtZS5sb2FkR2FtZShnYW1lKTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsb3NlIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuQ2xvc2UuTm9EaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXJlY3Rpb24gPSBEaXJlY3Rpb25IZWxwZXIucGFyc2VTaG9ydChhcmd1bWVudC50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuQ2xvc2UuV3JvbmdEaXJlY3Rpb24uZm9ybWF0KGFyZ3VtZW50KSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VEaXJlY3Rpb24oZGlyZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZURpcmVjdGlvbihkaXJlY3Rpb246IERpcmVjdGlvbikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLmdldExvY2F0aW9uKCkpO1xyXG4gICAgICAgIGxldCBleGl0ID0gcm9vbS5nZXRFeGl0KGRpcmVjdGlvbik7XHJcbiAgICAgICAgaWYgKGV4aXQgPT09IG51bGwgfHwgZXhpdC5pc0hpZGRlbigpIHx8ICFleGl0LmlzRG9vcigpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuQ2xvc2UuTm9Eb29yKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4aXQuaXNDbG9zZWQoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkNsb3NlLkFscmVhZHlDbG9zZWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleGl0LkRvb3IhLklzQ2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICBsZXQgbmV4dFJvb20gPSBHYW1lLmdldFJvb20oZXhpdC5nZXRSb29tSWQoKSk7XHJcbiAgICAgICAgbGV0IG5leHREb29yID0gbmV4dFJvb20uZ2V0RXhpdFRvUm9vbShyb29tLklkKT8uRG9vcjtcclxuICAgICAgICBpZiAobmV4dERvb3IpIHtcclxuICAgICAgICAgICAgbmV4dERvb3IuSXNDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkNsb3NlLkNsb3NlZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21tYW5kIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBFeGVjdXRlKGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5FeGVjdXRlQm9keShjb21tYW5kLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgICAgIGlmICghY29tbWFuZENhbGxiYWNrLmludGVycnVwdEZsb3cpIHtcclxuICAgICAgICAgICAgY29tbWFuZENhbGxiYWNrLkNhbGxJZk5vdENhbGxlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFic3RyYWN0IEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKTogdm9pZDtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRG93biBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoX2NvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24uZG93biwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRHJvcCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRHJvcC5Ob0FyZ3VtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50LnRvTG93ZXJDYXNlKCkgPT09ICdhbGwnKSB7XHJcbiAgICAgICAgICAgIGlmICghR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRHJvcC5Ob0l0ZW1zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kcm9wQWxsKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50LCBjb21tYW5kLmdldE51bWJlcigxKSk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkRyb3AuTm9JdGVtRm91bmQuZm9ybWF0KGFyZ3VtZW50KSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZHJvcEl0ZW0oaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyb3BBbGwoKSB7XHJcbiAgICAgICAgd2hpbGUgKEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcEl0ZW0oR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZWxlbWVudEF0KDApISk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyb3BJdGVtKGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5yZW1vdmUoaXRlbSk7XHJcbiAgICAgICAgR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKS5nZXRJdGVtcygpLmFkZChpdGVtKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkRyb3AuRHJvcHBlZC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQmllcm5paykpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRWFzdCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5lYXN0LCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuaW1wb3J0IHsgR2FtZSBhcyBHYW1lVmFyIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFdmFsIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZ2FtZSA9IEdhbWVWYXI7XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoZXZhbChhcmd1bWVudCkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi4vbW9kZWwvQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuaW1wb3J0IHsgVGFrZSB9IGZyb20gJy4vVGFrZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRXhhbSBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKTtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGxldCBudW1iZXIgPSBjb21tYW5kLmdldE51bWJlcigxKTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRXhhbS5Ob0FyZ3VtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IHJvb20uZ2V0Q2hhcmFjdGVycygpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGNoYXJhY3RlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4YW1DaGFyYWN0ZXIoY2hhcmFjdGVyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGl0ZW0gPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhhbUl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0gPSByb29tLmdldEl0ZW1zKCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4YW1JdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkV4YW0uTm9PYmplY3QuZm9ybWF0KGFyZ3VtZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhhbUNoYXJhY3RlcihjaGFyYWN0ZXI6IENoYXJhY3Rlcikge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9vay5Zb3VMb29rQXQuZm9ybWF0KGNoYXJhY3Rlci5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChjaGFyYWN0ZXIuZ2V0RGVzY3JpcHRpb24oKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgTG9jYWwuQ29tbWFuZHMuRXhhbS5IZWFsdGhMZXZlbC5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXIuZ2V0TmFtZSgpLnN0YXJ0V2l0aFVwcGVyKCksXHJcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXIuZ2V0SGVhbHRoTGV2ZWwodHJ1ZSksXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvL1RPRE86IGVrd2lwdW5la1xyXG4gICAgfVxyXG4gICAgZXhhbUl0ZW0oaXRlbTogSXRlbSkge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9vay5Zb3VMb29rQXQuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoaXRlbS5nZXREZXNjcmlwdGlvbigpKTtcclxuICAgICAgICBpZiAoaXRlbS5pc0NvbnRhaW5lcigpKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmlzTG9ja2VkKCkpIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRXhhbS5Mb2NrZWRDb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRXhhbS5Db250YWlucyk7XHJcbiAgICAgICAgICAgIGxldCBpdGVtcyA9IGl0ZW0uZ2V0SW52ZW50b3J5KCkhO1xyXG4gICAgICAgICAgICBpZiAoaXRlbXMuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoaXRlbXMucHJpbnRTaG9ydEZvcm1hdCgpKTtcclxuICAgICAgICAgICAgICAgIENvbW1hbmRzLlRha2UudGFrZUFsbEdvbGQoaXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkludmVudG9yeS5Ob0l0ZW1zLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoNCkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uSGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgR2xvYmFsRXZlbnRUeXBlIH0gZnJvbSAnLi4vZW51bXMvR2xvYmFsRXZlbnRUeXBlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudEFyZ3MgfSBmcm9tICcuLi9tb2RlbC9HbG9iYWxFdmVudEFyZ3MnO1xyXG5pbXBvcnQgeyBSb29tIH0gZnJvbSAnLi4vbW9kZWwvUm9vbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdvIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IERpcmVjdGlvbkhlbHBlci5wYXJzZVNob3J0KGFyZ3VtZW50LnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuR28uV3JvbmdEaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdvVG9EaXJlY3Rpb24oZGlyZWN0aW9uLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIGdvVG9EaXJlY3Rpb24oZGlyZWN0aW9uOiBhbnksIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGV4aXQgPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuZ2V0TG9jYXRpb24oKSkuZ2V0RXhpdChkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAoZXhpdCA9PT0gbnVsbCB8fCBleGl0LmlzSGlkZGVuKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5Ob1Bhc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXhpdC5pc0Nsb3NlZCgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuR28uUGFzc2FnZUNsb3NlZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBuZXdSb29tID0gR2FtZS5nZXRSb29tKGV4aXQuZ2V0Um9vbUlkKCkpO1xyXG4gICAgICAgIEdhbWUuUGxheWVyLnNldFByZXZpb3VzTG9jYXRpb24oR2FtZS5QbGF5ZXIuZ2V0TG9jYXRpb24oKSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VQbGF5ZXJMb2NhdGlvbihuZXdSb29tLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVBsYXllckxvY2F0aW9uKHJvb206IFJvb20sIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuTG9jYXRpb24gPSByb29tLklkO1xyXG5cclxuICAgICAgICB0aGlzLm9uRmlyc3RFbnRlckdsb2JhbEV2ZW50cyhcclxuICAgICAgICAgICAgcm9vbSxcclxuICAgICAgICAgICAgKCkgPT4gdGhpcy5hZnRlck9uRmlyc3RFbnRlckdsb2JhbEV2ZW50cyhyb29tLCBjb21tYW5kQ2FsbGJhY2spLFxyXG4gICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2ssXHJcbiAgICAgICAgKTtcclxuICAgICAgICByb29tLklzVmlzaXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgb25GaXJzdEVudGVyR2xvYmFsRXZlbnRzKHJvb206IFJvb20sIGNvbnRpbnVlQ2FsbGJhY2s6IEZ1bmN0aW9uLCB0ZXJtaW5hdGVDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHJvb20uZ2V0T25GaXJzdEVudGVyRXZlbnQoKSAhPT0gbnVsbCAmJiAhcm9vbS5Jc1Zpc2l0ZWQpIHtcclxuICAgICAgICAgICAgbGV0IGludGVycnVwdCA9IEdhbWUuaW52b2tlR2xvYmFsRXZlbnQoXHJcbiAgICAgICAgICAgICAgICByb29tLmdldE9uRmlyc3RFbnRlckV2ZW50KCkhLFxyXG4gICAgICAgICAgICAgICAgbmV3IEdsb2JhbEV2ZW50QXJncyhHbG9iYWxFdmVudFR5cGUuQmVmb3JlUm9vbUVudGVyLCByb29tLCB0ZXJtaW5hdGVDYWxsYmFjaywgY29udGludWVDYWxsYmFjayksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcnJ1cHQpIHtcclxuICAgICAgICAgICAgICAgIHRlcm1pbmF0ZUNhbGxiYWNrLmludGVycnVwdEZsb3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250aW51ZUNhbGxiYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWZ0ZXJPbkZpcnN0RW50ZXJHbG9iYWxFdmVudHMocm9vbTogUm9vbSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Mb29rLmxvb2tSb29tKHJvb20pO1xyXG4gICAgICAgIHRoaXMub25FbnRlckdsb2JhbEV2ZW50cyhyb29tLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW50ZXJHbG9iYWxFdmVudHMocm9vbTogUm9vbSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocm9vbS5nZXRPbkVudGVyRXZlbnQoKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaW50ZXJydXB0ID0gR2FtZS5pbnZva2VHbG9iYWxFdmVudChcclxuICAgICAgICAgICAgICAgIHJvb20uZ2V0T25FbnRlckV2ZW50KCkhLFxyXG4gICAgICAgICAgICAgICAgbmV3IEdsb2JhbEV2ZW50QXJncyhHbG9iYWxFdmVudFR5cGUuQmVmb3JlUm9vbUVudGVyLCByb29tLCBjb21tYW5kQ2FsbGJhY2ssICgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZENhbGxiYWNrLkNhbGxJZk5vdENhbGxlZCgpLFxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKGludGVycnVwdCkge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZENhbGxiYWNrLmludGVycnVwdEZsb3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb21tYW5kQ2FsbGJhY2suQ2FsbElmTm90Q2FsbGVkKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5JbnZlbnRvcnkuWW91ckl0ZW1zKTtcclxuICAgICAgICBpZiAoIUdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuSW52ZW50b3J5Lk5vSXRlbXMuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkucHJpbnRTaG9ydEZvcm1hdCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBHYW1lIGFzIEdhbWVWYXIgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4uL21vZGVsL0dhbWVEYXRhJztcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZ2FtZSA9IEdhbWVWYXI7XHJcbiAgICAgICAgbGV0IGdhbWVEYXRhID0gR2FtZURhdGE7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChKU09OLnN0cmluZ2lmeShldmFsKGFyZ3VtZW50KSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgTG9hZEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCBzYXZlRGF0YSA9IEVuZ2luZS5Mb2FkKCk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb2FkLkxvYWRpbmcpO1xyXG4gICAgICAgIExvYWRHYW1lKHNhdmVEYXRhKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvYWQuTG9hZGVkKTtcclxuICAgICAgICBDb21tYW5kcy5Mb29rLmxvb2tSb29tKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uSGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL21vZGVsL1Jvb20nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb29rIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG5cclxuICAgICAgICBpZiAoIUdhbWUuUGxheWVyLmNhblNlZSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9vay5DYW50U2VlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb29rUm9vbShyb29tKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG51bWJlciA9IGNvbW1hbmQuZ2V0TnVtYmVyKDEpO1xyXG4gICAgICAgIGxldCBjaGFyYWN0ZXIgPSByb29tLmdldENoYXJhY3RlcnMoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChjaGFyYWN0ZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb29rQ2hhcmFjdGVyKGNoYXJhY3Rlcik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gcm9vbS5nZXRJdGVtcygpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb29rSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLk5vT2JqZWN0LmZvcm1hdChhcmd1bWVudCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tSb29tKHJvb20/OiBSb29tKSB7XHJcbiAgICAgICAgaWYgKHJvb20gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByb29tID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSAnJztcclxuICAgICAgICBtZXNzYWdlICs9IHJvb20uZ2V0TmFtZSgpICsgRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgbWVzc2FnZSArPSB0aGlzLmV4aXRzU3RyaW5nKHJvb20pICsgRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgbWVzc2FnZSArPSBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICBtZXNzYWdlICs9IHJvb20uZ2V0RGVzY3JpcHRpb24oKTtcclxuICAgICAgICBpZiAocm9vbS5nZXRDaGFyYWN0ZXJzKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBFbmdpbmUuRW5kTGluZSArIEVuZ2luZS5FbmRMaW5lICsgcm9vbS5nZXRDaGFyYWN0ZXJzKCkucHJpbnRMb25nRm9ybWF0KGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJvb20uZ2V0SXRlbXMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICBpZiAoIXJvb20uZ2V0Q2hhcmFjdGVycygpLmFueSgpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmUgKyByb29tLmdldEl0ZW1zKCkucHJpbnRMb25nRm9ybWF0KHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KG1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9va0l0ZW0oaXRlbTogSXRlbSkge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9vay5Zb3VMb29rQXQuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoaXRlbS5nZXREZXNjcmlwdGlvbigpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb29rQ2hhcmFjdGVyKGNoYXJhY3RlcjogQ2hhcmFjdGVyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoY2hhcmFjdGVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KGNoYXJhY3Rlci5nZXREZXNjcmlwdGlvbigpKTtcclxuICAgIH1cclxuXHJcbiAgICBleGl0c1N0cmluZyhyb29tOiBSb29tKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcmV0dXJuU3RyaW5nID0gJ3xnJyArIExvY2FsLkNvbW1hbmRzLkxvb2suRXhpdHMgKyAnOiBbICc7XHJcbiAgICAgICAgbGV0IGZpcnN0RXhpdCA9IHRydWU7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbnMgPSByb29tLmdldEV4aXRzRGlyZWN0aW9ucygpO1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZmlyc3RFeGl0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gJywgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaXJzdEV4aXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHJvb20uZ2V0RXhpdChkaXJlY3Rpb24pPy5pc0Nsb3NlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gJyonO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBEaXJlY3Rpb25IZWxwZXIuZ2V0TG9jYWxlKGRpcmVjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcgXXxXJztcclxuICAgICAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vQ29tbWFuZCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTm9Db21tYW5kLk5vQ29tbWFuZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vcnRoIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLm5vcnRoLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgT3BlbiBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk9wZW4uTm9EaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkaXJlY3Rpb24gPSBEaXJlY3Rpb25IZWxwZXIucGFyc2VTaG9ydChhcmd1bWVudC50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuT3Blbi5Xcm9uZ0RpcmVjdGlvbi5mb3JtYXQoYXJndW1lbnQpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vcGVuRGlyZWN0aW9uKGRpcmVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgb3BlbkRpcmVjdGlvbihkaXJlY3Rpb246IERpcmVjdGlvbikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLmdldExvY2F0aW9uKCkpO1xyXG4gICAgICAgIGxldCBleGl0ID0gcm9vbS5nZXRFeGl0KGRpcmVjdGlvbik7XHJcbiAgICAgICAgaWYgKGV4aXQgPT09IG51bGwgfHwgZXhpdC5pc0hpZGRlbigpIHx8ICFleGl0LmlzRG9vcigpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuT3Blbi5Ob0Rvb3IpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWV4aXQuaXNDbG9zZWQoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk9wZW4uQWxyZWFkeU9wZW4pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXhpdC5pc0xvY2tlZCgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuT3Blbi5Mb2NrZWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV4aXQuRG9vciEuSXNDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgICBsZXQgbmV4dFJvb20gPSBHYW1lLmdldFJvb20oZXhpdC5nZXRSb29tSWQoKSk7XHJcbiAgICAgICAgbGV0IG5leHREb29yID0gbmV4dFJvb20uZ2V0RXhpdFRvUm9vbShyb29tLklkKT8uRG9vcjtcclxuICAgICAgICBpZiAobmV4dERvb3IpIHtcclxuICAgICAgICAgICAgbmV4dERvb3IuSXNDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5PcGVuLk9wZW5lZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlbG9hZCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIEVuZ2luZS5SZWxvYWQoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXZlIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KEdhbWUpO1xyXG4gICAgICAgIEVuZ2luZS5TYXZlKGpzb24pO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuU2F2ZS5TYXZlZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2FuIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgaWYgKCFHYW1lLlBsYXllci5jYW5TZWUoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlNjYW4uQ2FudFNlZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBsYXllclJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlNjYW4uTG9va2luZ0Fyb3VuZFlvdVNlZSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TY2FuLkhlcmUpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQodGhpcy5wcmludENoYXJhY3RlcnMoR2FtZS5QbGF5ZXIuTG9jYXRpb24pKTtcclxuXHJcbiAgICAgICAgRGlyZWN0aW9uSGVscGVyLmZvckVhY2goKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZXhpdCA9IHBsYXllclJvb20uZ2V0RXhpdChkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAoZXhpdCAhPT0gbnVsbCAmJiAhZXhpdC5pc0hpZGRlbigpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlNjYW4uSW5EaXJlY3Rpb24uZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEaXJlY3Rpb25IZWxwZXIuZ2V0TG9jYWxlKGRpcmVjdGlvbiwgR3JhbW1hQ2FzZS5NaWVqc2Nvd25payksXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXhpdC5pc0Nsb3NlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoNCkgKyBMb2NhbC5Db21tYW5kcy5TY2FuLkNsb3NlZERvb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KHRoaXMucHJpbnRDaGFyYWN0ZXJzKGV4aXQuUm9vbUlkKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50Q2hhcmFjdGVycyhyb29tSWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKHJvb21JZCk7XHJcbiAgICAgICAgaWYgKCFyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpICsgTG9jYWwuQ29tbWFuZHMuU2Nhbi5Ob09uZVRoZXJlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb20uZ2V0Q2hhcmFjdGVycygpLnByaW50U2hvcnRGb3JtYXQodHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvdXRoIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLnNvdXRoLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFrZSBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCBhcmd1bWVudDEgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudDEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLk5vQXJndW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbnVtYmVyMSA9IGNvbW1hbmQuZ2V0TnVtYmVyKDEpO1xyXG4gICAgICAgIGxldCBhcmd1bWVudDIgPSBjb21tYW5kLmdldEFyZ3VtZW50KDIpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudDIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy9waWNrIHVwIGl0ZW0gZnJvbSBsb2NhdGlvblxyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnQxLnRvTG93ZXJDYXNlKCkgPT09ICdhbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Ob0l0ZW1zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VBbGxGcm9tTG9jYXRpb24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtTGlzdCA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKTtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gaXRlbUxpc3QuZmluZChhcmd1bWVudDEsIG51bWJlcjEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtRm91bmQuZm9ybWF0KGFyZ3VtZW50MSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudGFrZUl0ZW1Gcm9tTG9jYXRpb24oaXRlbSwgaXRlbUxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy90YWtlIGl0ZW0gZnJvbSBjb250YWluZXJcclxuICAgICAgICAgICAgbGV0IG51bWJlcjIgPSBjb21tYW5kLmdldE51bWJlcigyKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQyLCBudW1iZXIyKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlSXRlbUZyb21Db250YWluZXIoYXJndW1lbnQxLCBudW1iZXIxLCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbUxpc3QgPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IGl0ZW1MaXN0LmZpbmQoYXJndW1lbnQyLCBudW1iZXIyKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlSXRlbUZyb21Db250YWluZXIoYXJndW1lbnQxLCBudW1iZXIxLCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtRm91bmQuZm9ybWF0KGFyZ3VtZW50MikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWtlSXRlbUZyb21Db250YWluZXIobmFtZTogc3RyaW5nLCBudW1iZXI6IG51bWJlciwgY29udGFpbmVyOiBJdGVtKSB7XHJcbiAgICAgICAgaWYgKCFjb250YWluZXIuaXNDb250YWluZXIoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuSXNOb0NvbnRhaW5lci5mb3JtYXQoY29udGFpbmVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lci5pc0xvY2tlZCgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Db250YWluZXJJc0xvY2tlZC5mb3JtYXQoY29udGFpbmVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gY29udGFpbmVyLmdldEludmVudG9yeSgpIS5maW5kKG5hbWUsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtRm91bmRJbkNvbnRhaW5lci5mb3JtYXQoY29udGFpbmVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpLCBuYW1lKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRha2VJdGVtKGl0ZW0sIGNvbnRhaW5lci5nZXRJbnZlbnRvcnkoKSEpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlRha2UuVGFrZUl0ZW1Gcm9tQ29udGFpbmVyLmZvcm1hdChcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ2V0TmFtZSgpLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykuc3RhcnRXaXRoVXBwZXIoKSxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRha2VJdGVtRnJvbUxvY2F0aW9uKGl0ZW06IEl0ZW0sIGl0ZW1MaXN0OiBJdGVtTGlzdCkge1xyXG4gICAgICAgIGlmICghaXRlbS5pc1Rha2VhYmxlKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLkNhbm5vdFBpY2tVcC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuRG9wZWxuaWFjeikpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50YWtlSXRlbShpdGVtLCBpdGVtTGlzdCk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLlBpY2tlZFVwLmZvcm1hdChpdGVtLmdldE5hbWUoR3JhbW1hQ2FzZS5CaWVybmlrKSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRha2VBbGxGcm9tTG9jYXRpb24oKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1MaXN0ID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKS5nZXRJdGVtcygpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpdGVtID0gaXRlbUxpc3QuZWxlbWVudEF0KGkpOyBpdGVtICE9IG51bGw7IGl0ZW0gPSBpdGVtTGlzdC5lbGVtZW50QXQoaSkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRha2VJdGVtRnJvbUxvY2F0aW9uKGl0ZW0sIGl0ZW1MaXN0KSkge1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRha2VBbGxHb2xkKGNvbnRhaW5lcjogSXRlbSkge1xyXG4gICAgICAgIGxldCBpdGVtTGlzdCA9IGNvbnRhaW5lci5nZXRJbnZlbnRvcnkoKSE7XHJcbiAgICAgICAgbGV0IGdvbGQ6IEl0ZW0gfCBudWxsID0gbnVsbDtcclxuICAgICAgICB3aGlsZSAoKGdvbGQgPSBpdGVtTGlzdC5maW5kQnlJZCgnZ29sZCcpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRha2VJdGVtKGdvbGQsIGl0ZW1MaXN0KTtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlRha2UuVGFrZUl0ZW1Gcm9tQ29udGFpbmVyLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICAgICBnb2xkLmdldE5hbWUoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKS5zdGFydFdpdGhVcHBlcigpLFxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGFrZUl0ZW0oaXRlbTogSXRlbSwgaXRlbUxpc3Q6IEl0ZW1MaXN0KSB7XHJcbiAgICAgICAgaXRlbUxpc3QucmVtb3ZlKGl0ZW0pO1xyXG4gICAgICAgIEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFkZChpdGVtKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBjb21tYW5kLmdldENvbW1hbmQoKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXROdW1iZXIoMSkgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXRBcmd1bWVudCgxKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXROdW1iZXIoMikgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXRBcmd1bWVudCgyKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgR2FtZS5nZXROYW1lKCkgK1xyXG4gICAgICAgICAgICAgICAgJyBhYWEnLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICdOYXp5d2FtIHNpxJkgfGJ7MH18Vy4gVGFrIHxCezB9fFcgdG8gd8WCYcWbbmllIG1vamUgaW1pxJkuIEEgbmllLCBtb8W8ZSB0byBqZWRuYWsgfFJ7MX18Vz8gTmllZWUsIGNoeWJhIHxHezJ9fFcuLi4gTmllLCB0byBuaWUgdG8uLi4gV2llbSEgfFB7M318VyB0byBtb2plIHByYXdkeml3ZSBpbWnEmSEnLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICdHYW1lLlBsYXllci5nZXROYW1lKCknLFxyXG4gICAgICAgICAgICAgICAgJ1dvanRlayBQxJlkeml3w7NyJyxcclxuICAgICAgICAgICAgICAgICdTa3J6eXBlayBOYWRhY2h1JyxcclxuICAgICAgICAgICAgICAgICdaZHppb2NobyBNb2N6eXfEhXMnLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnQ3phcyBuYSBrb2xvciB0ZXN0IScpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xiRGFyayBCbHVlezB9fEJCbHVlJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfGdEYXJrIEdyZWVuezB9fEdHcmVlbicuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgyKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xjRGFyayBDeWFuezB9fENDeWFuJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHJEYXJrIFJlZHswfXxSUmVkJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHBEYXJrIFB1cnBsZSB8UFB1cnBsZScuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHlEYXJrIFllbGxvdyB8WVllbGxvdycuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHNEYXJrIEdyZXl7MH18U0dyZXknLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoMykpKTtcclxuICAgICAgICB0aHJvdyAnVGVzdCBleGNlcHRpb24nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVcCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi51cCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VzdCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi53ZXN0LCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBDb21tYW5kQ2FsbGJhY2sge1xyXG4gICAgY2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG4gICAgY2FsbGJhY2tDYWxsZWQ6IGJvb2xlYW47XHJcbiAgICBpbnRlcnJ1cHRGbG93OiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmludGVycnVwdEZsb3cgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogSWYgY29tbWFuZCBjYW4gY2F1c2UgaW50ZXJydXB0RmxvdywgbWFrZSBzdXJlIHRvIGNhbGwgdGhpcyBtZXRob2QgYXQgdGhlIGVuZCBvZiBjb21tYW5kIGV4ZWN1dGlvbiAqL1xyXG4gICAgQ2FsbElmTm90Q2FsbGVkKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYWxsYmFja0NhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcbiAgICBjb21tYW5kU3RyaW5nOiBzdHJpbmc7XHJcbiAgICBwYXJzZWRDb21tYW5kOiBzdHJpbmc7XHJcbiAgICBwYXJzZWRBcmd1bWVudHM6IHN0cmluZ1tdIHwgbnVsbDtcclxuICAgIHBhcnNlZE51bWJlcnM6IG51bWJlcltdIHwgbnVsbDtcclxuICAgIHBhcnNlZENvdW50OiBudW1iZXJbXSB8IG51bGw7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kU3RyaW5nOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRTdHJpbmcgPSBjb21tYW5kU3RyaW5nO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9ICcnO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQXJndW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQ291bnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1hbmQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQ29tbWFuZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUNvbW1hbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gdGhpcy5wYXJzZWRDb21tYW5kLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkQ29tbWFuZDtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUNvbW1hbmQoKSB7XHJcbiAgICAgICAgbGV0IHNwYWNlSW5kZXggPSB0aGlzLmNvbW1hbmRTdHJpbmcuaW5kZXhPZignICcpO1xyXG4gICAgICAgIGlmIChzcGFjZUluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlZENvbW1hbmQgPSB0aGlzLmNvbW1hbmRTdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gdGhpcy5jb21tYW5kU3RyaW5nLnNsaWNlKDAsIHNwYWNlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRBcmd1bWVudChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQXJndW1lbnRzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VBcmd1bWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQXJndW1lbnRzID09PSBudWxsIHx8IHRoaXMucGFyc2VkQXJndW1lbnRzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWRBcmd1bWVudHNbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE51bWJlcihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkTnVtYmVycyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQXJndW1lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZE51bWJlcnMgPT09IG51bGwgfHwgdGhpcy5wYXJzZWROdW1iZXJzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWROdW1iZXJzW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb3VudChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQ291bnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUFyZ3VtZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYXJzZWRDb3VudCA9PT0gbnVsbCB8fCB0aGlzLnBhcnNlZENvdW50W2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWRDb3VudFtpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBcmd1bWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZWRBcmd1bWVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnBhcnNlZENvdW50ID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSB0aGlzLmNvbW1hbmRTdHJpbmcuaW5kZXhPZignICcpO1xyXG4gICAgICAgIGxldCBlbmRJbmRleDtcclxuICAgICAgICBsZXQgY3VycmVudENvbW1hbmQgPSB0aGlzLmNvbW1hbmRTdHJpbmc7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRBcmd1bWVudE51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChzdGFydEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBzdGFydEluZGV4Kys7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBcmd1bWVudE51bWJlcisrO1xyXG4gICAgICAgICAgICBsZXQgcGFyc2VkTnVtYmVyID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHBhcnNlZENvdW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8vdXN1d2FteSBuaWVwb3RyemVibmUgc3BhY2plXHJcbiAgICAgICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgY3VycmVudENvbW1hbmQubGVuZ3RoICYmIGN1cnJlbnRDb21tYW5kW3N0YXJ0SW5kZXhdID09PSAnICcpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJyZW50Q29tbWFuZCA9IGN1cnJlbnRDb21tYW5kLnNsaWNlKHN0YXJ0SW5kZXgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gd3ljacSFZ2FuaWUgbnVtZXJ1IGRsYSBhcmd1bWVudHVcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kWzBdLmlzTnVtYmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCA8IGN1cnJlbnRDb21tYW5kLmxlbmd0aCAmJiBjdXJyZW50Q29tbWFuZFtjdXJyZW50SW5kZXhdLmlzTnVtYmVyKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZFtjdXJyZW50SW5kZXhdID09PSAnLicpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZWROdW1iZXIgPSBOdW1iZXIucGFyc2VJbnQoY3VycmVudENvbW1hbmQuc2xpY2UoMCwgY3VycmVudEluZGV4KSwgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkTnVtYmVyc1tjdXJyZW50QXJndW1lbnROdW1iZXJdID0gcGFyc2VkTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb21tYW5kID0gY3VycmVudENvbW1hbmQuc2xpY2UoY3VycmVudEluZGV4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vamV6ZWxpIG5pZSB3c2themFubyBsaWN6YnksIHRvIGRvbXnFm2xuaWUgamVzdCAxXHJcbiAgICAgICAgICAgIGlmIChwYXJzZWROdW1iZXIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkTnVtYmVyc1tjdXJyZW50QXJndW1lbnROdW1iZXJdID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFyc2VkQ291bnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkQ291bnRbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vd3ljacSFZ2FuaWUgdHJlxZtjaSBhcmd1bWVudHVcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kWzBdID09PSAnXCInKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gMTtcclxuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gY3VycmVudENvbW1hbmQuaW5kZXhPZignXCInLCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBjdXJyZW50Q29tbWFuZC5pbmRleE9mKCcgJywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBjdXJyZW50Q29tbWFuZC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VkQXJndW1lbnRzW2N1cnJlbnRBcmd1bWVudE51bWJlcl0gPSBjdXJyZW50Q29tbWFuZC5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbiAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL2NvbW1hbmRzL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1hbmRUcmVlIHtcclxuICAgIHJvb3Q6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHsgY29tbWFuZDogbnVsbCB9O1xyXG4gICAgfVxyXG5cclxuICAgIEFkZE5ld0NvbW1hbmQobmFtZTogc3RyaW5nLCBvYmplY3Q6IENvbW1hbmQpIHtcclxuICAgICAgICBpZiAoIW5hbWUgfHwgbmFtZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05ldyBjb21tYW5kIG5hbWUgY2Fubm90IGJlIG51bGwgb3IgZW1wdHknO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLlZhbGlkYXRlQ29tbWFuZE9iamVjdChvYmplY3QpO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudE5vZGUgPSB0aGlzLnJvb3Q7XHJcblxyXG4gICAgICAgIG5hbWUudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChjdXJyZW50Q2hhcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGVbY3VycmVudENoYXJdID0geyBjb21tYW5kOiBvYmplY3QgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGVbY3VycmVudENoYXJdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBTZXREZWZhdWx0Q29tbWFuZChvYmplY3Q6IENvbW1hbmQpIHtcclxuICAgICAgICB0aGlzLlZhbGlkYXRlQ29tbWFuZE9iamVjdChvYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QuY29tbWFuZCA9IG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkIHx8IG9iamVjdCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ29tbWFuZCBvYmplY3QgY2Fubm90IGJlIG51bGwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIShvYmplY3QgaW5zdGFuY2VvZiBDb21tYW5kKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ29tbWFuZCBvYmplY3QgbXVzdCBleHRlbmQgQ29tbWFuZCBjbGFzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEdldENvbW1hbmQobmFtZTogc3RyaW5nKTogQ29tbWFuZCB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gdGhpcy5yb290O1xyXG5cclxuICAgICAgICBuYW1lLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgICAgICAuc29tZSgoY3VycmVudENoYXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZVtjdXJyZW50Q2hhcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29tbWFuZCBub3QgZm91bmQtIHJldHVybiBkZWZhdWx0IGNvbW1hbmRcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGVbY3VycmVudENoYXJdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlLmNvbW1hbmQ7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi9Db21tYW5kQ2FsbGJhY2snO1xuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4vQ29tbWFuZFBhcnNlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vY29tbWFuZHMvQ29tbWFuZCc7XG5pbXBvcnQgeyBEb3duIH0gZnJvbSAnLi4vY29tbWFuZHMvRG93bic7XG5pbXBvcnQgeyBEcm9wIH0gZnJvbSAnLi4vY29tbWFuZHMvRHJvcCc7XG5pbXBvcnQgeyBFYXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvRWFzdCc7XG5pbXBvcnQgeyBFdmFsIH0gZnJvbSAnLi4vY29tbWFuZHMvRXZhbCc7XG5pbXBvcnQgeyBFeGFtIH0gZnJvbSAnLi4vY29tbWFuZHMvRXhhbSc7XG5pbXBvcnQgeyBHbyB9IGZyb20gJy4uL2NvbW1hbmRzL0dvJztcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL2NvbW1hbmRzL0ludmVudG9yeSc7XG5pbXBvcnQgeyBKc29uIH0gZnJvbSAnLi4vY29tbWFuZHMvSnNvbic7XG5pbXBvcnQgeyBMb29rIH0gZnJvbSAnLi4vY29tbWFuZHMvTG9vayc7XG5pbXBvcnQgeyBOb3J0aCB9IGZyb20gJy4uL2NvbW1hbmRzL05vcnRoJztcbmltcG9ydCB7IFJlbG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL1JlbG9hZCc7XG5pbXBvcnQgeyBTYXZlIH0gZnJvbSAnLi4vY29tbWFuZHMvU2F2ZSc7XG5pbXBvcnQgeyBTY2FuIH0gZnJvbSAnLi4vY29tbWFuZHMvU2Nhbic7XG5pbXBvcnQgeyBTb3V0aCB9IGZyb20gJy4uL2NvbW1hbmRzL1NvdXRoJztcbmltcG9ydCB7IFRha2UgfSBmcm9tICcuLi9jb21tYW5kcy9UYWtlJztcbmltcG9ydCB7IFRlc3QgfSBmcm9tICcuLi9jb21tYW5kcy9UZXN0JztcbmltcG9ydCB7IFVwIH0gZnJvbSAnLi4vY29tbWFuZHMvVXAnO1xuaW1wb3J0IHsgV2VzdCB9IGZyb20gJy4uL2NvbW1hbmRzL1dlc3QnO1xuaW1wb3J0IHsgQ29tbWFuZFRyZWUgfSBmcm9tICcuL0NvbW1hbmRUcmVlJztcbmltcG9ydCB7IFByb21wdCB9IGZyb20gJy4uL2NvbW1vbkxvZ2ljL1Byb21wdCc7XG5pbXBvcnQgeyBMb2FkIH0gZnJvbSAnLi4vY29tbWFuZHMvTG9hZCc7XG5pbXBvcnQgeyBFbmdpbmVVdGlscyB9IGZyb20gJy4uL2NvbW1vbkxvZ2ljL0VuZ2luZVV0aWxzJztcbmltcG9ydCB7IE9wZW4gfSBmcm9tICcuLi9jb21tYW5kcy9PcGVuJztcbmltcG9ydCB7IENsb3NlIH0gZnJvbSAnLi4vY29tbWFuZHMvQ2xvc2UnO1xuXG5jbGFzcyBDb21tYW5kTGlzdCB7XG4gICAgQ2xvc2UgPSBuZXcgQ2xvc2UoKTtcbiAgICBEb3duID0gbmV3IERvd24oKTtcbiAgICBEcm9wID0gbmV3IERyb3AoKTtcbiAgICBFYXN0ID0gbmV3IEVhc3QoKTtcbiAgICBFdmFsID0gbmV3IEV2YWwoKTtcbiAgICBFeGFtID0gbmV3IEV4YW0oKTtcbiAgICBHbyA9IG5ldyBHbygpO1xuICAgIEludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoKTtcbiAgICBKc29uID0gbmV3IEpzb24oKTtcbiAgICBMb2FkID0gbmV3IExvYWQoKTtcbiAgICBMb29rID0gbmV3IExvb2soKTtcbiAgICBOb3J0aCA9IG5ldyBOb3J0aCgpO1xuICAgIE9wZW4gPSBuZXcgT3BlbigpO1xuICAgIFJlbG9hZCA9IG5ldyBSZWxvYWQoKTtcbiAgICBTb3V0aCA9IG5ldyBTb3V0aCgpO1xuICAgIFNhdmUgPSBuZXcgU2F2ZSgpO1xuICAgIFNjYW4gPSBuZXcgU2NhbigpO1xuICAgIFRha2UgPSBuZXcgVGFrZSgpO1xuICAgIFRlc3QgPSBuZXcgVGVzdCgpO1xuICAgIFVwID0gbmV3IFVwKCk7XG4gICAgV2VzdCA9IG5ldyBXZXN0KCk7XG59XG5cbmludGVyZmFjZSBDb21tYW5kRGljdGlvbmFyeSB7XG4gICAgW2NvbW1hbmROYW1lOiBzdHJpbmddOiBDb21tYW5kO1xufVxuXG5jbGFzcyBDb21tYW5kc01hbmFnZXIgZXh0ZW5kcyBDb21tYW5kTGlzdCB7XG4gICAgVHJlZTogQ29tbWFuZFRyZWU7XG4gICAgaXNDb21tYW5kRXhlY3V0aW5nOiBib29sZWFuO1xuICAgIGNvbW1hbmRRdWV1ZTogYW55W107XG4gICAgQ29tbWFuZHM6IENvbW1hbmREaWN0aW9uYXJ5ID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5UcmVlID0gbmV3IENvbW1hbmRUcmVlKCk7XG4gICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gW107XG4gICAgfVxuXG4gICAgRXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaChjb21tYW5kKTtcbiAgICAgICAgaWYgKGNvbW1hbmQuaXNOdWxsT3JFbXB0eSgpKSB7XG4gICAgICAgICAgICBFbmdpbmVVdGlscy5Ta2lwUHJpbnRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzQ29tbWFuZEV4ZWN1dGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuRXhlY3V0ZU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEV4ZWN1dGVOZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRRdWV1ZVswXTtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUuc2hpZnQoKTtcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBDb21tYW5kUGFyc2VyKGNvbW1hbmQpO1xuICAgICAgICBsZXQgY29tbWFuZE5hbWUgPSBwYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIGlmIChjb21tYW5kTmFtZS5pc051bGxPckVtcHR5KCkpIHtcbiAgICAgICAgICAgIHRoaXMuQWZ0ZXJFeGVjdXRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29tbWFuZE9iamVjdCA9IHRoaXMuVHJlZS5HZXRDb21tYW5kKGNvbW1hbmROYW1lKTtcbiAgICAgICAgaWYgKGNvbW1hbmRPYmplY3QgPT09IHVuZGVmaW5lZCB8fCBjb21tYW5kT2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ29tbWFuZCBvYmplY3QgZm9yIHswfSBub3QgZm91bmQnLmZvcm1hdChjb21tYW5kTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBFbmdpbmUuT3V0cHV0KCcnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbW1hbmRPYmplY3QuRXhlY3V0ZShwYXJzZXIsIG5ldyBDb21tYW5kQ2FsbGJhY2soKCkgPT4gdGhpcy5BZnRlckV4ZWN1dGUoKSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLkFmdGVyRXhlY3V0ZSgpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEFmdGVyRXhlY3V0ZSgpIHtcbiAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XG4gICAgICAgIFByb21wdC5QcmludCgpO1xuICAgICAgICB0aGlzLkV4ZWN1dGVOZXh0KCk7XG4gICAgfVxuXG4gICAgU2V0RGVmYXVsdENvbW1hbmQoY29tbWFuZE9iamVjdDogQ29tbWFuZCkge1xuICAgICAgICB0aGlzLlRyZWUuU2V0RGVmYXVsdENvbW1hbmQoY29tbWFuZE9iamVjdCk7XG4gICAgfVxuXG4gICAgUmVnaXN0ZXJDb21tYW5kPENvbW1hbmROYW1lIGV4dGVuZHMga2V5b2YgQ29tbWFuZExpc3Q+KG5hbWU6IENvbW1hbmROYW1lLCBvYmplY3Q6IENvbW1hbmRMaXN0W0NvbW1hbmROYW1lXSkge1xuICAgICAgICB0aGlzLlRyZWUuQWRkTmV3Q29tbWFuZChuYW1lLCBvYmplY3QpO1xuICAgICAgICBsZXQgY29tbWFuZExpc3QgPSB0aGlzIGFzIENvbW1hbmRMaXN0O1xuICAgICAgICBjb21tYW5kTGlzdFtuYW1lXSA9IG9iamVjdDtcbiAgICB9XG59XG5cbmV4cG9ydCB2YXIgQ29tbWFuZHMgPSBuZXcgQ29tbWFuZHNNYW5hZ2VyKCk7XG4iLCJpbXBvcnQgeyBDbG9zZSB9IGZyb20gJy4uL2NvbW1hbmRzL0Nsb3NlJztcclxuaW1wb3J0IHsgRG93biB9IGZyb20gJy4uL2NvbW1hbmRzL0Rvd24nO1xyXG5pbXBvcnQgeyBEcm9wIH0gZnJvbSAnLi4vY29tbWFuZHMvRHJvcCc7XHJcbmltcG9ydCB7IEVhc3QgfSBmcm9tICcuLi9jb21tYW5kcy9FYXN0JztcclxuaW1wb3J0IHsgRXZhbCB9IGZyb20gJy4uL2NvbW1hbmRzL0V2YWwnO1xyXG5pbXBvcnQgeyBFeGFtIH0gZnJvbSAnLi4vY29tbWFuZHMvRXhhbSc7XHJcbmltcG9ydCB7IEdvIH0gZnJvbSAnLi4vY29tbWFuZHMvR28nO1xyXG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9jb21tYW5kcy9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBKc29uIH0gZnJvbSAnLi4vY29tbWFuZHMvSnNvbic7XHJcbmltcG9ydCB7IExvYWQgfSBmcm9tICcuLi9jb21tYW5kcy9Mb2FkJztcclxuaW1wb3J0IHsgTG9vayB9IGZyb20gJy4uL2NvbW1hbmRzL0xvb2snO1xyXG5pbXBvcnQgeyBOb0NvbW1hbmQgfSBmcm9tICcuLi9jb21tYW5kcy9Ob0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBOb3J0aCB9IGZyb20gJy4uL2NvbW1hbmRzL05vcnRoJztcclxuaW1wb3J0IHsgT3BlbiB9IGZyb20gJy4uL2NvbW1hbmRzL09wZW4nO1xyXG5pbXBvcnQgeyBSZWxvYWQgfSBmcm9tICcuLi9jb21tYW5kcy9SZWxvYWQnO1xyXG5pbXBvcnQgeyBTYXZlIH0gZnJvbSAnLi4vY29tbWFuZHMvU2F2ZSc7XHJcbmltcG9ydCB7IFNjYW4gfSBmcm9tICcuLi9jb21tYW5kcy9TY2FuJztcclxuaW1wb3J0IHsgU291dGggfSBmcm9tICcuLi9jb21tYW5kcy9Tb3V0aCc7XHJcbmltcG9ydCB7IFRha2UgfSBmcm9tICcuLi9jb21tYW5kcy9UYWtlJztcclxuaW1wb3J0IHsgVGVzdCB9IGZyb20gJy4uL2NvbW1hbmRzL1Rlc3QnO1xyXG5pbXBvcnQgeyBVcCB9IGZyb20gJy4uL2NvbW1hbmRzL1VwJztcclxuaW1wb3J0IHsgV2VzdCB9IGZyb20gJy4uL2NvbW1hbmRzL1dlc3QnO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4vQ29tbWFuZHNNYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBJbml0Q29tbWFuZHMoKSB7XHJcbiAgICBDb21tYW5kcy5TZXREZWZhdWx0Q29tbWFuZChuZXcgTm9Db21tYW5kKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnQ2xvc2UnLCBuZXcgQ2xvc2UoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdEb3duJywgbmV3IERvd24oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Ryb3AnLCBuZXcgRHJvcCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Vhc3QnLCBuZXcgRWFzdCgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRXhhbScsIG5ldyBFeGFtKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdFdmFsJywgbmV3IEV2YWwoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdHbycsIG5ldyBHbygpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0ludmVudG9yeScsIG5ldyBJbnZlbnRvcnkoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdKc29uJywgbmV3IEpzb24oKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdMb29rJywgbmV3IExvb2soKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0xvYWQnLCBuZXcgTG9hZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ05vcnRoJywgbmV3IE5vcnRoKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnT3BlbicsIG5ldyBPcGVuKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnUmVsb2FkJywgbmV3IFJlbG9hZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NvdXRoJywgbmV3IFNvdXRoKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdTY2FuJywgbmV3IFNjYW4oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NhdmUnLCBuZXcgU2F2ZSgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1Rha2UnLCBuZXcgVGFrZSgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVGVzdCcsIG5ldyBUZXN0KCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVXAnLCBuZXcgVXAoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdXZXN0JywgbmV3IFdlc3QoKSk7XHJcbn1cclxuIiwiY2xhc3MgRW5naW5lVXRpbHNDbGFzcyB7XHJcbiAgICBza2lwUHJpbnRlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIE91dHB1dFByaW50ZXIobWVzc2FnZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGRlbGF5ID0gNjAsIGlzTmV3TGluZSA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLnNraXBQcmludGVyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcmludE5leHQobWVzc2FnZSwgY2FsbGJhY2ssIGRlbGF5LCBpc05ld0xpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnROZXh0KG1lc3NhZ2U6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyLCBpc05ld0xpbmU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAobWVzc2FnZS5pc051bGxPckVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGlzTmV3TGluZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5za2lwUHJpbnRlciA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KG1lc3NhZ2VbMF0sIGZhbHNlKTtcclxuICAgICAgICBFbmdpbmUuU3RhcnRUaW1lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXh0KG1lc3NhZ2Uuc2xpY2UoMSksIGNhbGxiYWNrLCBkZWxheSwgaXNOZXdMaW5lKTtcclxuICAgICAgICB9LCBkZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgU2tpcFByaW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5za2lwUHJpbnRlciA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgRW5naW5lVXRpbHMgPSBuZXcgRW5naW5lVXRpbHNDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lVXRpbHMgfSBmcm9tICcuL0VuZ2luZVV0aWxzJztcclxuXHJcbmV4cG9ydCB2YXIgSW5wdXRGdW5jdGlvbnMgPSAndHJ1ZSc7XHJcblxyXG5mdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZykge1xyXG4gICAgQ29tbWFuZHMuRXhlY3V0ZShjb21tYW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gU2tpcFByaW50ZXIoKSB7XHJcbiAgICBFbmdpbmVVdGlscy5Ta2lwUHJpbnRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXN1bWVFeGVjdXRpb24oKSB7XHJcbiAgICBDb21tYW5kcy5FeGVjdXRlTmV4dCgpO1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBmdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBmdW5jdGlvbiBTa2lwUHJpbnRlcigpOiB2b2lkO1xyXG4gICAgZnVuY3Rpb24gUmVzdW1lRXhlY3V0aW9uKCk6IHZvaWQ7XHJcbn1cclxuZ2xvYmFsVGhpcy5FeGVjdXRlID0gRXhlY3V0ZTtcclxuZ2xvYmFsVGhpcy5Ta2lwUHJpbnRlciA9IFNraXBQcmludGVyO1xyXG5nbG9iYWxUaGlzLlJlc3VtZUV4ZWN1dGlvbiA9IFJlc3VtZUV4ZWN1dGlvbjtcclxuIiwiY2xhc3MgUHJvbXB0Q2xhc3Mge1xyXG4gICAgUHJpbnQoKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnJCAnLCBmYWxzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgUHJvbXB0ID0gbmV3IFByb21wdENsYXNzKCk7XHJcbiIsImNsYXNzIFJhbmRvbUNsYXNzIHtcclxuICAgIG5leHRJbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgUmFuZG9tID0gbmV3IFJhbmRvbUNsYXNzKCk7XHJcbiIsImV4cG9ydCB7fTtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGludGVyZmFjZSBTdHJpbmcge1xyXG4gICAgICAgIGZvcm1hdCguLi5hcmdzOiBhbnlbXSk6IHN0cmluZztcclxuICAgICAgICBzdGFydFdpdGhVcHBlcigpOiBzdHJpbmc7XHJcbiAgICAgICAgaXNOdW1iZXIoKTogYm9vbGVhbjtcclxuICAgICAgICBpc051bGxPckVtcHR5KCk6IGJvb2xlYW47XHJcbiAgICB9XHJcbn1cclxuXHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKC4uLmFyZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBudW1iZXI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9PSAndW5kZWZpbmVkJyA/IGFyZ3NbbnVtYmVyXSA6IG1hdGNoO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnN0YXJ0V2l0aFVwcGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbMF0udG9VcHBlckNhc2UoKSArIHRoaXMuc2xpY2UoMSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmlzTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIC9eXFxkKyQvLnRlc3QodGhpcy50b1N0cmluZygpKTtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUuaXNOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzID09PSBudWxsIHx8IHRoaXMgPT09ICcnO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tICcuL0VudW1IZWxwZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi9HcmFtbWFDYXNlJztcclxuXHJcbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XHJcbiAgICBub3J0aCA9ICdub3J0aCcsXHJcbiAgICBzb3V0aCA9ICdzb3V0aCcsXHJcbiAgICBlYXN0ID0gJ2Vhc3QnLFxyXG4gICAgd2VzdCA9ICd3ZXN0JyxcclxuICAgIHVwID0gJ3VwJyxcclxuICAgIGRvd24gPSAnZG93bicsXHJcbn1cclxuXHJcbmNsYXNzIERpcmVjdGlvbkhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxEaXJlY3Rpb24+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKERpcmVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxlKGRpcmVjdGlvbjogRGlyZWN0aW9uLCBncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICByZXR1cm4gTG9jYWwuRGlyZWN0aW9uc1tkaXJlY3Rpb25dW2dyYW1tYUNhc2VdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIERpcmVjdGlvbkhlbHBlciA9IG5ldyBEaXJlY3Rpb25IZWxwZXJDbGFzcygpO1xyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW51bUhlbHBlcjxFbnVtVHlwZT4ge1xyXG4gICAgc291cmNlOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlOiBzdHJpbmcpOiBFbnVtVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3ZhbHVlXSBhcyBFbnVtVHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBcnJheSh2YWx1ZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IGFycmF5OiBFbnVtVHlwZVtdID0gW107XHJcbiAgICAgICAgdmFsdWVzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyc2VkOiBFbnVtVHlwZSB8IG51bGwgPSB0aGlzLnBhcnNlKGtleSk7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZWQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gocGFyc2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBjb250YWlucyhzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eShzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VTaG9ydChzdHJpbmc6IHN0cmluZyk6IEVudW1UeXBlIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW2tleV0gYXMgRW51bVR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0S2V5KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlW2tleV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmb3JFYWNoKGNhbGxiYWNrOiB7ICh2YWx1ZTogRW51bVR5cGUsIGtleTogc3RyaW5nKTogdm9pZCB9KTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuc291cmNlW2tleV0sIGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gXCIuL0VudW1IZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEVxdWlwbWVudFNsb3Qge1xyXG4gICAgTm9uZSA9IDAsXHJcbiAgICBUb3JzbyA9IDEsXHJcbiAgICBBcm1zID0gMixcclxuICAgIEhhbmRzID0gMyxcclxuICAgIExlZ3MgPSA0LFxyXG4gICAgRmVldHMgPSA1LFxyXG4gICAgSGVhZCA9IDYsXHJcbiAgICBNYWluSGFuZCA9IDcsXHJcbiAgICBPZmZIYW5kID0gOCxcclxuICAgIFNoaXJ0ID0gOSxcclxuICAgIFBhbnRzID0gMTAsXHJcbiAgICBDb2F0ID0gMTEsXHJcbiAgICBSaWdodFJpbmcgPSAxMixcclxuICAgIExlZnRSaW5nID0gMTMsXHJcbiAgICBOZWNrbGFjZSA9IDE0LFxyXG4gICAgVG9yY2ggPSAxNSxcclxufVxyXG5cclxuY2xhc3MgRXF1aXBtZW50U2xvdEhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxFcXVpcG1lbnRTbG90PiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihFcXVpcG1lbnRTbG90KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBFcXVpcG1lbnRTbG90SGVscGVyID0gbmV3IEVxdWlwbWVudFNsb3RIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSBcIi4vRW51bUhlbHBlclwiO1xyXG5cclxuZXhwb3J0IGVudW0gR2xvYmFsRXZlbnRUeXBlIHtcclxuICAgIEJlZm9yZVJvb21FbnRlciA9IDEsXHJcbn1cclxuXHJcbmNsYXNzIEdsb2JhbEV2ZW50VHlwZUhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxHbG9iYWxFdmVudFR5cGU+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKEdsb2JhbEV2ZW50VHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR2xvYmFsRXZlbnRUeXBlSGVscGVyID0gbmV3IEdsb2JhbEV2ZW50VHlwZUhlbHBlckNsYXNzKCk7XHJcbiIsImltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tIFwiLi9FbnVtSGVscGVyXCI7XHJcblxyXG5leHBvcnQgZW51bSBHcmFtbWFDYXNlIHtcclxuICAgIE1pYW5vd25payA9IDAsIC8va29nbyBjbyBqZXN0XHJcbiAgICBEb3BlbG5pYWN6ID0gMSwgLy9rb2dvIGN6ZWdvIG5pZSBtYVxyXG4gICAgQ2Vsb3duaWsgPSAyLCAvL2tvbXUgY3plbXUgc2nEmSBwcnp5Z2zEhWRhbVxyXG4gICAgQmllcm5payA9IDMsIC8va29nbyBjbyB3aWR6xJksIHVwdXN6Y3phbVxyXG4gICAgTmFyemVkbmlrID0gNCwgLy96IGtpbSB6IGN6eW0gaWRlXHJcbiAgICBNaWVqc2Nvd25payA9IDUsIC8vbyBraW0gbyBjenltIG1vd2llXHJcbiAgICBXb2xhY3ogPSA2LCAvL28ga29nb8W8IHRvIG1vamUgc2tyb21uZSBvY3p5IG1hasSFIHphc3pjenl0IHBvc3RyemVnYcSHXHJcbn1cclxuXHJcbmNsYXNzIEdyYW1tYUNhc2VIZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8R3JhbW1hQ2FzZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoR3JhbW1hQ2FzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR3JhbW1hQ2FzZUhlbHBlciA9IG5ldyBHcmFtbWFDYXNlSGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gJy4vRW51bUhlbHBlcic7XHJcblxyXG5leHBvcnQgdHlwZSBJdGVtVHlwZTIgPVxyXG4gICAgfCAnV2VhcG9uMUgnXHJcbiAgICB8ICdXZWFwb24ySCdcclxuICAgIHwgJ1NoaWVsZCdcclxuICAgIHwgJ0FybW9yJ1xyXG4gICAgfCAnU2hvdWxkZXJzJ1xyXG4gICAgfCAnR2xvdmVzJ1xyXG4gICAgfCAnR3JlYXZlcydcclxuICAgIHwgJ0Jvb3RzJ1xyXG4gICAgfCAnSGVsbWV0J1xyXG4gICAgfCAnU2hpcnQnXHJcbiAgICB8ICdQYW50cydcclxuICAgIHwgJ1dpbGRTaGllbGQnXHJcbiAgICB8ICdXaWxkQXJtb3InXHJcbiAgICB8ICdXaWxkU2hvdWxkZXJzJ1xyXG4gICAgfCAnV2lsZEdsb3ZlcydcclxuICAgIHwgJ1dpbGRHcmVhdmVzJ1xyXG4gICAgfCAnV2lsZEJvb3RzJ1xyXG4gICAgfCAnV2lsZEhlbG1ldCdcclxuICAgIHwgJ1JpbmcnXHJcbiAgICB8ICdOZWNrbGFjZSdcclxuICAgIHwgJ1BvdGlvbidcclxuICAgIHwgJ0Zvb2QnXHJcbiAgICB8ICdUcmFzaCdcclxuICAgIHwgJ0N1cnJlbmN5J1xyXG4gICAgfCAnQ29udGFpbmVyJ1xyXG4gICAgfCAnU3RhdGljQ29udGFpbmVyJ1xyXG4gICAgfCAnUXVlc3QnXHJcbiAgICB8ICdTdGF0aWMnXHJcbiAgICB8ICdMZXZlcic7XHJcblxyXG5leHBvcnQgZW51bSBJdGVtVHlwZSB7XHJcbiAgICBXZWFwb24xSCA9ICdXZWFwb24xSCcsXHJcbiAgICBXZWFwb24ySCA9ICdXZWFwb24ySCcsXHJcbiAgICBTaGllbGQgPSAnU2hpZWxkJyxcclxuICAgIEFybW9yID0gJ0FybW9yJyxcclxuICAgIFNob3VsZGVycyA9ICdTaG91bGRlcnMnLFxyXG4gICAgR2xvdmVzID0gJ0dsb3ZlcycsXHJcbiAgICBHcmVhdmVzID0gJ0dyZWF2ZXMnLFxyXG4gICAgQm9vdHMgPSAnQm9vdHMnLFxyXG4gICAgSGVsbWV0ID0gJ0hlbG1ldCcsXHJcbiAgICBTaGlydCA9ICdTaGlydCcsXHJcbiAgICBQYW50cyA9ICdQYW50cycsXHJcbiAgICBXaWxkU2hpZWxkID0gJ1dpbGRTaGllbGQnLFxyXG4gICAgV2lsZEFybW9yID0gJ1dpbGRBcm1vcicsXHJcbiAgICBXaWxkU2hvdWxkZXJzID0gJ1dpbGRTaG91bGRlcnMnLFxyXG4gICAgV2lsZEdsb3ZlcyA9ICdXaWxkR2xvdmVzJyxcclxuICAgIFdpbGRHcmVhdmVzID0gJ1dpbGRHcmVhdmVzJyxcclxuICAgIFdpbGRCb290cyA9ICdXaWxkQm9vdHMnLFxyXG4gICAgV2lsZEhlbG1ldCA9ICdXaWxkSGVsbWV0JyxcclxuICAgIFJpbmcgPSAnUmluZycsXHJcbiAgICBOZWNrbGFjZSA9ICdOZWNrbGFjZScsXHJcbiAgICBQb3Rpb24gPSAnUG90aW9uJyxcclxuICAgIEZvb2QgPSAnRm9vZCcsXHJcbiAgICBUcmFzaCA9ICdUcmFzaCcsXHJcbiAgICBDdXJyZW5jeSA9ICdDdXJyZW5jeScsXHJcbiAgICBDb250YWluZXIgPSAnQ29udGFpbmVyJyxcclxuICAgIFN0YXRpY0NvbnRhaW5lciA9ICdTdGF0aWNDb250YWluZXInLFxyXG4gICAgUXVlc3QgPSAnUXVlc3QnLFxyXG4gICAgU3RhdGljID0gJ1N0YXRpYycsXHJcbiAgICBMZXZlciA9ICdMZXZlcicsXHJcbn1cclxuXHJcbmNsYXNzIEl0ZW1UeXBlSGVscGVyQ2xhc3MgZXh0ZW5kcyBFbnVtSGVscGVyPEl0ZW1UeXBlPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihJdGVtVHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgSXRlbVR5cGVIZWxwZXIgPSBuZXcgSXRlbVR5cGVIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi4vbW9kZWwvQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgRXF1aXBtZW50IH0gZnJvbSAnLi4vbW9kZWwvRXF1aXBtZW50JztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi4vbW9kZWwvSXRlbUxpc3QnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9DaGFyYWN0ZXJUZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyRmFjdG9yeSB7XHJcbiAgICBzcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzLmdldFRlbXBsYXRlKGNoYXJhY3RlcklkKTtcclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcigpO1xyXG4gICAgICAgIGNoYXJhY3RlciA9IHRoaXMuTG9hZEZyb21UZW1wbGF0ZShjaGFyYWN0ZXIsIHRlbXBsYXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcclxuICAgIH1cclxuXHJcbiAgICBMb2FkRnJvbVRlbXBsYXRlKGNoYXJhY3RlcjogQ2hhcmFjdGVyLCB0ZW1wbGF0ZTogQ2hhcmFjdGVyVGVtcGxhdGUpIHtcclxuICAgICAgICBjaGFyYWN0ZXIuSWQgPSB0ZW1wbGF0ZS5JZDtcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkludmVudG9yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnZlbnRvcnlNb2RlbCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5JbnZlbnRvcnkuZm9yRWFjaCgoaXRlbURlZmluaXRpb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5TW9kZWwuYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXIuSW52ZW50b3J5ID0gaW52ZW50b3J5TW9kZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVtcGxhdGUuRXF1aXBtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGVxdWlwbWVudE1vZGVsID0gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5FcXVpcG1lbnQuZm9yRWFjaCgoZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIGVxdWlwbWVudE1vZGVsLmVxdWlwKGVxLlNsb3QsIEdhbWUuc3Bhd25JdGVtKGVxLkl0ZW0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlci5FcXVpcG1lbnQgPSBlcXVpcG1lbnRNb2RlbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IEl0ZW1DaGFuY2VPbmVPZlRlbXBsYXRlLCBJdGVtQ2hhbmNlVGVtcGxhdGUsIEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50LCBTdGFjayB9IGZyb20gJy4uL3RlbXBsYXRlcy9Db21tb24nO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvSXRlbVRlbXBsYXRlJztcclxuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi4vY29tbW9uTG9naWMvUmFuZG9tJztcclxuaW1wb3J0IHsgSXRlbUxvY2sgfSBmcm9tICcuLi9tb2RlbC9JdGVtTG9jayc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUZhY3Rvcnkge1xyXG4gICAgc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uOiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCk6IEl0ZW0gfCBudWxsIHtcclxuICAgICAgICBsZXQgaXRlbSA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbURlZmluaXRpb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJdGVtQ2hhbmNlVGVtcGxhdGUoaXRlbURlZmluaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uQ2hhbmNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUmFuZG9tLm5leHRJbnQoMSwgMTAwKSA+IGl0ZW1EZWZpbml0aW9uLkNoYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZDtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZCh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5TdGFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRTdGFjayh0aGlzLnN0YWNrVmFsdWUoaXRlbURlZmluaXRpb24uU3RhY2spKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUludmVudG9yeShpdGVtRGVmaW5pdGlvbiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVMb2NrKGl0ZW1EZWZpbml0aW9uLCBpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleCA9IHRoaXMucmVzb2x2ZVJhbmRvbUl0ZW1JbmRleChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZFtzZWxlY3RlZEl0ZW1JbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLlN0YWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdJdGVtIGRlZmluaXRpb24gaGFzIHswfSBzcGVjaWZpZWQgaWRzIGJ1dCBvbmx5IHsxfSBzcGVjaWZpZWQgc3RhY2tzJy5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5JdGVtSWQubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uU3RhY2subGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFN0YWNrKHRoaXMuc3RhY2tWYWx1ZShpdGVtRGVmaW5pdGlvbi5TdGFja1tzZWxlY3RlZEl0ZW1JbmRleF0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNJdGVtQ2hhbmNlVGVtcGxhdGUoaXRlbURlZmluaXRpb246IEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50KTogaXRlbURlZmluaXRpb24gaXMgSXRlbUNoYW5jZVRlbXBsYXRlIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW1EZWZpbml0aW9uICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgaXRlbURlZmluaXRpb24uSXRlbUlkID09PSAnc3RyaW5nJztcclxuICAgIH1cclxuXHJcbiAgICBzcGF3bkl0ZW1CeVRlbXBsYXRlSWQodGVtcGxhdGVJZDogc3RyaW5nKTogSXRlbSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlOiBJdGVtVGVtcGxhdGUgPSBHYW1lRGF0YS5JdGVtVGVtcGxhdGVzLmdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xyXG4gICAgICAgIGxldCBpdGVtID0gbmV3IEl0ZW0oKTtcclxuICAgICAgICBpdGVtLklkID0gdGVtcGxhdGUuSWQ7XHJcbiAgICAgICAgaWYgKGl0ZW0uaXNDb250YWluZXIoKSkge1xyXG4gICAgICAgICAgICBpdGVtLkludmVudG9yeSA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc29sdmVSYW5kb21JdGVtSW5kZXgoaXRlbURlZmluaXRpb246IEl0ZW1DaGFuY2VPbmVPZlRlbXBsYXRlKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QgPSBbXTtcclxuICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSXRlbUlkLmZvckVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdD8ucHVzaCgxKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5JdGVtSWQubGVuZ3RoICE9PSBpdGVtRGVmaW5pdGlvbi5DaGFuY2VMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSBkZWZpbml0aW9uIGhhcyB7MH0gc3BlY2lmaWVkIGlkcyBidXQgb25seSB7MX0gc3BlY2lmaWVkIGNoYW5jZXMgaW4gQ2hhbmNlTGlzdCcuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QubGVuZ3RoLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoYW5jZVN1bSA9IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QucmVkdWNlKChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gYSArIGIpO1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENoYW5jZSA9IFJhbmRvbS5uZXh0SW50KDEsIGNoYW5jZVN1bSk7XHJcbiAgICAgICAgY2hhbmNlU3VtID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2hhbmNlU3VtICs9IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3RbaV07XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZENoYW5jZSA8PSBjaGFuY2VTdW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwOyAvL3Nob3VsZCBuZXZlciBvY2N1clxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZUludmVudG9yeShpdGVtRGVmaW5pdGlvbjogSXRlbUNoYW5jZVRlbXBsYXRlLCBpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkludmVudG9yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnZlbnRvcnkgPSBpdGVtLmdldEludmVudG9yeSgpO1xyXG4gICAgICAgICAgICBpZiAoaW52ZW50b3J5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnkgPSBpdGVtLkludmVudG9yeSA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkludmVudG9yeS5mb3JFYWNoKChpdGVtRGVmaW5pdGlvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnk/LmFkZChHYW1lLnNwYXduSXRlbShpdGVtRGVmaW5pdGlvbikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlTG9jayhpdGVtRGVmaW5pdGlvbjogSXRlbUNoYW5jZVRlbXBsYXRlLCBpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkxvY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpdGVtLkxvY2sgPSBuZXcgSXRlbUxvY2soaXRlbURlZmluaXRpb24uTG9jayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhY2tWYWx1ZShzdGFjazogU3RhY2spOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChzdGFjayA9PT0gdW5kZWZpbmVkIHx8IHN0YWNrID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHN0YWNrID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhY2s7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJhbmRvbS5uZXh0SW50KHN0YWNrLk1pbiwgc3RhY2suTWF4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZExpc3RGcm9tVGVtcGxhdGUodGVtcGxhdGU/OiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudFtdKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1MaXN0ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGUuZm9yRWFjaCgoaXRlbURlZmluaXRpb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbUxpc3QuYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbUxpc3Q7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3Rlckxpc3QgfSBmcm9tICcuLi9tb2RlbC9DaGFyYWN0ZXJMaXN0JztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgUm9vbUV4aXQgfSBmcm9tICcuLi9tb2RlbC9Sb29tRXhpdCc7XHJcbmltcG9ydCB7IFJvb21FeGl0c0xpc3QgfSBmcm9tICcuLi9tb2RlbC9Sb29tRXhpdHNMaXN0JztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL1Jvb21UZW1wbGF0ZSc7XHJcbmltcG9ydCB7IFJvb21Eb29yIH0gZnJvbSAnLi4vbW9kZWwvUm9vbURvb3InO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4uL21vZGVsL0dhbWVEYXRhJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tRmFjdG9yeSB7XHJcbiAgICBzcGF3blJvb20odGVtcGxhdGU6IFJvb21UZW1wbGF0ZSkge1xyXG4gICAgICAgIGxldCByb29tID0gbmV3IFJvb20oKTtcclxuICAgICAgICByb29tLklkID0gdGVtcGxhdGUuSWQ7XHJcbiAgICAgICAgcmV0dXJuIHJvb207XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21EYXRhKHJvb206IFJvb20pIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IEdhbWVEYXRhLlJvb21UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUocm9vbS5JZCk7XHJcbiAgICAgICAgbGV0IGV4aXRzTW9kZWwgPSBuZXcgUm9vbUV4aXRzTGlzdCgpO1xyXG4gICAgICAgIHRlbXBsYXRlLkV4aXRzPy5mb3JFYWNoKChleGl0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSBleGl0LkRpcmVjdGlvbjtcclxuICAgICAgICAgICAgbGV0IHJvb21FeGl0ID0gbmV3IFJvb21FeGl0KCk7XHJcbiAgICAgICAgICAgIHJvb21FeGl0LlJvb21JZCA9IGV4aXQuUm9vbUlkO1xyXG4gICAgICAgICAgICByb29tRXhpdC5Jc0hpZGRlbiA9IGV4aXQuaXNIaWRkZW47XHJcbiAgICAgICAgICAgIGlmIChleGl0LkRvb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvb3IgPSAocm9vbUV4aXQuRG9vciA9IG5ldyBSb29tRG9vcigpKTtcclxuICAgICAgICAgICAgICAgIGRvb3IuSXNMb2NrZWQgPSBleGl0LkRvb3IuSXNMb2NrZWQ7XHJcbiAgICAgICAgICAgICAgICBkb29yLklzQ2xvc2VkID0gZXhpdC5Eb29yLklzQ2xvc2VkO1xyXG4gICAgICAgICAgICAgICAgZG9vci5LZXlJZCA9IGV4aXQuRG9vci5LZXlJZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZG9vci5Jc0xvY2tlZCA9PT0gdW5kZWZpbmVkICYmIGRvb3IuS2V5SWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvb3IuSXNMb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvb3IuSXNDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV4aXRzTW9kZWxbZGlyZWN0aW9uXSA9IHJvb21FeGl0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJvb20uRXhpdHMgPSBleGl0c01vZGVsO1xyXG5cclxuICAgICAgICByb29tLkl0ZW1zID0gR2FtZS5JdGVtRmFjdG9yeS5sb2FkTGlzdEZyb21UZW1wbGF0ZSh0ZW1wbGF0ZS5JdGVtcyk7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5DaGFyYWN0ZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcnNNb2RlbCA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLkNoYXJhY3RlcnMuZm9yRWFjaCgoY2hhcmFjdGVySWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYXJhY3RlcnNNb2RlbC5hZGQoR2FtZS5zcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcm9vbS5DaGFyYWN0ZXJzID0gY2hhcmFjdGVyc01vZGVsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEVudGl0eUJhc2UgfSBmcm9tICcuL0VudGl0eUJhc2UnO1xyXG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuL0VxdWlwbWVudCc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IENoYXJhY3RlclN0YXRzIH0gZnJvbSAnLi9DaGFyYWN0ZXJTdGF0cyc7XHJcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ2hhcmFjdGVyVGVtcGxhdGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlciBleHRlbmRzIEVudGl0eUJhc2Uge1xyXG4gICAgSW52ZW50b3J5OiBJdGVtTGlzdCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgRXF1aXBtZW50OiBFcXVpcG1lbnQgPSBuZXcgRXF1aXBtZW50KCk7XHJcbiAgICBTdGF0czogQ2hhcmFjdGVyU3RhdHMgPSBuZXcgQ2hhcmFjdGVyU3RhdHMoKTtcclxuXHJcbiAgICBwcml2YXRlIGdldFRlbXBsYXRlKCk6IENoYXJhY3RlclRlbXBsYXRlIHtcclxuICAgICAgICByZXR1cm4gR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzLmdldFRlbXBsYXRlKHRoaXMuSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3RlcjogQ2hhcmFjdGVyKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZENoYXJhY3Rlcik7XHJcbiAgICAgICAgdGhpcy5JbnZlbnRvcnkgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB0aGlzLkludmVudG9yeS5sb2FkRnJvbVNhdmUoc2F2ZWRDaGFyYWN0ZXIuSW52ZW50b3J5KTtcclxuICAgICAgICB0aGlzLkVxdWlwbWVudCA9IG5ldyBFcXVpcG1lbnQoKTtcclxuICAgICAgICB0aGlzLkVxdWlwbWVudC5sb2FkRnJvbVNhdmUoc2F2ZWRDaGFyYWN0ZXIuRXF1aXBtZW50KTtcclxuICAgICAgICB0aGlzLlN0YXRzID0gbmV3IENoYXJhY3RlclN0YXRzKCk7XHJcbiAgICAgICAgdGhpcy5TdGF0cy5sb2FkRnJvbVNhdmUoc2F2ZWRDaGFyYWN0ZXIuU3RhdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoZ3JhbW1hQ2FzZSA9IEdyYW1tYUNhc2UuTWlhbm93bmlrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lW2dyYW1tYUNhc2VdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuRGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SWRsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLklkbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW52ZW50b3J5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkludmVudG9yeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFcXVpcG1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRXF1aXBtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEVxdWlwbWVudCgpLmhhc0xpZ2h0U291cmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGVhbHRoTGV2ZWwoZGVzY3JpcHRpb246IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgcGVyY2VudGFnZSA9ICh0aGlzLlN0YXRzLmN1cnJlbnRIZWFsdGggKiAxMDApIC8gdGhpcy5TdGF0cy5oZWFsdGgudG90YWw7XHJcbiAgICAgICAgbGV0IGxldmVsOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuRnVsbCA6ICfilojilojilojilojilognO1xyXG4gICAgICAgICAgICByZXR1cm4gJ3xHJyArIGxldmVsICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPiA4MCkge1xyXG4gICAgICAgICAgICBsZXZlbCA9IGRlc2NyaXB0aW9uID8gTG9jYWwuU3RhdHMuSGVhbHRoTGV2ZWxzLkxpZ2h0V291bmRzIDogJ+KWiOKWiOKWiOKWiOKWiCc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfGcnICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDYwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuTWVkaXVtV291bmRzIDogJ+KWiOKWiOKWiOKWiOKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFknICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDQwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuU2VyaW91c1dvdW5kcyA6ICfilojilojilojilpHilpEnO1xyXG4gICAgICAgICAgICByZXR1cm4gJ3xZJyArIGxldmVsICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPiAyMCkge1xyXG4gICAgICAgICAgICBsZXZlbCA9IGRlc2NyaXB0aW9uID8gTG9jYWwuU3RhdHMuSGVhbHRoTGV2ZWxzLkhlYXZ5V291bmRzIDogJ+KWiOKWiOKWkeKWkeKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFInICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+PSAwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuTmVhckRlYXRoIDogJ+KWiOKWkeKWkeKWkeKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFInICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXZlbCA9IGRlc2NyaXB0aW9uID8gTG9jYWwuU3RhdHMuSGVhbHRoTGV2ZWxzLkRlYWQgOiAn4paR4paR4paR4paR4paRJztcclxuICAgICAgICByZXR1cm4gJ3xSJyArIGxldmVsICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEVudGl0eUxpc3QgfSBmcm9tICcuL0VudGl0eUxpc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3Rlckxpc3QgZXh0ZW5kcyBFbnRpdHlMaXN0PENoYXJhY3Rlcj4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRMaXN0OiBDaGFyYWN0ZXJMaXN0KSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IHNhdmVkTGlzdC5BcnJheS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0NoYXIgPSBuZXcgQ2hhcmFjdGVyKCk7XHJcbiAgICAgICAgICAgIG5ld0NoYXIubG9hZEZyb21TYXZlKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3Q2hhcjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChjKSA9PiBjLmhhc0xpZ2h0U291cmNlKCkgPT09IHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFN0YXQge1xyXG4gICAgYmFzZTogbnVtYmVyID0gMDtcclxuICAgIHJhY2U6IG51bWJlciA9IDA7XHJcbiAgICBjbGFzczogbnVtYmVyID0gMDtcclxuICAgIGJvbnVzOiBudW1iZXIgPSAwO1xyXG4gICAgdG90YWw6IG51bWJlciA9IDA7XHJcbn1cclxuXHJcbmNsYXNzIEF0dHJpYnV0ZSB7XHJcbiAgICBzdGF0OiBudW1iZXIgPSAwO1xyXG4gICAgbGV2ZWw6IG51bWJlciA9IDA7XHJcbiAgICBlcTogbnVtYmVyID0gMDtcclxuICAgIGJvbnVzOiBudW1iZXIgPSAwO1xyXG4gICAgbW9kaWZpZXI6IG51bWJlciA9IDA7XHJcbiAgICB0b3RhbDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlclN0YXRzIHtcclxuICAgIGxldmVsOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHN0cmVuZ3RoOiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIGRleHRlcml0eTogU3RhdCA9IG5ldyBTdGF0KCk7XHJcbiAgICBhZ2lsaXR5OiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIGVuZHVyYW5jZTogU3RhdCA9IG5ldyBTdGF0KCk7XHJcbiAgICB2aXRhbGl0eTogU3RhdCA9IG5ldyBTdGF0KCk7XHJcblxyXG4gICAgYXR0YWNrOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBkZWZlbnNlOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBoZWFsdGg6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGFybW9yOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBmYXRpZ3VlOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBkYW1hZ2U6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuXHJcbiAgICBjdXJyZW50SGVhbHRoOiBudW1iZXIgPSAxMDA7XHJcbiAgICBjdXJyZW50QXJtb3I6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5oZWFsdGgudG90YWwgPSAxMDA7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkU3RhdHM6IENoYXJhY3RlclN0YXRzKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZFN0YXRzKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ2hhcmFjdGVyVGVtcGxhdGVzIHtcclxuICAgIFt0ZW1wbGF0ZUlkOiBzdHJpbmddOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihjaGFyYWN0ZXJUZW1wbGF0ZXM/OiBhbnkpIHtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyVGVtcGxhdGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNoYXJhY3RlclRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NoYXJhY3RlciB0ZW1wbGF0ZXMgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFyYWN0ZXJUZW1wbGF0ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3Q2hhcmFjdGVyVGVtcGxhdGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5ld0NoYXJhY3RlclRlbXBsYXRlKGNoYXJhY3RlclRlbXBsYXRlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpc1tjaGFyYWN0ZXJUZW1wbGF0ZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2hhcmFjdGVyIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoY2hhcmFjdGVyVGVtcGxhdGUuSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzW2NoYXJhY3RlclRlbXBsYXRlLklkXSA9IGNoYXJhY3RlclRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKGNoYXJhY3RlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpc1tjaGFyYWN0ZXJJZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gQ2hhcmFjdGVyIHRlbXBsYXRlIGRlZmluZWQgZm9yIElkIHswfSEnLmZvcm1hdChjaGFyYWN0ZXJJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW2NoYXJhY3RlcklkXTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5QmFzZSB7XHJcbiAgICBJZDogc3RyaW5nID0gJyc7XHJcbiAgICBhYnN0cmFjdCBnZXROYW1lKCk6IHN0cmluZztcclxuICAgIGFic3RyYWN0IGdldElkbGUoKTogc3RyaW5nO1xyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZEVudGl0eTogRW50aXR5QmFzZSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRFbnRpdHkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVudGl0eUJhc2UgfSBmcm9tICcuL0VudGl0eUJhc2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eUxpc3Q8VHlwZSBleHRlbmRzIEVudGl0eUJhc2U+IHtcclxuICAgIEFycmF5OiBUeXBlW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGl0ZW06IFR5cGUpIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuQXJyYXkucHVzaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoaXRlbTogVHlwZSkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuQXJyYXkuaW5kZXhPZihpdGVtKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLkFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFueSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRBdChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuQXJyYXlbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5W2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXkubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmQobmFtZTogc3RyaW5nLCBudW1iZXIgPSAxKTogVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGxldCBmb3VuZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5BcnJheS5zb21lKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmdldE5hbWUoKS5zZWFyY2gobmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bWJlciA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBudW1iZXItLTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEJ5SWQoaWQ6IHN0cmluZywgbnVtYmVyID0gMSk6IFR5cGUgfCBudWxsIHtcclxuICAgICAgICBsZXQgZm91bmQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuQXJyYXkuc29tZSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5JZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50TG9uZ0Zvcm1hdChpbmRlbnQgPSB0cnVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpbnQoaW5kZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmludFNob3J0Rm9ybWF0KGluZGVudCA9IHRydWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcmludChpbmRlbnQsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmludChpbmRlbnQgPSB0cnVlLCBsb25nRm9ybWF0ID0gdHJ1ZSkge1xyXG4gICAgICAgIGxldCByZXR1cm5TdHJpbmcgPSAnJztcclxuICAgICAgICB0aGlzLkFycmF5LmZvckVhY2goKGVudGl0eSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmV0dXJuU3RyaW5nICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9IEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9IGVudGl0eS5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKTtcclxuICAgICAgICAgICAgaWYgKGxvbmdGb3JtYXQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSAnICcgKyBlbnRpdHkuZ2V0SWRsZSgpICsgJy4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblN0cmluZztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBFcXVpcG1lbnRTbG90LCBFcXVpcG1lbnRTbG90SGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRXF1aXBtZW50U2xvdCc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudCB7XHJcbiAgICBBcnJheTogSXRlbVtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZEVxdWlwbWVudDogRXF1aXBtZW50KSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IHNhdmVkRXF1aXBtZW50LkFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgICAgIG5ld0l0ZW0ubG9hZEZyb21TYXZlKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3SXRlbTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZVNsb3Qoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIGlmIChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnezB9IGlzIG5vdCBhIHByb3BlciBlcXVpcG1lbnQgc2xvdC4nLmZvcm1hdChzbG90KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXF1aXAoc2xvdDogRXF1aXBtZW50U2xvdCwgaXRlbTogSXRlbSB8IG51bGwpIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBlcXVpcCwgezB9IGFscmVhZHkgY29udGFpbnMgYW4gaXRlbS4nLmZvcm1hdChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLkFycmF5W3Nsb3RdID0gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJDYW5ub3QgcmVtb3ZlLCB7MH0gZG9lc24ndCBjb250YWlucyBhbiBpdGVtLlwiLmZvcm1hdChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgdGhpcy5BcnJheVtzbG90XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5BcnJheVtzbG90XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheVtzbG90XTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChpKSA9PiBpLmlzTGlnaHRTb3VyY2UoKSA9PT0gdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2xvYmFsRXZlbnRzIH0gZnJvbSAnLi4vR2xvYmFsRXZlbnRzJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi9DaGFyYWN0ZXInO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudEFyZ3MgfSBmcm9tICcuL0dsb2JhbEV2ZW50QXJncyc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuL1Jvb20nO1xyXG5pbXBvcnQgeyBSb29tRmFjdG9yeSB9IGZyb20gJy4uL2ZhY3Rvcmllcy9Sb29tRmFjdG9yeSc7XHJcbmltcG9ydCB7IEl0ZW1GYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzL0l0ZW1GYWN0b3J5JztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyRmFjdG9yeSB9IGZyb20gJy4uL2ZhY3Rvcmllcy9DaGFyYWN0ZXJGYWN0b3J5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lTW9kZWwge1xyXG4gICAgTmFtZTogc3RyaW5nO1xyXG4gICAgU3RhcnRpbmdSb29tOiBudW1iZXI7XHJcbiAgICBSb29tczogUm9vbVtdO1xyXG4gICAgUGxheWVyID0gbmV3IFBsYXllcigpO1xyXG5cclxuICAgIEl0ZW1GYWN0b3J5OiBJdGVtRmFjdG9yeTtcclxuICAgIENoYXJhY3RlckZhY3Rvcnk6IENoYXJhY3RlckZhY3Rvcnk7XHJcbiAgICBSb29tRmFjdG9yeTogUm9vbUZhY3Rvcnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5OYW1lID0gJyc7XHJcbiAgICAgICAgdGhpcy5TdGFydGluZ1Jvb20gPSAwO1xyXG4gICAgICAgIHRoaXMuUm9vbXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5JdGVtRmFjdG9yeSA9IG5ldyBJdGVtRmFjdG9yeSgpO1xyXG4gICAgICAgIHRoaXMuQ2hhcmFjdGVyRmFjdG9yeSA9IG5ldyBDaGFyYWN0ZXJGYWN0b3J5KCk7XHJcbiAgICAgICAgdGhpcy5Sb29tRmFjdG9yeSA9IG5ldyBSb29tRmFjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRHYW1lKHNhdmVkR2FtZTogR2FtZU1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5OYW1lID0gc2F2ZWRHYW1lLk5hbWU7XHJcbiAgICAgICAgdGhpcy5TdGFydGluZ1Jvb20gPSBzYXZlZEdhbWUuU3RhcnRpbmdSb29tO1xyXG4gICAgICAgIGZvciAobGV0IHJvb21JZCBpbiBzYXZlZEdhbWUuUm9vbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5Sb29tc1tyb29tSWRdID0gbmV3IFJvb20oKTtcclxuICAgICAgICAgICAgdGhpcy5Sb29tc1tyb29tSWRdLmxvYWRGcm9tU2F2ZShzYXZlZEdhbWUuUm9vbXNbcm9vbUlkXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuUGxheWVyID0gbmV3IFBsYXllcigpO1xyXG4gICAgICAgIHRoaXMuUGxheWVyLmxvYWRGcm9tU2F2ZShzYXZlZEdhbWUuUGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Um9vbShyb29tSWQ6IG51bWJlcik6IFJvb20ge1xyXG4gICAgICAgIGxldCByb29tID0gdGhpcy5Sb29tc1tyb29tSWRdO1xyXG4gICAgICAgIGlmIChyb29tID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm9vbVRlbXBsYXRlID0gR2FtZURhdGEuUm9vbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZShyb29tSWQpO1xyXG4gICAgICAgICAgICByb29tID0gdGhpcy5Sb29tc1tyb29tSWRdID0gdGhpcy5Sb29tRmFjdG9yeS5zcGF3blJvb20ocm9vbVRlbXBsYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5Sb29tRmFjdG9yeS5sb2FkRnJvbURhdGEocm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb29tO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYXduSXRlbShpdGVtRGVmaW5pdGlvbjogYW55KTogSXRlbSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkl0ZW1GYWN0b3J5LnNwYXduSXRlbShpdGVtRGVmaW5pdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25DaGFyYWN0ZXIoY2hhcmFjdGVySWQ6IHN0cmluZyk6IENoYXJhY3RlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hhcmFjdGVyRmFjdG9yeS5zcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbVR5cGUoaXRlbVR5cGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBHYW1lRGF0YS5JdGVtVHlwZXMuZ2V0SXRlbVR5cGUoaXRlbVR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnZva2VHbG9iYWxFdmVudChuYW1lOiBzdHJpbmcsIGFyZ3M6IEdsb2JhbEV2ZW50QXJncyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBldmVudCA9IEdsb2JhbEV2ZW50c1tuYW1lXTtcclxuICAgICAgICBpZiAoZXZlbnQgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgZXZlbnQgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJHbG9iYWwgZXZlbnQgd2l0aCBuYW1lIHswfSBkb2Vzbid0IGV4aXN0XCIuZm9ybWF0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50KGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENoYXJhY3RlclRlbXBsYXRlcyB9IGZyb20gJy4vQ2hhcmFjdGVyVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgSXRlbVRlbXBsYXRlcyB9IGZyb20gJy4vSXRlbVRlbXBsYXRlcyc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlcyB9IGZyb20gJy4vSXRlbVR5cGVzJztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlcyB9IGZyb20gJy4vUm9vbVRlbXBsYXRlcyc7XHJcblxyXG5jbGFzcyBHYW1lRGF0YU1vZGVsIHtcclxuICAgIEl0ZW1UeXBlczogSXRlbVR5cGVzO1xyXG4gICAgSXRlbVRlbXBsYXRlczogSXRlbVRlbXBsYXRlcztcclxuICAgIENoYXJhY3RlclRlbXBsYXRlczogQ2hhcmFjdGVyVGVtcGxhdGVzO1xyXG4gICAgUm9vbVRlbXBsYXRlczogUm9vbVRlbXBsYXRlcztcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuSXRlbVR5cGVzID0gbmV3IEl0ZW1UeXBlcyh1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuSXRlbVRlbXBsYXRlcyA9IG5ldyBJdGVtVGVtcGxhdGVzKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJUZW1wbGF0ZXMgPSBuZXcgQ2hhcmFjdGVyVGVtcGxhdGVzKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5Sb29tVGVtcGxhdGVzID0gbmV3IFJvb21UZW1wbGF0ZXModW5kZWZpbmVkKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBHYW1lRGF0YSA9IG5ldyBHYW1lRGF0YU1vZGVsKCk7XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHbG9iYWxFdmVudEFyZ3Mge1xyXG4gICAgVHlwZTogbnVtYmVyO1xyXG4gICAgU2VuZGVyOiBhbnk7XHJcbiAgICBUZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaztcclxuICAgIENvbnRpbnVlQ29tbWFuZENhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHR5cGU6IG51bWJlcixcclxuICAgICAgICBzZW5kZXI6IGFueSxcclxuICAgICAgICB0ZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjayxcclxuICAgICAgICBjb250aW51ZUNvbW1hbmRDYWxsYmFjazogRnVuY3Rpb24sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLlR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuU2VuZGVyID0gc2VuZGVyO1xyXG4gICAgICAgIHRoaXMuVGVybWluYXRlQ29tbWFuZENhbGxiYWNrID0gdGVybWluYXRlQ29tbWFuZENhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuQ29udGludWVDb21tYW5kQ2FsbGJhY2sgPSBjb250aW51ZUNvbW1hbmRDYWxsYmFjaztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XG5pbXBvcnQgeyBJdGVtVHlwZSwgSXRlbVR5cGVIZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9JdGVtVHlwZSc7XG5pbXBvcnQgeyBFbnRpdHlCYXNlIH0gZnJvbSAnLi9FbnRpdHlCYXNlJztcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XG5pbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XG5pbXBvcnQgeyBJdGVtTG9jayB9IGZyb20gJy4vSXRlbUxvY2snO1xuaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vR2FtZURhdGEnO1xuXG5leHBvcnQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eUJhc2Uge1xuICAgIFN0YWNrPzogbnVtYmVyO1xuICAgIEludmVudG9yeT86IEl0ZW1MaXN0O1xuICAgIExvY2s/OiBJdGVtTG9jaztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGVtcGxhdGUoKTogSXRlbVRlbXBsYXRlIHtcbiAgICAgICAgcmV0dXJuIEdhbWVEYXRhLkl0ZW1UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGhpcy5JZCk7XG4gICAgfVxuXG4gICAgZ2V0TmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmdldFRlbXBsYXRlKCkuTmFtZTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RhY2thYmxlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lW2dyYW1tYUNhc2VdICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0YWNrKCkgKyAnICcgKyB0aGlzLmdldFBsdXJhbE5hbWUoZ3JhbW1hQ2FzZSkgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGx1cmFsTmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmdldFRlbXBsYXRlKCkuTmFtZTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG5hbWVbMF0pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZVtncmFtbWFDYXNlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5nZXRTdGFjaygpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZVswXVtncmFtbWFDYXNlXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVbMV1bZ3JhbW1hQ2FzZV07XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVbMl1bZ3JhbW1hQ2FzZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREZXNjcmlwdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5EZXNjcmlwdGlvbiArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XG4gICAgfVxuXG4gICAgZ2V0SWRsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0VGVtcGxhdGUoKS5JZGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2NhbC5Db21tYW5kcy5Mb29rLkRlZmF1bHRJZGxlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuSWRsZSE7XG4gICAgfVxuXG4gICAgaXNMaWdodFNvdXJjZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5Jc0xpZ2h0U291cmNlID09PSB0cnVlO1xuICAgIH1cblxuICAgIGlzU3RhY2thYmxlKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLklzU3RhY2thYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLklzU3RhY2thYmxlO1xuICAgIH1cblxuICAgIGdldFN0YWNrKCkge1xuICAgICAgICBpZiAodGhpcy5TdGFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5TdGFjaztcbiAgICB9XG5cbiAgICBzZXRTdGFjayh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RhY2thYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuU3RhY2sgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFN0YWNrKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGFja2FibGUoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuU3RhY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuU3RhY2sgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5TdGFjayArPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFR5cGUoKSB7XG4gICAgICAgIHJldHVybiBJdGVtVHlwZUhlbHBlci5wYXJzZSh0aGlzLmdldFRlbXBsYXRlKCkuVHlwZSk7XG4gICAgfVxuXG4gICAgaXNUYWtlYWJsZSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGF0aWM6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXRpY0NvbnRhaW5lcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTGV2ZXI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEludmVudG9yeSgpOiBJdGVtTGlzdCB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5JbnZlbnRvcnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuSW52ZW50b3J5O1xuICAgIH1cblxuICAgIGlzQ29udGFpbmVyKCkge1xuICAgICAgICBsZXQgdHlwZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKS5UeXBlO1xuICAgICAgICByZXR1cm4gdHlwZSA9PSBJdGVtVHlwZS5Db250YWluZXIgfHwgdHlwZSA9PSBJdGVtVHlwZS5TdGF0aWNDb250YWluZXI7XG4gICAgfVxuXG4gICAgaXNMb2NrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkxvY2s/LklzTG9ja2VkID09PSB0cnVlO1xuICAgIH1cblxuICAgIHNldElzTG9ja2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLkxvY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5Mb2NrLklzTG9ja2VkID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgRW50aXR5TGlzdCB9IGZyb20gJy4vRW50aXR5TGlzdCc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1MaXN0IGV4dGVuZHMgRW50aXR5TGlzdDxJdGVtPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZExpc3Q6IEl0ZW1MaXN0KSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IHNhdmVkTGlzdC5BcnJheS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0l0ZW0gPSBuZXcgSXRlbSgpO1xyXG4gICAgICAgICAgICBuZXdJdGVtLmxvYWRGcm9tU2F2ZShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGl0ZW06IEl0ZW0gfCBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbS5pc1N0YWNrYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1N0YWNrID0gR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZmluZEJ5SWQoaXRlbS5JZCk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1N0YWNrICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ1N0YWNrLmFkZFN0YWNrKGl0ZW0uZ2V0U3RhY2soKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIuYWRkKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5LnNvbWUoKGkpID0+IGkuaXNMaWdodFNvdXJjZSgpID09PSB0cnVlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMb2NrVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ29tbW9uJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVtTG9jayB7XHJcbiAgICBJc0xvY2tlZDogYm9vbGVhbjtcclxuICAgIEtleUlkOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZTogTG9ja1RlbXBsYXRlKSB7XHJcbiAgICAgICAgdGhpcy5Jc0xvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5LZXlJZCA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgdGVtcGxhdGUpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEl0ZW1UZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9JdGVtVGVtcGxhdGUnO1xyXG5cclxuY2xhc3MgSXRlbVRlbXBsYXRlc0xpc3Qge1xyXG4gICAgW3RlbXBsYXRlSWQ6IHN0cmluZ106IEl0ZW1UZW1wbGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1UZW1wbGF0ZXMge1xyXG4gICAgbGlzdDogSXRlbVRlbXBsYXRlc0xpc3QgPSBuZXcgSXRlbVRlbXBsYXRlc0xpc3QoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpdGVtVGVtcGxhdGVzOiBJdGVtVGVtcGxhdGVbXSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChpdGVtVGVtcGxhdGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW1UZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHRlbXBsYXRlcyBtdXN0IGJlIGFuIGFycmF5JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW1UZW1wbGF0ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3SXRlbVRlbXBsYXRlKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGROZXdJdGVtVGVtcGxhdGUoaXRlbVRlbXBsYXRlOiBJdGVtVGVtcGxhdGUpIHtcclxuICAgICAgICBpZiAodGhpcy5saXN0W2l0ZW1UZW1wbGF0ZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0ZW1wbGF0ZSB7MH0gaXMgYWxyZWFkeSBkZWZpbmVkIScuZm9ybWF0KGl0ZW1UZW1wbGF0ZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGlzdFtpdGVtVGVtcGxhdGUuSWRdID0gaXRlbVRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKGl0ZW1JZDogc3RyaW5nKTogSXRlbVRlbXBsYXRlIHtcclxuICAgICAgICBpZiAodGhpcy5saXN0W2l0ZW1JZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gaXRlbSB0ZW1wbGF0ZSBkZWZpbmVkIGZvciB7MH0hJy5mb3JtYXQoaXRlbUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdFtpdGVtSWRdO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBJdGVtVHlwZXMge1xyXG4gICAgW2l0ZW1UeXBlSWQ6IHN0cmluZ106IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1UeXBlc1RlbXBsYXRlOiBhbnkgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoaXRlbVR5cGVzVGVtcGxhdGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbVR5cGVzVGVtcGxhdGUpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHR5cGVzIHRlbXBsYXRlIG11c3QgYmUgYW4gYXJyYXknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbVR5cGVzVGVtcGxhdGUuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuQWRkTmV3SXRlbVR5cGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIEFkZE5ld0l0ZW1UeXBlKGl0ZW1UeXBlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpc1tpdGVtVHlwZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0eXBlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoaXRlbVR5cGUuSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzW2l0ZW1UeXBlLklkXSA9IGl0ZW1UeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIEdldEl0ZW1UeXBlKGl0ZW1UeXBlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaXRlbVR5cGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHR5cGUgJyArIGl0ZW1UeXBlTmFtZSArICcgaXMgbm90IGRlZmluZWQhJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbaXRlbVR5cGVOYW1lXTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi9DaGFyYWN0ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIENoYXJhY3RlciB7XHJcbiAgICBMb2NhdGlvbjogbnVtYmVyID0gMDtcclxuICAgIFByZXZpb3VzTG9jYXRpb246IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRQbGF5ZXI6IFBsYXllcikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRQbGF5ZXIpO1xyXG4gICAgICAgIHN1cGVyLmxvYWRGcm9tU2F2ZShzYXZlZFBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYXRpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Mb2NhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMb2NhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5Mb2NhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByZXZpb3VzTG9jYXRpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5QcmV2aW91c0xvY2F0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByZXZpb3VzTG9jYXRpb24odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuUHJldmlvdXNMb2NhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNhblNlZSgpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbSh0aGlzLkxvY2F0aW9uKTtcclxuICAgICAgICByZXR1cm4gcm9vbS5oYXNMaWdodFNvdXJjZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uSGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyTGlzdCB9IGZyb20gJy4vQ2hhcmFjdGVyTGlzdCc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IFJvb21FeGl0IH0gZnJvbSAnLi9Sb29tRXhpdCc7XHJcbmltcG9ydCB7IFJvb21FeGl0c0xpc3QgfSBmcm9tICcuL1Jvb21FeGl0c0xpc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb20ge1xyXG4gICAgSWQ6IG51bWJlciA9IDA7XHJcbiAgICBFeGl0czogUm9vbUV4aXRzTGlzdCA9IG5ldyBSb29tRXhpdHNMaXN0KCk7XHJcbiAgICBJc1Zpc2l0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEl0ZW1zOiBJdGVtTGlzdCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgQ2hhcmFjdGVyczogQ2hhcmFjdGVyTGlzdCA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZFJvb206IFJvb20pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkUm9vbSk7XHJcbiAgICAgICAgdGhpcy5FeGl0cyA9IG5ldyBSb29tRXhpdHNMaXN0KCk7XHJcbiAgICAgICAgZm9yIChsZXQgZXhpdEtleSBpbiBzYXZlZFJvb20uRXhpdHMpIHtcclxuICAgICAgICAgICAgdGhpcy5FeGl0c1tleGl0S2V5XSA9IG5ldyBSb29tRXhpdCgpO1xyXG4gICAgICAgICAgICB0aGlzLkV4aXRzW2V4aXRLZXldLmxvYWRGcm9tU2F2ZShzYXZlZFJvb20uRXhpdHNbZXhpdEtleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkl0ZW1zID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgdGhpcy5JdGVtcy5sb2FkRnJvbVNhdmUoc2F2ZWRSb29tLkl0ZW1zKTtcclxuICAgICAgICB0aGlzLkNoYXJhY3RlcnMgPSBuZXcgQ2hhcmFjdGVyTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuQ2hhcmFjdGVycy5sb2FkRnJvbVNhdmUoc2F2ZWRSb29tLkNoYXJhY3RlcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzLmdldFRlbXBsYXRlKHRoaXMuSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuRGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhcmFjdGVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5DaGFyYWN0ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4aXQoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiBSb29tRXhpdCB8IG51bGwge1xyXG4gICAgICAgIGlmICh0aGlzLkV4aXRzW2RpcmVjdGlvbl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRXhpdHNbZGlyZWN0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeGl0VG9Sb29tKHJvb21JZDogbnVtYmVyKTogUm9vbUV4aXQgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGxldCBkaXJlY3Rpb24gaW4gdGhpcy5FeGl0cykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5FeGl0c1tkaXJlY3Rpb25dLmdldFJvb21JZCgpID09PSByb29tSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkV4aXRzW2RpcmVjdGlvbl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhpdHNEaXJlY3Rpb25zKCk6IERpcmVjdGlvbltdIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aW9uSGVscGVyLnBhcnNlQXJyYXkoT2JqZWN0LmtleXModGhpcy5FeGl0cykpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldFRlbXBsYXRlKCkuSXNOYXR1cmFsTGlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdldEl0ZW1zKCkuaGFzTGlnaHRTb3VyY2UoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hhcmFjdGVycygpLmhhc0xpZ2h0U291cmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T25GaXJzdEVudGVyRXZlbnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VGVtcGxhdGUoKS5PbkZpcnN0RW50ZXJFdmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLk9uRmlyc3RFbnRlckV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9uRW50ZXJFdmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLk9uRW50ZXJFdmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLk9uRW50ZXJFdmVudDtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgUm9vbURvb3Ige1xyXG4gICAgSXNMb2NrZWQ/OiBib29sZWFuO1xyXG4gICAgSXNDbG9zZWQ/OiBib29sZWFuO1xyXG4gICAgS2V5SWQ/OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkRG9vcjogUm9vbURvb3IpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkRG9vcik7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUm9vbURvb3IgfSBmcm9tICcuL1Jvb21Eb29yJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tRXhpdCB7XHJcbiAgICBSb29tSWQ6IG51bWJlciA9IDA7XHJcbiAgICBJc0hpZGRlbj86IGJvb2xlYW47XHJcbiAgICBEb29yPzogUm9vbURvb3I7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkRXhpdDogUm9vbUV4aXQpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkRXhpdCk7XHJcbiAgICAgICAgaWYgKHNhdmVkRXhpdC5Eb29yICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5Eb29yID0gbmV3IFJvb21Eb29yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuRG9vci5sb2FkRnJvbVNhdmUoc2F2ZWRFeGl0LkRvb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRSb29tSWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuUm9vbUlkO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRG9vcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNDbG9zZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRG9vcj8uSXNDbG9zZWQgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNMb2NrZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRG9vcj8uSXNMb2NrZWQgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNIaWRkZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXNIaWRkZW4gPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0S2V5SWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuRG9vcj8uS2V5SWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRG9vci5LZXlJZCE7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUm9vbUV4aXQgfSBmcm9tICcuL1Jvb21FeGl0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tRXhpdHNMaXN0IHtcclxuICAgIFtkaXJlY3Rpb246IHN0cmluZ106IFJvb21FeGl0O1xyXG59XHJcbiIsImltcG9ydCB7IFJvb21UZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9Sb29tVGVtcGxhdGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21UZW1wbGF0ZXMge1xyXG4gICAgW3RlbXBsYXRlSWQ6IG51bWJlcl06IFJvb21UZW1wbGF0ZTtcclxuICAgIFRlbXBsYXRlczogUm9vbVRlbXBsYXRlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb29tVGVtcGxhdGVzPzogYW55KSB7XHJcbiAgICAgICAgaWYgKHJvb21UZW1wbGF0ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocm9vbVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Jvb20gdGVtcGxhdGVzIG11c3QgYmUgYW4gYXJyYXknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm9vbVRlbXBsYXRlcy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdSb29tVGVtcGxhdGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5ld1Jvb21UZW1wbGF0ZShyb29tVGVtcGxhdGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzW3Jvb21UZW1wbGF0ZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUm9vbSB0ZW1wbGF0ZSB7MH0gaXMgYWxyZWFkeSBkZWZpbmVkIScuZm9ybWF0KHJvb21UZW1wbGF0ZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXNbcm9vbVRlbXBsYXRlLklkXSA9IHJvb21UZW1wbGF0ZTtcclxuICAgICAgICB0aGlzLlRlbXBsYXRlc1tyb29tVGVtcGxhdGUuSWRdID0gcm9vbVRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKHJvb21JZDogbnVtYmVyKTogUm9vbVRlbXBsYXRlIHtcclxuICAgICAgICBpZiAodGhpc1tyb29tSWRdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05vIFJvb20gdGVtcGxhdGUgZGVmaW5lZCBmb3IgSWQgezB9IScuZm9ybWF0KHJvb21JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW3Jvb21JZF07XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IFByb21wdCB9IGZyb20gJy4vY29tbW9uTG9naWMvUHJvbXB0JztcclxuaW1wb3J0IHsgSW5pdENvbW1hbmRzIH0gZnJvbSAnLi9jb21tYW5kc1V0aWxzL1JlZ2lzdGVyQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBHYW1lLCBJbml0R2FtZURhdGEsIFZlcnNpb24gfSBmcm9tICcuL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCAnLi9jb21tb25Mb2dpYy9JbnB1dEZ1bmN0aW9ucyc7XHJcbmltcG9ydCAnLi9jb21tb25Mb2dpYy9TdHJpbmdVdGlscyc7XHJcblxyXG5mdW5jdGlvbiBJbml0KCkge1xyXG4gICAgSW5pdEdhbWVEYXRhKCk7XHJcbiAgICBJbml0Q29tbWFuZHMoKTtcclxuICAgIEVuZ2luZS5PdXRwdXQoJ0R1bmdlb24gQ3Jhd2xlciAyLCB3ZXJzamE6Jyk7XHJcbiAgICBFbmdpbmUuT3V0cHV0KFZlcnNpb24pO1xyXG4gICAgQ29tbWFuZHMuR28uY2hhbmdlUGxheWVyTG9jYXRpb24oXHJcbiAgICAgICAgR2FtZS5nZXRSb29tKEdhbWUuU3RhcnRpbmdSb29tKSxcclxuICAgICAgICBuZXcgQ29tbWFuZENhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgICAgIFByb21wdC5QcmludCgpO1xyXG4gICAgICAgIH0pLFxyXG4gICAgKTtcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZnVuY3Rpb24gSW5pdCgpOiB2b2lkO1xyXG59XHJcbmdsb2JhbFRoaXMuSW5pdCA9IEluaXQ7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==