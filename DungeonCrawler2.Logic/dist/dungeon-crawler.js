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
    ExecuteBody(command, commandCallback) { }
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
            if (!firstExit) {
                returnString += ', ';
            }
            firstExit = false;
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
            if (exit !== null && !exit.isHidden() && !exit.isClosed()) {
                Engine.Output(InitGameData_1.Local.Commands.Scan.InDirection.format(Direction_1.DirectionHelper.getLocale(direction, GrammaCase_1.GrammaCase.Miejscownik)));
                Engine.Output(this.printCharacters(exit.RoomId));
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

/***/ "./src/commandsUtils/InitCommands.ts"
/*!*******************************************!*\
  !*** ./src/commandsUtils/InitCommands.ts ***!
  \*******************************************/
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
                if (door.IsLocked === undefined && door.IsClosed !== undefined) {
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

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Character-Schema.json","CharactersTemplates":[{"Id":"cave-rat","Name":["szczur jaskiniowy","szczura jaskiniowego","szczurowi jaskiniowemu","szczura jaskiniowego","szczurem jaskiniowym","szczurze jaskiniowym","szczurze jaskiniowy"],"Description":"Szczury jaskiniowe są nieco większe od szczurów miejskich, są jednak porównywalnie obrzydliwe. Bure, mokre futerko pokrywa prawie jedno łokciowego gryzonia, który skrzętnie przeszukuje otoczenie w poszukiwaniu pożywienia. Odgłos małych pazurków uderzających w kamienną posadzkę towarzyszy każdemu ruchowi szczura.","Idle":"szpera dookoła","Equipment":[{"Slot":"Torso","Item":"rat-skin"}]}]}');

/***/ },

/***/ "./res/Game.json"
/*!***********************!*\
  !*** ./res/Game.json ***!
  \***********************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"schema/Game-Schema.json","GameTemplate":{"Name":"nazwa gry","StartingRoom":0,"Rooms":[{"Id":0,"Name":"Początek korytarza","Description":"Rozglądając się dookoła dostrzegasz głównie ciemność. Wąski słup światła wpadający z dziury w suficie jest jedynym źródłem światła. Miejsce to wygląda na jakiś stary, podziemny tunel. Przejście za twoimi plecami zostało zasypane gruzem, kamieniami i ziemią, którą teraz porastają chwasty i trawa. Patrząc wprost widzisz morze kamienia ginące w mroku poza światłem. Interesująca wydaje się jedynie dziura w podłodze, umieszczona bezpośrednia pod tą w suficie. Słup światła nurkuje do niej ginąc gdzieś dużo, dużo niżej.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":1}],"Items":["stick-wood",{"ItemId":"gold","Stack":10},{"ItemId":"stick-wood","Chance":100},{"ItemId":["stick-wood","stick-wood-2","gold"],"ChanceList":[33,33,34],"Stack":[1,1,50]}]},{"Id":1,"Name":"Podziemny korytarz","Description":"Korytarz wyłożony jest starymi kamiennymi płytami. Takie same płytki na ścianach, podłodze, suficie, od tego kamienia zaczyna kręcić ci się w głowie. Niektóre z nich powypadały ze swoich miejsc, tworzą teraz warstwę gruzu na podłodze. Większość z tych, które pozostały jest porośnięta mchem. Sztucznie uformowany kamień powoli poddaje się otaczającej go naturze.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":2},{"Direction":"south","RoomId":0}],"Characters":["cave-rat"],"Items":[{"ItemId":"wooden-chest","Inventory":["sapphire-round",{"ItemId":"gold","Stack":{"Min":20,"Max":100}}],"Lock":{"KeyId":"simple-iron-key"}}],"OnFirstEnterEvent":"TestGlobalEvent"},{"Id":2,"Name":"Podziemny korytarz","Description":"Im dalej od źródła światła tym bardziej korytarz pogłębia się ciemności i dostrzegasz coraz mniej. Cienie robią się nadzwyczaj długie, niknące w ciemności znajdującej się przed tobą. Refleksje światła na nieporośniętych mchem płytkach stają się coraz słabsze, natomiast podłoga wydaje się być pokryta dywanem mroku.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":3},{"Direction":"south","RoomId":1}]}]}}');

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

module.exports = /*#__PURE__*/JSON.parse('{"Local":{"Directions":{"north":["północ","północy","północy","północ","północą","północy","północy"],"south":["południe","południa","południu","południe","południem","południu","południu"],"east":["wschód","wschodu","wschodowi","wschód","wschodem","wschodzie","wschodzie"],"west":["zachód","zachodu","zachodowi","zachód","zachodem","zachodzie","zachodzie"],"up":["góra","góry","górze","górę","górą","górze","góro"],"down":["dół","dołu","dołowi","dół","dołem","dole","dole"]},"Stats":{"HealthLevels":{"Full":"w pełni zdrowia","LightWounds":"lekko ranny","MediumWounds":"średnio rany","SeriousWounds":"poważnie ranny","HeavyWounds":"ciężko ranny","NearDeath":"bliski śmierci","Dead":"martwy"}},"Commands":{"Drop":{"NoArgument":"Co chcesz wyrzucić?","NoItems":"Przecież nic nie masz biedaku.","NoItemFound":"Nie masz czegoś takiego jak {0}.","Dropped":"Upuszczasz {0}."},"Exam":{"NoArgument":"Czemu chcesz się przyjęć?","NoObject":"Nie znajdujesz niczego takiego jak {0}.","Contains":"Zawiera w sobie:","LockedContainer":"Pojemnik jest zamknięty.","HealthLevel":"{0} jest {1}."},"Go":{"WrongDirection":"Może lepiej zostać tutaj i zjeść kilka pierogów?","NoPassage":"Nie możesz tam pójść.","PassageClosed":"Przejście jest zamknięte."},"Inventory":{"YourItems":"Obecnie przy sobie posiadasz:","NoItems":"{0}Ogólnie nic"},"Load":{"Loading":"Ładowanie gry...","Loaded":"Gra została załadowana."},"Look":{"CantSee":"Nic nie widzisz w tej ciemności.","NoObject":"Tu nie ma nic takiego jak {0}.","YouLookAt":"Przyglądasz się {0}.","Exits":"Wyjścia","DefaultIdle":"leży na ziemi"},"NoCommand":{"NoCommand":"Chyba ty."},"Save":{"Saved":"Gra została zapisana."},"Scan":{"CantSee":"Nic nie widzisz w tej ciemności.","LookingAroundYouSee":"Rozglądając się dookoła dostrzegasz:","Here":"Tutaj:","InDirection":"Na {0}:","NoOneThere":"nikogo nie ma"},"Take":{"NoArgument":"Wziąć co?","NoItems":"Nic tu nie ma.","NoItemFound":"Tutaj nie ma czegoś takiego jak {0}.","NoItemFoundInContainer":"{0} nie zawiera czegoś takiego jak {1}.","CannotPickUp":"Nie możesz podnieść {0}.","PickedUp":"Podnosisz {0}.","ContainerIsLocked":"{0} jest zamknięty.","IsNoContainer":"{0} nie jest pojemnikiem.","TakeItemFromContainer":"Wyjmujesz {0} z {1}."}},"GlobalEvents":{"TestGlobalEvent":{"Message":"Testing global events..."}}}}');

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
const InitCommands_1 = __webpack_require__(/*! ./commandsUtils/InitCommands */ "./src/commandsUtils/InitCommands.ts");
const InitGameData_1 = __webpack_require__(/*! ./InitGameData */ "./src/InitGameData.ts");
__webpack_require__(/*! ./commonLogic/InputFunctions */ "./src/commonLogic/InputFunctions.ts");
__webpack_require__(/*! ./commonLogic/StringUtils */ "./src/commonLogic/StringUtils.ts");
function Init() {
    (0, InitGameData_1.InitGameData)();
    (0, InitCommands_1.InitCommands)();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVuZ2Vvbi1jcmF3bGVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwrR0FBd0Q7QUFDeEQsMEZBQXVDO0FBR3ZDLE1BQU0saUJBQWlCO0lBUW5CLGVBQWUsQ0FBQyxJQUFxQjtRQUNqQyx5QkFBVyxDQUFDLGFBQWEsQ0FBQyxvQkFBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3BHLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQUVVLG9CQUFZLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ0ZsRCxvQ0FTQztBQUVELDRCQUlDO0FBL0JELGtHQUFrRDtBQUNsRCxzRkFBbUQ7QUFDbkQscUdBQTZEO0FBQzdELCtGQUF3RDtBQUN4RCxtRkFBZ0Q7QUFDaEQsOEVBQXlDO0FBQ3pDLDZGQUErRDtBQUMvRCx3SEFBZ0U7QUFDaEUseUdBQXNEO0FBQ3RELDBGQUE0QztBQUM1Qyx5R0FBc0Q7QUFFM0MsYUFBSyxHQUFHLHFCQUFPLENBQUM7QUFDaEIsWUFBSSxHQUFjLElBQUksZ0JBQVMsRUFBRSxDQUFDO0FBQ2xDLGVBQU8sR0FBRyxFQUFFLENBQUM7QUFFeEIsU0FBZ0IsWUFBWTtJQUN4QixZQUFJLEdBQUcsSUFBSSxnQkFBUyxFQUFFLENBQUM7SUFDdkIsbUJBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxxQkFBYSxDQUFDLDBCQUFTLENBQUMsQ0FBQztJQUNsRCxtQkFBUSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUFhLENBQUMsMkJBQWMsQ0FBQyxDQUFDO0lBQzNELG1CQUFRLENBQUMsa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxxQ0FBbUIsQ0FBQyxDQUFDO0lBQzFFLG1CQUFRLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyx3QkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9ELGVBQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXZFLDRCQUFvQixHQUFHLFlBQUksQ0FBQyxZQUFZLENBQUM7QUFDN0MsQ0FBQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxTQUFpQjtJQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBYyxDQUFDO0lBQ2hELFlBQUksR0FBRyxJQUFJLGdCQUFTLEVBQUUsQ0FBQztJQUN2QixZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNUJELE1BQWEsT0FBTztJQUNoQixnQkFBZSxDQUFDO0lBRWhCLE9BQU8sQ0FBQyxPQUFzQixFQUFFLGVBQWdDO1FBQzVELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDakMsZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCLEVBQUUsZUFBZ0MsSUFBRyxDQUFDO0NBQzNFO0FBWEQsMEJBV0M7Ozs7Ozs7Ozs7Ozs7O0FDWkQsZ0lBQTREO0FBQzVELDhGQUErQztBQUMvQyxvRkFBb0M7QUFFcEMsTUFBYSxJQUFLLFNBQVEsaUJBQU87SUFDN0IsV0FBVyxDQUFDLFFBQXVCLEVBQUUsZUFBZ0M7UUFDakUsMEJBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDSjtBQUpELG9CQUlDOzs7Ozs7Ozs7Ozs7OztBQ1RELGlHQUFpRDtBQUNqRCwyRkFBOEM7QUFFOUMsb0ZBQW9DO0FBRXBDLE1BQWEsSUFBSyxTQUFRLGlCQUFPO0lBQzdCLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLG1CQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxPQUFPO1lBQ1gsQ0FBQztZQUVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksSUFBSSxHQUFHLG1CQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE9BQU87WUFDWCxDQUFDO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU87UUFDSCxPQUFPLG1CQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQztRQUM1RCxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFVO1FBQ2YsbUJBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLG1CQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQztDQUNKO0FBckNELG9CQXFDQzs7Ozs7Ozs7Ozs7Ozs7QUN6Q0QsZ0lBQTREO0FBQzVELDhGQUErQztBQUMvQyxvRkFBb0M7QUFFcEMsTUFBYSxJQUFLLFNBQVEsaUJBQU87SUFDN0IsV0FBVyxDQUFDLENBQWdCLEVBQUUsZUFBZ0M7UUFDMUQsMEJBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDSjtBQUpELG9CQUlDOzs7Ozs7Ozs7Ozs7OztBQ1RELG9GQUFvQztBQUNwQywyRkFBa0Q7QUFFbEQsTUFBYSxJQUFLLFNBQVEsaUJBQU87SUFDN0IsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsT0FBTztRQUNYLENBQUM7UUFDRCxJQUFJLElBQUksR0FBRyxtQkFBTyxDQUFDO1FBRW5CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKO0FBVkQsb0JBVUM7Ozs7Ozs7Ozs7Ozs7O0FDWkQsZ0lBQTREO0FBQzVELGlHQUFpRDtBQUNqRCwyRkFBOEM7QUFHOUMsb0ZBQW9DO0FBR3BDLE1BQWEsSUFBSyxTQUFRLGlCQUFPO0lBQzdCLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLElBQUksR0FBRyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEMsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUMsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsbUJBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUFvQjtRQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsTUFBTSxDQUNULG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUNsQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLEVBQ3BDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQ2pDLENBQ0osQ0FBQztRQUNGLGlCQUFpQjtJQUNyQixDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQVU7UUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNyQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNuRCxPQUFPO1lBQ1gsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUcsQ0FBQztZQUNqQyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDeEMsMEJBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUM7aUJBQU0sQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBN0RELG9CQTZEQzs7Ozs7Ozs7Ozs7Ozs7QUNyRUQsZ0lBQTREO0FBQzVELDhGQUFxRDtBQUNyRCxnSEFBMkQ7QUFDM0QsMkZBQThDO0FBQzlDLGdIQUEyRDtBQUUzRCxvRkFBb0M7QUFFcEMsTUFBYSxFQUFHLFNBQVEsaUJBQU87SUFDM0IsV0FBVyxDQUFDLE9BQXNCLEVBQUUsZUFBZ0M7UUFDaEUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsU0FBUyxHQUFHLDJCQUFlLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNoRCxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxhQUFhLENBQUMsU0FBYyxFQUFFLGVBQWdDO1FBQzFELElBQUksSUFBSSxHQUFHLG1CQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRFLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztZQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQyxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0MsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLE9BQU8sR0FBRyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUM3QyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELG9CQUFvQixDQUFDLElBQVUsRUFBRSxlQUFnQztRQUM3RCxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUUvQixJQUFJLENBQUMsd0JBQXdCLENBQ3pCLElBQUksRUFDSixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxFQUMvRCxlQUFlLENBQ2xCLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQsd0JBQXdCLENBQUMsSUFBVSxFQUFFLGdCQUEwQixFQUFFLGlCQUFrQztRQUMvRixJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMxRCxJQUFJLFNBQVMsR0FBRyxtQkFBSSxDQUFDLGlCQUFpQixDQUNsQyxJQUFJLENBQUMsb0JBQW9CLEVBQUcsRUFDNUIsSUFBSSxpQ0FBZSxDQUFDLGlDQUFlLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUNsRyxDQUFDO1lBQ0YsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDWixpQkFBaUIsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUN2QyxPQUFPO1lBQ1gsQ0FBQztRQUNMLENBQUM7UUFFRCxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCw2QkFBNkIsQ0FBQyxJQUFVLEVBQUUsZUFBZ0M7UUFDdEUsMEJBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELG1CQUFtQixDQUFDLElBQVUsRUFBRSxlQUFnQztRQUM1RCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLFNBQVMsR0FBRyxtQkFBSSxDQUFDLGlCQUFpQixDQUNsQyxJQUFJLENBQUMsZUFBZSxFQUFHLEVBQ3ZCLElBQUksaUNBQWUsQ0FBQyxpQ0FBZSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUM3RSxlQUFlLENBQUMsZUFBZSxFQUFFLENBQ3BDLENBQ0osQ0FBQztZQUNGLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQ1osZUFBZSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBQ3JDLE9BQU87WUFDWCxDQUFDO1FBQ0wsQ0FBQztRQUVELGVBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0NBQ0o7QUFoRkQsZ0JBZ0ZDOzs7Ozs7Ozs7Ozs7OztBQ3pGRCwyRkFBOEM7QUFDOUMsb0ZBQW9DO0FBRXBDLE1BQWEsU0FBVSxTQUFRLGlCQUFPO0lBQ2xDLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsbUJBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7YUFBTSxDQUFDO1lBQ0osTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQVRELDhCQVNDOzs7Ozs7Ozs7Ozs7OztBQ1pELG9GQUFvQztBQUNwQywyRkFBa0Q7QUFDbEQsMkZBQTZDO0FBRTdDLE1BQWEsSUFBSyxTQUFRLGlCQUFPO0lBQzdCLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3BCLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxJQUFJLEdBQUcsbUJBQU8sQ0FBQztRQUNuQixJQUFJLFFBQVEsR0FBRyxtQkFBUSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FDSjtBQVZELG9CQVVDOzs7Ozs7Ozs7Ozs7OztBQ2RELGdJQUE0RDtBQUM1RCwyRkFBa0Q7QUFDbEQsb0ZBQW9DO0FBRXBDLE1BQWEsSUFBSyxTQUFRLGlCQUFPO0lBQzdCLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsMkJBQVEsRUFBQyxRQUFRLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQywwQkFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFSRCxvQkFRQzs7Ozs7Ozs7Ozs7Ozs7QUNaRCw4RkFBZ0U7QUFDaEUsaUdBQWlEO0FBQ2pELDJGQUE4QztBQUk5QyxvRkFBb0M7QUFFcEMsTUFBYSxJQUFLLFNBQVEsaUJBQU87SUFDN0IsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLElBQUksSUFBSSxHQUFHLG1CQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1RCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsbUJBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsT0FBTztRQUNYLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFXO1FBQ2hCLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3JCLElBQUksR0FBRyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMzQyxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25ELE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzFCLE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDakMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUM3QixPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0YsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO2dCQUM5QixPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUM5QixDQUFDO1lBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRU8sUUFBUSxDQUFDLElBQVU7UUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUFvQjtRQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVU7UUFDbEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxHQUFHLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzdELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNiLFlBQVksSUFBSSxJQUFJLENBQUM7WUFDekIsQ0FBQztZQUNELFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIsWUFBWSxJQUFJLDJCQUFlLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO1FBQ0gsWUFBWSxJQUFJLE1BQU0sQ0FBQztRQUN2QixPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0NBQ0o7QUFsRkQsb0JBa0ZDOzs7Ozs7Ozs7Ozs7OztBQzFGRCwyRkFBd0M7QUFDeEMsb0ZBQW9DO0FBRXBDLE1BQWEsU0FBVSxTQUFRLGlCQUFPO0lBQ2xDLFdBQVcsQ0FBQyxDQUFnQjtRQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0o7QUFKRCw4QkFJQzs7Ozs7Ozs7Ozs7Ozs7QUNORCxnSUFBNEQ7QUFDNUQsOEZBQStDO0FBQy9DLG9GQUFvQztBQUVwQyxNQUFhLEtBQU0sU0FBUSxpQkFBTztJQUM5QixXQUFXLENBQUMsQ0FBZ0IsRUFBRSxlQUFnQztRQUMxRCwwQkFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMscUJBQVMsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNKO0FBSkQsc0JBSUM7Ozs7Ozs7Ozs7Ozs7O0FDVEQsb0ZBQW9DO0FBRXBDLE1BQWEsTUFBTyxTQUFRLGlCQUFPO0lBQy9CLFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBSkQsd0JBSUM7Ozs7Ozs7Ozs7Ozs7O0FDTkQsMkZBQThDO0FBQzlDLG9GQUFvQztBQUVwQyxNQUFhLElBQUssU0FBUSxpQkFBTztJQUM3QixXQUFXLENBQUMsT0FBc0I7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBSSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0o7QUFORCxvQkFNQzs7Ozs7Ozs7Ozs7Ozs7QUNURCw4RkFBcUQ7QUFDckQsaUdBQWlEO0FBQ2pELDJGQUE4QztBQUM5QyxvRkFBb0M7QUFFcEMsTUFBYSxJQUFLLFNBQVEsaUJBQU87SUFDN0IsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLElBQUksQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsbUJBQUksQ0FBQyxPQUFPLENBQUMsbUJBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsbUJBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUUxRCwyQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ2xDLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQ1Qsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQ2xDLDJCQUFlLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSx1QkFBVSxDQUFDLFdBQVcsQ0FBQyxDQUMvRCxDQUNKLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxlQUFlLENBQUMsTUFBYztRQUNsQyxJQUFJLElBQUksR0FBRyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDOUIsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDOUUsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDSjtBQWpDRCxvQkFpQ0M7Ozs7Ozs7Ozs7Ozs7O0FDckNELGdJQUE0RDtBQUM1RCw4RkFBK0M7QUFDL0Msb0ZBQW9DO0FBRXBDLE1BQWEsS0FBTSxTQUFRLGlCQUFPO0lBQzlCLFdBQVcsQ0FBQyxDQUFnQixFQUFFLGVBQWdDO1FBQzFELDBCQUFRLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxxQkFBUyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0o7QUFKRCxzQkFJQzs7Ozs7Ozs7Ozs7Ozs7QUNURCxpR0FBaUQ7QUFDakQsMkZBQThDO0FBRzlDLG9GQUFvQztBQUVwQyxNQUFhLElBQUssU0FBUSxpQkFBTztJQUM3QixXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxPQUFPO1FBQ1gsQ0FBQztRQUVELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNyQiw0QkFBNEI7WUFDNUIsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO29CQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDM0MsT0FBTztnQkFDWCxDQUFDO2dCQUNELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQy9CLENBQUM7aUJBQU0sQ0FBQztnQkFDSixJQUFJLFFBQVEsR0FBRyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDN0QsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzdDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pFLE9BQU87Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlDLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLDBCQUEwQjtZQUMxQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksU0FBUyxHQUFHLG1CQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEUsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUMxRCxPQUFPO1lBQ1gsQ0FBQztZQUVELElBQUksUUFBUSxHQUFHLG1CQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzdELFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5QyxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzFELE9BQU87WUFDWCxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7SUFDTCxDQUFDO0lBRUQscUJBQXFCLENBQUMsSUFBWSxFQUFFLE1BQWMsRUFBRSxTQUFlO1FBQy9ELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUMzQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUYsT0FBTztRQUNYLENBQUM7UUFDRCxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLFlBQVksRUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDaEIsTUFBTSxDQUFDLE1BQU0sQ0FDVCxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDaEcsQ0FBQztZQUNGLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FDVCxvQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUM1QyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQ2QsU0FBUyxDQUFDLE9BQU8sQ0FBQyx1QkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUMxRCxDQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsb0JBQW9CLENBQUMsSUFBVSxFQUFFLFFBQWtCO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsbUJBQW1CO1FBQ2YsSUFBSSxRQUFRLEdBQUcsbUJBQUksQ0FBQyxPQUFPLENBQUMsbUJBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsS0FBSyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNoRixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUM3QyxDQUFDLEVBQUUsQ0FBQztZQUNSLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxTQUFlO1FBQ3ZCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUcsQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBZ0IsSUFBSSxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQ1Qsb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FDNUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNkLFNBQVMsQ0FBQyxPQUFPLENBQUMsdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FDMUQsQ0FDSixDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBVSxFQUFFLFFBQWtCO1FBQ25DLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsbUJBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDSjtBQWhIRCxvQkFnSEM7Ozs7Ozs7Ozs7Ozs7O0FDdEhELDJGQUF1QztBQUN2QyxvRkFBb0M7QUFFcEMsTUFBYSxJQUFLLFNBQVEsaUJBQU87SUFDN0IsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQ1QsT0FBTyxDQUFDLFVBQVUsRUFBRTtZQUNoQixHQUFHO1lBQ0gsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEIsR0FBRztZQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEdBQUc7WUFDSCxtQkFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLE1BQU0sQ0FDYixDQUFDO1FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FDVCx1S0FBdUssQ0FBQyxNQUFNLENBQzFLLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLG1CQUFtQixDQUN0QixDQUNKLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sZ0JBQWdCLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBakNELG9CQWlDQzs7Ozs7Ozs7Ozs7Ozs7QUNuQ0QsZ0lBQTREO0FBQzVELDhGQUErQztBQUMvQyxvRkFBb0M7QUFFcEMsTUFBYSxFQUFHLFNBQVEsaUJBQU87SUFDM0IsV0FBVyxDQUFDLENBQWdCLEVBQUUsZUFBZ0M7UUFDMUQsMEJBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFTLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDSjtBQUpELGdCQUlDOzs7Ozs7Ozs7Ozs7OztBQ1JELGdJQUE0RDtBQUM1RCw4RkFBK0M7QUFDL0Msb0ZBQW9DO0FBRXBDLE1BQWEsSUFBSyxTQUFRLGlCQUFPO0lBQzdCLFdBQVcsQ0FBQyxDQUFnQixFQUFFLGVBQWdDO1FBQzFELDBCQUFRLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxxQkFBUyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUFKRCxvQkFJQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCxNQUFhLGVBQWU7SUFJeEIsWUFBWSxRQUFrQjtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBRUQsd0dBQXdHO0lBQ3hHLGVBQWU7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBakJELDBDQWlCQzs7Ozs7Ozs7Ozs7Ozs7QUNqQkQsTUFBYSxhQUFhO0lBTXRCLFlBQVksYUFBcUI7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZO1FBQ1IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakQsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUMsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRSxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3JCLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM3RSxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBYTtRQUNuQixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDekUsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBYTtRQUNsQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDckUsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksUUFBUSxDQUFDO1FBQ2IsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN4QyxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQztRQUU5QixPQUFPLFVBQVUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLFVBQVUsRUFBRSxDQUFDO1lBQ2IscUJBQXFCLEVBQUUsQ0FBQztZQUN4QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXZCLDZCQUE2QjtZQUM3QixPQUFPLFVBQVUsR0FBRyxjQUFjLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDOUUsVUFBVSxFQUFFLENBQUM7WUFDakIsQ0FBQztZQUNELGNBQWMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xELElBQUksY0FBYyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUN4QixNQUFNO1lBQ1YsQ0FBQztZQUVELGtDQUFrQztZQUNsQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUMvQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLE9BQU8sWUFBWSxHQUFHLGNBQWMsQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7b0JBQ3JGLFlBQVksRUFBRSxDQUFDO2dCQUNuQixDQUFDO2dCQUNELElBQUksY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUN2QyxZQUFZLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDMUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFlBQVksQ0FBQztvQkFDekQsY0FBYyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUV4RCxJQUFJLGNBQWMsS0FBSyxFQUFFLEVBQUUsQ0FBQzt3QkFDeEIsTUFBTTtvQkFDVixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBQ0QsaURBQWlEO1lBQ2pELElBQUksWUFBWSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBRUQsNkJBQTZCO1lBQzdCLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUM1QixVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLFFBQVEsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QyxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixRQUFRLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUNELElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLFFBQVEsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO1lBQ3JDLENBQUM7WUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekYsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMxQixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBN0hELHNDQTZIQzs7Ozs7Ozs7Ozs7Ozs7QUM3SEQsOEZBQThDO0FBRTlDLE1BQWEsV0FBVztJQUVwQjtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFZLEVBQUUsTUFBZTtRQUN2QyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUN2QixNQUFNLDBDQUEwQyxDQUFDO1FBQ3JELENBQUM7UUFDRCxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUU1QixJQUFJLENBQUMsV0FBVyxFQUFFO2FBQ2IsS0FBSyxDQUFDLEVBQUUsQ0FBQzthQUNULE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3JCLElBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUN6QyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDbkQsQ0FBQztZQUNELFdBQVcsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsTUFBZTtRQUM3QixJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxNQUFlO1FBQ2pDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDMUMsTUFBTSwrQkFBK0IsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLGlCQUFPLENBQUMsRUFBRSxDQUFDO1lBQy9CLE1BQU0sMENBQTBDLENBQUM7UUFDckQsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUNuQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRTVCLElBQUksQ0FBQyxXQUFXLEVBQUU7YUFDYixLQUFLLENBQUMsRUFBRSxDQUFDO2FBQ1QsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3pDLDJDQUEyQztnQkFDM0MsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxXQUFXLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRVAsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDO0lBQy9CLENBQUM7Q0FDSjtBQXhERCxrQ0F3REM7Ozs7Ozs7Ozs7Ozs7O0FDMURELGlIQUFvRDtBQUNwRCwyR0FBZ0Q7QUFFaEQscUZBQXdDO0FBQ3hDLHFGQUF3QztBQUN4QyxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLHFGQUF3QztBQUN4QywrRUFBb0M7QUFDcEMsb0dBQWtEO0FBQ2xELHFGQUF3QztBQUN4QyxxRkFBd0M7QUFDeEMsd0ZBQTBDO0FBQzFDLDJGQUE0QztBQUM1QyxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLHdGQUEwQztBQUMxQyxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLCtFQUFvQztBQUNwQyxxRkFBd0M7QUFDeEMscUdBQTRDO0FBQzVDLGlHQUErQztBQUMvQyxxRkFBd0M7QUFFeEMsTUFBTSxXQUFXO0lBQWpCO1FBQ0ksU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsT0FBRSxHQUFHLElBQUksT0FBRSxFQUFFLENBQUM7UUFDZCxjQUFTLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7UUFDNUIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsVUFBSyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7UUFDcEIsV0FBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7UUFDdEIsVUFBSyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7UUFDcEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFHLElBQUksV0FBSSxFQUFFLENBQUM7UUFDbEIsT0FBRSxHQUFHLElBQUksT0FBRSxFQUFFLENBQUM7UUFDZCxTQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQUE7QUFNRCxNQUFNLGVBQWdCLFNBQVEsV0FBVztJQU1yQztRQUNJLEtBQUssRUFBRSxDQUFDO1FBSFosYUFBUSxHQUFzQixFQUFFLENBQUM7UUFJN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZTtRQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsT0FBTztRQUNYLENBQUM7UUFDRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUV0QyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxJQUFJLGFBQWEsS0FBSyxTQUFTLElBQUksYUFBYSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3hELE1BQU0sa0NBQWtDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQztZQUNELGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksaUNBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxDQUFDO1FBQ1osQ0FBQztJQUNMLENBQUM7SUFFRCxZQUFZO1FBQ1IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQixlQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELGlCQUFpQixDQUFDLGFBQXNCO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELGVBQWUsQ0FBd0MsSUFBaUIsRUFBRSxNQUFnQztRQUN0RyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxXQUFXLEdBQUcsSUFBbUIsQ0FBQztRQUN0QyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQy9CLENBQUM7Q0FDSjtBQUVVLGdCQUFRLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzNGNUMsb0NBaUNDO0FBdkRELHFGQUF3QztBQUN4QyxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLHFGQUF3QztBQUN4QyxxRkFBd0M7QUFDeEMsK0VBQW9DO0FBQ3BDLG9HQUFrRDtBQUNsRCxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLHFGQUF3QztBQUN4QyxvR0FBa0Q7QUFDbEQsd0ZBQTBDO0FBQzFDLDJGQUE0QztBQUM1QyxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLHdGQUEwQztBQUMxQyxxRkFBd0M7QUFDeEMscUZBQXdDO0FBQ3hDLCtFQUFvQztBQUNwQyxxRkFBd0M7QUFDeEMsaUhBQTZDO0FBRTdDLFNBQWdCLFlBQVk7SUFDeEIsMEJBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLHFCQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRTVDLDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFDN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztJQUU3QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFDN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztJQUU3QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxPQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXpDLDBCQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxJQUFJLHFCQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRXZELDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFFN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztJQUM3QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRTdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLGFBQUssRUFBRSxDQUFDLENBQUM7SUFFL0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksZUFBTSxFQUFFLENBQUMsQ0FBQztJQUVqRCwwQkFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxhQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFDN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztJQUU3QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLDBCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLFdBQUksRUFBRSxDQUFDLENBQUM7SUFFN0MsMEJBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksT0FBRSxFQUFFLENBQUMsQ0FBQztJQUV6QywwQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxXQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdkRELE1BQU0sZ0JBQWdCO0lBQXRCO1FBQ0ksZ0JBQVcsR0FBWSxLQUFLLENBQUM7SUE0QmpDLENBQUM7SUExQkcsYUFBYSxDQUFDLE9BQWUsRUFBRSxRQUFrQixFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsU0FBUyxHQUFHLElBQUk7UUFDM0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQWUsRUFBRSxRQUFrQixFQUFFLEtBQWEsRUFBRSxTQUFrQjtRQUM1RSxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO1lBQzFCLElBQUksU0FBUyxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFDRCxRQUFRLEVBQUUsQ0FBQztZQUNYLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzVCLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUFFVSxtQkFBVyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUMvQmhELGdJQUE0RDtBQUM1RCxtR0FBNEM7QUFFakMsc0JBQWMsR0FBRyxNQUFNLENBQUM7QUFFbkMsU0FBUyxPQUFPLENBQUMsT0FBZTtJQUM1QiwwQkFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxXQUFXO0lBQ2hCLHlCQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDOUIsQ0FBQztBQUVELFNBQVMsZUFBZTtJQUNwQiwwQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFPRCxVQUFVLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUM3QixVQUFVLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUNyQyxVQUFVLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN4QjdDLE1BQU0sV0FBVztJQUNiLEtBQUs7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0o7QUFFVSxjQUFNLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNOdEMsTUFBTSxXQUFXO0lBQ2IsT0FBTyxDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDSjtBQUVVLGNBQU0sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDS3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxJQUFjO0lBQ2pELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxLQUFhLEVBQUUsTUFBYztRQUNuRSxPQUFPLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRztJQUM5QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHO0lBQ3hCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRztJQUM3QixPQUFPLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUN4QyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDM0JGLDJGQUF3QztBQUN4QywwRkFBMEM7QUFDMUMsMEZBQTBDO0FBRTFDLElBQVksU0FPWDtBQVBELFdBQVksU0FBUztJQUNqQiw0QkFBZTtJQUNmLDRCQUFlO0lBQ2YsMEJBQWE7SUFDYiwwQkFBYTtJQUNiLHNCQUFTO0lBQ1QsMEJBQWE7QUFDakIsQ0FBQyxFQVBXLFNBQVMseUJBQVQsU0FBUyxRQU9wQjtBQUVELE1BQU0sb0JBQXFCLFNBQVEsdUJBQXFCO0lBQ3BEO1FBQ0ksS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxTQUFTLENBQUMsU0FBb0IsRUFBRSxVQUFVLEdBQUcsdUJBQVUsQ0FBQyxTQUFTO1FBQzdELE9BQU8sb0JBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKO0FBRVUsdUJBQWUsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdkJ4RCxNQUFzQixVQUFVO0lBRTVCLFlBQVksTUFBVztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWE7UUFDZixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDcEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBYSxDQUFDO1FBQzFDLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQWdCO1FBQ3ZCLElBQUksS0FBSyxHQUFlLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDbkIsSUFBSSxNQUFNLEdBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFjO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUFjO1FBQ3JCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7b0JBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQWEsQ0FBQztnQkFDeEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFzQjtRQUN6QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQztvQkFDN0IsT0FBTyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFrRDtRQUN0RCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBNURELGdDQTREQzs7Ozs7Ozs7Ozs7Ozs7QUM1REQsMEZBQTBDO0FBRTFDLElBQVksYUFpQlg7QUFqQkQsV0FBWSxhQUFhO0lBQ3JCLGlEQUFRO0lBQ1IsbURBQVM7SUFDVCxpREFBUTtJQUNSLG1EQUFTO0lBQ1QsaURBQVE7SUFDUixtREFBUztJQUNULGlEQUFRO0lBQ1IseURBQVk7SUFDWix1REFBVztJQUNYLG1EQUFTO0lBQ1Qsb0RBQVU7SUFDVixrREFBUztJQUNULDREQUFjO0lBQ2QsMERBQWE7SUFDYiwwREFBYTtJQUNiLG9EQUFVO0FBQ2QsQ0FBQyxFQWpCVyxhQUFhLDZCQUFiLGFBQWEsUUFpQnhCO0FBRUQsTUFBTSx3QkFBeUIsU0FBUSx1QkFBeUI7SUFDNUQ7UUFDSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDekIsQ0FBQztDQUNKO0FBRVUsMkJBQW1CLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQzNCaEUsMEZBQTBDO0FBRTFDLElBQVksZUFFWDtBQUZELFdBQVksZUFBZTtJQUN2QiwyRUFBbUI7QUFDdkIsQ0FBQyxFQUZXLGVBQWUsK0JBQWYsZUFBZSxRQUUxQjtBQUVELE1BQU0sMEJBQTJCLFNBQVEsdUJBQTJCO0lBQ2hFO1FBQ0ksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQUVVLDZCQUFxQixHQUFHLElBQUksMEJBQTBCLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNacEUsMEZBQTBDO0FBRTFDLElBQVksVUFRWDtBQVJELFdBQVksVUFBVTtJQUNsQixxREFBYTtJQUNiLHVEQUFjO0lBQ2QsbURBQVk7SUFDWixpREFBVztJQUNYLHFEQUFhO0lBQ2IseURBQWU7SUFDZiwrQ0FBVTtBQUNkLENBQUMsRUFSVyxVQUFVLDBCQUFWLFVBQVUsUUFRckI7QUFFRCxNQUFNLHFCQUFzQixTQUFRLHVCQUFzQjtJQUN0RDtRQUNJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QixDQUFDO0NBQ0o7QUFFVSx3QkFBZ0IsR0FBRyxJQUFJLHFCQUFxQixFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbEIxRCwwRkFBMEM7QUFpQzFDLElBQVksUUE4Qlg7QUE5QkQsV0FBWSxRQUFRO0lBQ2hCLGlDQUFxQjtJQUNyQixpQ0FBcUI7SUFDckIsNkJBQWlCO0lBQ2pCLDJCQUFlO0lBQ2YsbUNBQXVCO0lBQ3ZCLDZCQUFpQjtJQUNqQiwrQkFBbUI7SUFDbkIsMkJBQWU7SUFDZiw2QkFBaUI7SUFDakIsMkJBQWU7SUFDZiwyQkFBZTtJQUNmLHFDQUF5QjtJQUN6QixtQ0FBdUI7SUFDdkIsMkNBQStCO0lBQy9CLHFDQUF5QjtJQUN6Qix1Q0FBMkI7SUFDM0IsbUNBQXVCO0lBQ3ZCLHFDQUF5QjtJQUN6Qix5QkFBYTtJQUNiLGlDQUFxQjtJQUNyQiw2QkFBaUI7SUFDakIseUJBQWE7SUFDYiwyQkFBZTtJQUNmLGlDQUFxQjtJQUNyQixtQ0FBdUI7SUFDdkIsK0NBQW1DO0lBQ25DLDJCQUFlO0lBQ2YsNkJBQWlCO0lBQ2pCLDJCQUFlO0FBQ25CLENBQUMsRUE5QlcsUUFBUSx3QkFBUixRQUFRLFFBOEJuQjtBQUVELE1BQU0sbUJBQW9CLFNBQVEsdUJBQW9CO0lBQ2xEO1FBQ0ksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQUVVLHNCQUFjLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3ZFdEQsMkZBQXVDO0FBQ3ZDLDhGQUErQztBQUMvQyw4RkFBK0M7QUFDL0MsMkZBQTZDO0FBQzdDLDJGQUE2QztBQUc3QyxNQUFhLGdCQUFnQjtJQUN6QixjQUFjLENBQUMsV0FBbUI7UUFDOUIsSUFBSSxRQUFRLEdBQUcsbUJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEUsSUFBSSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7UUFDaEMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdkQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFNBQW9CLEVBQUUsUUFBMkI7UUFDOUQsU0FBUyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBRTNCLElBQUksUUFBUSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxJQUFJLGNBQWMsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztZQUNwQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQW1CLEVBQUUsRUFBRTtnQkFDL0MsY0FBYyxDQUFDLEdBQUcsQ0FBQyxtQkFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUM7UUFDekMsQ0FBQztRQUVELElBQUksUUFBUSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxJQUFJLGNBQWMsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztZQUNyQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUM5QixjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsbUJBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztDQUNKO0FBN0JELDRDQTZCQzs7Ozs7Ozs7Ozs7Ozs7QUNwQ0QsMkZBQXVDO0FBQ3ZDLDJGQUE2QztBQUM3QywrRUFBcUM7QUFDckMsMkZBQTZDO0FBRzdDLGlHQUErQztBQUMvQywyRkFBNkM7QUFFN0MsTUFBYSxXQUFXO0lBQ3BCLFNBQVMsQ0FBQyxjQUF1QztRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0RCxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7Z0JBQzVDLElBQUksY0FBYyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztvQkFDdEMsSUFBSSxlQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBQ2pELE9BQU8sSUFBSSxDQUFDO29CQUNoQixDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztnQkFDdkMsSUFBSSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxjQUFjLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO29CQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELENBQUM7Z0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLFVBQVUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzFELElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUN0QixPQUFPLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLGNBQWMsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ3JDLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFDL0QsTUFBTSxzRUFBc0UsQ0FBQyxNQUFNLENBQy9FLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUM1QixjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FDOUIsQ0FBQztvQkFDTixDQUFDO29CQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxDQUFDO1lBQ0wsQ0FBQztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsY0FBdUM7UUFDeEQsT0FBTyxPQUFPLGNBQWMsS0FBSyxRQUFRLElBQUksT0FBTyxjQUFjLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztJQUMzRixDQUFDO0lBRUQscUJBQXFCLENBQUMsVUFBa0I7UUFDcEMsSUFBSSxRQUFRLEdBQWlCLG1CQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RSxJQUFJLElBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxjQUF1QztRQUNsRSxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDL0IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFOztnQkFDL0Isb0JBQWMsQ0FBQyxVQUFVLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEUsTUFBTSxxRkFBcUYsQ0FBQyxNQUFNLENBQzlGLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUM1QixjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FDbkMsQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsRixJQUFJLGNBQWMsR0FBRyxlQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNsRCxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEQsU0FBUyxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxjQUFjLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQzlCLE9BQU8sQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtJQUNsQyxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsY0FBa0MsRUFBRSxJQUFVO1FBQ25FLElBQUksY0FBYyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEMsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQ3JCLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQ2hELENBQUM7WUFDRCxjQUFjLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQW1CLEVBQUUsRUFBRTtnQkFDckQsU0FBUyxhQUFULFNBQVMsdUJBQVQsU0FBUyxDQUFFLEdBQUcsQ0FBQyxtQkFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7SUFFTyxXQUFXLENBQUMsY0FBa0MsRUFBRSxJQUFVO1FBQzlELElBQUksY0FBYyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksbUJBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7SUFFTyxVQUFVLENBQUMsS0FBWTtRQUMzQixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDNUIsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLGVBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsQ0FBQztJQUNMLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxRQUFvQztRQUNyRCxJQUFJLFFBQVEsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBbUIsRUFBRSxFQUFFO2dCQUNyQyxRQUFRLENBQUMsR0FBRyxDQUFDLG1CQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBdkhELGtDQXVIQzs7Ozs7Ozs7Ozs7Ozs7QUNoSUQsMkZBQXVDO0FBQ3ZDLDBHQUF1RDtBQUV2RCwrRUFBcUM7QUFDckMsMkZBQTZDO0FBQzdDLDBHQUF1RDtBQUV2RCwyRkFBNkM7QUFDN0MsMkZBQTZDO0FBRTdDLE1BQWEsV0FBVztJQUNwQixTQUFTLENBQUMsUUFBc0I7UUFDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFVOztRQUNuQixNQUFNLFFBQVEsR0FBRyxtQkFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELElBQUksVUFBVSxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1FBQ3JDLGNBQVEsQ0FBQyxLQUFLLDBDQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzdCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7WUFDOUIsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNsQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQzFCLElBQUksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUU3QixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQzdELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixDQUFDO1lBQ0wsQ0FBQztZQUNELFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUV4QixJQUFJLENBQUMsS0FBSyxHQUFHLG1CQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuRSxJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7WUFDMUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDeEMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxtQkFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQXZDRCxrQ0F1Q0M7Ozs7Ozs7Ozs7Ozs7O0FDakRELGlHQUFpRDtBQUNqRCwwRkFBMEM7QUFDMUMsdUZBQXdDO0FBQ3hDLG9GQUFzQztBQUN0QyxzR0FBa0Q7QUFDbEQsMkZBQXdDO0FBQ3hDLG9GQUFzQztBQUd0QyxNQUFhLFNBQVUsU0FBUSx1QkFBVTtJQUF6Qzs7UUFDSSxjQUFTLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDckMsY0FBUyxHQUFjLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBQ3ZDLFVBQUssR0FBbUIsSUFBSSwrQkFBYyxFQUFFLENBQUM7SUFzRWpELENBQUM7SUFwRVcsV0FBVztRQUNmLE9BQU8sbUJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxZQUFZLENBQUMsY0FBeUI7UUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFVLEdBQUcsdUJBQVUsQ0FBQyxTQUFTO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUMxQyxDQUFDO0lBRUQsT0FBTztRQUNILE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRUQsWUFBWTtRQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsWUFBWTtRQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRCxjQUFjLENBQUMsV0FBb0I7UUFDL0IsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDNUUsSUFBSSxLQUFhLENBQUM7UUFDbEIsSUFBSSxVQUFVLElBQUksR0FBRyxFQUFFLENBQUM7WUFDcEIsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsb0JBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzlELE9BQU8sSUFBSSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQzlDLENBQUM7UUFDRCxJQUFJLFVBQVUsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxvQkFBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckUsT0FBTyxJQUFJLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDOUMsQ0FBQztRQUNELElBQUksVUFBVSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN0RSxPQUFPLElBQUksR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUM5QyxDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsb0JBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3ZFLE9BQU8sSUFBSSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQzlDLENBQUM7UUFDRCxJQUFJLFVBQVUsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNsQixLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxvQkFBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckUsT0FBTyxJQUFJLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDOUMsQ0FBQztRQUNELElBQUksVUFBVSxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xCLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNuRSxPQUFPLElBQUksR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUM5QyxDQUFDO1FBQ0QsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsb0JBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzlELE9BQU8sSUFBSSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQzlDLENBQUM7Q0FDSjtBQXpFRCw4QkF5RUM7Ozs7Ozs7Ozs7Ozs7O0FDbEZELHVGQUF3QztBQUN4QywwRkFBMEM7QUFFMUMsTUFBYSxhQUFjLFNBQVEsdUJBQXFCO0lBQ3BEO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsWUFBWSxDQUFDLFNBQXdCO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN0QyxJQUFJLE9BQU8sR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztZQUM5QixPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGNBQWM7UUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUNKO0FBaEJELHNDQWdCQzs7Ozs7Ozs7Ozs7Ozs7QUNuQkQsTUFBTSxJQUFJO0lBQVY7UUFDSSxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFVBQUssR0FBVyxDQUFDLENBQUM7SUFDdEIsQ0FBQztDQUFBO0FBRUQsTUFBTSxTQUFTO0lBQWY7UUFDSSxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsT0FBRSxHQUFXLENBQUMsQ0FBQztRQUNmLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FBQTtBQUVELE1BQWEsY0FBYztJQW1CdkI7UUFsQkEsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUVsQixhQUFRLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUM1QixjQUFTLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUM3QixZQUFPLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUMzQixjQUFTLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUM3QixhQUFRLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUU1QixXQUFNLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNwQyxZQUFPLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNyQyxXQUFNLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNwQyxVQUFLLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNuQyxZQUFPLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNyQyxXQUFNLEdBQWMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUVwQyxrQkFBYSxHQUFXLEdBQUcsQ0FBQztRQUM1QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUdyQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDNUIsQ0FBQztJQUVELFlBQVksQ0FBQyxVQUEwQjtRQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0o7QUExQkQsd0NBMEJDOzs7Ozs7Ozs7Ozs7OztBQzNDRCxNQUFhLGtCQUFrQjtJQUUzQixZQUFZLGtCQUF3QjtRQUNoQyxJQUFJLGtCQUFrQixLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ25DLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sc0NBQXNDLENBQUM7UUFDakQsQ0FBQztRQUVELGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4QyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsdUJBQXVCLENBQUMsaUJBQXNCO1FBQzFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzNDLE1BQU0sNENBQTRDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BGLENBQUM7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLENBQUM7SUFDbkQsQ0FBQztJQUVELFdBQVcsQ0FBQyxXQUFtQjtRQUMzQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxNQUFNLDJDQUEyQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBN0JELGdEQTZCQzs7Ozs7Ozs7Ozs7Ozs7QUM3QkQsTUFBc0IsVUFBVTtJQUFoQztRQUNJLE9BQUUsR0FBVyxFQUFFLENBQUM7SUFPcEIsQ0FBQztJQUhHLFlBQVksQ0FBQyxXQUF1QjtRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFSRCxnQ0FRQzs7Ozs7Ozs7Ozs7Ozs7QUNORCxNQUFhLFVBQVU7SUFFbkI7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQVU7UUFDVixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNoQixPQUFPO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVTtRQUNiLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNMLENBQUM7SUFFRCxHQUFHO1FBQ0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFhO1FBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSSxDQUFDLElBQVksRUFBRSxNQUFNLEdBQUcsQ0FBQztRQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNyQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ25DLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUNkLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2IsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7cUJBQU0sQ0FBQztvQkFDSixNQUFNLEVBQUUsQ0FBQztvQkFDVCxPQUFPLEtBQUssQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBVSxFQUFFLE1BQU0sR0FBRyxDQUFDO1FBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JCLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDakIsSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFDYixPQUFPLElBQUksQ0FBQztnQkFDaEIsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE1BQU0sRUFBRSxDQUFDO29CQUNULE9BQU8sS0FBSyxDQUFDO2dCQUNqQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELGVBQWUsQ0FBQyxNQUFNLEdBQUcsSUFBSTtRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSTtRQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxVQUFVLEdBQUcsSUFBSTtRQUNsQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMxQixJQUFJLFlBQVksS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDdEIsWUFBWSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDbkMsQ0FBQztZQUNELElBQUksTUFBTSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNsQixZQUFZLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDO1lBQ0QsWUFBWSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNsRCxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUUsQ0FBQztnQkFDdEIsWUFBWSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQ2pELENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQTNGRCxnQ0EyRkM7Ozs7Ozs7Ozs7Ozs7O0FDN0ZELDBHQUE0RTtBQUM1RSx3RUFBOEI7QUFFOUIsTUFBYSxTQUFTO0lBRWxCO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFlBQVksQ0FBQyxjQUF5QjtRQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDM0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUN6QixPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFtQjtRQUM1QixJQUFJLG1DQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxNQUFNLHFDQUFxQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFtQixFQUFFLElBQWlCO1FBQ3hDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2hCLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDakMsTUFBTSw2Q0FBNkMsQ0FBQyxNQUFNLENBQUMsbUNBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakcsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBbUI7UUFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDakMsTUFBTSw4Q0FBOEMsQ0FBQyxNQUFNLENBQUMsbUNBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEcsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQW1CO1FBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELGNBQWM7UUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDOUQsQ0FBQztDQUNKO0FBckRELDhCQXFEQzs7Ozs7Ozs7Ozs7Ozs7QUN4REQsMkZBQStDO0FBRS9DLG9GQUFzQztBQUd0Qyw4RUFBa0M7QUFDbEMsd0VBQThCO0FBQzlCLDRHQUF1RDtBQUN2RCw0R0FBdUQ7QUFDdkQsMkhBQWlFO0FBRWpFLE1BQWEsU0FBUztJQVVsQjtRQU5BLFdBQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBT2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELFFBQVEsQ0FBQyxTQUFvQjtRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO1FBQzNDLEtBQUssSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFjO1FBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDckIsTUFBTSxZQUFZLEdBQUcsbUJBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hFLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxDQUFDLGNBQW1CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGNBQWMsQ0FBQyxXQUFtQjtRQUM5QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELFdBQVcsQ0FBQyxZQUFvQjtRQUM1QixPQUFPLG1CQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsSUFBWSxFQUFFLElBQXFCO1FBQ2pELElBQUksS0FBSyxHQUFHLDJCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ3JELE1BQU0sMENBQTBDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUFqRUQsOEJBaUVDOzs7Ozs7Ozs7Ozs7OztBQzVFRCxrSEFBMEQ7QUFDMUQsbUdBQWdEO0FBQ2hELHVGQUF3QztBQUN4QyxtR0FBZ0Q7QUFFaEQsTUFBTSxhQUFhO0lBS2Y7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0o7QUFFVSxnQkFBUSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDaEIxQyxNQUFhLGVBQWU7SUFLeEIsWUFDSSxJQUFZLEVBQ1osTUFBVyxFQUNYLHdCQUF5QyxFQUN6Qyx1QkFBaUM7UUFFakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLHdCQUF3QixDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQztJQUMzRCxDQUFDO0NBQ0o7QUFoQkQsMENBZ0JDOzs7Ozs7Ozs7Ozs7OztBQ2xCRCxpR0FBaUQ7QUFDakQsMkZBQTZEO0FBQzdELDBGQUEwQztBQUUxQywyRkFBd0M7QUFHeEMsb0ZBQXNDO0FBRXRDLE1BQWEsSUFBSyxTQUFRLHVCQUFVO0lBS2hDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU8sV0FBVztRQUNmLE9BQU8sbUJBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQVUsR0FBRyx1QkFBVSxDQUFDLFNBQVM7UUFDckMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDdEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUNsRCxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDeEYsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhLENBQUMsVUFBVSxHQUFHLHVCQUFVLENBQUMsU0FBUztRQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUIsQ0FBQzthQUFNLENBQUM7WUFDSixRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUN0QixLQUFLLENBQUM7b0JBQ0YsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxDQUFDO2dCQUNQLEtBQUssQ0FBQyxDQUFDO2dCQUNQLEtBQUssQ0FBQztvQkFDRixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDL0I7b0JBQ0ksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ2hFLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3hDLE9BQU8sb0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQztJQUNyRCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUMvQyxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQzFDLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWE7UUFDbEIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFhO1FBQ2xCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDckIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDO1lBQ0QsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7UUFDeEIsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPO1FBQ0gsT0FBTyx5QkFBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFVBQVU7UUFDTixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO1lBQ3JCLEtBQUssbUJBQVEsQ0FBQyxNQUFNLENBQUM7WUFDckIsS0FBSyxtQkFBUSxDQUFDLGVBQWUsQ0FBQztZQUM5QixLQUFLLG1CQUFRLENBQUMsS0FBSztnQkFDZixPQUFPLEtBQUssQ0FBQztZQUNqQjtnQkFDSSxPQUFPLElBQUksQ0FBQztRQUNwQixDQUFDO0lBQ0wsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDL0IsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbkMsT0FBTyxJQUFJLElBQUksbUJBQVEsQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLG1CQUFRLENBQUMsZUFBZSxDQUFDO0lBQzFFLENBQUM7SUFFRCxRQUFROztRQUNKLE9BQU8sV0FBSSxDQUFDLElBQUksMENBQUUsUUFBUSxNQUFLLElBQUksQ0FBQztJQUN4QyxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQWM7UUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBeEhELG9CQXdIQzs7Ozs7Ozs7Ozs7Ozs7QUNqSUQsMkZBQXVDO0FBQ3ZDLDBGQUEwQztBQUMxQyx3RUFBOEI7QUFFOUIsTUFBYSxRQUFTLFNBQVEsdUJBQWdCO0lBQzFDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsWUFBWSxDQUFDLFNBQW1CO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN0QyxJQUFJLE9BQU8sR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQWlCO1FBQ2pCLElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2hCLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNyQixJQUFJLGFBQWEsR0FBRyxtQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLElBQUksYUFBYSxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUN6QixhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPO1lBQ1gsQ0FBQztRQUNMLENBQUM7UUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzlELENBQUM7Q0FDSjtBQTlCRCw0QkE4QkM7Ozs7Ozs7Ozs7Ozs7O0FDaENELE1BQWEsUUFBUTtJQUdqQixZQUFZLFFBQXNCO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSjtBQVJELDRCQVFDOzs7Ozs7Ozs7Ozs7OztBQ1JELE1BQU0saUJBQWlCO0NBRXRCO0FBRUQsTUFBYSxhQUFhO0lBR3RCLFlBQVksYUFBeUM7UUFGckQsU0FBSSxHQUFzQixJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFHOUMsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDOUIsT0FBTztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO1lBQ2hDLE1BQU0saUNBQWlDLENBQUM7UUFDNUMsQ0FBQztRQUVELGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtCQUFrQixDQUFDLFlBQTBCO1FBQ3pDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDM0MsTUFBTSx1Q0FBdUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUM7SUFDOUMsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjO1FBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxNQUFNLG1DQUFtQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQTlCRCxzQ0E4QkM7Ozs7Ozs7Ozs7Ozs7O0FDcENELE1BQWEsU0FBUztJQUVsQixZQUFZLGlCQUFrQztRQUMxQyxJQUFJLGlCQUFpQixLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sc0NBQXNDLENBQUM7UUFDakQsQ0FBQztRQUVELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFhO1FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxNQUFNLG1DQUFtQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxXQUFXLENBQUMsWUFBb0I7UUFDNUIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDbkMsTUFBTSxZQUFZLEdBQUcsWUFBWSxHQUFHLGtCQUFrQixDQUFDO1FBQzNELENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0o7QUE3QkQsOEJBNkJDOzs7Ozs7Ozs7Ozs7OztBQzdCRCwyRkFBdUM7QUFDdkMsdUZBQXdDO0FBRXhDLE1BQWEsTUFBTyxTQUFRLHFCQUFTO0lBSWpDO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFKWixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztJQUk3QixDQUFDO0lBRUQsWUFBWSxDQUFDLFdBQW1CO1FBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCxtQkFBbUI7UUFDZixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqQyxDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBYTtRQUM3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxJQUFJLEdBQUcsbUJBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQWpDRCx3QkFpQ0M7Ozs7Ozs7Ozs7Ozs7O0FDcENELDhGQUFnRTtBQUNoRSxtR0FBZ0Q7QUFDaEQsb0ZBQXNDO0FBQ3RDLG9GQUFzQztBQUN0QyxvRkFBc0M7QUFDdEMsbUdBQWdEO0FBRWhELE1BQWEsSUFBSTtJQU9iO1FBTkEsT0FBRSxHQUFXLENBQUMsQ0FBQztRQUNmLFVBQUssR0FBa0IsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFDM0MsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixVQUFLLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDakMsZUFBVSxHQUFrQixJQUFJLDZCQUFhLEVBQUUsQ0FBQztJQUVqQyxDQUFDO0lBRWhCLFlBQVksQ0FBQyxTQUFlO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFDakMsS0FBSyxJQUFJLE9BQU8sSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxXQUFXO1FBQ1AsT0FBTyxtQkFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ25DLENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQzFDLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBb0I7UUFDeEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELGtCQUFrQjtRQUNkLE9BQU8sMkJBQWUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3BDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDO1lBQ25DLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLGlCQUFpQixLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3JELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUNoRCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNoRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQzNDLENBQUM7Q0FDSjtBQTVFRCxvQkE0RUM7Ozs7Ozs7Ozs7Ozs7O0FDbkZELE1BQWEsUUFBUTtJQUlqQixnQkFBZSxDQUFDO0lBRWhCLFlBQVksQ0FBQyxTQUFtQjtRQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0o7QUFURCw0QkFTQzs7Ozs7Ozs7Ozs7Ozs7QUNURCxvRkFBc0M7QUFFdEMsTUFBYSxRQUFRO0lBSWpCO1FBSEEsV0FBTSxHQUFXLENBQUMsQ0FBQztJQUdKLENBQUM7SUFFaEIsWUFBWSxDQUFDLFNBQW1CO1FBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDO0lBQ25DLENBQUM7SUFFRCxRQUFROztRQUNKLE9BQU8sV0FBSSxDQUFDLElBQUksMENBQUUsUUFBUSxNQUFLLElBQUksQ0FBQztJQUN4QyxDQUFDO0lBRUQsUUFBUTs7UUFDSixPQUFPLFdBQUksQ0FBQyxJQUFJLDBDQUFFLFFBQVEsTUFBSyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxRQUFROztRQUNKLElBQUksV0FBSSxDQUFDLElBQUksMENBQUUsS0FBSyxNQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBTSxDQUFDO0lBQzVCLENBQUM7Q0FDSjtBQXhDRCw0QkF3Q0M7Ozs7Ozs7Ozs7Ozs7O0FDeENELE1BQWEsYUFBYTtDQUV6QjtBQUZELHNDQUVDOzs7Ozs7Ozs7Ozs7OztBQ0ZELE1BQWEsYUFBYTtJQUl0QixZQUFZLGFBQW1CO1FBRi9CLGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRzNCLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzlCLE9BQU87UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztZQUNoQyxNQUFNLGlDQUFpQyxDQUFDO1FBQzVDLENBQUM7UUFFRCxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxZQUFpQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDdEMsTUFBTSx1Q0FBdUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUM7SUFDbkQsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjO1FBQ3RCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzdCLE1BQU0sc0NBQXNDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQ0o7QUFoQ0Qsc0NBZ0NDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNsQ0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7O0FDNUJBLCtIQUFrRTtBQUNsRSwrSEFBMkQ7QUFDM0QsZ0dBQThDO0FBQzlDLHNIQUE0RDtBQUM1RCwwRkFBNkQ7QUFDN0QsK0ZBQXNDO0FBQ3RDLHlGQUFtQztBQUVuQyxTQUFTLElBQUk7SUFDVCwrQkFBWSxHQUFFLENBQUM7SUFDZiwrQkFBWSxHQUFFLENBQUM7SUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBTyxDQUFDLENBQUM7SUFDdkIsMEJBQVEsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQzVCLG1CQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFJLENBQUMsWUFBWSxDQUFDLEVBQy9CLElBQUksaUNBQWUsQ0FBQyxHQUFHLEVBQUU7UUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQixlQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQ0wsQ0FBQztBQUNOLENBQUM7QUFLRCxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9HbG9iYWxFdmVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luaXRHYW1lRGF0YS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvQ29tbWFuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRG93bi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRHJvcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRWFzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRXZhbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRXhhbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvR28udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0ludmVudG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvSnNvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTG9hZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTG9vay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTm9Db21tYW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Ob3J0aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvUmVsb2FkLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9TYXZlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9TY2FuLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Tb3V0aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvVGFrZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvVGVzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvVXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1dlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFRyZWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0luaXRDb21tYW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvRW5naW5lVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL0lucHV0RnVuY3Rpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9Qcm9tcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL1JhbmRvbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvU3RyaW5nVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0RpcmVjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRW51bUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRXF1aXBtZW50U2xvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvR2xvYmFsRXZlbnRUeXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9HcmFtbWFDYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9JdGVtVHlwZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL0NoYXJhY3RlckZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZhY3Rvcmllcy9JdGVtRmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL1Jvb21GYWN0b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9DaGFyYWN0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3Rlckxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3RlclN0YXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9DaGFyYWN0ZXJUZW1wbGF0ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VudGl0eUJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VudGl0eUxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VxdWlwbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2FtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2FtZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0dsb2JhbEV2ZW50QXJncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbUxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW1Mb2NrLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbURvb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1Jvb21FeGl0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tRXhpdHNMaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvSW5pdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbmdpbmVVdGlscyB9IGZyb20gJy4vY29tbW9uTG9naWMvRW5naW5lVXRpbHMnO1xyXG5pbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2xvYmFsRXZlbnRBcmdzIH0gZnJvbSAnLi9tb2RlbC9HbG9iYWxFdmVudEFyZ3MnO1xyXG5cclxuY2xhc3MgR2xvYmFsRXZlbnRzQ2xhc3Mge1xyXG4gICAgLy8gSWYgZ2xvYmFsIGV2ZW50cyByZXR1cm5zIHRydWUsIGl0IHNpZ25hbHMgaW50ZXJydXB0aW9uIG9mIGNvbW1hbmQgZXhlY3V0aW9uIGZsb3dcclxuICAgIC8vIHN1Y2ggZXZlbnQgbXVzdCBjYWxsIG9uZSBvZiB0aGUgc3VwcGxpZWQgY2FsbGJhY2tzOlxyXG4gICAgLy8gLSBhcmdzLkNvbnRpbnVlQ29tbWFuZENhbGxiYWNrIGlmIHRoZSBldmVudCBkZWNpZGVzIGl0IHdhbnQgdG8gcmVzdW1lIHRoZSBleGVjdXRpb24gXHJcbiAgICAvLyAgICAgIG9mIHRoZSBjb21tYW5kIGl0IHdhcyBpbnZva2VkIGJ5XHJcbiAgICAvLyAtIGFyZ3MuRmluaXNoQ29tbWFuZENhbGxiYWNrIGlmIHRoZSBldmVudCBkZWNpZGVzIHRvIHRlcm1pbmF0ZSB0aGUgZXhlY3V0aW9uIFxyXG4gICAgLy8gICAgICBvZiB0aGUgY29tbWFuZCBpdCB3YXMgaW52b2tlZCBieVxyXG4gICAgW2dsb2JhbEV2ZW50TmFtZTogc3RyaW5nXTogKGFyZ3M6IEdsb2JhbEV2ZW50QXJncykgPT4gYm9vbGVhbjtcclxuICAgIFRlc3RHbG9iYWxFdmVudChhcmdzOiBHbG9iYWxFdmVudEFyZ3MpIHtcclxuICAgICAgICBFbmdpbmVVdGlscy5PdXRwdXRQcmludGVyKExvY2FsLkdsb2JhbEV2ZW50cy5UZXN0R2xvYmFsRXZlbnQuTWVzc2FnZSwgYXJncy5Db250aW51ZUNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR2xvYmFsRXZlbnRzID0gbmV3IEdsb2JhbEV2ZW50c0NsYXNzKCk7XHJcbiIsImltcG9ydCB7IEl0ZW1UeXBlcyB9IGZyb20gJy4uL3Jlcy9JdGVtVHlwZXMuanNvbic7XHJcbmltcG9ydCB7IEl0ZW1zVGVtcGxhdGVzIH0gZnJvbSAnLi4vcmVzL0l0ZW1zLmpzb24nO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJzVGVtcGxhdGVzIH0gZnJvbSAnLi4vcmVzL0NoYXJhY3RlcnMuanNvbic7XHJcbmltcG9ydCB7IExvY2FsIGFzIExvY2FsUGwgfSBmcm9tICcuLi9yZXMvTG9jYWwucGwuanNvbic7XHJcbmltcG9ydCB7IEdhbWVUZW1wbGF0ZSB9IGZyb20gJy4uL3Jlcy9HYW1lLmpzb24nO1xyXG5pbXBvcnQgeyBHYW1lTW9kZWwgfSBmcm9tICcuL21vZGVsL0dhbWUnO1xyXG5pbXBvcnQgeyBJdGVtVHlwZXMgYXMgSXRlbVR5cGVzTGlzdCB9IGZyb20gJy4vbW9kZWwvSXRlbVR5cGVzJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9DaGFyYWN0ZXJUZW1wbGF0ZXMnO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9JdGVtVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL21vZGVsL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlcyB9IGZyb20gJy4vbW9kZWwvUm9vbVRlbXBsYXRlcyc7XHJcblxyXG5leHBvcnQgdmFyIExvY2FsID0gTG9jYWxQbDtcclxuZXhwb3J0IHZhciBHYW1lOiBHYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbmV4cG9ydCB2YXIgVmVyc2lvbiA9ICcnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEluaXRHYW1lRGF0YSgpIHtcclxuICAgIEdhbWUgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbiAgICBHYW1lRGF0YS5JdGVtVHlwZXMgPSBuZXcgSXRlbVR5cGVzTGlzdChJdGVtVHlwZXMpO1xyXG4gICAgR2FtZURhdGEuSXRlbVRlbXBsYXRlcyA9IG5ldyBJdGVtVGVtcGxhdGVzKEl0ZW1zVGVtcGxhdGVzKTtcclxuICAgIEdhbWVEYXRhLkNoYXJhY3RlclRlbXBsYXRlcyA9IG5ldyBDaGFyYWN0ZXJUZW1wbGF0ZXMoQ2hhcmFjdGVyc1RlbXBsYXRlcyk7XHJcbiAgICBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzID0gbmV3IFJvb21UZW1wbGF0ZXMoR2FtZVRlbXBsYXRlLlJvb21zKTtcclxuICAgIFZlcnNpb24gPSBFbmdpbmUuTG9hZERhdGEoJ3ZlcnNpb24udHh0JykucmVwbGFjZSgnXFxuJywgRW5naW5lLkVuZExpbmUpO1xyXG5cclxuICAgIEdhbWUuUGxheWVyLkxvY2F0aW9uID0gR2FtZS5TdGFydGluZ1Jvb207XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2FkR2FtZShzYXZlZEdhbWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgZ2FtZSA9IEpTT04ucGFyc2Uoc2F2ZWRHYW1lKSBhcyBHYW1lTW9kZWw7XHJcbiAgICBHYW1lID0gbmV3IEdhbWVNb2RlbCgpO1xyXG4gICAgR2FtZS5sb2FkR2FtZShnYW1lKTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1hbmQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIEV4ZWN1dGUoY29tbWFuZDogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLkV4ZWN1dGVCb2R5KGNvbW1hbmQsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICAgICAgaWYgKCFjb21tYW5kQ2FsbGJhY2suaW50ZXJydXB0Rmxvdykge1xyXG4gICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2suQ2FsbElmTm90Q2FsbGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7fVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEb3duIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfY29tbWFuZDogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5kb3duLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEcm9wIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLk5vQXJndW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnQudG9Mb3dlckNhc2UoKSA9PT0gJ2FsbCcpIHtcclxuICAgICAgICAgICAgaWYgKCFHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLk5vSXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRyb3BBbGwoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQsIGNvbW1hbmQuZ2V0TnVtYmVyKDEpKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRHJvcC5Ob0l0ZW1Gb3VuZC5mb3JtYXQoYXJndW1lbnQpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kcm9wSXRlbShpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJvcEFsbCgpIHtcclxuICAgICAgICB3aGlsZSAoR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuYW55KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5kcm9wSXRlbShHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5lbGVtZW50QXQoMCkhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJvcEl0ZW0oaXRlbTogSXRlbSkge1xyXG4gICAgICAgIEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLnJlbW92ZShpdGVtKTtcclxuICAgICAgICBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCkuYWRkKGl0ZW0pO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRHJvcC5Ecm9wcGVkLmZvcm1hdChpdGVtLmdldE5hbWUoR3JhbW1hQ2FzZS5CaWVybmlrKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFYXN0IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLmVhc3QsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBHYW1lIGFzIEdhbWVWYXIgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2YWwgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnYW1lID0gR2FtZVZhcjtcclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChldmFsKGFyZ3VtZW50KSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuLi9tb2RlbC9DaGFyYWN0ZXInO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBUYWtlIH0gZnJvbSAnLi9UYWtlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFeGFtIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGNvbW1hbmQuZ2V0TnVtYmVyKDEpO1xyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLk5vQXJndW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gcm9vbS5nZXRDaGFyYWN0ZXJzKCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhhbUNoYXJhY3RlcihjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXRlbSA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5leGFtSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbSA9IHJvb20uZ2V0SXRlbXMoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhhbUl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRXhhbS5Ob09iamVjdC5mb3JtYXQoYXJndW1lbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICBleGFtQ2hhcmFjdGVyKGNoYXJhY3RlcjogQ2hhcmFjdGVyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoY2hhcmFjdGVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KGNoYXJhY3Rlci5nZXREZXNjcmlwdGlvbigpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5FeGFtLkhlYWx0aExldmVsLmZvcm1hdChcclxuICAgICAgICAgICAgICAgIGNoYXJhY3Rlci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSxcclxuICAgICAgICAgICAgICAgIGNoYXJhY3Rlci5nZXRIZWFsdGhMZXZlbCh0cnVlKSxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vVE9ETzogZWt3aXB1bmVrXHJcbiAgICB9XHJcbiAgICBleGFtSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChpdGVtLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgICAgIGlmIChpdGVtLmlzQ29udGFpbmVyKCkpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uaXNMb2NrZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLkxvY2tlZENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLkNvbnRhaW5zKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW1zID0gaXRlbS5nZXRJbnZlbnRvcnkoKSE7XHJcbiAgICAgICAgICAgIGlmIChpdGVtcy5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChpdGVtcy5wcmludFNob3J0Rm9ybWF0KCkpO1xyXG4gICAgICAgICAgICAgICAgQ29tbWFuZHMuVGFrZS50YWtlQWxsR29sZChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuSW52ZW50b3J5Lk5vSXRlbXMuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudFR5cGUgfSBmcm9tICcuLi9lbnVtcy9HbG9iYWxFdmVudFR5cGUnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50QXJncyB9IGZyb20gJy4uL21vZGVsL0dsb2JhbEV2ZW50QXJncyc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgR28gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gRGlyZWN0aW9uSGVscGVyLnBhcnNlU2hvcnQoYXJndW1lbnQudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5Xcm9uZ0RpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ29Ub0RpcmVjdGlvbihkaXJlY3Rpb24sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgZ29Ub0RpcmVjdGlvbihkaXJlY3Rpb246IGFueSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZXhpdCA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKS5nZXRFeGl0KGRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChleGl0ID09PSBudWxsIHx8IGV4aXQuaXNIaWRkZW4oKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkdvLk5vUGFzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChleGl0LmlzQ2xvc2VkKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5QYXNzYWdlQ2xvc2VkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld1Jvb20gPSBHYW1lLmdldFJvb20oZXhpdC5nZXRSb29tSWQoKSk7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuc2V0UHJldmlvdXNMb2NhdGlvbihHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVBsYXllckxvY2F0aW9uKG5ld1Jvb20sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGxheWVyTG9jYXRpb24ocm9vbTogUm9vbSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBHYW1lLlBsYXllci5Mb2NhdGlvbiA9IHJvb20uSWQ7XHJcblxyXG4gICAgICAgIHRoaXMub25GaXJzdEVudGVyR2xvYmFsRXZlbnRzKFxyXG4gICAgICAgICAgICByb29tLFxyXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmFmdGVyT25GaXJzdEVudGVyR2xvYmFsRXZlbnRzKHJvb20sIGNvbW1hbmRDYWxsYmFjayksXHJcbiAgICAgICAgICAgIGNvbW1hbmRDYWxsYmFjayxcclxuICAgICAgICApO1xyXG4gICAgICAgIHJvb20uSXNWaXNpdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkZpcnN0RW50ZXJHbG9iYWxFdmVudHMocm9vbTogUm9vbSwgY29udGludWVDYWxsYmFjazogRnVuY3Rpb24sIHRlcm1pbmF0ZUNhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocm9vbS5nZXRPbkZpcnN0RW50ZXJFdmVudCgpICE9PSBudWxsICYmICFyb29tLklzVmlzaXRlZCkge1xyXG4gICAgICAgICAgICBsZXQgaW50ZXJydXB0ID0gR2FtZS5pbnZva2VHbG9iYWxFdmVudChcclxuICAgICAgICAgICAgICAgIHJvb20uZ2V0T25GaXJzdEVudGVyRXZlbnQoKSEsXHJcbiAgICAgICAgICAgICAgICBuZXcgR2xvYmFsRXZlbnRBcmdzKEdsb2JhbEV2ZW50VHlwZS5CZWZvcmVSb29tRW50ZXIsIHJvb20sIHRlcm1pbmF0ZUNhbGxiYWNrLCBjb250aW51ZUNhbGxiYWNrKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKGludGVycnVwdCkge1xyXG4gICAgICAgICAgICAgICAgdGVybWluYXRlQ2FsbGJhY2suaW50ZXJydXB0RmxvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRpbnVlQ2FsbGJhY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBhZnRlck9uRmlyc3RFbnRlckdsb2JhbEV2ZW50cyhyb29tOiBSb29tLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkxvb2subG9va1Jvb20ocm9vbSk7XHJcbiAgICAgICAgdGhpcy5vbkVudGVyR2xvYmFsRXZlbnRzKHJvb20sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbnRlckdsb2JhbEV2ZW50cyhyb29tOiBSb29tLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChyb29tLmdldE9uRW50ZXJFdmVudCgpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnJ1cHQgPSBHYW1lLmludm9rZUdsb2JhbEV2ZW50KFxyXG4gICAgICAgICAgICAgICAgcm9vbS5nZXRPbkVudGVyRXZlbnQoKSEsXHJcbiAgICAgICAgICAgICAgICBuZXcgR2xvYmFsRXZlbnRBcmdzKEdsb2JhbEV2ZW50VHlwZS5CZWZvcmVSb29tRW50ZXIsIHJvb20sIGNvbW1hbmRDYWxsYmFjaywgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2suQ2FsbElmTm90Q2FsbGVkKCksXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJydXB0KSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2suaW50ZXJydXB0RmxvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbW1hbmRDYWxsYmFjay5DYWxsSWZOb3RDYWxsZWQoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnkgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkludmVudG9yeS5Zb3VySXRlbXMpO1xyXG4gICAgICAgIGlmICghR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuYW55KCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5JbnZlbnRvcnkuTm9JdGVtcy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5wcmludFNob3J0Rm9ybWF0KCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCB7IEdhbWUgYXMgR2FtZVZhciB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEpzb24gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnYW1lID0gR2FtZVZhcjtcclxuICAgICAgICBsZXQgZ2FtZURhdGEgPSBHYW1lRGF0YTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KEpTT04uc3RyaW5naWZ5KGV2YWwoYXJndW1lbnQpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBMb2FkR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IHNhdmVEYXRhID0gRW5naW5lLkxvYWQoKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvYWQuTG9hZGluZyk7XHJcbiAgICAgICAgTG9hZEdhbWUoc2F2ZURhdGEpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9hZC5Mb2FkZWQpO1xyXG4gICAgICAgIENvbW1hbmRzLkxvb2subG9va1Jvb20oKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi4vbW9kZWwvQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBSb29tIH0gZnJvbSAnLi4vbW9kZWwvUm9vbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvb2sgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbik7XHJcblxyXG4gICAgICAgIGlmICghR2FtZS5QbGF5ZXIuY2FuU2VlKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLkNhbnRTZWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tSb29tKHJvb20pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbnVtYmVyID0gY29tbWFuZC5nZXROdW1iZXIoMSk7XHJcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IHJvb20uZ2V0Q2hhcmFjdGVycygpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGNoYXJhY3RlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tDaGFyYWN0ZXIoY2hhcmFjdGVyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGl0ZW0gPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va0l0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0gPSByb29tLmdldEl0ZW1zKCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suTm9PYmplY3QuZm9ybWF0KGFyZ3VtZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9va1Jvb20ocm9vbT86IFJvb20pIHtcclxuICAgICAgICBpZiAocm9vbSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gcm9vbS5nZXROYW1lKCkgKyBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICBtZXNzYWdlICs9IHRoaXMuZXhpdHNTdHJpbmcocm9vbSkgKyBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gcm9vbS5nZXREZXNjcmlwdGlvbigpO1xyXG4gICAgICAgIGlmIChyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lICsgRW5naW5lLkVuZExpbmUgKyByb29tLmdldENoYXJhY3RlcnMoKS5wcmludExvbmdGb3JtYXQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm9vbS5nZXRJdGVtcygpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIGlmICghcm9vbS5nZXRDaGFyYWN0ZXJzKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVzc2FnZSArPSBFbmdpbmUuRW5kTGluZSArIHJvb20uZ2V0SXRlbXMoKS5wcmludExvbmdGb3JtYXQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb29rSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChpdGVtLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tDaGFyYWN0ZXIoY2hhcmFjdGVyOiBDaGFyYWN0ZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suWW91TG9va0F0LmZvcm1hdChjaGFyYWN0ZXIuZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoY2hhcmFjdGVyLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4aXRzU3RyaW5nKHJvb206IFJvb20pOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCByZXR1cm5TdHJpbmcgPSAnfGcnICsgTG9jYWwuQ29tbWFuZHMuTG9vay5FeGl0cyArICc6IFsgJztcclxuICAgICAgICBsZXQgZmlyc3RFeGl0ID0gdHJ1ZTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9ucyA9IHJvb20uZ2V0RXhpdHNEaXJlY3Rpb25zKCk7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFmaXJzdEV4aXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSAnLCAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpcnN0RXhpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gRGlyZWN0aW9uSGVscGVyLmdldExvY2FsZShkaXJlY3Rpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVyblN0cmluZyArPSAnIF18Vyc7XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblN0cmluZztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb0NvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk5vQ29tbWFuZC5Ob0NvbW1hbmQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb3J0aCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5ub3J0aCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVsb2FkIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgRW5naW5lLlJlbG9hZCgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhdmUgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoR2FtZSk7XHJcbiAgICAgICAgRW5naW5lLlNhdmUoanNvbik7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TYXZlLlNhdmVkKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uSGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjYW4gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBpZiAoIUdhbWUuUGxheWVyLmNhblNlZSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuU2Nhbi5DYW50U2VlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGxheWVyUm9vbSA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbik7XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuU2Nhbi5Mb29raW5nQXJvdW5kWW91U2VlKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlNjYW4uSGVyZSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCh0aGlzLnByaW50Q2hhcmFjdGVycyhHYW1lLlBsYXllci5Mb2NhdGlvbikpO1xyXG5cclxuICAgICAgICBEaXJlY3Rpb25IZWxwZXIuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBleGl0ID0gcGxheWVyUm9vbS5nZXRFeGl0KGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChleGl0ICE9PSBudWxsICYmICFleGl0LmlzSGlkZGVuKCkgJiYgIWV4aXQuaXNDbG9zZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5TY2FuLkluRGlyZWN0aW9uLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGlyZWN0aW9uSGVscGVyLmdldExvY2FsZShkaXJlY3Rpb24sIEdyYW1tYUNhc2UuTWllanNjb3duaWspLFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dCh0aGlzLnByaW50Q2hhcmFjdGVycyhleGl0LlJvb21JZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcmludENoYXJhY3RlcnMocm9vbUlkOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbShyb29tSWQpO1xyXG4gICAgICAgIGlmICghcm9vbS5nZXRDaGFyYWN0ZXJzKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSArIExvY2FsLkNvbW1hbmRzLlNjYW4uTm9PbmVUaGVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByb29tLmdldENoYXJhY3RlcnMoKS5wcmludFNob3J0Rm9ybWF0KHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTb3V0aCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5zb3V0aCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRha2UgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQxID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQxID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Ob0FyZ3VtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG51bWJlcjEgPSBjb21tYW5kLmdldE51bWJlcigxKTtcclxuICAgICAgICBsZXQgYXJndW1lbnQyID0gY29tbWFuZC5nZXRBcmd1bWVudCgyKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vcGljayB1cCBpdGVtIGZyb20gbG9jYXRpb25cclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50MS50b0xvd2VyQ2FzZSgpID09PSAnYWxsJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlQWxsRnJvbUxvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUxpc3QgPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGl0ZW1MaXN0LmZpbmQoYXJndW1lbnQxLCBudW1iZXIxKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLk5vSXRlbUZvdW5kLmZvcm1hdChhcmd1bWVudDEpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VJdGVtRnJvbUxvY2F0aW9uKGl0ZW0sIGl0ZW1MaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGFrZSBpdGVtIGZyb20gY29udGFpbmVyXHJcbiAgICAgICAgICAgIGxldCBudW1iZXIyID0gY29tbWFuZC5nZXROdW1iZXIoMik7XHJcbiAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50MiwgbnVtYmVyMik7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFrZUl0ZW1Gcm9tQ29udGFpbmVyKGFyZ3VtZW50MSwgbnVtYmVyMSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1MaXN0ID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKS5nZXRJdGVtcygpO1xyXG4gICAgICAgICAgICBjb250YWluZXIgPSBpdGVtTGlzdC5maW5kKGFyZ3VtZW50MiwgbnVtYmVyMik7XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFrZUl0ZW1Gcm9tQ29udGFpbmVyKGFyZ3VtZW50MSwgbnVtYmVyMSwgY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLk5vSXRlbUZvdW5kLmZvcm1hdChhcmd1bWVudDIpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGFrZUl0ZW1Gcm9tQ29udGFpbmVyKG5hbWU6IHN0cmluZywgbnVtYmVyOiBudW1iZXIsIGNvbnRhaW5lcjogSXRlbSkge1xyXG4gICAgICAgIGlmICghY29udGFpbmVyLmlzQ29udGFpbmVyKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLklzTm9Db250YWluZXIuZm9ybWF0KGNvbnRhaW5lci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250YWluZXIuaXNMb2NrZWQoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuQ29udGFpbmVySXNMb2NrZWQuZm9ybWF0KGNvbnRhaW5lci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXRlbSA9IGNvbnRhaW5lci5nZXRJbnZlbnRvcnkoKSEuZmluZChuYW1lLCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5UYWtlLk5vSXRlbUZvdW5kSW5Db250YWluZXIuZm9ybWF0KGNvbnRhaW5lci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSwgbmFtZSksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YWtlSXRlbShpdGVtLCBjb250YWluZXIuZ2V0SW52ZW50b3J5KCkhKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5UYWtlLlRha2VJdGVtRnJvbUNvbnRhaW5lci5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICBpdGVtLmdldE5hbWUoKSxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspLnN0YXJ0V2l0aFVwcGVyKCksXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtOiBJdGVtLCBpdGVtTGlzdDogSXRlbUxpc3QpIHtcclxuICAgICAgICBpZiAoIWl0ZW0uaXNUYWtlYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5DYW5ub3RQaWNrVXAuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkRvcGVsbmlhY3opKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGFrZUl0ZW0oaXRlbSwgaXRlbUxpc3QpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5QaWNrZWRVcC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQmllcm5paykpKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0YWtlQWxsRnJvbUxvY2F0aW9uKCkge1xyXG4gICAgICAgIGxldCBpdGVtTGlzdCA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSA9IGl0ZW1MaXN0LmVsZW1lbnRBdChpKTsgaXRlbSAhPSBudWxsOyBpdGVtID0gaXRlbUxpc3QuZWxlbWVudEF0KGkpKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtLCBpdGVtTGlzdCkpIHtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWtlQWxsR29sZChjb250YWluZXI6IEl0ZW0pIHtcclxuICAgICAgICBsZXQgaXRlbUxpc3QgPSBjb250YWluZXIuZ2V0SW52ZW50b3J5KCkhO1xyXG4gICAgICAgIGxldCBnb2xkOiBJdGVtIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgd2hpbGUgKChnb2xkID0gaXRlbUxpc3QuZmluZEJ5SWQoJ2dvbGQnKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50YWtlSXRlbShnb2xkLCBpdGVtTGlzdCk7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5UYWtlLlRha2VJdGVtRnJvbUNvbnRhaW5lci5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICAgICAgZ29sZC5nZXROYW1lKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykuc3RhcnRXaXRoVXBwZXIoKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRha2VJdGVtKGl0ZW06IEl0ZW0sIGl0ZW1MaXN0OiBJdGVtTGlzdCkge1xyXG4gICAgICAgIGl0ZW1MaXN0LnJlbW92ZShpdGVtKTtcclxuICAgICAgICBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hZGQoaXRlbSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgY29tbWFuZC5nZXRDb21tYW5kKCkgK1xyXG4gICAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0TnVtYmVyKDEpICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0QXJndW1lbnQoMSkgK1xyXG4gICAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0TnVtYmVyKDIpICtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQuZ2V0QXJndW1lbnQoMikgK1xyXG4gICAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICAgIEdhbWUuZ2V0TmFtZSgpICtcclxuICAgICAgICAgICAgICAgICcgYWFhJyxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICAnTmF6eXdhbSBzacSZIHxiezB9fFcuIFRhayB8QnswfXxXIHRvIHfFgmHFm25pZSBtb2plIGltacSZLiBBIG5pZSwgbW/FvGUgdG8gamVkbmFrIHxSezF9fFc/IE5pZWVlLCBjaHliYSB8R3syfXxXLi4uIE5pZSwgdG8gbmllIHRvLi4uIFdpZW0hIHxQezN9fFcgdG8gbW9qZSBwcmF3ZHppd2UgaW1pxJkhJy5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICAnR2FtZS5QbGF5ZXIuZ2V0TmFtZSgpJyxcclxuICAgICAgICAgICAgICAgICdXb2p0ZWsgUMSZZHppd8OzcicsXHJcbiAgICAgICAgICAgICAgICAnU2tyenlwZWsgTmFkYWNodScsXHJcbiAgICAgICAgICAgICAgICAnWmR6aW9jaG8gTW9jenl3xIVzJyxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ0N6YXMgbmEga29sb3IgdGVzdCEnKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KCd8YkRhcmsgQmx1ZXswfXxCQmx1ZScuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgzKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xnRGFyayBHcmVlbnswfXxHR3JlZW4nLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoMikpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KCd8Y0RhcmsgQ3lhbnswfXxDQ3lhbicuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgzKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xyRGFyayBSZWR7MH18UlJlZCcuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xwRGFyayBQdXJwbGUgfFBQdXJwbGUnLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3x5RGFyayBZZWxsb3cgfFlZZWxsb3cnLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xzRGFyayBHcmV5ezB9fFNHcmV5Jy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgdGhyb3cgJ1Rlc3QgZXhjZXB0aW9uJztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVXAgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24udXAsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24ud2VzdCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ29tbWFuZENhbGxiYWNrIHtcclxuICAgIGNhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgIGNhbGxiYWNrQ2FsbGVkOiBib29sZWFuO1xyXG4gICAgaW50ZXJydXB0RmxvdzogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICB0aGlzLmNhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbnRlcnJ1cHRGbG93ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIElmIGNvbW1hbmQgY2FuIGNhdXNlIGludGVycnVwdEZsb3csIG1ha2Ugc3VyZSB0byBjYWxsIHRoaXMgbWV0aG9kIGF0IHRoZSBlbmQgb2YgY29tbWFuZCBleGVjdXRpb24gKi9cclxuICAgIENhbGxJZk5vdENhbGxlZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FsbGJhY2tDYWxsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrQ2FsbGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIENvbW1hbmRQYXJzZXIge1xyXG4gICAgY29tbWFuZFN0cmluZzogc3RyaW5nO1xyXG4gICAgcGFyc2VkQ29tbWFuZDogc3RyaW5nO1xyXG4gICAgcGFyc2VkQXJndW1lbnRzOiBzdHJpbmdbXSB8IG51bGw7XHJcbiAgICBwYXJzZWROdW1iZXJzOiBudW1iZXJbXSB8IG51bGw7XHJcbiAgICBwYXJzZWRDb3VudDogbnVtYmVyW10gfCBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoY29tbWFuZFN0cmluZzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kU3RyaW5nID0gY29tbWFuZFN0cmluZztcclxuICAgICAgICB0aGlzLnBhcnNlZENvbW1hbmQgPSAnJztcclxuICAgICAgICB0aGlzLnBhcnNlZEFyZ3VtZW50cyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wYXJzZWROdW1iZXJzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcnNlZENvdW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb21tYW5kKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZENvbW1hbmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VDb21tYW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9IHRoaXMucGFyc2VkQ29tbWFuZC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlZENvbW1hbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VDb21tYW5kKCkge1xyXG4gICAgICAgIGxldCBzcGFjZUluZGV4ID0gdGhpcy5jb21tYW5kU3RyaW5nLmluZGV4T2YoJyAnKTtcclxuICAgICAgICBpZiAoc3BhY2VJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gdGhpcy5jb21tYW5kU3RyaW5nO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9IHRoaXMuY29tbWFuZFN0cmluZy5zbGljZSgwLCBzcGFjZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXJndW1lbnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZEFyZ3VtZW50cyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQXJndW1lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZEFyZ3VtZW50cyA9PT0gbnVsbCB8fCB0aGlzLnBhcnNlZEFyZ3VtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkQXJndW1lbnRzW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROdW1iZXIoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZE51bWJlcnMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUFyZ3VtZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYXJzZWROdW1iZXJzID09PSBudWxsIHx8IHRoaXMucGFyc2VkTnVtYmVyc1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkTnVtYmVyc1tpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q291bnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZENvdW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VBcmd1bWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQ291bnQgPT09IG51bGwgfHwgdGhpcy5wYXJzZWRDb3VudFtpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkQ291bnRbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlQXJndW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMucGFyc2VkQXJndW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5wYXJzZWROdW1iZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5wYXJzZWRDb3VudCA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydEluZGV4ID0gdGhpcy5jb21tYW5kU3RyaW5nLmluZGV4T2YoJyAnKTtcclxuICAgICAgICBsZXQgZW5kSW5kZXg7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb21tYW5kID0gdGhpcy5jb21tYW5kU3RyaW5nO1xyXG4gICAgICAgIGxldCBjdXJyZW50QXJndW1lbnROdW1iZXIgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgc3RhcnRJbmRleCsrO1xyXG4gICAgICAgICAgICBjdXJyZW50QXJndW1lbnROdW1iZXIrKztcclxuICAgICAgICAgICAgbGV0IHBhcnNlZE51bWJlciA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBwYXJzZWRDb3VudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvL3VzdXdhbXkgbmllcG90cnplYm5lIHNwYWNqZVxyXG4gICAgICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGN1cnJlbnRDb21tYW5kLmxlbmd0aCAmJiBjdXJyZW50Q29tbWFuZFtzdGFydEluZGV4XSA9PT0gJyAnKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3VycmVudENvbW1hbmQgPSBjdXJyZW50Q29tbWFuZC5zbGljZShzdGFydEluZGV4KTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHd5Y2nEhWdhbmllIG51bWVydSBkbGEgYXJndW1lbnR1XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZFswXS5pc051bWJlcigpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggPCBjdXJyZW50Q29tbWFuZC5sZW5ndGggJiYgY3VycmVudENvbW1hbmRbY3VycmVudEluZGV4XS5pc051bWJlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmRbY3VycmVudEluZGV4XSA9PT0gJy4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkTnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KGN1cnJlbnRDb21tYW5kLnNsaWNlKDAsIGN1cnJlbnRJbmRleCksIDEwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnNbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IHBhcnNlZE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29tbWFuZCA9IGN1cnJlbnRDb21tYW5kLnNsaWNlKGN1cnJlbnRJbmRleCArIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2plemVsaSBuaWUgd3NrYXphbm8gbGljemJ5LCB0byBkb215xZtsbmllIGplc3QgMVxyXG4gICAgICAgICAgICBpZiAocGFyc2VkTnVtYmVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnNbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhcnNlZENvdW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZENvdW50W2N1cnJlbnRBcmd1bWVudE51bWJlcl0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3d5Y2nEhWdhbmllIHRyZcWbY2kgYXJndW1lbnR1XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZFswXSA9PT0gJ1wiJykge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IDE7XHJcbiAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGN1cnJlbnRDb21tYW5kLmluZGV4T2YoJ1wiJywgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gY3VycmVudENvbW1hbmQuaW5kZXhPZignICcsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbmRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gY3VycmVudENvbW1hbmQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcnNlZEFyZ3VtZW50c1tjdXJyZW50QXJndW1lbnROdW1iZXJdID0gY3VycmVudENvbW1hbmQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpO1xyXG4gICAgICAgICAgICBzdGFydEluZGV4ID0gZW5kSW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuLi9jb21tYW5kcy9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kVHJlZSB7XHJcbiAgICByb290OiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSB7IGNvbW1hbmQ6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBBZGROZXdDb21tYW5kKG5hbWU6IHN0cmluZywgb2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lIHx8IG5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdOZXcgY29tbWFuZCBuYW1lIGNhbm5vdCBiZSBudWxsIG9yIGVtcHR5JztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5WYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gdGhpcy5yb290O1xyXG5cclxuICAgICAgICBuYW1lLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoY3VycmVudENoYXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZVtjdXJyZW50Q2hhcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXSA9IHsgY29tbWFuZDogb2JqZWN0IH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgU2V0RGVmYXVsdENvbW1hbmQob2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgdGhpcy5WYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yb290LmNvbW1hbmQgPSBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDb21tYW5kT2JqZWN0KG9iamVjdDogQ29tbWFuZCkge1xyXG4gICAgICAgIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCB8fCBvYmplY3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IGNhbm5vdCBiZSBudWxsJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgQ29tbWFuZCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IG11c3QgZXh0ZW5kIENvbW1hbmQgY2xhc3MnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBHZXRDb21tYW5kKG5hbWU6IHN0cmluZyk6IENvbW1hbmQge1xyXG4gICAgICAgIGxldCBjdXJyZW50Tm9kZSA9IHRoaXMucm9vdDtcclxuXHJcbiAgICAgICAgbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIC5zcGxpdCgnJylcclxuICAgICAgICAgICAgLnNvbWUoKGN1cnJlbnRDaGFyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGVbY3VycmVudENoYXJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbW1hbmQgbm90IGZvdW5kLSByZXR1cm4gZGVmYXVsdCBjb21tYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZS5jb21tYW5kO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4vQ29tbWFuZENhbGxiYWNrJztcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuL0NvbW1hbmRQYXJzZXInO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL2NvbW1hbmRzL0NvbW1hbmQnO1xuaW1wb3J0IHsgRG93biB9IGZyb20gJy4uL2NvbW1hbmRzL0Rvd24nO1xuaW1wb3J0IHsgRHJvcCB9IGZyb20gJy4uL2NvbW1hbmRzL0Ryb3AnO1xuaW1wb3J0IHsgRWFzdCB9IGZyb20gJy4uL2NvbW1hbmRzL0Vhc3QnO1xuaW1wb3J0IHsgRXZhbCB9IGZyb20gJy4uL2NvbW1hbmRzL0V2YWwnO1xuaW1wb3J0IHsgRXhhbSB9IGZyb20gJy4uL2NvbW1hbmRzL0V4YW0nO1xuaW1wb3J0IHsgR28gfSBmcm9tICcuLi9jb21tYW5kcy9Hbyc7XG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9jb21tYW5kcy9JbnZlbnRvcnknO1xuaW1wb3J0IHsgSnNvbiB9IGZyb20gJy4uL2NvbW1hbmRzL0pzb24nO1xuaW1wb3J0IHsgTG9vayB9IGZyb20gJy4uL2NvbW1hbmRzL0xvb2snO1xuaW1wb3J0IHsgTm9ydGggfSBmcm9tICcuLi9jb21tYW5kcy9Ob3J0aCc7XG5pbXBvcnQgeyBSZWxvYWQgfSBmcm9tICcuLi9jb21tYW5kcy9SZWxvYWQnO1xuaW1wb3J0IHsgU2F2ZSB9IGZyb20gJy4uL2NvbW1hbmRzL1NhdmUnO1xuaW1wb3J0IHsgU2NhbiB9IGZyb20gJy4uL2NvbW1hbmRzL1NjYW4nO1xuaW1wb3J0IHsgU291dGggfSBmcm9tICcuLi9jb21tYW5kcy9Tb3V0aCc7XG5pbXBvcnQgeyBUYWtlIH0gZnJvbSAnLi4vY29tbWFuZHMvVGFrZSc7XG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvVGVzdCc7XG5pbXBvcnQgeyBVcCB9IGZyb20gJy4uL2NvbW1hbmRzL1VwJztcbmltcG9ydCB7IFdlc3QgfSBmcm9tICcuLi9jb21tYW5kcy9XZXN0JztcbmltcG9ydCB7IENvbW1hbmRUcmVlIH0gZnJvbSAnLi9Db21tYW5kVHJlZSc7XG5pbXBvcnQgeyBQcm9tcHQgfSBmcm9tICcuLi9jb21tb25Mb2dpYy9Qcm9tcHQnO1xuaW1wb3J0IHsgTG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL0xvYWQnO1xuXG5jbGFzcyBDb21tYW5kTGlzdCB7XG4gICAgRG93biA9IG5ldyBEb3duKCk7XG4gICAgRHJvcCA9IG5ldyBEcm9wKCk7XG4gICAgRWFzdCA9IG5ldyBFYXN0KCk7XG4gICAgRXZhbCA9IG5ldyBFdmFsKCk7XG4gICAgRXhhbSA9IG5ldyBFeGFtKCk7XG4gICAgR28gPSBuZXcgR28oKTtcbiAgICBJbnZlbnRvcnkgPSBuZXcgSW52ZW50b3J5KCk7XG4gICAgSnNvbiA9IG5ldyBKc29uKCk7XG4gICAgTG9hZCA9IG5ldyBMb2FkKCk7XG4gICAgTG9vayA9IG5ldyBMb29rKCk7XG4gICAgTm9ydGggPSBuZXcgTm9ydGgoKTtcbiAgICBSZWxvYWQgPSBuZXcgUmVsb2FkKCk7XG4gICAgU291dGggPSBuZXcgU291dGgoKTtcbiAgICBTYXZlID0gbmV3IFNhdmUoKTtcbiAgICBTY2FuID0gbmV3IFNjYW4oKTtcbiAgICBUYWtlID0gbmV3IFRha2UoKTtcbiAgICBUZXN0ID0gbmV3IFRlc3QoKTtcbiAgICBVcCA9IG5ldyBVcCgpO1xuICAgIFdlc3QgPSBuZXcgV2VzdCgpO1xufVxuXG5pbnRlcmZhY2UgQ29tbWFuZERpY3Rpb25hcnkge1xuICAgIFtjb21tYW5kTmFtZTogc3RyaW5nXTogQ29tbWFuZDtcbn1cblxuY2xhc3MgQ29tbWFuZHNNYW5hZ2VyIGV4dGVuZHMgQ29tbWFuZExpc3Qge1xuICAgIFRyZWU6IENvbW1hbmRUcmVlO1xuICAgIGlzQ29tbWFuZEV4ZWN1dGluZzogYm9vbGVhbjtcbiAgICBjb21tYW5kUXVldWU6IGFueVtdO1xuICAgIENvbW1hbmRzOiBDb21tYW5kRGljdGlvbmFyeSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuVHJlZSA9IG5ldyBDb21tYW5kVHJlZSgpO1xuICAgICAgICB0aGlzLmlzQ29tbWFuZEV4ZWN1dGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdO1xuICAgIH1cblxuICAgIEV4ZWN1dGUoY29tbWFuZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goY29tbWFuZCk7XG4gICAgICAgIGlmICh0aGlzLmlzQ29tbWFuZEV4ZWN1dGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuRXhlY3V0ZU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEV4ZWN1dGVOZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5jb21tYW5kUXVldWUubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRRdWV1ZVswXTtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUuc2hpZnQoKTtcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBDb21tYW5kUGFyc2VyKGNvbW1hbmQpO1xuICAgICAgICBsZXQgY29tbWFuZE5hbWUgPSBwYXJzZXIuZ2V0Q29tbWFuZCgpO1xuXG4gICAgICAgIGxldCBjb21tYW5kT2JqZWN0ID0gdGhpcy5UcmVlLkdldENvbW1hbmQoY29tbWFuZE5hbWUpO1xuICAgICAgICBpZiAoY29tbWFuZE9iamVjdCA9PT0gdW5kZWZpbmVkIHx8IGNvbW1hbmRPYmplY3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93ICdDb21tYW5kIG9iamVjdCBmb3IgezB9IG5vdCBmb3VuZCcuZm9ybWF0KGNvbW1hbmROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJycpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29tbWFuZE9iamVjdC5FeGVjdXRlKHBhcnNlciwgbmV3IENvbW1hbmRDYWxsYmFjaygoKSA9PiB0aGlzLkFmdGVyRXhlY3V0ZSgpKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuQWZ0ZXJFeGVjdXRlKCk7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQWZ0ZXJFeGVjdXRlKCkge1xuICAgICAgICBFbmdpbmUuT3V0cHV0KCcnKTtcbiAgICAgICAgUHJvbXB0LlByaW50KCk7XG4gICAgICAgIHRoaXMuRXhlY3V0ZU5leHQoKTtcbiAgICB9XG5cbiAgICBTZXREZWZhdWx0Q29tbWFuZChjb21tYW5kT2JqZWN0OiBDb21tYW5kKSB7XG4gICAgICAgIHRoaXMuVHJlZS5TZXREZWZhdWx0Q29tbWFuZChjb21tYW5kT2JqZWN0KTtcbiAgICB9XG5cbiAgICBSZWdpc3RlckNvbW1hbmQ8Q29tbWFuZE5hbWUgZXh0ZW5kcyBrZXlvZiBDb21tYW5kTGlzdD4obmFtZTogQ29tbWFuZE5hbWUsIG9iamVjdDogQ29tbWFuZExpc3RbQ29tbWFuZE5hbWVdKSB7XG4gICAgICAgIHRoaXMuVHJlZS5BZGROZXdDb21tYW5kKG5hbWUsIG9iamVjdCk7XG4gICAgICAgIGxldCBjb21tYW5kTGlzdCA9IHRoaXMgYXMgQ29tbWFuZExpc3Q7XG4gICAgICAgIGNvbW1hbmRMaXN0W25hbWVdID0gb2JqZWN0O1xuICAgIH1cbn1cblxuZXhwb3J0IHZhciBDb21tYW5kcyA9IG5ldyBDb21tYW5kc01hbmFnZXIoKTtcbiIsImltcG9ydCB7IERvd24gfSBmcm9tICcuLi9jb21tYW5kcy9Eb3duJztcclxuaW1wb3J0IHsgRHJvcCB9IGZyb20gJy4uL2NvbW1hbmRzL0Ryb3AnO1xyXG5pbXBvcnQgeyBFYXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvRWFzdCc7XHJcbmltcG9ydCB7IEV2YWwgfSBmcm9tICcuLi9jb21tYW5kcy9FdmFsJztcclxuaW1wb3J0IHsgRXhhbSB9IGZyb20gJy4uL2NvbW1hbmRzL0V4YW0nO1xyXG5pbXBvcnQgeyBHbyB9IGZyb20gJy4uL2NvbW1hbmRzL0dvJztcclxuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi4vY29tbWFuZHMvSW52ZW50b3J5JztcclxuaW1wb3J0IHsgSnNvbiB9IGZyb20gJy4uL2NvbW1hbmRzL0pzb24nO1xyXG5pbXBvcnQgeyBMb2FkIH0gZnJvbSAnLi4vY29tbWFuZHMvTG9hZCc7XHJcbmltcG9ydCB7IExvb2sgfSBmcm9tICcuLi9jb21tYW5kcy9Mb29rJztcclxuaW1wb3J0IHsgTm9Db21tYW5kIH0gZnJvbSAnLi4vY29tbWFuZHMvTm9Db21tYW5kJztcclxuaW1wb3J0IHsgTm9ydGggfSBmcm9tICcuLi9jb21tYW5kcy9Ob3J0aCc7XHJcbmltcG9ydCB7IFJlbG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL1JlbG9hZCc7XHJcbmltcG9ydCB7IFNhdmUgfSBmcm9tICcuLi9jb21tYW5kcy9TYXZlJztcclxuaW1wb3J0IHsgU2NhbiB9IGZyb20gJy4uL2NvbW1hbmRzL1NjYW4nO1xyXG5pbXBvcnQgeyBTb3V0aCB9IGZyb20gJy4uL2NvbW1hbmRzL1NvdXRoJztcclxuaW1wb3J0IHsgVGFrZSB9IGZyb20gJy4uL2NvbW1hbmRzL1Rha2UnO1xyXG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvVGVzdCc7XHJcbmltcG9ydCB7IFVwIH0gZnJvbSAnLi4vY29tbWFuZHMvVXAnO1xyXG5pbXBvcnQgeyBXZXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvV2VzdCc7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi9Db21tYW5kc01hbmFnZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEluaXRDb21tYW5kcygpIHtcclxuICAgIENvbW1hbmRzLlNldERlZmF1bHRDb21tYW5kKG5ldyBOb0NvbW1hbmQoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdEb3duJywgbmV3IERvd24oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Ryb3AnLCBuZXcgRHJvcCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Vhc3QnLCBuZXcgRWFzdCgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRXhhbScsIG5ldyBFeGFtKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdFdmFsJywgbmV3IEV2YWwoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdHbycsIG5ldyBHbygpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0ludmVudG9yeScsIG5ldyBJbnZlbnRvcnkoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdKc29uJywgbmV3IEpzb24oKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdMb29rJywgbmV3IExvb2soKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0xvYWQnLCBuZXcgTG9hZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ05vcnRoJywgbmV3IE5vcnRoKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnUmVsb2FkJywgbmV3IFJlbG9hZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NvdXRoJywgbmV3IFNvdXRoKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdTY2FuJywgbmV3IFNjYW4oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NhdmUnLCBuZXcgU2F2ZSgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1Rha2UnLCBuZXcgVGFrZSgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVGVzdCcsIG5ldyBUZXN0KCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVXAnLCBuZXcgVXAoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdXZXN0JywgbmV3IFdlc3QoKSk7XHJcbn1cclxuIiwiY2xhc3MgRW5naW5lVXRpbHNDbGFzcyB7XHJcbiAgICBza2lwUHJpbnRlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIE91dHB1dFByaW50ZXIobWVzc2FnZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGRlbGF5ID0gNjAsIGlzTmV3TGluZSA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLnNraXBQcmludGVyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcmludE5leHQobWVzc2FnZSwgY2FsbGJhY2ssIGRlbGF5LCBpc05ld0xpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50TmV4dChtZXNzYWdlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgZGVsYXk6IG51bWJlciwgaXNOZXdMaW5lOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuaXNOdWxsT3JFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChpc05ld0xpbmUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2tpcFByaW50ZXIgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgZGVsYXkgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChtZXNzYWdlWzBdLCBmYWxzZSk7XHJcbiAgICAgICAgRW5naW5lLlN0YXJ0VGltZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByaW50TmV4dChtZXNzYWdlLnNsaWNlKDEpLCBjYWxsYmFjaywgZGVsYXksIGlzTmV3TGluZSk7XHJcbiAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIFNraXBQcmludGVyKCkge1xyXG4gICAgICAgIHRoaXMuc2tpcFByaW50ZXIgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEVuZ2luZVV0aWxzID0gbmV3IEVuZ2luZVV0aWxzQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IEVuZ2luZVV0aWxzIH0gZnJvbSAnLi9FbmdpbmVVdGlscyc7XHJcblxyXG5leHBvcnQgdmFyIElucHV0RnVuY3Rpb25zID0gJ3RydWUnO1xyXG5cclxuZnVuY3Rpb24gRXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpIHtcclxuICAgIENvbW1hbmRzLkV4ZWN1dGUoY29tbWFuZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFNraXBQcmludGVyKCkge1xyXG4gICAgRW5naW5lVXRpbHMuU2tpcFByaW50ZXIoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gUmVzdW1lRXhlY3V0aW9uKCkge1xyXG4gICAgQ29tbWFuZHMuRXhlY3V0ZU5leHQoKTtcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZnVuY3Rpb24gRXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgZnVuY3Rpb24gU2tpcFByaW50ZXIoKTogdm9pZDtcclxuICAgIGZ1bmN0aW9uIFJlc3VtZUV4ZWN1dGlvbigpOiB2b2lkO1xyXG59XHJcbmdsb2JhbFRoaXMuRXhlY3V0ZSA9IEV4ZWN1dGU7XHJcbmdsb2JhbFRoaXMuU2tpcFByaW50ZXIgPSBTa2lwUHJpbnRlcjtcclxuZ2xvYmFsVGhpcy5SZXN1bWVFeGVjdXRpb24gPSBSZXN1bWVFeGVjdXRpb247XHJcbiIsImNsYXNzIFByb21wdENsYXNzIHtcclxuICAgIFByaW50KCkge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJyQgJywgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIFByb21wdCA9IG5ldyBQcm9tcHRDbGFzcygpO1xyXG4iLCJjbGFzcyBSYW5kb21DbGFzcyB7XHJcbiAgICBuZXh0SW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIFJhbmRvbSA9IG5ldyBSYW5kb21DbGFzcygpO1xyXG4iLCJleHBvcnQge307XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBpbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgICAgICBmb3JtYXQoLi4uYXJnczogYW55W10pOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhcnRXaXRoVXBwZXIoKTogc3RyaW5nO1xyXG4gICAgICAgIGlzTnVtYmVyKCk6IGJvb2xlYW47XHJcbiAgICAgICAgaXNOdWxsT3JFbXB0eSgpOiBib29sZWFuO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICguLi5hcmdzOiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgbnVtYmVyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPT0gJ3VuZGVmaW5lZCcgPyBhcmdzW251bWJlcl0gOiBtYXRjaDtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5zdGFydFdpdGhVcHBlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnNsaWNlKDEpO1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5pc051bWJlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAvXlxcZCskLy50ZXN0KHRoaXMudG9TdHJpbmcoKSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmlzTnVsbE9yRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcyA9PT0gbnVsbCB8fCB0aGlzID09PSAnJztcclxufTtcclxuIiwiaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSAnLi9FbnVtSGVscGVyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4vR3JhbW1hQ2FzZSc7XHJcblxyXG5leHBvcnQgZW51bSBEaXJlY3Rpb24ge1xyXG4gICAgbm9ydGggPSAnbm9ydGgnLFxyXG4gICAgc291dGggPSAnc291dGgnLFxyXG4gICAgZWFzdCA9ICdlYXN0JyxcclxuICAgIHdlc3QgPSAnd2VzdCcsXHJcbiAgICB1cCA9ICd1cCcsXHJcbiAgICBkb3duID0gJ2Rvd24nLFxyXG59XHJcblxyXG5jbGFzcyBEaXJlY3Rpb25IZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8RGlyZWN0aW9uPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihEaXJlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExvY2FsZShkaXJlY3Rpb246IERpcmVjdGlvbiwgZ3JhbW1hQ2FzZSA9IEdyYW1tYUNhc2UuTWlhbm93bmlrKSB7XHJcbiAgICAgICAgcmV0dXJuIExvY2FsLkRpcmVjdGlvbnNbZGlyZWN0aW9uXVtncmFtbWFDYXNlXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBEaXJlY3Rpb25IZWxwZXIgPSBuZXcgRGlyZWN0aW9uSGVscGVyQ2xhc3MoKTtcclxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudW1IZWxwZXI8RW51bVR5cGU+IHtcclxuICAgIHNvdXJjZTogYW55O1xyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh2YWx1ZTogc3RyaW5nKTogRW51bVR5cGUgfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVt2YWx1ZV0gYXMgRW51bVR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlQXJyYXkodmFsdWVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBhcnJheTogRW51bVR5cGVbXSA9IFtdO1xyXG4gICAgICAgIHZhbHVlcy5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhcnNlZDogRW51bVR5cGUgfCBudWxsID0gdGhpcy5wYXJzZShrZXkpO1xyXG4gICAgICAgICAgICBpZiAocGFyc2VkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHBhcnNlZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGFpbnMoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoc3RyaW5nKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlU2hvcnQoc3RyaW5nOiBzdHJpbmcpOiBFbnVtVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVtrZXldIGFzIEVudW1UeXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEtleSh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZVtrZXldID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yRWFjaChjYWxsYmFjazogeyAodmFsdWU6IEVudW1UeXBlLCBrZXk6IHN0cmluZyk6IHZvaWQgfSk6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLnNvdXJjZVtrZXldLCBrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tIFwiLi9FbnVtSGVscGVyXCI7XHJcblxyXG5leHBvcnQgZW51bSBFcXVpcG1lbnRTbG90IHtcclxuICAgIE5vbmUgPSAwLFxyXG4gICAgVG9yc28gPSAxLFxyXG4gICAgQXJtcyA9IDIsXHJcbiAgICBIYW5kcyA9IDMsXHJcbiAgICBMZWdzID0gNCxcclxuICAgIEZlZXRzID0gNSxcclxuICAgIEhlYWQgPSA2LFxyXG4gICAgTWFpbkhhbmQgPSA3LFxyXG4gICAgT2ZmSGFuZCA9IDgsXHJcbiAgICBTaGlydCA9IDksXHJcbiAgICBQYW50cyA9IDEwLFxyXG4gICAgQ29hdCA9IDExLFxyXG4gICAgUmlnaHRSaW5nID0gMTIsXHJcbiAgICBMZWZ0UmluZyA9IDEzLFxyXG4gICAgTmVja2xhY2UgPSAxNCxcclxuICAgIFRvcmNoID0gMTUsXHJcbn1cclxuXHJcbmNsYXNzIEVxdWlwbWVudFNsb3RIZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8RXF1aXBtZW50U2xvdD4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoRXF1aXBtZW50U2xvdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgRXF1aXBtZW50U2xvdEhlbHBlciA9IG5ldyBFcXVpcG1lbnRTbG90SGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gXCIuL0VudW1IZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEdsb2JhbEV2ZW50VHlwZSB7XHJcbiAgICBCZWZvcmVSb29tRW50ZXIgPSAxLFxyXG59XHJcblxyXG5jbGFzcyBHbG9iYWxFdmVudFR5cGVIZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8R2xvYmFsRXZlbnRUeXBlPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihHbG9iYWxFdmVudFR5cGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEdsb2JhbEV2ZW50VHlwZUhlbHBlciA9IG5ldyBHbG9iYWxFdmVudFR5cGVIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSBcIi4vRW51bUhlbHBlclwiO1xyXG5cclxuZXhwb3J0IGVudW0gR3JhbW1hQ2FzZSB7XHJcbiAgICBNaWFub3duaWsgPSAwLCAvL2tvZ28gY28gamVzdFxyXG4gICAgRG9wZWxuaWFjeiA9IDEsIC8va29nbyBjemVnbyBuaWUgbWFcclxuICAgIENlbG93bmlrID0gMiwgLy9rb211IGN6ZW11IHNpxJkgcHJ6eWdsxIVkYW1cclxuICAgIEJpZXJuaWsgPSAzLCAvL2tvZ28gY28gd2lkesSZLCB1cHVzemN6YW1cclxuICAgIE5hcnplZG5payA9IDQsIC8veiBraW0geiBjenltIGlkZVxyXG4gICAgTWllanNjb3duaWsgPSA1LCAvL28ga2ltIG8gY3p5bSBtb3dpZVxyXG4gICAgV29sYWN6ID0gNiwgLy9vIGtvZ2/FvCB0byBtb2plIHNrcm9tbmUgb2N6eSBtYWrEhSB6YXN6Y3p5dCBwb3N0cnplZ2HEh1xyXG59XHJcblxyXG5jbGFzcyBHcmFtbWFDYXNlSGVscGVyQ2xhc3MgZXh0ZW5kcyBFbnVtSGVscGVyPEdyYW1tYUNhc2U+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKEdyYW1tYUNhc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEdyYW1tYUNhc2VIZWxwZXIgPSBuZXcgR3JhbW1hQ2FzZUhlbHBlckNsYXNzKCk7XHJcbiIsImltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tICcuL0VudW1IZWxwZXInO1xyXG5cclxuZXhwb3J0IHR5cGUgSXRlbVR5cGUyID1cclxuICAgIHwgJ1dlYXBvbjFIJ1xyXG4gICAgfCAnV2VhcG9uMkgnXHJcbiAgICB8ICdTaGllbGQnXHJcbiAgICB8ICdBcm1vcidcclxuICAgIHwgJ1Nob3VsZGVycydcclxuICAgIHwgJ0dsb3ZlcydcclxuICAgIHwgJ0dyZWF2ZXMnXHJcbiAgICB8ICdCb290cydcclxuICAgIHwgJ0hlbG1ldCdcclxuICAgIHwgJ1NoaXJ0J1xyXG4gICAgfCAnUGFudHMnXHJcbiAgICB8ICdXaWxkU2hpZWxkJ1xyXG4gICAgfCAnV2lsZEFybW9yJ1xyXG4gICAgfCAnV2lsZFNob3VsZGVycydcclxuICAgIHwgJ1dpbGRHbG92ZXMnXHJcbiAgICB8ICdXaWxkR3JlYXZlcydcclxuICAgIHwgJ1dpbGRCb290cydcclxuICAgIHwgJ1dpbGRIZWxtZXQnXHJcbiAgICB8ICdSaW5nJ1xyXG4gICAgfCAnTmVja2xhY2UnXHJcbiAgICB8ICdQb3Rpb24nXHJcbiAgICB8ICdGb29kJ1xyXG4gICAgfCAnVHJhc2gnXHJcbiAgICB8ICdDdXJyZW5jeSdcclxuICAgIHwgJ0NvbnRhaW5lcidcclxuICAgIHwgJ1N0YXRpY0NvbnRhaW5lcidcclxuICAgIHwgJ1F1ZXN0J1xyXG4gICAgfCAnU3RhdGljJ1xyXG4gICAgfCAnTGV2ZXInO1xyXG5cclxuZXhwb3J0IGVudW0gSXRlbVR5cGUge1xyXG4gICAgV2VhcG9uMUggPSAnV2VhcG9uMUgnLFxyXG4gICAgV2VhcG9uMkggPSAnV2VhcG9uMkgnLFxyXG4gICAgU2hpZWxkID0gJ1NoaWVsZCcsXHJcbiAgICBBcm1vciA9ICdBcm1vcicsXHJcbiAgICBTaG91bGRlcnMgPSAnU2hvdWxkZXJzJyxcclxuICAgIEdsb3ZlcyA9ICdHbG92ZXMnLFxyXG4gICAgR3JlYXZlcyA9ICdHcmVhdmVzJyxcclxuICAgIEJvb3RzID0gJ0Jvb3RzJyxcclxuICAgIEhlbG1ldCA9ICdIZWxtZXQnLFxyXG4gICAgU2hpcnQgPSAnU2hpcnQnLFxyXG4gICAgUGFudHMgPSAnUGFudHMnLFxyXG4gICAgV2lsZFNoaWVsZCA9ICdXaWxkU2hpZWxkJyxcclxuICAgIFdpbGRBcm1vciA9ICdXaWxkQXJtb3InLFxyXG4gICAgV2lsZFNob3VsZGVycyA9ICdXaWxkU2hvdWxkZXJzJyxcclxuICAgIFdpbGRHbG92ZXMgPSAnV2lsZEdsb3ZlcycsXHJcbiAgICBXaWxkR3JlYXZlcyA9ICdXaWxkR3JlYXZlcycsXHJcbiAgICBXaWxkQm9vdHMgPSAnV2lsZEJvb3RzJyxcclxuICAgIFdpbGRIZWxtZXQgPSAnV2lsZEhlbG1ldCcsXHJcbiAgICBSaW5nID0gJ1JpbmcnLFxyXG4gICAgTmVja2xhY2UgPSAnTmVja2xhY2UnLFxyXG4gICAgUG90aW9uID0gJ1BvdGlvbicsXHJcbiAgICBGb29kID0gJ0Zvb2QnLFxyXG4gICAgVHJhc2ggPSAnVHJhc2gnLFxyXG4gICAgQ3VycmVuY3kgPSAnQ3VycmVuY3knLFxyXG4gICAgQ29udGFpbmVyID0gJ0NvbnRhaW5lcicsXHJcbiAgICBTdGF0aWNDb250YWluZXIgPSAnU3RhdGljQ29udGFpbmVyJyxcclxuICAgIFF1ZXN0ID0gJ1F1ZXN0JyxcclxuICAgIFN0YXRpYyA9ICdTdGF0aWMnLFxyXG4gICAgTGV2ZXIgPSAnTGV2ZXInLFxyXG59XHJcblxyXG5jbGFzcyBJdGVtVHlwZUhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxJdGVtVHlwZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoSXRlbVR5cGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEl0ZW1UeXBlSGVscGVyID0gbmV3IEl0ZW1UeXBlSGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEVxdWlwbWVudCB9IGZyb20gJy4uL21vZGVsL0VxdWlwbWVudCc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ2hhcmFjdGVyVGVtcGxhdGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlckZhY3Rvcnkge1xyXG4gICAgc3Bhd25DaGFyYWN0ZXIoY2hhcmFjdGVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IEdhbWVEYXRhLkNoYXJhY3RlclRlbXBsYXRlcy5nZXRUZW1wbGF0ZShjaGFyYWN0ZXJJZCk7XHJcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoKTtcclxuICAgICAgICBjaGFyYWN0ZXIgPSB0aGlzLkxvYWRGcm9tVGVtcGxhdGUoY2hhcmFjdGVyLCB0ZW1wbGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgTG9hZEZyb21UZW1wbGF0ZShjaGFyYWN0ZXI6IENoYXJhY3RlciwgdGVtcGxhdGU6IENoYXJhY3RlclRlbXBsYXRlKSB7XHJcbiAgICAgICAgY2hhcmFjdGVyLklkID0gdGVtcGxhdGUuSWQ7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5JbnZlbnRvcnkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgaW52ZW50b3J5TW9kZWwgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUuSW52ZW50b3J5LmZvckVhY2goKGl0ZW1EZWZpbml0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeU1vZGVsLmFkZChHYW1lLnNwYXduSXRlbShpdGVtRGVmaW5pdGlvbikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2hhcmFjdGVyLkludmVudG9yeSA9IGludmVudG9yeU1vZGVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkVxdWlwbWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBlcXVpcG1lbnRNb2RlbCA9IG5ldyBFcXVpcG1lbnQoKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUuRXF1aXBtZW50LmZvckVhY2goKGVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcXVpcG1lbnRNb2RlbC5lcXVpcChlcS5TbG90LCBHYW1lLnNwYXduSXRlbShlcS5JdGVtKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXIuRXF1aXBtZW50ID0gZXF1aXBtZW50TW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXI7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi4vbW9kZWwvSXRlbUxpc3QnO1xyXG5pbXBvcnQgeyBJdGVtQ2hhbmNlT25lT2ZUZW1wbGF0ZSwgSXRlbUNoYW5jZVRlbXBsYXRlLCBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCwgU3RhY2sgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ29tbW9uJztcclxuaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XHJcbmltcG9ydCB7IFJhbmRvbSB9IGZyb20gJy4uL2NvbW1vbkxvZ2ljL1JhbmRvbSc7XHJcbmltcG9ydCB7IEl0ZW1Mb2NrIH0gZnJvbSAnLi4vbW9kZWwvSXRlbUxvY2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1GYWN0b3J5IHtcclxuICAgIHNwYXduSXRlbShpdGVtRGVmaW5pdGlvbjogSXRlbUxpc3RUZW1wbGF0ZUVsZW1lbnQpOiBJdGVtIHwgbnVsbCB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1EZWZpbml0aW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcGF3bkl0ZW1CeVRlbXBsYXRlSWQoaXRlbURlZmluaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSXRlbUNoYW5jZVRlbXBsYXRlKGl0ZW1EZWZpbml0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkNoYW5jZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFJhbmRvbS5uZXh0SW50KDEsIDEwMCkgPiBpdGVtRGVmaW5pdGlvbi5DaGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlSWQgPSBpdGVtRGVmaW5pdGlvbi5JdGVtSWQ7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gdGhpcy5zcGF3bkl0ZW1CeVRlbXBsYXRlSWQodGVtcGxhdGVJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uU3RhY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0U3RhY2sodGhpcy5zdGFja1ZhbHVlKGl0ZW1EZWZpbml0aW9uLlN0YWNrKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVJbnZlbnRvcnkoaXRlbURlZmluaXRpb24sIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlTG9jayhpdGVtRGVmaW5pdGlvbiwgaXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtSW5kZXggPSB0aGlzLnJlc29sdmVSYW5kb21JdGVtSW5kZXgoaXRlbURlZmluaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlSWQgPSBpdGVtRGVmaW5pdGlvbi5JdGVtSWRbc2VsZWN0ZWRJdGVtSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlSWQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW0gPSB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZCh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5TdGFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkl0ZW1JZC5sZW5ndGggIT09IGl0ZW1EZWZpbml0aW9uLlN0YWNrLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAnSXRlbSBkZWZpbml0aW9uIGhhcyB7MH0gc3BlY2lmaWVkIGlkcyBidXQgb25seSB7MX0gc3BpZWNpZmllZCBzdGFja3MnLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZC5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5TdGFjay5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0U3RhY2sodGhpcy5zdGFja1ZhbHVlKGl0ZW1EZWZpbml0aW9uLlN0YWNrW3NlbGVjdGVkSXRlbUluZGV4XSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc0l0ZW1DaGFuY2VUZW1wbGF0ZShpdGVtRGVmaW5pdGlvbjogSXRlbUxpc3RUZW1wbGF0ZUVsZW1lbnQpOiBpdGVtRGVmaW5pdGlvbiBpcyBJdGVtQ2hhbmNlVGVtcGxhdGUge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgaXRlbURlZmluaXRpb24gIT09ICdzdHJpbmcnICYmIHR5cGVvZiBpdGVtRGVmaW5pdGlvbi5JdGVtSWQgPT09ICdzdHJpbmcnO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYXduSXRlbUJ5VGVtcGxhdGVJZCh0ZW1wbGF0ZUlkOiBzdHJpbmcpOiBJdGVtIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGU6IEl0ZW1UZW1wbGF0ZSA9IEdhbWVEYXRhLkl0ZW1UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgSXRlbSgpO1xyXG4gICAgICAgIGl0ZW0uSWQgPSB0ZW1wbGF0ZS5JZDtcclxuICAgICAgICBpZiAoaXRlbS5pc0NvbnRhaW5lcigpKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uSW52ZW50b3J5ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZVJhbmRvbUl0ZW1JbmRleChpdGVtRGVmaW5pdGlvbjogSXRlbUNoYW5jZU9uZU9mVGVtcGxhdGUpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5DaGFuY2VMaXN0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5JdGVtSWQuZm9yRWFjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5DaGFuY2VMaXN0Py5wdXNoKDEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkl0ZW1JZC5sZW5ndGggIT09IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIGRlZmluaXRpb24gaGFzIHswfSBzcGVjaWZpZWQgaWRzIGJ1dCBvbmx5IHsxfSBzcGllY2lmaWVkIGNoYW5jZXMgaW4gQ2hhbmNlTGlzdCcuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QubGVuZ3RoLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNoYW5jZVN1bSA9IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QucmVkdWNlKChhOiBudW1iZXIsIGI6IG51bWJlcikgPT4gYSArIGIpO1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENoYW5jZSA9IFJhbmRvbS5uZXh0SW50KDEsIGNoYW5jZVN1bSk7XHJcbiAgICAgICAgY2hhbmNlU3VtID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2hhbmNlU3VtICs9IGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3RbaV07XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZENoYW5jZSA8PSBjaGFuY2VTdW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwOyAvL3Nob3VsZCBuZXZlciBvY2N1clxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZUludmVudG9yeShpdGVtRGVmaW5pdGlvbjogSXRlbUNoYW5jZVRlbXBsYXRlLCBpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkludmVudG9yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnZlbnRvcnkgPSBpdGVtLmdldEludmVudG9yeSgpO1xyXG4gICAgICAgICAgICBpZiAoaW52ZW50b3J5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnkgPSBpdGVtLkludmVudG9yeSA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkludmVudG9yeS5mb3JFYWNoKChpdGVtRGVmaW5pdGlvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnk/LmFkZChHYW1lLnNwYXduSXRlbShpdGVtRGVmaW5pdGlvbikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlTG9jayhpdGVtRGVmaW5pdGlvbjogSXRlbUNoYW5jZVRlbXBsYXRlLCBpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkxvY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpdGVtLkxvY2sgPSBuZXcgSXRlbUxvY2soaXRlbURlZmluaXRpb24uTG9jayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhY2tWYWx1ZShzdGFjazogU3RhY2spOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChzdGFjayA9PT0gdW5kZWZpbmVkIHx8IHN0YWNrID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHN0YWNrID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhY2s7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJhbmRvbS5uZXh0SW50KHN0YWNrLk1pbiwgc3RhY2suTWF4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZExpc3RGcm9tVGVtcGxhdGUodGVtcGxhdGU/OiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudFtdKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1MaXN0ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGUuZm9yRWFjaCgoaXRlbURlZmluaXRpb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbUxpc3QuYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbUxpc3Q7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3Rlckxpc3QgfSBmcm9tICcuLi9tb2RlbC9DaGFyYWN0ZXJMaXN0JztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgUm9vbUV4aXQgfSBmcm9tICcuLi9tb2RlbC9Sb29tRXhpdCc7XHJcbmltcG9ydCB7IFJvb21FeGl0c0xpc3QgfSBmcm9tICcuLi9tb2RlbC9Sb29tRXhpdHNMaXN0JztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL1Jvb21UZW1wbGF0ZSc7XHJcbmltcG9ydCB7IFJvb21Eb29yIH0gZnJvbSAnLi4vbW9kZWwvUm9vbURvb3InO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4uL21vZGVsL0dhbWVEYXRhJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tRmFjdG9yeSB7XHJcbiAgICBzcGF3blJvb20odGVtcGxhdGU6IFJvb21UZW1wbGF0ZSkge1xyXG4gICAgICAgIGxldCByb29tID0gbmV3IFJvb20oKTtcclxuICAgICAgICByb29tLklkID0gdGVtcGxhdGUuSWQ7XHJcbiAgICAgICAgcmV0dXJuIHJvb207XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21EYXRhKHJvb206IFJvb20pIHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IEdhbWVEYXRhLlJvb21UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUocm9vbS5JZCk7XHJcbiAgICAgICAgbGV0IGV4aXRzTW9kZWwgPSBuZXcgUm9vbUV4aXRzTGlzdCgpO1xyXG4gICAgICAgIHRlbXBsYXRlLkV4aXRzPy5mb3JFYWNoKChleGl0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSBleGl0LkRpcmVjdGlvbjtcclxuICAgICAgICAgICAgbGV0IHJvb21FeGl0ID0gbmV3IFJvb21FeGl0KCk7XHJcbiAgICAgICAgICAgIHJvb21FeGl0LlJvb21JZCA9IGV4aXQuUm9vbUlkO1xyXG4gICAgICAgICAgICByb29tRXhpdC5Jc0hpZGRlbiA9IGV4aXQuaXNIaWRkZW47XHJcbiAgICAgICAgICAgIGlmIChleGl0LkRvb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvb3IgPSAocm9vbUV4aXQuRG9vciA9IG5ldyBSb29tRG9vcigpKTtcclxuICAgICAgICAgICAgICAgIGRvb3IuSXNMb2NrZWQgPSBleGl0LkRvb3IuSXNMb2NrZWQ7XHJcbiAgICAgICAgICAgICAgICBkb29yLklzQ2xvc2VkID0gZXhpdC5Eb29yLklzQ2xvc2VkO1xyXG4gICAgICAgICAgICAgICAgZG9vci5LZXlJZCA9IGV4aXQuRG9vci5LZXlJZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZG9vci5Jc0xvY2tlZCA9PT0gdW5kZWZpbmVkICYmIGRvb3IuSXNDbG9zZWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvb3IuSXNMb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV4aXRzTW9kZWxbZGlyZWN0aW9uXSA9IHJvb21FeGl0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJvb20uRXhpdHMgPSBleGl0c01vZGVsO1xyXG5cclxuICAgICAgICByb29tLkl0ZW1zID0gR2FtZS5JdGVtRmFjdG9yeS5sb2FkTGlzdEZyb21UZW1wbGF0ZSh0ZW1wbGF0ZS5JdGVtcyk7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5DaGFyYWN0ZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcnNNb2RlbCA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLkNoYXJhY3RlcnMuZm9yRWFjaCgoY2hhcmFjdGVySWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYXJhY3RlcnNNb2RlbC5hZGQoR2FtZS5zcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcm9vbS5DaGFyYWN0ZXJzID0gY2hhcmFjdGVyc01vZGVsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEVudGl0eUJhc2UgfSBmcm9tICcuL0VudGl0eUJhc2UnO1xyXG5pbXBvcnQgeyBFcXVpcG1lbnQgfSBmcm9tICcuL0VxdWlwbWVudCc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IENoYXJhY3RlclN0YXRzIH0gZnJvbSAnLi9DaGFyYWN0ZXJTdGF0cyc7XHJcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ2hhcmFjdGVyVGVtcGxhdGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlciBleHRlbmRzIEVudGl0eUJhc2Uge1xyXG4gICAgSW52ZW50b3J5OiBJdGVtTGlzdCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgRXF1aXBtZW50OiBFcXVpcG1lbnQgPSBuZXcgRXF1aXBtZW50KCk7XHJcbiAgICBTdGF0czogQ2hhcmFjdGVyU3RhdHMgPSBuZXcgQ2hhcmFjdGVyU3RhdHMoKTtcclxuXHJcbiAgICBwcml2YXRlIGdldFRlbXBsYXRlKCk6IENoYXJhY3RlclRlbXBsYXRlIHtcclxuICAgICAgICByZXR1cm4gR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzLmdldFRlbXBsYXRlKHRoaXMuSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3RlcjogQ2hhcmFjdGVyKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZENoYXJhY3Rlcik7XHJcbiAgICAgICAgdGhpcy5JbnZlbnRvcnkgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB0aGlzLkludmVudG9yeS5sb2FkRnJvbVNhdmUoc2F2ZWRDaGFyYWN0ZXIuSW52ZW50b3J5KTtcclxuICAgICAgICB0aGlzLkVxdWlwbWVudCA9IG5ldyBFcXVpcG1lbnQoKTtcclxuICAgICAgICB0aGlzLkVxdWlwbWVudC5sb2FkRnJvbVNhdmUoc2F2ZWRDaGFyYWN0ZXIuRXF1aXBtZW50KTtcclxuICAgICAgICB0aGlzLlN0YXRzID0gbmV3IENoYXJhY3RlclN0YXRzKCk7XHJcbiAgICAgICAgdGhpcy5TdGF0cy5sb2FkRnJvbVNhdmUoc2F2ZWRDaGFyYWN0ZXIuU3RhdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoZ3JhbW1hQ2FzZSA9IEdyYW1tYUNhc2UuTWlhbm93bmlrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lW2dyYW1tYUNhc2VdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuRGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SWRsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLklkbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW52ZW50b3J5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkludmVudG9yeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFcXVpcG1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRXF1aXBtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEVxdWlwbWVudCgpLmhhc0xpZ2h0U291cmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGVhbHRoTGV2ZWwoZGVzY3JpcHRpb246IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgcGVyY2VudGFnZSA9ICh0aGlzLlN0YXRzLmN1cnJlbnRIZWFsdGggKiAxMDApIC8gdGhpcy5TdGF0cy5oZWFsdGgudG90YWw7XHJcbiAgICAgICAgbGV0IGxldmVsOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuRnVsbCA6ICfilojilojilojilojilognO1xyXG4gICAgICAgICAgICByZXR1cm4gJ3xHJyArIGxldmVsICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPiA4MCkge1xyXG4gICAgICAgICAgICBsZXZlbCA9IGRlc2NyaXB0aW9uID8gTG9jYWwuU3RhdHMuSGVhbHRoTGV2ZWxzLkxpZ2h0V291bmRzIDogJ+KWiOKWiOKWiOKWiOKWiCc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfGcnICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDYwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuTWVkaXVtV291bmRzIDogJ+KWiOKWiOKWiOKWiOKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFknICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDQwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuU2VyaW91c1dvdW5kcyA6ICfilojilojilojilpHilpEnO1xyXG4gICAgICAgICAgICByZXR1cm4gJ3xZJyArIGxldmVsICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPiAyMCkge1xyXG4gICAgICAgICAgICBsZXZlbCA9IGRlc2NyaXB0aW9uID8gTG9jYWwuU3RhdHMuSGVhbHRoTGV2ZWxzLkhlYXZ5V291bmRzIDogJ+KWiOKWiOKWkeKWkeKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFInICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+PSAwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuTmVhckRlYXRoIDogJ+KWiOKWkeKWkeKWkeKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFInICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXZlbCA9IGRlc2NyaXB0aW9uID8gTG9jYWwuU3RhdHMuSGVhbHRoTGV2ZWxzLkRlYWQgOiAn4paR4paR4paR4paR4paRJztcclxuICAgICAgICByZXR1cm4gJ3xSJyArIGxldmVsICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEVudGl0eUxpc3QgfSBmcm9tICcuL0VudGl0eUxpc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3Rlckxpc3QgZXh0ZW5kcyBFbnRpdHlMaXN0PENoYXJhY3Rlcj4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRMaXN0OiBDaGFyYWN0ZXJMaXN0KSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IHNhdmVkTGlzdC5BcnJheS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0NoYXIgPSBuZXcgQ2hhcmFjdGVyKCk7XHJcbiAgICAgICAgICAgIG5ld0NoYXIubG9hZEZyb21TYXZlKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3Q2hhcjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChjKSA9PiBjLmhhc0xpZ2h0U291cmNlKCkgPT09IHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFN0YXQge1xyXG4gICAgYmFzZTogbnVtYmVyID0gMDtcclxuICAgIHJhY2U6IG51bWJlciA9IDA7XHJcbiAgICBjbGFzczogbnVtYmVyID0gMDtcclxuICAgIGJvbnVzOiBudW1iZXIgPSAwO1xyXG4gICAgdG90YWw6IG51bWJlciA9IDA7XHJcbn1cclxuXHJcbmNsYXNzIEF0dHJpYnV0ZSB7XHJcbiAgICBzdGF0OiBudW1iZXIgPSAwO1xyXG4gICAgbGV2ZWw6IG51bWJlciA9IDA7XHJcbiAgICBlcTogbnVtYmVyID0gMDtcclxuICAgIGJvbnVzOiBudW1iZXIgPSAwO1xyXG4gICAgbW9kaWZpZXI6IG51bWJlciA9IDA7XHJcbiAgICB0b3RhbDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlclN0YXRzIHtcclxuICAgIGxldmVsOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHN0cmVuZ3RoOiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIGRleHRlcml0eTogU3RhdCA9IG5ldyBTdGF0KCk7XHJcbiAgICBhZ2lsaXR5OiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIGVuZHVyYW5jZTogU3RhdCA9IG5ldyBTdGF0KCk7XHJcbiAgICB2aXRhbGl0eTogU3RhdCA9IG5ldyBTdGF0KCk7XHJcblxyXG4gICAgYXR0YWNrOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBkZWZlbnNlOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBoZWFsdGg6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGFybW9yOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBmYXRpZ3VlOiBBdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKCk7XHJcbiAgICBkYW1hZ2U6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuXHJcbiAgICBjdXJyZW50SGVhbHRoOiBudW1iZXIgPSAxMDA7XHJcbiAgICBjdXJyZW50QXJtb3I6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5oZWFsdGgudG90YWwgPSAxMDA7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkU3RhdHM6IENoYXJhY3RlclN0YXRzKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZFN0YXRzKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ2hhcmFjdGVyVGVtcGxhdGVzIHtcclxuICAgIFt0ZW1wbGF0ZUlkOiBzdHJpbmddOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihjaGFyYWN0ZXJUZW1wbGF0ZXM/OiBhbnkpIHtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyVGVtcGxhdGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNoYXJhY3RlclRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NoYXJhY3RlciB0ZW1wbGF0ZXMgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFyYWN0ZXJUZW1wbGF0ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3Q2hhcmFjdGVyVGVtcGxhdGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5ld0NoYXJhY3RlclRlbXBsYXRlKGNoYXJhY3RlclRlbXBsYXRlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpc1tjaGFyYWN0ZXJUZW1wbGF0ZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2hhcmFjdGVyIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoY2hhcmFjdGVyVGVtcGxhdGUuSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzW2NoYXJhY3RlclRlbXBsYXRlLklkXSA9IGNoYXJhY3RlclRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKGNoYXJhY3RlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpc1tjaGFyYWN0ZXJJZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gQ2hhcmFjdGVyIHRlbXBsYXRlIGRlZmluZWQgZm9yIElkIHswfSEnLmZvcm1hdChjaGFyYWN0ZXJJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW2NoYXJhY3RlcklkXTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5QmFzZSB7XHJcbiAgICBJZDogc3RyaW5nID0gJyc7XHJcbiAgICBhYnN0cmFjdCBnZXROYW1lKCk6IHN0cmluZztcclxuICAgIGFic3RyYWN0IGdldElkbGUoKTogc3RyaW5nO1xyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZEVudGl0eTogRW50aXR5QmFzZSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRFbnRpdHkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVudGl0eUJhc2UgfSBmcm9tICcuL0VudGl0eUJhc2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eUxpc3Q8VHlwZSBleHRlbmRzIEVudGl0eUJhc2U+IHtcclxuICAgIEFycmF5OiBUeXBlW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGl0ZW06IFR5cGUpIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuQXJyYXkucHVzaChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoaXRlbTogVHlwZSkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuQXJyYXkuaW5kZXhPZihpdGVtKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLkFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFueSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRBdChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuQXJyYXlbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5W2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBsZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXkubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmQobmFtZTogc3RyaW5nLCBudW1iZXIgPSAxKTogVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGxldCBmb3VuZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5BcnJheS5zb21lKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmdldE5hbWUoKS5zZWFyY2gobmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bWJlciA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBudW1iZXItLTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEJ5SWQoaWQ6IHN0cmluZywgbnVtYmVyID0gMSk6IFR5cGUgfCBudWxsIHtcclxuICAgICAgICBsZXQgZm91bmQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuQXJyYXkuc29tZSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5JZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50TG9uZ0Zvcm1hdChpbmRlbnQgPSB0cnVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpbnQoaW5kZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmludFNob3J0Rm9ybWF0KGluZGVudCA9IHRydWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcmludChpbmRlbnQsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmludChpbmRlbnQgPSB0cnVlLCBsb25nRm9ybWF0ID0gdHJ1ZSkge1xyXG4gICAgICAgIGxldCByZXR1cm5TdHJpbmcgPSAnJztcclxuICAgICAgICB0aGlzLkFycmF5LmZvckVhY2goKGVudGl0eSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmV0dXJuU3RyaW5nICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9IEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9IGVudGl0eS5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKTtcclxuICAgICAgICAgICAgaWYgKGxvbmdGb3JtYXQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSAnICcgKyBlbnRpdHkuZ2V0SWRsZSgpICsgJy4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblN0cmluZztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBFcXVpcG1lbnRTbG90LCBFcXVpcG1lbnRTbG90SGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRXF1aXBtZW50U2xvdCc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVxdWlwbWVudCB7XHJcbiAgICBBcnJheTogSXRlbVtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZEVxdWlwbWVudDogRXF1aXBtZW50KSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IHNhdmVkRXF1aXBtZW50LkFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgICAgIG5ld0l0ZW0ubG9hZEZyb21TYXZlKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3SXRlbTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZVNsb3Qoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIGlmIChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnezB9IGlzIG5vdCBhIHByb3BlciBlcXVpcG1lbnQgc2xvdC4nLmZvcm1hdChzbG90KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXF1aXAoc2xvdDogRXF1aXBtZW50U2xvdCwgaXRlbTogSXRlbSB8IG51bGwpIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBlcXVpcCwgezB9IGFscmVhZHkgY29udGFpbnMgYW4gaXRlbS4nLmZvcm1hdChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLkFycmF5W3Nsb3RdID0gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJDYW5ub3QgcmVtb3ZlLCB7MH0gZG9lc24ndCBjb250YWlucyBhbiBpdGVtLlwiLmZvcm1hdChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgdGhpcy5BcnJheVtzbG90XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5BcnJheVtzbG90XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheVtzbG90XTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChpKSA9PiBpLmlzTGlnaHRTb3VyY2UoKSA9PT0gdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2xvYmFsRXZlbnRzIH0gZnJvbSAnLi4vR2xvYmFsRXZlbnRzJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi9DaGFyYWN0ZXInO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudEFyZ3MgfSBmcm9tICcuL0dsb2JhbEV2ZW50QXJncyc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuL1Jvb20nO1xyXG5pbXBvcnQgeyBSb29tRmFjdG9yeSB9IGZyb20gJy4uL2ZhY3Rvcmllcy9Sb29tRmFjdG9yeSc7XHJcbmltcG9ydCB7IEl0ZW1GYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzL0l0ZW1GYWN0b3J5JztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyRmFjdG9yeSB9IGZyb20gJy4uL2ZhY3Rvcmllcy9DaGFyYWN0ZXJGYWN0b3J5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lTW9kZWwge1xyXG4gICAgTmFtZTogc3RyaW5nO1xyXG4gICAgU3RhcnRpbmdSb29tOiBudW1iZXI7XHJcbiAgICBSb29tczogUm9vbVtdO1xyXG4gICAgUGxheWVyID0gbmV3IFBsYXllcigpO1xyXG5cclxuICAgIEl0ZW1GYWN0b3J5OiBJdGVtRmFjdG9yeTtcclxuICAgIENoYXJhY3RlckZhY3Rvcnk6IENoYXJhY3RlckZhY3Rvcnk7XHJcbiAgICBSb29tRmFjdG9yeTogUm9vbUZhY3Rvcnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5OYW1lID0gJyc7XHJcbiAgICAgICAgdGhpcy5TdGFydGluZ1Jvb20gPSAwO1xyXG4gICAgICAgIHRoaXMuUm9vbXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5JdGVtRmFjdG9yeSA9IG5ldyBJdGVtRmFjdG9yeSgpO1xyXG4gICAgICAgIHRoaXMuQ2hhcmFjdGVyRmFjdG9yeSA9IG5ldyBDaGFyYWN0ZXJGYWN0b3J5KCk7XHJcbiAgICAgICAgdGhpcy5Sb29tRmFjdG9yeSA9IG5ldyBSb29tRmFjdG9yeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRHYW1lKHNhdmVkR2FtZTogR2FtZU1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5OYW1lID0gc2F2ZWRHYW1lLk5hbWU7XHJcbiAgICAgICAgdGhpcy5TdGFydGluZ1Jvb20gPSBzYXZlZEdhbWUuU3RhcnRpbmdSb29tO1xyXG4gICAgICAgIGZvciAobGV0IHJvb21JZCBpbiBzYXZlZEdhbWUuUm9vbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5Sb29tc1tyb29tSWRdID0gbmV3IFJvb20oKTtcclxuICAgICAgICAgICAgdGhpcy5Sb29tc1tyb29tSWRdLmxvYWRGcm9tU2F2ZShzYXZlZEdhbWUuUm9vbXNbcm9vbUlkXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuUGxheWVyID0gbmV3IFBsYXllcigpO1xyXG4gICAgICAgIHRoaXMuUGxheWVyLmxvYWRGcm9tU2F2ZShzYXZlZEdhbWUuUGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Um9vbShyb29tSWQ6IG51bWJlcik6IFJvb20ge1xyXG4gICAgICAgIGxldCByb29tID0gdGhpcy5Sb29tc1tyb29tSWRdO1xyXG4gICAgICAgIGlmIChyb29tID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm9vbVRlbXBsYXRlID0gR2FtZURhdGEuUm9vbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZShyb29tSWQpO1xyXG4gICAgICAgICAgICByb29tID0gdGhpcy5Sb29tc1tyb29tSWRdID0gdGhpcy5Sb29tRmFjdG9yeS5zcGF3blJvb20ocm9vbVRlbXBsYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5Sb29tRmFjdG9yeS5sb2FkRnJvbURhdGEocm9vbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb29tO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYXduSXRlbShpdGVtRGVmaW5pdGlvbjogYW55KTogSXRlbSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkl0ZW1GYWN0b3J5LnNwYXduSXRlbShpdGVtRGVmaW5pdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25DaGFyYWN0ZXIoY2hhcmFjdGVySWQ6IHN0cmluZyk6IENoYXJhY3RlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hhcmFjdGVyRmFjdG9yeS5zcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbVR5cGUoaXRlbVR5cGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBHYW1lRGF0YS5JdGVtVHlwZXMuZ2V0SXRlbVR5cGUoaXRlbVR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnZva2VHbG9iYWxFdmVudChuYW1lOiBzdHJpbmcsIGFyZ3M6IEdsb2JhbEV2ZW50QXJncyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBldmVudCA9IEdsb2JhbEV2ZW50c1tuYW1lXTtcclxuICAgICAgICBpZiAoZXZlbnQgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgZXZlbnQgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJHbG9iYWwgZXZlbnQgd2l0aCBuYW1lIHswfSBkb2Vzbid0IGV4aXN0XCIuZm9ybWF0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50KGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENoYXJhY3RlclRlbXBsYXRlcyB9IGZyb20gJy4vQ2hhcmFjdGVyVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgSXRlbVRlbXBsYXRlcyB9IGZyb20gJy4vSXRlbVRlbXBsYXRlcyc7XHJcbmltcG9ydCB7IEl0ZW1UeXBlcyB9IGZyb20gJy4vSXRlbVR5cGVzJztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlcyB9IGZyb20gJy4vUm9vbVRlbXBsYXRlcyc7XHJcblxyXG5jbGFzcyBHYW1lRGF0YU1vZGVsIHtcclxuICAgIEl0ZW1UeXBlczogSXRlbVR5cGVzO1xyXG4gICAgSXRlbVRlbXBsYXRlczogSXRlbVRlbXBsYXRlcztcclxuICAgIENoYXJhY3RlclRlbXBsYXRlczogQ2hhcmFjdGVyVGVtcGxhdGVzO1xyXG4gICAgUm9vbVRlbXBsYXRlczogUm9vbVRlbXBsYXRlcztcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuSXRlbVR5cGVzID0gbmV3IEl0ZW1UeXBlcyh1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuSXRlbVRlbXBsYXRlcyA9IG5ldyBJdGVtVGVtcGxhdGVzKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJUZW1wbGF0ZXMgPSBuZXcgQ2hhcmFjdGVyVGVtcGxhdGVzKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5Sb29tVGVtcGxhdGVzID0gbmV3IFJvb21UZW1wbGF0ZXModW5kZWZpbmVkKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBHYW1lRGF0YSA9IG5ldyBHYW1lRGF0YU1vZGVsKCk7XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHbG9iYWxFdmVudEFyZ3Mge1xyXG4gICAgVHlwZTogbnVtYmVyO1xyXG4gICAgU2VuZGVyOiBhbnk7XHJcbiAgICBUZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaztcclxuICAgIENvbnRpbnVlQ29tbWFuZENhbGxiYWNrOiBGdW5jdGlvbjtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHR5cGU6IG51bWJlcixcclxuICAgICAgICBzZW5kZXI6IGFueSxcclxuICAgICAgICB0ZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjayxcclxuICAgICAgICBjb250aW51ZUNvbW1hbmRDYWxsYmFjazogRnVuY3Rpb24sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLlR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuU2VuZGVyID0gc2VuZGVyO1xyXG4gICAgICAgIHRoaXMuVGVybWluYXRlQ29tbWFuZENhbGxiYWNrID0gdGVybWluYXRlQ29tbWFuZENhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuQ29udGludWVDb21tYW5kQ2FsbGJhY2sgPSBjb250aW51ZUNvbW1hbmRDYWxsYmFjaztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XG5pbXBvcnQgeyBJdGVtVHlwZSwgSXRlbVR5cGVIZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9JdGVtVHlwZSc7XG5pbXBvcnQgeyBFbnRpdHlCYXNlIH0gZnJvbSAnLi9FbnRpdHlCYXNlJztcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XG5pbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XG5pbXBvcnQgeyBJdGVtTG9jayB9IGZyb20gJy4vSXRlbUxvY2snO1xuaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vR2FtZURhdGEnO1xuXG5leHBvcnQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eUJhc2Uge1xuICAgIFN0YWNrPzogbnVtYmVyO1xuICAgIEludmVudG9yeT86IEl0ZW1MaXN0O1xuICAgIExvY2s/OiBJdGVtTG9jaztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGVtcGxhdGUoKTogSXRlbVRlbXBsYXRlIHtcbiAgICAgICAgcmV0dXJuIEdhbWVEYXRhLkl0ZW1UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGhpcy5JZCk7XG4gICAgfVxuXG4gICAgZ2V0TmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmdldFRlbXBsYXRlKCkuTmFtZTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RhY2thYmxlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lW2dyYW1tYUNhc2VdICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0YWNrKCkgKyAnICcgKyB0aGlzLmdldFBsdXJhbE5hbWUoZ3JhbW1hQ2FzZSkgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGx1cmFsTmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmdldFRlbXBsYXRlKCkuTmFtZTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG5hbWVbMF0pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZVtncmFtbWFDYXNlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5nZXRTdGFjaygpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZVswXVtncmFtbWFDYXNlXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVbMV1bZ3JhbW1hQ2FzZV07XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVbMl1bZ3JhbW1hQ2FzZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREZXNjcmlwdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5EZXNjcmlwdGlvbiArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XG4gICAgfVxuXG4gICAgZ2V0SWRsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0VGVtcGxhdGUoKS5JZGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBMb2NhbC5Db21tYW5kcy5Mb29rLkRlZmF1bHRJZGxlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuSWRsZSE7XG4gICAgfVxuXG4gICAgaXNMaWdodFNvdXJjZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5Jc0xpZ2h0U291cmNlID09PSB0cnVlO1xuICAgIH1cblxuICAgIGlzU3RhY2thYmxlKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLklzU3RhY2thYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLklzU3RhY2thYmxlO1xuICAgIH1cblxuICAgIGdldFN0YWNrKCkge1xuICAgICAgICBpZiAodGhpcy5TdGFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5TdGFjaztcbiAgICB9XG5cbiAgICBzZXRTdGFjayh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RhY2thYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuU3RhY2sgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFN0YWNrKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGFja2FibGUoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuU3RhY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuU3RhY2sgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5TdGFjayArPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFR5cGUoKSB7XG4gICAgICAgIHJldHVybiBJdGVtVHlwZUhlbHBlci5wYXJzZSh0aGlzLmdldFRlbXBsYXRlKCkuVHlwZSk7XG4gICAgfVxuXG4gICAgaXNUYWtlYWJsZSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGF0aWM6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXRpY0NvbnRhaW5lcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTGV2ZXI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEludmVudG9yeSgpOiBJdGVtTGlzdCB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5JbnZlbnRvcnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuSW52ZW50b3J5O1xuICAgIH1cblxuICAgIGlzQ29udGFpbmVyKCkge1xuICAgICAgICBsZXQgdHlwZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKS5UeXBlO1xuICAgICAgICByZXR1cm4gdHlwZSA9PSBJdGVtVHlwZS5Db250YWluZXIgfHwgdHlwZSA9PSBJdGVtVHlwZS5TdGF0aWNDb250YWluZXI7XG4gICAgfVxuXG4gICAgaXNMb2NrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkxvY2s/LklzTG9ja2VkID09PSB0cnVlO1xuICAgIH1cblxuICAgIHNldElzTG9ja2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLkxvY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5Mb2NrLklzTG9ja2VkID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgRW50aXR5TGlzdCB9IGZyb20gJy4vRW50aXR5TGlzdCc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1MaXN0IGV4dGVuZHMgRW50aXR5TGlzdDxJdGVtPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZExpc3Q6IEl0ZW1MaXN0KSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IHNhdmVkTGlzdC5BcnJheS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld0l0ZW0gPSBuZXcgSXRlbSgpO1xyXG4gICAgICAgICAgICBuZXdJdGVtLmxvYWRGcm9tU2F2ZShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGl0ZW06IEl0ZW0gfCBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbS5pc1N0YWNrYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1N0YWNrID0gR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZmluZEJ5SWQoaXRlbS5JZCk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1N0YWNrICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ1N0YWNrLmFkZFN0YWNrKGl0ZW0uZ2V0U3RhY2soKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIuYWRkKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5LnNvbWUoKGkpID0+IGkuaXNMaWdodFNvdXJjZSgpID09PSB0cnVlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMb2NrVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ29tbW9uJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVtTG9jayB7XHJcbiAgICBJc0xvY2tlZDogYm9vbGVhbjtcclxuICAgIEtleUlkOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZTogTG9ja1RlbXBsYXRlKSB7XHJcbiAgICAgICAgdGhpcy5Jc0xvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5LZXlJZCA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgdGVtcGxhdGUpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEl0ZW1UZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9JdGVtVGVtcGxhdGUnO1xyXG5cclxuY2xhc3MgSXRlbVRlbXBsYXRlc0xpc3Qge1xyXG4gICAgW3RlbXBsYXRlSWQ6IHN0cmluZ106IEl0ZW1UZW1wbGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1UZW1wbGF0ZXMge1xyXG4gICAgbGlzdDogSXRlbVRlbXBsYXRlc0xpc3QgPSBuZXcgSXRlbVRlbXBsYXRlc0xpc3QoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpdGVtVGVtcGxhdGVzOiBJdGVtVGVtcGxhdGVbXSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChpdGVtVGVtcGxhdGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW1UZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHRlbXBsYXRlcyBtdXN0IGJlIGFuIGFycmF5JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW1UZW1wbGF0ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3SXRlbVRlbXBsYXRlKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGROZXdJdGVtVGVtcGxhdGUoaXRlbVRlbXBsYXRlOiBJdGVtVGVtcGxhdGUpIHtcclxuICAgICAgICBpZiAodGhpcy5saXN0W2l0ZW1UZW1wbGF0ZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0ZW1wbGF0ZSB7MH0gaXMgYWxyZWFkeSBkZWZpbmVkIScuZm9ybWF0KGl0ZW1UZW1wbGF0ZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGlzdFtpdGVtVGVtcGxhdGUuSWRdID0gaXRlbVRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKGl0ZW1JZDogc3RyaW5nKTogSXRlbVRlbXBsYXRlIHtcclxuICAgICAgICBpZiAodGhpcy5saXN0W2l0ZW1JZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gaXRlbSB0ZW1wbGF0ZSBkZWZpbmVkIGZvciB7MH0hJy5mb3JtYXQoaXRlbUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdFtpdGVtSWRdO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBJdGVtVHlwZXMge1xyXG4gICAgW2l0ZW1UeXBlSWQ6IHN0cmluZ106IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1UeXBlc1RlbXBsYXRlOiBhbnkgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoaXRlbVR5cGVzVGVtcGxhdGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbVR5cGVzVGVtcGxhdGUpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHR5cGVzIHRlbXBsYXRlIG11c3QgYmUgYW4gYXJyYXknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbVR5cGVzVGVtcGxhdGUuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuQWRkTmV3SXRlbVR5cGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIEFkZE5ld0l0ZW1UeXBlKGl0ZW1UeXBlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpc1tpdGVtVHlwZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0eXBlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoaXRlbVR5cGUuSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzW2l0ZW1UeXBlLklkXSA9IGl0ZW1UeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIEdldEl0ZW1UeXBlKGl0ZW1UeXBlTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaXRlbVR5cGVOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHR5cGUgJyArIGl0ZW1UeXBlTmFtZSArICcgaXMgbm90IGRlZmluZWQhJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbaXRlbVR5cGVOYW1lXTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi9DaGFyYWN0ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIENoYXJhY3RlciB7XHJcbiAgICBMb2NhdGlvbjogbnVtYmVyID0gMDtcclxuICAgIFByZXZpb3VzTG9jYXRpb246IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRQbGF5ZXI6IFBsYXllcikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRQbGF5ZXIpO1xyXG4gICAgICAgIHN1cGVyLmxvYWRGcm9tU2F2ZShzYXZlZFBsYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYXRpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Mb2NhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMb2NhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5Mb2NhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByZXZpb3VzTG9jYXRpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5QcmV2aW91c0xvY2F0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByZXZpb3VzTG9jYXRpb24odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuUHJldmlvdXNMb2NhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNhblNlZSgpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbSh0aGlzLkxvY2F0aW9uKTtcclxuICAgICAgICByZXR1cm4gcm9vbS5oYXNMaWdodFNvdXJjZSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uSGVscGVyIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyTGlzdCB9IGZyb20gJy4vQ2hhcmFjdGVyTGlzdCc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IFJvb21FeGl0IH0gZnJvbSAnLi9Sb29tRXhpdCc7XHJcbmltcG9ydCB7IFJvb21FeGl0c0xpc3QgfSBmcm9tICcuL1Jvb21FeGl0c0xpc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb20ge1xyXG4gICAgSWQ6IG51bWJlciA9IDA7XHJcbiAgICBFeGl0czogUm9vbUV4aXRzTGlzdCA9IG5ldyBSb29tRXhpdHNMaXN0KCk7XHJcbiAgICBJc1Zpc2l0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEl0ZW1zOiBJdGVtTGlzdCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgQ2hhcmFjdGVyczogQ2hhcmFjdGVyTGlzdCA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZFJvb206IFJvb20pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkUm9vbSk7XHJcbiAgICAgICAgdGhpcy5FeGl0cyA9IG5ldyBSb29tRXhpdHNMaXN0KCk7XHJcbiAgICAgICAgZm9yIChsZXQgZXhpdEtleSBpbiBzYXZlZFJvb20uRXhpdHMpIHtcclxuICAgICAgICAgICAgdGhpcy5FeGl0c1tleGl0S2V5XSA9IG5ldyBSb29tRXhpdCgpO1xyXG4gICAgICAgICAgICB0aGlzLkV4aXRzW2V4aXRLZXldLmxvYWRGcm9tU2F2ZShzYXZlZFJvb20uRXhpdHNbZXhpdEtleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkl0ZW1zID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgdGhpcy5JdGVtcy5sb2FkRnJvbVNhdmUoc2F2ZWRSb29tLkl0ZW1zKTtcclxuICAgICAgICB0aGlzLkNoYXJhY3RlcnMgPSBuZXcgQ2hhcmFjdGVyTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuQ2hhcmFjdGVycy5sb2FkRnJvbVNhdmUoc2F2ZWRSb29tLkNoYXJhY3RlcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzLmdldFRlbXBsYXRlKHRoaXMuSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuRGVzY3JpcHRpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hhcmFjdGVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5DaGFyYWN0ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4aXQoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiBSb29tRXhpdCB8IG51bGwge1xyXG4gICAgICAgIGlmICh0aGlzLkV4aXRzW2RpcmVjdGlvbl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRXhpdHNbZGlyZWN0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeGl0c0RpcmVjdGlvbnMoKTogRGlyZWN0aW9uW10ge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3Rpb25IZWxwZXIucGFyc2VBcnJheShPYmplY3Qua2V5cyh0aGlzLkV4aXRzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VGVtcGxhdGUoKS5Jc05hdHVyYWxMaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0SXRlbXMoKS5oYXNMaWdodFNvdXJjZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGFyYWN0ZXJzKCkuaGFzTGlnaHRTb3VyY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPbkZpcnN0RW50ZXJFdmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLk9uRmlyc3RFbnRlckV2ZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuT25GaXJzdEVudGVyRXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T25FbnRlckV2ZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldFRlbXBsYXRlKCkuT25FbnRlckV2ZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuT25FbnRlckV2ZW50O1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBSb29tRG9vciB7XHJcbiAgICBJc0xvY2tlZD86IGJvb2xlYW47XHJcbiAgICBJc0Nsb3NlZD86IGJvb2xlYW47XHJcbiAgICBLZXlJZD86IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWREb29yOiBSb29tRG9vcikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWREb29yKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSb29tRG9vciB9IGZyb20gJy4vUm9vbURvb3InO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21FeGl0IHtcclxuICAgIFJvb21JZDogbnVtYmVyID0gMDtcclxuICAgIElzSGlkZGVuPzogYm9vbGVhbjtcclxuICAgIERvb3I/OiBSb29tRG9vcjtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRFeGl0OiBSb29tRXhpdCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRFeGl0KTtcclxuICAgICAgICBpZiAoc2F2ZWRFeGl0LkRvb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLkRvb3IgPSBuZXcgUm9vbURvb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5Eb29yLmxvYWRGcm9tU2F2ZShzYXZlZEV4aXQuRG9vcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFJvb21JZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Sb29tSWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEb29yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkRvb3IgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBpc0Nsb3NlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yPy5Jc0Nsb3NlZCA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0xvY2tlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yPy5Jc0xvY2tlZCA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0hpZGRlbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5Jc0hpZGRlbiA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRLZXlJZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5Eb29yPy5LZXlJZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5Eb29yLktleUlkITtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBSb29tRXhpdCB9IGZyb20gJy4vUm9vbUV4aXQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21FeGl0c0xpc3Qge1xyXG4gICAgW2RpcmVjdGlvbjogc3RyaW5nXTogUm9vbUV4aXQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgUm9vbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL1Jvb21UZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUm9vbVRlbXBsYXRlcyB7XHJcbiAgICBbdGVtcGxhdGVJZDogbnVtYmVyXTogUm9vbVRlbXBsYXRlO1xyXG4gICAgVGVtcGxhdGVzOiBSb29tVGVtcGxhdGVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJvb21UZW1wbGF0ZXM/OiBhbnkpIHtcclxuICAgICAgICBpZiAocm9vbVRlbXBsYXRlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShyb29tVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnUm9vbSB0ZW1wbGF0ZXMgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb29tVGVtcGxhdGVzLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Jvb21UZW1wbGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTmV3Um9vbVRlbXBsYXRlKHJvb21UZW1wbGF0ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXNbcm9vbVRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdSb29tIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQocm9vbVRlbXBsYXRlLklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpc1tyb29tVGVtcGxhdGUuSWRdID0gcm9vbVRlbXBsYXRlO1xyXG4gICAgICAgIHRoaXMuVGVtcGxhdGVzW3Jvb21UZW1wbGF0ZS5JZF0gPSByb29tVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUocm9vbUlkOiBudW1iZXIpOiBSb29tVGVtcGxhdGUge1xyXG4gICAgICAgIGlmICh0aGlzW3Jvb21JZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gUm9vbSB0ZW1wbGF0ZSBkZWZpbmVkIGZvciBJZCB7MH0hJy5mb3JtYXQocm9vbUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbcm9vbUlkXTtcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgUHJvbXB0IH0gZnJvbSAnLi9jb21tb25Mb2dpYy9Qcm9tcHQnO1xyXG5pbXBvcnQgeyBJbml0Q29tbWFuZHMgfSBmcm9tICcuL2NvbW1hbmRzVXRpbHMvSW5pdENvbW1hbmRzJztcclxuaW1wb3J0IHsgR2FtZSwgSW5pdEdhbWVEYXRhLCBWZXJzaW9uIH0gZnJvbSAnLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgJy4vY29tbW9uTG9naWMvSW5wdXRGdW5jdGlvbnMnO1xyXG5pbXBvcnQgJy4vY29tbW9uTG9naWMvU3RyaW5nVXRpbHMnO1xyXG5cclxuZnVuY3Rpb24gSW5pdCgpIHtcclxuICAgIEluaXRHYW1lRGF0YSgpO1xyXG4gICAgSW5pdENvbW1hbmRzKCk7XHJcbiAgICBFbmdpbmUuT3V0cHV0KCdEdW5nZW9uIENyYXdsZXIgMiwgd2Vyc2phOicpO1xyXG4gICAgRW5naW5lLk91dHB1dChWZXJzaW9uKTtcclxuICAgIENvbW1hbmRzLkdvLmNoYW5nZVBsYXllckxvY2F0aW9uKFxyXG4gICAgICAgIEdhbWUuZ2V0Um9vbShHYW1lLlN0YXJ0aW5nUm9vbSksXHJcbiAgICAgICAgbmV3IENvbW1hbmRDYWxsYmFjaygoKSA9PiB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoJycpO1xyXG4gICAgICAgICAgICBQcm9tcHQuUHJpbnQoKTtcclxuICAgICAgICB9KSxcclxuICAgICk7XHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGZ1bmN0aW9uIEluaXQoKTogdm9pZDtcclxufVxyXG5nbG9iYWxUaGlzLkluaXQgPSBJbml0O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=