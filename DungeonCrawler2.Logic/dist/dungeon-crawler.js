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
            var _a;
            if (!firstExit) {
                returnString += ', ';
            }
            firstExit = false;
            returnString += Direction_1.DirectionHelper.getLocale(direction);
            if ((_a = room.getExit(direction)) === null || _a === void 0 ? void 0 : _a.isClosed()) {
                returnString += '*';
            }
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

module.exports = /*#__PURE__*/JSON.parse('{"Local":{"Directions":{"north":["północ","północy","północy","północ","północą","północy","północy"],"south":["południe","południa","południu","południe","południem","południu","południu"],"east":["wschód","wschodu","wschodowi","wschód","wschodem","wschodzie","wschodzie"],"west":["zachód","zachodu","zachodowi","zachód","zachodem","zachodzie","zachodzie"],"up":["góra","góry","górze","górę","górą","górze","góro"],"down":["dół","dołu","dołowi","dół","dołem","dole","dole"]},"Stats":{"HealthLevels":{"Full":"w pełni zdrowia","LightWounds":"lekko ranny","MediumWounds":"średnio rany","SeriousWounds":"poważnie ranny","HeavyWounds":"ciężko ranny","NearDeath":"bliski śmierci","Dead":"martwy"}},"Commands":{"Drop":{"NoArgument":"Co chcesz wyrzucić?","NoItems":"Przecież nic nie masz biedaku.","NoItemFound":"Nie masz czegoś takiego jak {0}.","Dropped":"Upuszczasz {0}."},"Exam":{"NoArgument":"Czemu chcesz się przyjęć?","NoObject":"Nie znajdujesz niczego takiego jak {0}.","Contains":"Zawiera w sobie:","LockedContainer":"Pojemnik jest zamknięty.","HealthLevel":"{0} jest {1}."},"Go":{"WrongDirection":"Może lepiej zostać tutaj i zjeść kilka pierogów?","NoPassage":"Nie możesz tam pójść.","PassageClosed":"Przejście jest zamknięte."},"Inventory":{"YourItems":"Obecnie przy sobie posiadasz:","NoItems":"{0}Ogólnie nic"},"Load":{"Loading":"Ładowanie gry...","Loaded":"Gra została załadowana."},"Look":{"CantSee":"Nic nie widzisz w tej ciemności.","NoObject":"Tu nie ma nic takiego jak {0}.","YouLookAt":"Przyglądasz się {0}.","Exits":"Wyjścia","DefaultIdle":"leży na ziemi"},"NoCommand":{"NoCommand":"Chyba ty."},"Save":{"Saved":"Gra została zapisana."},"Scan":{"CantSee":"Nic nie widzisz w tej ciemności.","LookingAroundYouSee":"Rozglądając się dookoła dostrzegasz:","Here":"Tutaj:","InDirection":"Na {0}:","NoOneThere":"nikogo nie ma","ClosedDoor":"zamknięte drzwi"},"Take":{"NoArgument":"Wziąć co?","NoItems":"Nic tu nie ma.","NoItemFound":"Tutaj nie ma czegoś takiego jak {0}.","NoItemFoundInContainer":"{0} nie zawiera czegoś takiego jak {1}.","CannotPickUp":"Nie możesz podnieść {0}.","PickedUp":"Podnosisz {0}.","ContainerIsLocked":"{0} jest zamknięty.","IsNoContainer":"{0} nie jest pojemnikiem.","TakeItemFromContainer":"Wyjmujesz {0} z {1}."}},"GlobalEvents":{"TestGlobalEvent":{"Message":"Testing global events..."}}}}');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNOLENBQUM7QUFLRCxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9HbG9iYWxFdmVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luaXRHYW1lRGF0YS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvQ29tbWFuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRG93bi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRHJvcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRWFzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRXZhbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvRXhhbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvR28udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL0ludmVudG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvSnNvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTG9hZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTG9vay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvTm9Db21tYW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Ob3J0aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvUmVsb2FkLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9TYXZlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9TY2FuLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Tb3V0aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvVGFrZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvVGVzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvVXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1dlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFRyZWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kc1V0aWxzL0luaXRDb21tYW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvRW5naW5lVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL0lucHV0RnVuY3Rpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9Qcm9tcHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL1JhbmRvbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvU3RyaW5nVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0RpcmVjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRW51bUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvRXF1aXBtZW50U2xvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvR2xvYmFsRXZlbnRUeXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9HcmFtbWFDYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9JdGVtVHlwZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL0NoYXJhY3RlckZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZhY3Rvcmllcy9JdGVtRmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZmFjdG9yaWVzL1Jvb21GYWN0b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9DaGFyYWN0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3Rlckxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3RlclN0YXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9DaGFyYWN0ZXJUZW1wbGF0ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VudGl0eUJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VudGl0eUxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0VxdWlwbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2FtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvR2FtZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0dsb2JhbEV2ZW50QXJncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvSXRlbUxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW1Mb2NrLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbURvb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1Jvb21FeGl0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tRXhpdHNMaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9Sb29tVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvSW5pdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbmdpbmVVdGlscyB9IGZyb20gJy4vY29tbW9uTG9naWMvRW5naW5lVXRpbHMnO1xyXG5pbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2xvYmFsRXZlbnRBcmdzIH0gZnJvbSAnLi9tb2RlbC9HbG9iYWxFdmVudEFyZ3MnO1xyXG5cclxuY2xhc3MgR2xvYmFsRXZlbnRzQ2xhc3Mge1xyXG4gICAgLy8gSWYgZ2xvYmFsIGV2ZW50cyByZXR1cm5zIHRydWUsIGl0IHNpZ25hbHMgaW50ZXJydXB0aW9uIG9mIGNvbW1hbmQgZXhlY3V0aW9uIGZsb3dcclxuICAgIC8vIHN1Y2ggZXZlbnQgbXVzdCBjYWxsIG9uZSBvZiB0aGUgc3VwcGxpZWQgY2FsbGJhY2tzOlxyXG4gICAgLy8gLSBhcmdzLkNvbnRpbnVlQ29tbWFuZENhbGxiYWNrIGlmIHRoZSBldmVudCBkZWNpZGVzIGl0IHdhbnQgdG8gcmVzdW1lIHRoZSBleGVjdXRpb24gXHJcbiAgICAvLyAgICAgIG9mIHRoZSBjb21tYW5kIGl0IHdhcyBpbnZva2VkIGJ5XHJcbiAgICAvLyAtIGFyZ3MuRmluaXNoQ29tbWFuZENhbGxiYWNrIGlmIHRoZSBldmVudCBkZWNpZGVzIHRvIHRlcm1pbmF0ZSB0aGUgZXhlY3V0aW9uIFxyXG4gICAgLy8gICAgICBvZiB0aGUgY29tbWFuZCBpdCB3YXMgaW52b2tlZCBieVxyXG4gICAgW2dsb2JhbEV2ZW50TmFtZTogc3RyaW5nXTogKGFyZ3M6IEdsb2JhbEV2ZW50QXJncykgPT4gYm9vbGVhbjtcclxuICAgIFRlc3RHbG9iYWxFdmVudChhcmdzOiBHbG9iYWxFdmVudEFyZ3MpIHtcclxuICAgICAgICBFbmdpbmVVdGlscy5PdXRwdXRQcmludGVyKExvY2FsLkdsb2JhbEV2ZW50cy5UZXN0R2xvYmFsRXZlbnQuTWVzc2FnZSwgYXJncy5Db250aW51ZUNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR2xvYmFsRXZlbnRzID0gbmV3IEdsb2JhbEV2ZW50c0NsYXNzKCk7XHJcbiIsImltcG9ydCB7IEl0ZW1UeXBlcyB9IGZyb20gJy4uL3Jlcy9JdGVtVHlwZXMuanNvbic7XHJcbmltcG9ydCB7IEl0ZW1zVGVtcGxhdGVzIH0gZnJvbSAnLi4vcmVzL0l0ZW1zLmpzb24nO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJzVGVtcGxhdGVzIH0gZnJvbSAnLi4vcmVzL0NoYXJhY3RlcnMuanNvbic7XHJcbmltcG9ydCB7IExvY2FsIGFzIExvY2FsUGwgfSBmcm9tICcuLi9yZXMvTG9jYWwucGwuanNvbic7XHJcbmltcG9ydCB7IEdhbWVUZW1wbGF0ZSB9IGZyb20gJy4uL3Jlcy9HYW1lLmpzb24nO1xyXG5pbXBvcnQgeyBHYW1lTW9kZWwgfSBmcm9tICcuL21vZGVsL0dhbWUnO1xyXG5pbXBvcnQgeyBJdGVtVHlwZXMgYXMgSXRlbVR5cGVzTGlzdCB9IGZyb20gJy4vbW9kZWwvSXRlbVR5cGVzJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9DaGFyYWN0ZXJUZW1wbGF0ZXMnO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGVzIH0gZnJvbSAnLi9tb2RlbC9JdGVtVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL21vZGVsL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgUm9vbVRlbXBsYXRlcyB9IGZyb20gJy4vbW9kZWwvUm9vbVRlbXBsYXRlcyc7XHJcblxyXG5leHBvcnQgdmFyIExvY2FsID0gTG9jYWxQbDtcclxuZXhwb3J0IHZhciBHYW1lOiBHYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbmV4cG9ydCB2YXIgVmVyc2lvbiA9ICcnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEluaXRHYW1lRGF0YSgpIHtcclxuICAgIEdhbWUgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbiAgICBHYW1lRGF0YS5JdGVtVHlwZXMgPSBuZXcgSXRlbVR5cGVzTGlzdChJdGVtVHlwZXMpO1xyXG4gICAgR2FtZURhdGEuSXRlbVRlbXBsYXRlcyA9IG5ldyBJdGVtVGVtcGxhdGVzKEl0ZW1zVGVtcGxhdGVzKTtcclxuICAgIEdhbWVEYXRhLkNoYXJhY3RlclRlbXBsYXRlcyA9IG5ldyBDaGFyYWN0ZXJUZW1wbGF0ZXMoQ2hhcmFjdGVyc1RlbXBsYXRlcyk7XHJcbiAgICBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzID0gbmV3IFJvb21UZW1wbGF0ZXMoR2FtZVRlbXBsYXRlLlJvb21zKTtcclxuICAgIFZlcnNpb24gPSBFbmdpbmUuTG9hZERhdGEoJ3ZlcnNpb24udHh0JykucmVwbGFjZSgnXFxuJywgRW5naW5lLkVuZExpbmUpO1xyXG5cclxuICAgIEdhbWUuUGxheWVyLkxvY2F0aW9uID0gR2FtZS5TdGFydGluZ1Jvb207XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMb2FkR2FtZShzYXZlZEdhbWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgZ2FtZSA9IEpTT04ucGFyc2Uoc2F2ZWRHYW1lKSBhcyBHYW1lTW9kZWw7XHJcbiAgICBHYW1lID0gbmV3IEdhbWVNb2RlbCgpO1xyXG4gICAgR2FtZS5sb2FkR2FtZShnYW1lKTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1hbmQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIEV4ZWN1dGUoY29tbWFuZDogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLkV4ZWN1dGVCb2R5KGNvbW1hbmQsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICAgICAgaWYgKCFjb21tYW5kQ2FsbGJhY2suaW50ZXJydXB0Rmxvdykge1xyXG4gICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2suQ2FsbElmTm90Q2FsbGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7fVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEb3duIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfY29tbWFuZDogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5kb3duLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEcm9wIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLk5vQXJndW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnQudG9Mb3dlckNhc2UoKSA9PT0gJ2FsbCcpIHtcclxuICAgICAgICAgICAgaWYgKCFHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLk5vSXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRyb3BBbGwoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQsIGNvbW1hbmQuZ2V0TnVtYmVyKDEpKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRHJvcC5Ob0l0ZW1Gb3VuZC5mb3JtYXQoYXJndW1lbnQpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kcm9wSXRlbShpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJvcEFsbCgpIHtcclxuICAgICAgICB3aGlsZSAoR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuYW55KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5kcm9wSXRlbShHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5lbGVtZW50QXQoMCkhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJvcEl0ZW0oaXRlbTogSXRlbSkge1xyXG4gICAgICAgIEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLnJlbW92ZShpdGVtKTtcclxuICAgICAgICBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCkuYWRkKGl0ZW0pO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRHJvcC5Ecm9wcGVkLmZvcm1hdChpdGVtLmdldE5hbWUoR3JhbW1hQ2FzZS5CaWVybmlrKSkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFYXN0IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLmVhc3QsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBHYW1lIGFzIEdhbWVWYXIgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2YWwgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnYW1lID0gR2FtZVZhcjtcclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChldmFsKGFyZ3VtZW50KSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuLi9tb2RlbC9DaGFyYWN0ZXInO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBUYWtlIH0gZnJvbSAnLi9UYWtlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFeGFtIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGNvbW1hbmQuZ2V0TnVtYmVyKDEpO1xyXG5cclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLk5vQXJndW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gcm9vbS5nZXRDaGFyYWN0ZXJzKCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhhbUNoYXJhY3RlcihjaGFyYWN0ZXIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXRlbSA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5leGFtSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbSA9IHJvb20uZ2V0SXRlbXMoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhhbUl0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuRXhhbS5Ob09iamVjdC5mb3JtYXQoYXJndW1lbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICBleGFtQ2hhcmFjdGVyKGNoYXJhY3RlcjogQ2hhcmFjdGVyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoY2hhcmFjdGVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KGNoYXJhY3Rlci5nZXREZXNjcmlwdGlvbigpKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBMb2NhbC5Db21tYW5kcy5FeGFtLkhlYWx0aExldmVsLmZvcm1hdChcclxuICAgICAgICAgICAgICAgIGNoYXJhY3Rlci5nZXROYW1lKCkuc3RhcnRXaXRoVXBwZXIoKSxcclxuICAgICAgICAgICAgICAgIGNoYXJhY3Rlci5nZXRIZWFsdGhMZXZlbCh0cnVlKSxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vVE9ETzogZWt3aXB1bmVrXHJcbiAgICB9XHJcbiAgICBleGFtSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChpdGVtLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgICAgIGlmIChpdGVtLmlzQ29udGFpbmVyKCkpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uaXNMb2NrZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLkxvY2tlZENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5FeGFtLkNvbnRhaW5zKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW1zID0gaXRlbS5nZXRJbnZlbnRvcnkoKSE7XHJcbiAgICAgICAgICAgIGlmIChpdGVtcy5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChpdGVtcy5wcmludFNob3J0Rm9ybWF0KCkpO1xyXG4gICAgICAgICAgICAgICAgQ29tbWFuZHMuVGFrZS50YWtlQWxsR29sZChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuSW52ZW50b3J5Lk5vSXRlbXMuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudFR5cGUgfSBmcm9tICcuLi9lbnVtcy9HbG9iYWxFdmVudFR5cGUnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50QXJncyB9IGZyb20gJy4uL21vZGVsL0dsb2JhbEV2ZW50QXJncyc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgR28gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gRGlyZWN0aW9uSGVscGVyLnBhcnNlU2hvcnQoYXJndW1lbnQudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5Xcm9uZ0RpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ29Ub0RpcmVjdGlvbihkaXJlY3Rpb24sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgZ29Ub0RpcmVjdGlvbihkaXJlY3Rpb246IGFueSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZXhpdCA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKS5nZXRFeGl0KGRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChleGl0ID09PSBudWxsIHx8IGV4aXQuaXNIaWRkZW4oKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkdvLk5vUGFzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChleGl0LmlzQ2xvc2VkKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5QYXNzYWdlQ2xvc2VkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld1Jvb20gPSBHYW1lLmdldFJvb20oZXhpdC5nZXRSb29tSWQoKSk7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuc2V0UHJldmlvdXNMb2NhdGlvbihHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVBsYXllckxvY2F0aW9uKG5ld1Jvb20sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGxheWVyTG9jYXRpb24ocm9vbTogUm9vbSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBHYW1lLlBsYXllci5Mb2NhdGlvbiA9IHJvb20uSWQ7XHJcblxyXG4gICAgICAgIHRoaXMub25GaXJzdEVudGVyR2xvYmFsRXZlbnRzKFxyXG4gICAgICAgICAgICByb29tLFxyXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmFmdGVyT25GaXJzdEVudGVyR2xvYmFsRXZlbnRzKHJvb20sIGNvbW1hbmRDYWxsYmFjayksXHJcbiAgICAgICAgICAgIGNvbW1hbmRDYWxsYmFjayxcclxuICAgICAgICApO1xyXG4gICAgICAgIHJvb20uSXNWaXNpdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkZpcnN0RW50ZXJHbG9iYWxFdmVudHMocm9vbTogUm9vbSwgY29udGludWVDYWxsYmFjazogRnVuY3Rpb24sIHRlcm1pbmF0ZUNhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocm9vbS5nZXRPbkZpcnN0RW50ZXJFdmVudCgpICE9PSBudWxsICYmICFyb29tLklzVmlzaXRlZCkge1xyXG4gICAgICAgICAgICBsZXQgaW50ZXJydXB0ID0gR2FtZS5pbnZva2VHbG9iYWxFdmVudChcclxuICAgICAgICAgICAgICAgIHJvb20uZ2V0T25GaXJzdEVudGVyRXZlbnQoKSEsXHJcbiAgICAgICAgICAgICAgICBuZXcgR2xvYmFsRXZlbnRBcmdzKEdsb2JhbEV2ZW50VHlwZS5CZWZvcmVSb29tRW50ZXIsIHJvb20sIHRlcm1pbmF0ZUNhbGxiYWNrLCBjb250aW51ZUNhbGxiYWNrKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKGludGVycnVwdCkge1xyXG4gICAgICAgICAgICAgICAgdGVybWluYXRlQ2FsbGJhY2suaW50ZXJydXB0RmxvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRpbnVlQ2FsbGJhY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBhZnRlck9uRmlyc3RFbnRlckdsb2JhbEV2ZW50cyhyb29tOiBSb29tLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkxvb2subG9va1Jvb20ocm9vbSk7XHJcbiAgICAgICAgdGhpcy5vbkVudGVyR2xvYmFsRXZlbnRzKHJvb20sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbnRlckdsb2JhbEV2ZW50cyhyb29tOiBSb29tLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChyb29tLmdldE9uRW50ZXJFdmVudCgpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnJ1cHQgPSBHYW1lLmludm9rZUdsb2JhbEV2ZW50KFxyXG4gICAgICAgICAgICAgICAgcm9vbS5nZXRPbkVudGVyRXZlbnQoKSEsXHJcbiAgICAgICAgICAgICAgICBuZXcgR2xvYmFsRXZlbnRBcmdzKEdsb2JhbEV2ZW50VHlwZS5CZWZvcmVSb29tRW50ZXIsIHJvb20sIGNvbW1hbmRDYWxsYmFjaywgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2suQ2FsbElmTm90Q2FsbGVkKCksXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJydXB0KSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kQ2FsbGJhY2suaW50ZXJydXB0RmxvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbW1hbmRDYWxsYmFjay5DYWxsSWZOb3RDYWxsZWQoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnkgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkludmVudG9yeS5Zb3VySXRlbXMpO1xyXG4gICAgICAgIGlmICghR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuYW55KCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5JbnZlbnRvcnkuTm9JdGVtcy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5wcmludFNob3J0Rm9ybWF0KCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcbmltcG9ydCB7IEdhbWUgYXMgR2FtZVZhciB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEpzb24gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnYW1lID0gR2FtZVZhcjtcclxuICAgICAgICBsZXQgZ2FtZURhdGEgPSBHYW1lRGF0YTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KEpTT04uc3RyaW5naWZ5KGV2YWwoYXJndW1lbnQpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBMb2FkR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IHNhdmVEYXRhID0gRW5naW5lLkxvYWQoKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvYWQuTG9hZGluZyk7XHJcbiAgICAgICAgTG9hZEdhbWUoc2F2ZURhdGEpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuTG9hZC5Mb2FkZWQpO1xyXG4gICAgICAgIENvbW1hbmRzLkxvb2subG9va1Jvb20oKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi4vbW9kZWwvQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBSb29tIH0gZnJvbSAnLi4vbW9kZWwvUm9vbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvb2sgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgcm9vbSA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbik7XHJcblxyXG4gICAgICAgIGlmICghR2FtZS5QbGF5ZXIuY2FuU2VlKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLkNhbnRTZWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tSb29tKHJvb20pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbnVtYmVyID0gY29tbWFuZC5nZXROdW1iZXIoMSk7XHJcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IHJvb20uZ2V0Q2hhcmFjdGVycygpLmZpbmQoYXJndW1lbnQsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGNoYXJhY3RlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tDaGFyYWN0ZXIoY2hhcmFjdGVyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGl0ZW0gPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50LCBudW1iZXIpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va0l0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0gPSByb29tLmdldEl0ZW1zKCkuZmluZChhcmd1bWVudCwgbnVtYmVyKTtcclxuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suTm9PYmplY3QuZm9ybWF0KGFyZ3VtZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9va1Jvb20ocm9vbT86IFJvb20pIHtcclxuICAgICAgICBpZiAocm9vbSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gcm9vbS5nZXROYW1lKCkgKyBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICBtZXNzYWdlICs9IHRoaXMuZXhpdHNTdHJpbmcocm9vbSkgKyBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gcm9vbS5nZXREZXNjcmlwdGlvbigpO1xyXG4gICAgICAgIGlmIChyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lICsgRW5naW5lLkVuZExpbmUgKyByb29tLmdldENoYXJhY3RlcnMoKS5wcmludExvbmdGb3JtYXQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm9vbS5nZXRJdGVtcygpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIGlmICghcm9vbS5nZXRDaGFyYWN0ZXJzKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVzc2FnZSArPSBFbmdpbmUuRW5kTGluZSArIHJvb20uZ2V0SXRlbXMoKS5wcmludExvbmdGb3JtYXQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb29rSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChpdGVtLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tDaGFyYWN0ZXIoY2hhcmFjdGVyOiBDaGFyYWN0ZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suWW91TG9va0F0LmZvcm1hdChjaGFyYWN0ZXIuZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoY2hhcmFjdGVyLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4aXRzU3RyaW5nKHJvb206IFJvb20pOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCByZXR1cm5TdHJpbmcgPSAnfGcnICsgTG9jYWwuQ29tbWFuZHMuTG9vay5FeGl0cyArICc6IFsgJztcclxuICAgICAgICBsZXQgZmlyc3RFeGl0ID0gdHJ1ZTtcclxuICAgICAgICBsZXQgZGlyZWN0aW9ucyA9IHJvb20uZ2V0RXhpdHNEaXJlY3Rpb25zKCk7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFmaXJzdEV4aXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSAnLCAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpcnN0RXhpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gRGlyZWN0aW9uSGVscGVyLmdldExvY2FsZShkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAocm9vbS5nZXRFeGl0KGRpcmVjdGlvbik/LmlzQ2xvc2VkKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSAnKic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm5TdHJpbmcgKz0gJyBdfFcnO1xyXG4gICAgICAgIHJldHVybiByZXR1cm5TdHJpbmc7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTm9Db21tYW5kIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ob0NvbW1hbmQuTm9Db21tYW5kKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTm9ydGggZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24ubm9ydGgsIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlbG9hZCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIEVuZ2luZS5SZWxvYWQoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXZlIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KEdhbWUpO1xyXG4gICAgICAgIEVuZ2luZS5TYXZlKGpzb24pO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuU2F2ZS5TYXZlZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2FuIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgaWYgKCFHYW1lLlBsYXllci5jYW5TZWUoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlNjYW4uQ2FudFNlZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBsYXllclJvb20gPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pO1xyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlNjYW4uTG9va2luZ0Fyb3VuZFlvdVNlZSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TY2FuLkhlcmUpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQodGhpcy5wcmludENoYXJhY3RlcnMoR2FtZS5QbGF5ZXIuTG9jYXRpb24pKTtcclxuXHJcbiAgICAgICAgRGlyZWN0aW9uSGVscGVyLmZvckVhY2goKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZXhpdCA9IHBsYXllclJvb20uZ2V0RXhpdChkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAoZXhpdCAhPT0gbnVsbCAmJiAhZXhpdC5pc0hpZGRlbigpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlNjYW4uSW5EaXJlY3Rpb24uZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEaXJlY3Rpb25IZWxwZXIuZ2V0TG9jYWxlKGRpcmVjdGlvbiwgR3JhbW1hQ2FzZS5NaWVqc2Nvd25payksXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXhpdC5pc0Nsb3NlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoNCkgKyBMb2NhbC5Db21tYW5kcy5TY2FuLkNsb3NlZERvb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KHRoaXMucHJpbnRDaGFyYWN0ZXJzKGV4aXQuUm9vbUlkKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50Q2hhcmFjdGVycyhyb29tSWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKHJvb21JZCk7XHJcbiAgICAgICAgaWYgKCFyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpICsgTG9jYWwuQ29tbWFuZHMuU2Nhbi5Ob09uZVRoZXJlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb20uZ2V0Q2hhcmFjdGVycygpLnByaW50U2hvcnRGb3JtYXQodHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvdXRoIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLnNvdXRoLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi4vZW51bXMvR3JhbW1hQ2FzZSc7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4uL21vZGVsL0l0ZW0nO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFrZSBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCBhcmd1bWVudDEgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudDEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLk5vQXJndW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbnVtYmVyMSA9IGNvbW1hbmQuZ2V0TnVtYmVyKDEpO1xyXG4gICAgICAgIGxldCBhcmd1bWVudDIgPSBjb21tYW5kLmdldEFyZ3VtZW50KDIpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudDIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy9waWNrIHVwIGl0ZW0gZnJvbSBsb2NhdGlvblxyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnQxLnRvTG93ZXJDYXNlKCkgPT09ICdhbGwnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Ob0l0ZW1zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRha2VBbGxGcm9tTG9jYXRpb24oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtTGlzdCA9IEdhbWUuZ2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKTtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gaXRlbUxpc3QuZmluZChhcmd1bWVudDEsIG51bWJlcjEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtRm91bmQuZm9ybWF0KGFyZ3VtZW50MSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudGFrZUl0ZW1Gcm9tTG9jYXRpb24oaXRlbSwgaXRlbUxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy90YWtlIGl0ZW0gZnJvbSBjb250YWluZXJcclxuICAgICAgICAgICAgbGV0IG51bWJlcjIgPSBjb21tYW5kLmdldE51bWJlcigyKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmQoYXJndW1lbnQyLCBudW1iZXIyKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlSXRlbUZyb21Db250YWluZXIoYXJndW1lbnQxLCBudW1iZXIxLCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbUxpc3QgPSBHYW1lLmdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IGl0ZW1MaXN0LmZpbmQoYXJndW1lbnQyLCBudW1iZXIyKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlSXRlbUZyb21Db250YWluZXIoYXJndW1lbnQxLCBudW1iZXIxLCBjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtRm91bmQuZm9ybWF0KGFyZ3VtZW50MikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWtlSXRlbUZyb21Db250YWluZXIobmFtZTogc3RyaW5nLCBudW1iZXI6IG51bWJlciwgY29udGFpbmVyOiBJdGVtKSB7XHJcbiAgICAgICAgaWYgKCFjb250YWluZXIuaXNDb250YWluZXIoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuSXNOb0NvbnRhaW5lci5mb3JtYXQoY29udGFpbmVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lci5pc0xvY2tlZCgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Db250YWluZXJJc0xvY2tlZC5mb3JtYXQoY29udGFpbmVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtID0gY29udGFpbmVyLmdldEludmVudG9yeSgpIS5maW5kKG5hbWUsIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtRm91bmRJbkNvbnRhaW5lci5mb3JtYXQoY29udGFpbmVyLmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpLCBuYW1lKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRha2VJdGVtKGl0ZW0sIGNvbnRhaW5lci5nZXRJbnZlbnRvcnkoKSEpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlRha2UuVGFrZUl0ZW1Gcm9tQ29udGFpbmVyLmZvcm1hdChcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ2V0TmFtZSgpLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmdldE5hbWUoR3JhbW1hQ2FzZS5DZWxvd25paykuc3RhcnRXaXRoVXBwZXIoKSxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRha2VJdGVtRnJvbUxvY2F0aW9uKGl0ZW06IEl0ZW0sIGl0ZW1MaXN0OiBJdGVtTGlzdCkge1xyXG4gICAgICAgIGlmICghaXRlbS5pc1Rha2VhYmxlKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLkNhbm5vdFBpY2tVcC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuRG9wZWxuaWFjeikpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50YWtlSXRlbShpdGVtLCBpdGVtTGlzdCk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5UYWtlLlBpY2tlZFVwLmZvcm1hdChpdGVtLmdldE5hbWUoR3JhbW1hQ2FzZS5CaWVybmlrKSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRha2VBbGxGcm9tTG9jYXRpb24oKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1MaXN0ID0gR2FtZS5nZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKS5nZXRJdGVtcygpO1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpdGVtID0gaXRlbUxpc3QuZWxlbWVudEF0KGkpOyBpdGVtICE9IG51bGw7IGl0ZW0gPSBpdGVtTGlzdC5lbGVtZW50QXQoaSkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRha2VJdGVtRnJvbUxvY2F0aW9uKGl0ZW0sIGl0ZW1MaXN0KSkge1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRha2VBbGxHb2xkKGNvbnRhaW5lcjogSXRlbSkge1xyXG4gICAgICAgIGxldCBpdGVtTGlzdCA9IGNvbnRhaW5lci5nZXRJbnZlbnRvcnkoKSE7XHJcbiAgICAgICAgbGV0IGdvbGQ6IEl0ZW0gfCBudWxsID0gbnVsbDtcclxuICAgICAgICB3aGlsZSAoKGdvbGQgPSBpdGVtTGlzdC5maW5kQnlJZCgnZ29sZCcpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRha2VJdGVtKGdvbGQsIGl0ZW1MaXN0KTtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChcclxuICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlRha2UuVGFrZUl0ZW1Gcm9tQ29udGFpbmVyLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICAgICBnb2xkLmdldE5hbWUoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKS5zdGFydFdpdGhVcHBlcigpLFxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGFrZUl0ZW0oaXRlbTogSXRlbSwgaXRlbUxpc3Q6IEl0ZW1MaXN0KSB7XHJcbiAgICAgICAgaXRlbUxpc3QucmVtb3ZlKGl0ZW0pO1xyXG4gICAgICAgIEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFkZChpdGVtKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBjb21tYW5kLmdldENvbW1hbmQoKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXROdW1iZXIoMSkgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXRBcmd1bWVudCgxKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXROdW1iZXIoMikgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXRBcmd1bWVudCgyKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgR2FtZS5nZXROYW1lKCkgK1xyXG4gICAgICAgICAgICAgICAgJyBhYWEnLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICdOYXp5d2FtIHNpxJkgfGJ7MH18Vy4gVGFrIHxCezB9fFcgdG8gd8WCYcWbbmllIG1vamUgaW1pxJkuIEEgbmllLCBtb8W8ZSB0byBqZWRuYWsgfFJ7MX18Vz8gTmllZWUsIGNoeWJhIHxHezJ9fFcuLi4gTmllLCB0byBuaWUgdG8uLi4gV2llbSEgfFB7M318VyB0byBtb2plIHByYXdkeml3ZSBpbWnEmSEnLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICdHYW1lLlBsYXllci5nZXROYW1lKCknLFxyXG4gICAgICAgICAgICAgICAgJ1dvanRlayBQxJlkeml3w7NyJyxcclxuICAgICAgICAgICAgICAgICdTa3J6eXBlayBOYWRhY2h1JyxcclxuICAgICAgICAgICAgICAgICdaZHppb2NobyBNb2N6eXfEhXMnLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnQ3phcyBuYSBrb2xvciB0ZXN0IScpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xiRGFyayBCbHVlezB9fEJCbHVlJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfGdEYXJrIEdyZWVuezB9fEdHcmVlbicuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgyKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xjRGFyayBDeWFuezB9fENDeWFuJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHJEYXJrIFJlZHswfXxSUmVkJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHBEYXJrIFB1cnBsZSB8UFB1cnBsZScuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHlEYXJrIFllbGxvdyB8WVllbGxvdycuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHNEYXJrIEdyZXl7MH18U0dyZXknLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoMykpKTtcclxuICAgICAgICB0aHJvdyAnVGVzdCBleGNlcHRpb24nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVcCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi51cCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9jb21tYW5kc1V0aWxzL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VzdCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi53ZXN0LCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBDb21tYW5kQ2FsbGJhY2sge1xyXG4gICAgY2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG4gICAgY2FsbGJhY2tDYWxsZWQ6IGJvb2xlYW47XHJcbiAgICBpbnRlcnJ1cHRGbG93OiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmludGVycnVwdEZsb3cgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogSWYgY29tbWFuZCBjYW4gY2F1c2UgaW50ZXJydXB0RmxvdywgbWFrZSBzdXJlIHRvIGNhbGwgdGhpcyBtZXRob2QgYXQgdGhlIGVuZCBvZiBjb21tYW5kIGV4ZWN1dGlvbiAqL1xyXG4gICAgQ2FsbElmTm90Q2FsbGVkKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYWxsYmFja0NhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcbiAgICBjb21tYW5kU3RyaW5nOiBzdHJpbmc7XHJcbiAgICBwYXJzZWRDb21tYW5kOiBzdHJpbmc7XHJcbiAgICBwYXJzZWRBcmd1bWVudHM6IHN0cmluZ1tdIHwgbnVsbDtcclxuICAgIHBhcnNlZE51bWJlcnM6IG51bWJlcltdIHwgbnVsbDtcclxuICAgIHBhcnNlZENvdW50OiBudW1iZXJbXSB8IG51bGw7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kU3RyaW5nOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRTdHJpbmcgPSBjb21tYW5kU3RyaW5nO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9ICcnO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQXJndW1lbnRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQ291bnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1hbmQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQ29tbWFuZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUNvbW1hbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gdGhpcy5wYXJzZWRDb21tYW5kLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkQ29tbWFuZDtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUNvbW1hbmQoKSB7XHJcbiAgICAgICAgbGV0IHNwYWNlSW5kZXggPSB0aGlzLmNvbW1hbmRTdHJpbmcuaW5kZXhPZignICcpO1xyXG4gICAgICAgIGlmIChzcGFjZUluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlZENvbW1hbmQgPSB0aGlzLmNvbW1hbmRTdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gdGhpcy5jb21tYW5kU3RyaW5nLnNsaWNlKDAsIHNwYWNlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRBcmd1bWVudChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQXJndW1lbnRzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VBcmd1bWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQXJndW1lbnRzID09PSBudWxsIHx8IHRoaXMucGFyc2VkQXJndW1lbnRzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWRBcmd1bWVudHNbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE51bWJlcihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkTnVtYmVycyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQXJndW1lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZE51bWJlcnMgPT09IG51bGwgfHwgdGhpcy5wYXJzZWROdW1iZXJzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWROdW1iZXJzW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb3VudChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkQ291bnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUFyZ3VtZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYXJzZWRDb3VudCA9PT0gbnVsbCB8fCB0aGlzLnBhcnNlZENvdW50W2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWRDb3VudFtpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBcmd1bWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZWRBcmd1bWVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLnBhcnNlZE51bWJlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnBhcnNlZENvdW50ID0gW107XHJcbiAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSB0aGlzLmNvbW1hbmRTdHJpbmcuaW5kZXhPZignICcpO1xyXG4gICAgICAgIGxldCBlbmRJbmRleDtcclxuICAgICAgICBsZXQgY3VycmVudENvbW1hbmQgPSB0aGlzLmNvbW1hbmRTdHJpbmc7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRBcmd1bWVudE51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChzdGFydEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBzdGFydEluZGV4Kys7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBcmd1bWVudE51bWJlcisrO1xyXG4gICAgICAgICAgICBsZXQgcGFyc2VkTnVtYmVyID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHBhcnNlZENvdW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIC8vdXN1d2FteSBuaWVwb3RyemVibmUgc3BhY2plXHJcbiAgICAgICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgY3VycmVudENvbW1hbmQubGVuZ3RoICYmIGN1cnJlbnRDb21tYW5kW3N0YXJ0SW5kZXhdID09PSAnICcpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJyZW50Q29tbWFuZCA9IGN1cnJlbnRDb21tYW5kLnNsaWNlKHN0YXJ0SW5kZXgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gd3ljacSFZ2FuaWUgbnVtZXJ1IGRsYSBhcmd1bWVudHVcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kWzBdLmlzTnVtYmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCA8IGN1cnJlbnRDb21tYW5kLmxlbmd0aCAmJiBjdXJyZW50Q29tbWFuZFtjdXJyZW50SW5kZXhdLmlzTnVtYmVyKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZFtjdXJyZW50SW5kZXhdID09PSAnLicpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZWROdW1iZXIgPSBOdW1iZXIucGFyc2VJbnQoY3VycmVudENvbW1hbmQuc2xpY2UoMCwgY3VycmVudEluZGV4KSwgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkTnVtYmVyc1tjdXJyZW50QXJndW1lbnROdW1iZXJdID0gcGFyc2VkTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb21tYW5kID0gY3VycmVudENvbW1hbmQuc2xpY2UoY3VycmVudEluZGV4ICsgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vamV6ZWxpIG5pZSB3c2themFubyBsaWN6YnksIHRvIGRvbXnFm2xuaWUgamVzdCAxXHJcbiAgICAgICAgICAgIGlmIChwYXJzZWROdW1iZXIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkTnVtYmVyc1tjdXJyZW50QXJndW1lbnROdW1iZXJdID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFyc2VkQ291bnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkQ291bnRbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vd3ljacSFZ2FuaWUgdHJlxZtjaSBhcmd1bWVudHVcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kWzBdID09PSAnXCInKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gMTtcclxuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gY3VycmVudENvbW1hbmQuaW5kZXhPZignXCInLCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBjdXJyZW50Q29tbWFuZC5pbmRleE9mKCcgJywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVuZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBjdXJyZW50Q29tbWFuZC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VkQXJndW1lbnRzW2N1cnJlbnRBcmd1bWVudE51bWJlcl0gPSBjdXJyZW50Q29tbWFuZC5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbiAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4uL2NvbW1hbmRzL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1hbmRUcmVlIHtcclxuICAgIHJvb3Q6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHsgY29tbWFuZDogbnVsbCB9O1xyXG4gICAgfVxyXG5cclxuICAgIEFkZE5ld0NvbW1hbmQobmFtZTogc3RyaW5nLCBvYmplY3Q6IENvbW1hbmQpIHtcclxuICAgICAgICBpZiAoIW5hbWUgfHwgbmFtZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05ldyBjb21tYW5kIG5hbWUgY2Fubm90IGJlIG51bGwgb3IgZW1wdHknO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLlZhbGlkYXRlQ29tbWFuZE9iamVjdChvYmplY3QpO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudE5vZGUgPSB0aGlzLnJvb3Q7XHJcblxyXG4gICAgICAgIG5hbWUudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChjdXJyZW50Q2hhcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGVbY3VycmVudENoYXJdID0geyBjb21tYW5kOiBvYmplY3QgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGVbY3VycmVudENoYXJdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBTZXREZWZhdWx0Q29tbWFuZChvYmplY3Q6IENvbW1hbmQpIHtcclxuICAgICAgICB0aGlzLlZhbGlkYXRlQ29tbWFuZE9iamVjdChvYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QuY29tbWFuZCA9IG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBWYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkIHx8IG9iamVjdCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ29tbWFuZCBvYmplY3QgY2Fubm90IGJlIG51bGwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIShvYmplY3QgaW5zdGFuY2VvZiBDb21tYW5kKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ29tbWFuZCBvYmplY3QgbXVzdCBleHRlbmQgQ29tbWFuZCBjbGFzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEdldENvbW1hbmQobmFtZTogc3RyaW5nKTogQ29tbWFuZCB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gdGhpcy5yb290O1xyXG5cclxuICAgICAgICBuYW1lLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgICAgICAuc29tZSgoY3VycmVudENoYXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZVtjdXJyZW50Q2hhcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29tbWFuZCBub3QgZm91bmQtIHJldHVybiBkZWZhdWx0IGNvbW1hbmRcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGVbY3VycmVudENoYXJdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlLmNvbW1hbmQ7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi9Db21tYW5kQ2FsbGJhY2snO1xuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4vQ29tbWFuZFBhcnNlcic7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi4vY29tbWFuZHMvQ29tbWFuZCc7XG5pbXBvcnQgeyBEb3duIH0gZnJvbSAnLi4vY29tbWFuZHMvRG93bic7XG5pbXBvcnQgeyBEcm9wIH0gZnJvbSAnLi4vY29tbWFuZHMvRHJvcCc7XG5pbXBvcnQgeyBFYXN0IH0gZnJvbSAnLi4vY29tbWFuZHMvRWFzdCc7XG5pbXBvcnQgeyBFdmFsIH0gZnJvbSAnLi4vY29tbWFuZHMvRXZhbCc7XG5pbXBvcnQgeyBFeGFtIH0gZnJvbSAnLi4vY29tbWFuZHMvRXhhbSc7XG5pbXBvcnQgeyBHbyB9IGZyb20gJy4uL2NvbW1hbmRzL0dvJztcbmltcG9ydCB7IEludmVudG9yeSB9IGZyb20gJy4uL2NvbW1hbmRzL0ludmVudG9yeSc7XG5pbXBvcnQgeyBKc29uIH0gZnJvbSAnLi4vY29tbWFuZHMvSnNvbic7XG5pbXBvcnQgeyBMb29rIH0gZnJvbSAnLi4vY29tbWFuZHMvTG9vayc7XG5pbXBvcnQgeyBOb3J0aCB9IGZyb20gJy4uL2NvbW1hbmRzL05vcnRoJztcbmltcG9ydCB7IFJlbG9hZCB9IGZyb20gJy4uL2NvbW1hbmRzL1JlbG9hZCc7XG5pbXBvcnQgeyBTYXZlIH0gZnJvbSAnLi4vY29tbWFuZHMvU2F2ZSc7XG5pbXBvcnQgeyBTY2FuIH0gZnJvbSAnLi4vY29tbWFuZHMvU2Nhbic7XG5pbXBvcnQgeyBTb3V0aCB9IGZyb20gJy4uL2NvbW1hbmRzL1NvdXRoJztcbmltcG9ydCB7IFRha2UgfSBmcm9tICcuLi9jb21tYW5kcy9UYWtlJztcbmltcG9ydCB7IFRlc3QgfSBmcm9tICcuLi9jb21tYW5kcy9UZXN0JztcbmltcG9ydCB7IFVwIH0gZnJvbSAnLi4vY29tbWFuZHMvVXAnO1xuaW1wb3J0IHsgV2VzdCB9IGZyb20gJy4uL2NvbW1hbmRzL1dlc3QnO1xuaW1wb3J0IHsgQ29tbWFuZFRyZWUgfSBmcm9tICcuL0NvbW1hbmRUcmVlJztcbmltcG9ydCB7IFByb21wdCB9IGZyb20gJy4uL2NvbW1vbkxvZ2ljL1Byb21wdCc7XG5pbXBvcnQgeyBMb2FkIH0gZnJvbSAnLi4vY29tbWFuZHMvTG9hZCc7XG5cbmNsYXNzIENvbW1hbmRMaXN0IHtcbiAgICBEb3duID0gbmV3IERvd24oKTtcbiAgICBEcm9wID0gbmV3IERyb3AoKTtcbiAgICBFYXN0ID0gbmV3IEVhc3QoKTtcbiAgICBFdmFsID0gbmV3IEV2YWwoKTtcbiAgICBFeGFtID0gbmV3IEV4YW0oKTtcbiAgICBHbyA9IG5ldyBHbygpO1xuICAgIEludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoKTtcbiAgICBKc29uID0gbmV3IEpzb24oKTtcbiAgICBMb2FkID0gbmV3IExvYWQoKTtcbiAgICBMb29rID0gbmV3IExvb2soKTtcbiAgICBOb3J0aCA9IG5ldyBOb3J0aCgpO1xuICAgIFJlbG9hZCA9IG5ldyBSZWxvYWQoKTtcbiAgICBTb3V0aCA9IG5ldyBTb3V0aCgpO1xuICAgIFNhdmUgPSBuZXcgU2F2ZSgpO1xuICAgIFNjYW4gPSBuZXcgU2NhbigpO1xuICAgIFRha2UgPSBuZXcgVGFrZSgpO1xuICAgIFRlc3QgPSBuZXcgVGVzdCgpO1xuICAgIFVwID0gbmV3IFVwKCk7XG4gICAgV2VzdCA9IG5ldyBXZXN0KCk7XG59XG5cbmludGVyZmFjZSBDb21tYW5kRGljdGlvbmFyeSB7XG4gICAgW2NvbW1hbmROYW1lOiBzdHJpbmddOiBDb21tYW5kO1xufVxuXG5jbGFzcyBDb21tYW5kc01hbmFnZXIgZXh0ZW5kcyBDb21tYW5kTGlzdCB7XG4gICAgVHJlZTogQ29tbWFuZFRyZWU7XG4gICAgaXNDb21tYW5kRXhlY3V0aW5nOiBib29sZWFuO1xuICAgIGNvbW1hbmRRdWV1ZTogYW55W107XG4gICAgQ29tbWFuZHM6IENvbW1hbmREaWN0aW9uYXJ5ID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5UcmVlID0gbmV3IENvbW1hbmRUcmVlKCk7XG4gICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gW107XG4gICAgfVxuXG4gICAgRXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUucHVzaChjb21tYW5kKTtcbiAgICAgICAgaWYgKHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5pc0NvbW1hbmRFeGVjdXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5FeGVjdXRlTmV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRXhlY3V0ZU5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbW1hbmRRdWV1ZS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5pc0NvbW1hbmRFeGVjdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29tbWFuZCA9IHRoaXMuY29tbWFuZFF1ZXVlWzBdO1xuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5zaGlmdCgpO1xuICAgICAgICBsZXQgcGFyc2VyID0gbmV3IENvbW1hbmRQYXJzZXIoY29tbWFuZCk7XG4gICAgICAgIGxldCBjb21tYW5kTmFtZSA9IHBhcnNlci5nZXRDb21tYW5kKCk7XG5cbiAgICAgICAgbGV0IGNvbW1hbmRPYmplY3QgPSB0aGlzLlRyZWUuR2V0Q29tbWFuZChjb21tYW5kTmFtZSk7XG4gICAgICAgIGlmIChjb21tYW5kT2JqZWN0ID09PSB1bmRlZmluZWQgfHwgY29tbWFuZE9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IGZvciB7MH0gbm90IGZvdW5kJy5mb3JtYXQoY29tbWFuZE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb21tYW5kT2JqZWN0LkV4ZWN1dGUocGFyc2VyLCBuZXcgQ29tbWFuZENhbGxiYWNrKCgpID0+IHRoaXMuQWZ0ZXJFeGVjdXRlKCkpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5BZnRlckV4ZWN1dGUoKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBBZnRlckV4ZWN1dGUoKSB7XG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJycpO1xuICAgICAgICBQcm9tcHQuUHJpbnQoKTtcbiAgICAgICAgdGhpcy5FeGVjdXRlTmV4dCgpO1xuICAgIH1cblxuICAgIFNldERlZmF1bHRDb21tYW5kKGNvbW1hbmRPYmplY3Q6IENvbW1hbmQpIHtcbiAgICAgICAgdGhpcy5UcmVlLlNldERlZmF1bHRDb21tYW5kKGNvbW1hbmRPYmplY3QpO1xuICAgIH1cblxuICAgIFJlZ2lzdGVyQ29tbWFuZDxDb21tYW5kTmFtZSBleHRlbmRzIGtleW9mIENvbW1hbmRMaXN0PihuYW1lOiBDb21tYW5kTmFtZSwgb2JqZWN0OiBDb21tYW5kTGlzdFtDb21tYW5kTmFtZV0pIHtcbiAgICAgICAgdGhpcy5UcmVlLkFkZE5ld0NvbW1hbmQobmFtZSwgb2JqZWN0KTtcbiAgICAgICAgbGV0IGNvbW1hbmRMaXN0ID0gdGhpcyBhcyBDb21tYW5kTGlzdDtcbiAgICAgICAgY29tbWFuZExpc3RbbmFtZV0gPSBvYmplY3Q7XG4gICAgfVxufVxuXG5leHBvcnQgdmFyIENvbW1hbmRzID0gbmV3IENvbW1hbmRzTWFuYWdlcigpO1xuIiwiaW1wb3J0IHsgRG93biB9IGZyb20gJy4uL2NvbW1hbmRzL0Rvd24nO1xyXG5pbXBvcnQgeyBEcm9wIH0gZnJvbSAnLi4vY29tbWFuZHMvRHJvcCc7XHJcbmltcG9ydCB7IEVhc3QgfSBmcm9tICcuLi9jb21tYW5kcy9FYXN0JztcclxuaW1wb3J0IHsgRXZhbCB9IGZyb20gJy4uL2NvbW1hbmRzL0V2YWwnO1xyXG5pbXBvcnQgeyBFeGFtIH0gZnJvbSAnLi4vY29tbWFuZHMvRXhhbSc7XHJcbmltcG9ydCB7IEdvIH0gZnJvbSAnLi4vY29tbWFuZHMvR28nO1xyXG5pbXBvcnQgeyBJbnZlbnRvcnkgfSBmcm9tICcuLi9jb21tYW5kcy9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBKc29uIH0gZnJvbSAnLi4vY29tbWFuZHMvSnNvbic7XHJcbmltcG9ydCB7IExvYWQgfSBmcm9tICcuLi9jb21tYW5kcy9Mb2FkJztcclxuaW1wb3J0IHsgTG9vayB9IGZyb20gJy4uL2NvbW1hbmRzL0xvb2snO1xyXG5pbXBvcnQgeyBOb0NvbW1hbmQgfSBmcm9tICcuLi9jb21tYW5kcy9Ob0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBOb3J0aCB9IGZyb20gJy4uL2NvbW1hbmRzL05vcnRoJztcclxuaW1wb3J0IHsgUmVsb2FkIH0gZnJvbSAnLi4vY29tbWFuZHMvUmVsb2FkJztcclxuaW1wb3J0IHsgU2F2ZSB9IGZyb20gJy4uL2NvbW1hbmRzL1NhdmUnO1xyXG5pbXBvcnQgeyBTY2FuIH0gZnJvbSAnLi4vY29tbWFuZHMvU2Nhbic7XHJcbmltcG9ydCB7IFNvdXRoIH0gZnJvbSAnLi4vY29tbWFuZHMvU291dGgnO1xyXG5pbXBvcnQgeyBUYWtlIH0gZnJvbSAnLi4vY29tbWFuZHMvVGFrZSc7XHJcbmltcG9ydCB7IFRlc3QgfSBmcm9tICcuLi9jb21tYW5kcy9UZXN0JztcclxuaW1wb3J0IHsgVXAgfSBmcm9tICcuLi9jb21tYW5kcy9VcCc7XHJcbmltcG9ydCB7IFdlc3QgfSBmcm9tICcuLi9jb21tYW5kcy9XZXN0JztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuL0NvbW1hbmRzTWFuYWdlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSW5pdENvbW1hbmRzKCkge1xyXG4gICAgQ29tbWFuZHMuU2V0RGVmYXVsdENvbW1hbmQobmV3IE5vQ29tbWFuZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Rvd24nLCBuZXcgRG93bigpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRHJvcCcsIG5ldyBEcm9wKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRWFzdCcsIG5ldyBFYXN0KCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdFeGFtJywgbmV3IEV4YW0oKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0V2YWwnLCBuZXcgRXZhbCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0dvJywgbmV3IEdvKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnSW52ZW50b3J5JywgbmV3IEludmVudG9yeSgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0pzb24nLCBuZXcgSnNvbigpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0xvb2snLCBuZXcgTG9vaygpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnTG9hZCcsIG5ldyBMb2FkKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnTm9ydGgnLCBuZXcgTm9ydGgoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdSZWxvYWQnLCBuZXcgUmVsb2FkKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnU291dGgnLCBuZXcgU291dGgoKSk7XHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1NjYW4nLCBuZXcgU2NhbigpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnU2F2ZScsIG5ldyBTYXZlKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVGFrZScsIG5ldyBUYWtlKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdUZXN0JywgbmV3IFRlc3QoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdVcCcsIG5ldyBVcCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1dlc3QnLCBuZXcgV2VzdCgpKTtcclxufVxyXG4iLCJjbGFzcyBFbmdpbmVVdGlsc0NsYXNzIHtcclxuICAgIHNraXBQcmludGVyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgT3V0cHV0UHJpbnRlcihtZXNzYWdlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgZGVsYXkgPSA2MCwgaXNOZXdMaW5lID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuc2tpcFByaW50ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnByaW50TmV4dChtZXNzYWdlLCBjYWxsYmFjaywgZGVsYXksIGlzTmV3TGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnROZXh0KG1lc3NhZ2U6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyLCBpc05ld0xpbmU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAobWVzc2FnZS5pc051bGxPckVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGlzTmV3TGluZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5za2lwUHJpbnRlciA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KG1lc3NhZ2VbMF0sIGZhbHNlKTtcclxuICAgICAgICBFbmdpbmUuU3RhcnRUaW1lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJpbnROZXh0KG1lc3NhZ2Uuc2xpY2UoMSksIGNhbGxiYWNrLCBkZWxheSwgaXNOZXdMaW5lKTtcclxuICAgICAgICB9LCBkZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgU2tpcFByaW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5za2lwUHJpbnRlciA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgRW5naW5lVXRpbHMgPSBuZXcgRW5naW5lVXRpbHNDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL2NvbW1hbmRzVXRpbHMvQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lVXRpbHMgfSBmcm9tICcuL0VuZ2luZVV0aWxzJztcclxuXHJcbmV4cG9ydCB2YXIgSW5wdXRGdW5jdGlvbnMgPSAndHJ1ZSc7XHJcblxyXG5mdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZykge1xyXG4gICAgQ29tbWFuZHMuRXhlY3V0ZShjb21tYW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gU2tpcFByaW50ZXIoKSB7XHJcbiAgICBFbmdpbmVVdGlscy5Ta2lwUHJpbnRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXN1bWVFeGVjdXRpb24oKSB7XHJcbiAgICBDb21tYW5kcy5FeGVjdXRlTmV4dCgpO1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBmdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBmdW5jdGlvbiBTa2lwUHJpbnRlcigpOiB2b2lkO1xyXG4gICAgZnVuY3Rpb24gUmVzdW1lRXhlY3V0aW9uKCk6IHZvaWQ7XHJcbn1cclxuZ2xvYmFsVGhpcy5FeGVjdXRlID0gRXhlY3V0ZTtcclxuZ2xvYmFsVGhpcy5Ta2lwUHJpbnRlciA9IFNraXBQcmludGVyO1xyXG5nbG9iYWxUaGlzLlJlc3VtZUV4ZWN1dGlvbiA9IFJlc3VtZUV4ZWN1dGlvbjtcclxuIiwiY2xhc3MgUHJvbXB0Q2xhc3Mge1xyXG4gICAgUHJpbnQoKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnJCAnLCBmYWxzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgUHJvbXB0ID0gbmV3IFByb21wdENsYXNzKCk7XHJcbiIsImNsYXNzIFJhbmRvbUNsYXNzIHtcclxuICAgIG5leHRJbnQobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgUmFuZG9tID0gbmV3IFJhbmRvbUNsYXNzKCk7XHJcbiIsImV4cG9ydCB7fTtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGludGVyZmFjZSBTdHJpbmcge1xyXG4gICAgICAgIGZvcm1hdCguLi5hcmdzOiBhbnlbXSk6IHN0cmluZztcclxuICAgICAgICBzdGFydFdpdGhVcHBlcigpOiBzdHJpbmc7XHJcbiAgICAgICAgaXNOdW1iZXIoKTogYm9vbGVhbjtcclxuICAgICAgICBpc051bGxPckVtcHR5KCk6IGJvb2xlYW47XHJcbiAgICB9XHJcbn1cclxuXHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKC4uLmFyZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaDogc3RyaW5nLCBudW1iZXI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9PSAndW5kZWZpbmVkJyA/IGFyZ3NbbnVtYmVyXSA6IG1hdGNoO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnN0YXJ0V2l0aFVwcGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbMF0udG9VcHBlckNhc2UoKSArIHRoaXMuc2xpY2UoMSk7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmlzTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIC9eXFxkKyQvLnRlc3QodGhpcy50b1N0cmluZygpKTtcclxufTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUuaXNOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzID09PSBudWxsIHx8IHRoaXMgPT09ICcnO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tICcuL0VudW1IZWxwZXInO1xyXG5pbXBvcnQgeyBHcmFtbWFDYXNlIH0gZnJvbSAnLi9HcmFtbWFDYXNlJztcclxuXHJcbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XHJcbiAgICBub3J0aCA9ICdub3J0aCcsXHJcbiAgICBzb3V0aCA9ICdzb3V0aCcsXHJcbiAgICBlYXN0ID0gJ2Vhc3QnLFxyXG4gICAgd2VzdCA9ICd3ZXN0JyxcclxuICAgIHVwID0gJ3VwJyxcclxuICAgIGRvd24gPSAnZG93bicsXHJcbn1cclxuXHJcbmNsYXNzIERpcmVjdGlvbkhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxEaXJlY3Rpb24+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKERpcmVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TG9jYWxlKGRpcmVjdGlvbjogRGlyZWN0aW9uLCBncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICByZXR1cm4gTG9jYWwuRGlyZWN0aW9uc1tkaXJlY3Rpb25dW2dyYW1tYUNhc2VdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIERpcmVjdGlvbkhlbHBlciA9IG5ldyBEaXJlY3Rpb25IZWxwZXJDbGFzcygpO1xyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW51bUhlbHBlcjxFbnVtVHlwZT4ge1xyXG4gICAgc291cmNlOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlKHZhbHVlOiBzdHJpbmcpOiBFbnVtVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3ZhbHVlXSBhcyBFbnVtVHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VBcnJheSh2YWx1ZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IGFycmF5OiBFbnVtVHlwZVtdID0gW107XHJcbiAgICAgICAgdmFsdWVzLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyc2VkOiBFbnVtVHlwZSB8IG51bGwgPSB0aGlzLnBhcnNlKGtleSk7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZWQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gocGFyc2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBjb250YWlucyhzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eShzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2VTaG9ydChzdHJpbmc6IHN0cmluZyk6IEVudW1UeXBlIHwgbnVsbCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlW2tleV0gYXMgRW51bVR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0S2V5KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlW2tleV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmb3JFYWNoKGNhbGxiYWNrOiB7ICh2YWx1ZTogRW51bVR5cGUsIGtleTogc3RyaW5nKTogdm9pZCB9KTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuc291cmNlW2tleV0sIGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gXCIuL0VudW1IZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEVxdWlwbWVudFNsb3Qge1xyXG4gICAgTm9uZSA9IDAsXHJcbiAgICBUb3JzbyA9IDEsXHJcbiAgICBBcm1zID0gMixcclxuICAgIEhhbmRzID0gMyxcclxuICAgIExlZ3MgPSA0LFxyXG4gICAgRmVldHMgPSA1LFxyXG4gICAgSGVhZCA9IDYsXHJcbiAgICBNYWluSGFuZCA9IDcsXHJcbiAgICBPZmZIYW5kID0gOCxcclxuICAgIFNoaXJ0ID0gOSxcclxuICAgIFBhbnRzID0gMTAsXHJcbiAgICBDb2F0ID0gMTEsXHJcbiAgICBSaWdodFJpbmcgPSAxMixcclxuICAgIExlZnRSaW5nID0gMTMsXHJcbiAgICBOZWNrbGFjZSA9IDE0LFxyXG4gICAgVG9yY2ggPSAxNSxcclxufVxyXG5cclxuY2xhc3MgRXF1aXBtZW50U2xvdEhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxFcXVpcG1lbnRTbG90PiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihFcXVpcG1lbnRTbG90KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBFcXVpcG1lbnRTbG90SGVscGVyID0gbmV3IEVxdWlwbWVudFNsb3RIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSBcIi4vRW51bUhlbHBlclwiO1xyXG5cclxuZXhwb3J0IGVudW0gR2xvYmFsRXZlbnRUeXBlIHtcclxuICAgIEJlZm9yZVJvb21FbnRlciA9IDEsXHJcbn1cclxuXHJcbmNsYXNzIEdsb2JhbEV2ZW50VHlwZUhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxHbG9iYWxFdmVudFR5cGU+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKEdsb2JhbEV2ZW50VHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR2xvYmFsRXZlbnRUeXBlSGVscGVyID0gbmV3IEdsb2JhbEV2ZW50VHlwZUhlbHBlckNsYXNzKCk7XHJcbiIsImltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tIFwiLi9FbnVtSGVscGVyXCI7XHJcblxyXG5leHBvcnQgZW51bSBHcmFtbWFDYXNlIHtcclxuICAgIE1pYW5vd25payA9IDAsIC8va29nbyBjbyBqZXN0XHJcbiAgICBEb3BlbG5pYWN6ID0gMSwgLy9rb2dvIGN6ZWdvIG5pZSBtYVxyXG4gICAgQ2Vsb3duaWsgPSAyLCAvL2tvbXUgY3plbXUgc2nEmSBwcnp5Z2zEhWRhbVxyXG4gICAgQmllcm5payA9IDMsIC8va29nbyBjbyB3aWR6xJksIHVwdXN6Y3phbVxyXG4gICAgTmFyemVkbmlrID0gNCwgLy96IGtpbSB6IGN6eW0gaWRlXHJcbiAgICBNaWVqc2Nvd25payA9IDUsIC8vbyBraW0gbyBjenltIG1vd2llXHJcbiAgICBXb2xhY3ogPSA2LCAvL28ga29nb8W8IHRvIG1vamUgc2tyb21uZSBvY3p5IG1hasSFIHphc3pjenl0IHBvc3RyemVnYcSHXHJcbn1cclxuXHJcbmNsYXNzIEdyYW1tYUNhc2VIZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8R3JhbW1hQ2FzZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoR3JhbW1hQ2FzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgR3JhbW1hQ2FzZUhlbHBlciA9IG5ldyBHcmFtbWFDYXNlSGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gJy4vRW51bUhlbHBlcic7XHJcblxyXG5leHBvcnQgdHlwZSBJdGVtVHlwZTIgPVxyXG4gICAgfCAnV2VhcG9uMUgnXHJcbiAgICB8ICdXZWFwb24ySCdcclxuICAgIHwgJ1NoaWVsZCdcclxuICAgIHwgJ0FybW9yJ1xyXG4gICAgfCAnU2hvdWxkZXJzJ1xyXG4gICAgfCAnR2xvdmVzJ1xyXG4gICAgfCAnR3JlYXZlcydcclxuICAgIHwgJ0Jvb3RzJ1xyXG4gICAgfCAnSGVsbWV0J1xyXG4gICAgfCAnU2hpcnQnXHJcbiAgICB8ICdQYW50cydcclxuICAgIHwgJ1dpbGRTaGllbGQnXHJcbiAgICB8ICdXaWxkQXJtb3InXHJcbiAgICB8ICdXaWxkU2hvdWxkZXJzJ1xyXG4gICAgfCAnV2lsZEdsb3ZlcydcclxuICAgIHwgJ1dpbGRHcmVhdmVzJ1xyXG4gICAgfCAnV2lsZEJvb3RzJ1xyXG4gICAgfCAnV2lsZEhlbG1ldCdcclxuICAgIHwgJ1JpbmcnXHJcbiAgICB8ICdOZWNrbGFjZSdcclxuICAgIHwgJ1BvdGlvbidcclxuICAgIHwgJ0Zvb2QnXHJcbiAgICB8ICdUcmFzaCdcclxuICAgIHwgJ0N1cnJlbmN5J1xyXG4gICAgfCAnQ29udGFpbmVyJ1xyXG4gICAgfCAnU3RhdGljQ29udGFpbmVyJ1xyXG4gICAgfCAnUXVlc3QnXHJcbiAgICB8ICdTdGF0aWMnXHJcbiAgICB8ICdMZXZlcic7XHJcblxyXG5leHBvcnQgZW51bSBJdGVtVHlwZSB7XHJcbiAgICBXZWFwb24xSCA9ICdXZWFwb24xSCcsXHJcbiAgICBXZWFwb24ySCA9ICdXZWFwb24ySCcsXHJcbiAgICBTaGllbGQgPSAnU2hpZWxkJyxcclxuICAgIEFybW9yID0gJ0FybW9yJyxcclxuICAgIFNob3VsZGVycyA9ICdTaG91bGRlcnMnLFxyXG4gICAgR2xvdmVzID0gJ0dsb3ZlcycsXHJcbiAgICBHcmVhdmVzID0gJ0dyZWF2ZXMnLFxyXG4gICAgQm9vdHMgPSAnQm9vdHMnLFxyXG4gICAgSGVsbWV0ID0gJ0hlbG1ldCcsXHJcbiAgICBTaGlydCA9ICdTaGlydCcsXHJcbiAgICBQYW50cyA9ICdQYW50cycsXHJcbiAgICBXaWxkU2hpZWxkID0gJ1dpbGRTaGllbGQnLFxyXG4gICAgV2lsZEFybW9yID0gJ1dpbGRBcm1vcicsXHJcbiAgICBXaWxkU2hvdWxkZXJzID0gJ1dpbGRTaG91bGRlcnMnLFxyXG4gICAgV2lsZEdsb3ZlcyA9ICdXaWxkR2xvdmVzJyxcclxuICAgIFdpbGRHcmVhdmVzID0gJ1dpbGRHcmVhdmVzJyxcclxuICAgIFdpbGRCb290cyA9ICdXaWxkQm9vdHMnLFxyXG4gICAgV2lsZEhlbG1ldCA9ICdXaWxkSGVsbWV0JyxcclxuICAgIFJpbmcgPSAnUmluZycsXHJcbiAgICBOZWNrbGFjZSA9ICdOZWNrbGFjZScsXHJcbiAgICBQb3Rpb24gPSAnUG90aW9uJyxcclxuICAgIEZvb2QgPSAnRm9vZCcsXHJcbiAgICBUcmFzaCA9ICdUcmFzaCcsXHJcbiAgICBDdXJyZW5jeSA9ICdDdXJyZW5jeScsXHJcbiAgICBDb250YWluZXIgPSAnQ29udGFpbmVyJyxcclxuICAgIFN0YXRpY0NvbnRhaW5lciA9ICdTdGF0aWNDb250YWluZXInLFxyXG4gICAgUXVlc3QgPSAnUXVlc3QnLFxyXG4gICAgU3RhdGljID0gJ1N0YXRpYycsXHJcbiAgICBMZXZlciA9ICdMZXZlcicsXHJcbn1cclxuXHJcbmNsYXNzIEl0ZW1UeXBlSGVscGVyQ2xhc3MgZXh0ZW5kcyBFbnVtSGVscGVyPEl0ZW1UeXBlPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihJdGVtVHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgSXRlbVR5cGVIZWxwZXIgPSBuZXcgSXRlbVR5cGVIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyIH0gZnJvbSAnLi4vbW9kZWwvQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgRXF1aXBtZW50IH0gZnJvbSAnLi4vbW9kZWwvRXF1aXBtZW50JztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi4vbW9kZWwvSXRlbUxpc3QnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9DaGFyYWN0ZXJUZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyRmFjdG9yeSB7XHJcbiAgICBzcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzLmdldFRlbXBsYXRlKGNoYXJhY3RlcklkKTtcclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcigpO1xyXG4gICAgICAgIGNoYXJhY3RlciA9IHRoaXMuTG9hZEZyb21UZW1wbGF0ZShjaGFyYWN0ZXIsIHRlbXBsYXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcclxuICAgIH1cclxuXHJcbiAgICBMb2FkRnJvbVRlbXBsYXRlKGNoYXJhY3RlcjogQ2hhcmFjdGVyLCB0ZW1wbGF0ZTogQ2hhcmFjdGVyVGVtcGxhdGUpIHtcclxuICAgICAgICBjaGFyYWN0ZXIuSWQgPSB0ZW1wbGF0ZS5JZDtcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkludmVudG9yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnZlbnRvcnlNb2RlbCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5JbnZlbnRvcnkuZm9yRWFjaCgoaXRlbURlZmluaXRpb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5TW9kZWwuYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXIuSW52ZW50b3J5ID0gaW52ZW50b3J5TW9kZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVtcGxhdGUuRXF1aXBtZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGVxdWlwbWVudE1vZGVsID0gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5FcXVpcG1lbnQuZm9yRWFjaCgoZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIGVxdWlwbWVudE1vZGVsLmVxdWlwKGVxLlNsb3QsIEdhbWUuc3Bhd25JdGVtKGVxLkl0ZW0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlci5FcXVpcG1lbnQgPSBlcXVpcG1lbnRNb2RlbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuLi9tb2RlbC9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IEl0ZW1DaGFuY2VPbmVPZlRlbXBsYXRlLCBJdGVtQ2hhbmNlVGVtcGxhdGUsIEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50LCBTdGFjayB9IGZyb20gJy4uL3RlbXBsYXRlcy9Db21tb24nO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvSXRlbVRlbXBsYXRlJztcclxuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi4vY29tbW9uTG9naWMvUmFuZG9tJztcclxuaW1wb3J0IHsgSXRlbUxvY2sgfSBmcm9tICcuLi9tb2RlbC9JdGVtTG9jayc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUZhY3Rvcnkge1xyXG4gICAgc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uOiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCk6IEl0ZW0gfCBudWxsIHtcclxuICAgICAgICBsZXQgaXRlbSA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbURlZmluaXRpb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJdGVtQ2hhbmNlVGVtcGxhdGUoaXRlbURlZmluaXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uQ2hhbmNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUmFuZG9tLm5leHRJbnQoMSwgMTAwKSA+IGl0ZW1EZWZpbml0aW9uLkNoYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZDtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSB0aGlzLnNwYXduSXRlbUJ5VGVtcGxhdGVJZCh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5TdGFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRTdGFjayh0aGlzLnN0YWNrVmFsdWUoaXRlbURlZmluaXRpb24uU3RhY2spKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUludmVudG9yeShpdGVtRGVmaW5pdGlvbiwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVMb2NrKGl0ZW1EZWZpbml0aW9uLCBpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleCA9IHRoaXMucmVzb2x2ZVJhbmRvbUl0ZW1JbmRleChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZFtzZWxlY3RlZEl0ZW1JbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLlN0YWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdJdGVtIGRlZmluaXRpb24gaGFzIHswfSBzcGVjaWZpZWQgaWRzIGJ1dCBvbmx5IHsxfSBzcGllY2lmaWVkIHN0YWNrcycuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLlN0YWNrLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRTdGFjayh0aGlzLnN0YWNrVmFsdWUoaXRlbURlZmluaXRpb24uU3RhY2tbc2VsZWN0ZWRJdGVtSW5kZXhdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzSXRlbUNoYW5jZVRlbXBsYXRlKGl0ZW1EZWZpbml0aW9uOiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCk6IGl0ZW1EZWZpbml0aW9uIGlzIEl0ZW1DaGFuY2VUZW1wbGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtRGVmaW5pdGlvbiAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZCA9PT0gJ3N0cmluZyc7XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQ6IHN0cmluZyk6IEl0ZW0ge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZTogSXRlbVRlbXBsYXRlID0gR2FtZURhdGEuSXRlbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICBsZXQgaXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgaXRlbS5JZCA9IHRlbXBsYXRlLklkO1xyXG4gICAgICAgIGlmIChpdGVtLmlzQ29udGFpbmVyKCkpIHtcclxuICAgICAgICAgICAgaXRlbS5JbnZlbnRvcnkgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlUmFuZG9tSXRlbUluZGV4KGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlT25lT2ZUZW1wbGF0ZSk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5DaGFuY2VMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZC5mb3JFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3Q/LnB1c2goMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gZGVmaW5pdGlvbiBoYXMgezB9IHNwZWNpZmllZCBpZHMgYnV0IG9ubHkgezF9IHNwaWVjaWZpZWQgY2hhbmNlcyBpbiBDaGFuY2VMaXN0Jy5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5JdGVtSWQubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhbmNlU3VtID0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5yZWR1Y2UoKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBhICsgYik7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2hhbmNlID0gUmFuZG9tLm5leHRJbnQoMSwgY2hhbmNlU3VtKTtcclxuICAgICAgICBjaGFuY2VTdW0gPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGFuY2VTdW0gKz0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkQ2hhbmNlIDw9IGNoYW5jZVN1bSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7IC8vc2hvdWxkIG5ldmVyIG9jY3VyXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlSW52ZW50b3J5KGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlVGVtcGxhdGUsIGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSW52ZW50b3J5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGludmVudG9yeSA9IGl0ZW0uZ2V0SW52ZW50b3J5KCk7XHJcbiAgICAgICAgICAgIGlmIChpbnZlbnRvcnkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeSA9IGl0ZW0uSW52ZW50b3J5ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSW52ZW50b3J5LmZvckVhY2goKGl0ZW1EZWZpbml0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeT8uYWRkKEdhbWUuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc29sdmVMb2NrKGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlVGVtcGxhdGUsIGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uTG9jayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uTG9jayA9IG5ldyBJdGVtTG9jayhpdGVtRGVmaW5pdGlvbi5Mb2NrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGFja1ZhbHVlKHN0YWNrOiBTdGFjayk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHN0YWNrID09PSB1bmRlZmluZWQgfHwgc3RhY2sgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhY2sgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGFjaztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUmFuZG9tLm5leHRJbnQoc3RhY2suTWluLCBzdGFjay5NYXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkTGlzdEZyb21UZW1wbGF0ZSh0ZW1wbGF0ZT86IEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50W10pIHtcclxuICAgICAgICBsZXQgaXRlbUxpc3QgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICBpZiAodGVtcGxhdGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5mb3JFYWNoKChpdGVtRGVmaW5pdGlvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtTGlzdC5hZGQoR2FtZS5zcGF3bkl0ZW0oaXRlbURlZmluaXRpb24pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtTGlzdDtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyTGlzdCB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlckxpc3QnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL21vZGVsL1Jvb20nO1xyXG5pbXBvcnQgeyBSb29tRXhpdCB9IGZyb20gJy4uL21vZGVsL1Jvb21FeGl0JztcclxuaW1wb3J0IHsgUm9vbUV4aXRzTGlzdCB9IGZyb20gJy4uL21vZGVsL1Jvb21FeGl0c0xpc3QnO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvUm9vbVRlbXBsYXRlJztcclxuaW1wb3J0IHsgUm9vbURvb3IgfSBmcm9tICcuLi9tb2RlbC9Sb29tRG9vcic7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvb21GYWN0b3J5IHtcclxuICAgIHNwYXduUm9vbSh0ZW1wbGF0ZTogUm9vbVRlbXBsYXRlKSB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBuZXcgUm9vbSgpO1xyXG4gICAgICAgIHJvb20uSWQgPSB0ZW1wbGF0ZS5JZDtcclxuICAgICAgICByZXR1cm4gcm9vbTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbURhdGEocm9vbTogUm9vbSkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gR2FtZURhdGEuUm9vbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZShyb29tLklkKTtcclxuICAgICAgICBsZXQgZXhpdHNNb2RlbCA9IG5ldyBSb29tRXhpdHNMaXN0KCk7XHJcbiAgICAgICAgdGVtcGxhdGUuRXhpdHM/LmZvckVhY2goKGV4aXQpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IGV4aXQuRGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBsZXQgcm9vbUV4aXQgPSBuZXcgUm9vbUV4aXQoKTtcclxuICAgICAgICAgICAgcm9vbUV4aXQuUm9vbUlkID0gZXhpdC5Sb29tSWQ7XHJcbiAgICAgICAgICAgIHJvb21FeGl0LklzSGlkZGVuID0gZXhpdC5pc0hpZGRlbjtcclxuICAgICAgICAgICAgaWYgKGV4aXQuRG9vciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZG9vciA9IChyb29tRXhpdC5Eb29yID0gbmV3IFJvb21Eb29yKCkpO1xyXG4gICAgICAgICAgICAgICAgZG9vci5Jc0xvY2tlZCA9IGV4aXQuRG9vci5Jc0xvY2tlZDtcclxuICAgICAgICAgICAgICAgIGRvb3IuSXNDbG9zZWQgPSBleGl0LkRvb3IuSXNDbG9zZWQ7XHJcbiAgICAgICAgICAgICAgICBkb29yLktleUlkID0gZXhpdC5Eb29yLktleUlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkb29yLklzTG9ja2VkID09PSB1bmRlZmluZWQgJiYgZG9vci5Jc0Nsb3NlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9vci5Jc0xvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXhpdHNNb2RlbFtkaXJlY3Rpb25dID0gcm9vbUV4aXQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcm9vbS5FeGl0cyA9IGV4aXRzTW9kZWw7XHJcblxyXG4gICAgICAgIHJvb20uSXRlbXMgPSBHYW1lLkl0ZW1GYWN0b3J5LmxvYWRMaXN0RnJvbVRlbXBsYXRlKHRlbXBsYXRlLkl0ZW1zKTtcclxuXHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkNoYXJhY3RlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyc01vZGVsID0gbmV3IENoYXJhY3Rlckxpc3QoKTtcclxuICAgICAgICAgICAgdGVtcGxhdGUuQ2hhcmFjdGVycy5mb3JFYWNoKChjaGFyYWN0ZXJJZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyc01vZGVsLmFkZChHYW1lLnNwYXduQ2hhcmFjdGVyKGNoYXJhY3RlcklkKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByb29tLkNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJzTW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgRW50aXR5QmFzZSB9IGZyb20gJy4vRW50aXR5QmFzZSc7XHJcbmltcG9ydCB7IEVxdWlwbWVudCB9IGZyb20gJy4vRXF1aXBtZW50JztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyU3RhdHMgfSBmcm9tICcuL0NoYXJhY3RlclN0YXRzJztcclxuaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHYW1lRGF0YSB9IGZyb20gJy4vR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9DaGFyYWN0ZXJUZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgRW50aXR5QmFzZSB7XHJcbiAgICBJbnZlbnRvcnk6IEl0ZW1MaXN0ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICBFcXVpcG1lbnQ6IEVxdWlwbWVudCA9IG5ldyBFcXVpcG1lbnQoKTtcclxuICAgIFN0YXRzOiBDaGFyYWN0ZXJTdGF0cyA9IG5ldyBDaGFyYWN0ZXJTdGF0cygpO1xyXG5cclxuICAgIHByaXZhdGUgZ2V0VGVtcGxhdGUoKTogQ2hhcmFjdGVyVGVtcGxhdGUge1xyXG4gICAgICAgIHJldHVybiBHYW1lRGF0YS5DaGFyYWN0ZXJUZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGhpcy5JZCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkQ2hhcmFjdGVyOiBDaGFyYWN0ZXIpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkQ2hhcmFjdGVyKTtcclxuICAgICAgICB0aGlzLkludmVudG9yeSA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgIHRoaXMuSW52ZW50b3J5LmxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3Rlci5JbnZlbnRvcnkpO1xyXG4gICAgICAgIHRoaXMuRXF1aXBtZW50ID0gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgIHRoaXMuRXF1aXBtZW50LmxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3Rlci5FcXVpcG1lbnQpO1xyXG4gICAgICAgIHRoaXMuU3RhdHMgPSBuZXcgQ2hhcmFjdGVyU3RhdHMoKTtcclxuICAgICAgICB0aGlzLlN0YXRzLmxvYWRGcm9tU2F2ZShzYXZlZENoYXJhY3Rlci5TdGF0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLk5hbWVbZ3JhbW1hQ2FzZV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGVzY3JpcHRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5EZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZGxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuSWRsZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbnZlbnRvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSW52ZW50b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVxdWlwbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FcXVpcG1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RXF1aXBtZW50KCkuaGFzTGlnaHRTb3VyY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIZWFsdGhMZXZlbChkZXNjcmlwdGlvbjogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCBwZXJjZW50YWdlID0gKHRoaXMuU3RhdHMuY3VycmVudEhlYWx0aCAqIDEwMCkgLyB0aGlzLlN0YXRzLmhlYWx0aC50b3RhbDtcclxuICAgICAgICBsZXQgbGV2ZWw6IHN0cmluZztcclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+PSAxMDApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5GdWxsIDogJ+KWiOKWiOKWiOKWiOKWiCc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfEcnICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDgwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuTGlnaHRXb3VuZHMgOiAn4paI4paI4paI4paI4paIJztcclxuICAgICAgICAgICAgcmV0dXJuICd8ZycgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJjZW50YWdlID4gNjApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5NZWRpdW1Xb3VuZHMgOiAn4paI4paI4paI4paI4paRJztcclxuICAgICAgICAgICAgcmV0dXJuICd8WScgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJjZW50YWdlID4gNDApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5TZXJpb3VzV291bmRzIDogJ+KWiOKWiOKWiOKWkeKWkSc7XHJcbiAgICAgICAgICAgIHJldHVybiAnfFknICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVyY2VudGFnZSA+IDIwKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuSGVhdnlXb3VuZHMgOiAn4paI4paI4paR4paR4paRJztcclxuICAgICAgICAgICAgcmV0dXJuICd8UicgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJjZW50YWdlID49IDApIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBkZXNjcmlwdGlvbiA/IExvY2FsLlN0YXRzLkhlYWx0aExldmVscy5OZWFyRGVhdGggOiAn4paI4paR4paR4paR4paRJztcclxuICAgICAgICAgICAgcmV0dXJuICd8UicgKyBsZXZlbCArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldmVsID0gZGVzY3JpcHRpb24gPyBMb2NhbC5TdGF0cy5IZWFsdGhMZXZlbHMuRGVhZCA6ICfilpHilpHilpHilpHilpEnO1xyXG4gICAgICAgIHJldHVybiAnfFInICsgbGV2ZWwgKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4vQ2hhcmFjdGVyJztcclxuaW1wb3J0IHsgRW50aXR5TGlzdCB9IGZyb20gJy4vRW50aXR5TGlzdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyTGlzdCBleHRlbmRzIEVudGl0eUxpc3Q8Q2hhcmFjdGVyPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZExpc3Q6IENoYXJhY3Rlckxpc3QpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gc2F2ZWRMaXN0LkFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3Q2hhciA9IG5ldyBDaGFyYWN0ZXIoKTtcclxuICAgICAgICAgICAgbmV3Q2hhci5sb2FkRnJvbVNhdmUoaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdDaGFyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5LnNvbWUoKGMpID0+IGMuaGFzTGlnaHRTb3VyY2UoKSA9PT0gdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgU3RhdCB7XHJcbiAgICBiYXNlOiBudW1iZXIgPSAwO1xyXG4gICAgcmFjZTogbnVtYmVyID0gMDtcclxuICAgIGNsYXNzOiBudW1iZXIgPSAwO1xyXG4gICAgYm9udXM6IG51bWJlciA9IDA7XHJcbiAgICB0b3RhbDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuY2xhc3MgQXR0cmlidXRlIHtcclxuICAgIHN0YXQ6IG51bWJlciA9IDA7XHJcbiAgICBsZXZlbDogbnVtYmVyID0gMDtcclxuICAgIGVxOiBudW1iZXIgPSAwO1xyXG4gICAgYm9udXM6IG51bWJlciA9IDA7XHJcbiAgICBtb2RpZmllcjogbnVtYmVyID0gMDtcclxuICAgIHRvdGFsOiBudW1iZXIgPSAwO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVyU3RhdHMge1xyXG4gICAgbGV2ZWw6IG51bWJlciA9IDE7XHJcblxyXG4gICAgc3RyZW5ndGg6IFN0YXQgPSBuZXcgU3RhdCgpO1xyXG4gICAgZGV4dGVyaXR5OiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIGFnaWxpdHk6IFN0YXQgPSBuZXcgU3RhdCgpO1xyXG4gICAgZW5kdXJhbmNlOiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuICAgIHZpdGFsaXR5OiBTdGF0ID0gbmV3IFN0YXQoKTtcclxuXHJcbiAgICBhdHRhY2s6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGRlZmVuc2U6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGhlYWx0aDogQXR0cmlidXRlID0gbmV3IEF0dHJpYnV0ZSgpO1xyXG4gICAgYXJtb3I6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGZhdGlndWU6IEF0dHJpYnV0ZSA9IG5ldyBBdHRyaWJ1dGUoKTtcclxuICAgIGRhbWFnZTogQXR0cmlidXRlID0gbmV3IEF0dHJpYnV0ZSgpO1xyXG5cclxuICAgIGN1cnJlbnRIZWFsdGg6IG51bWJlciA9IDEwMDtcclxuICAgIGN1cnJlbnRBcm1vcjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhlYWx0aC50b3RhbCA9IDEwMDtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZWRTdGF0czogQ2hhcmFjdGVyU3RhdHMpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVkU3RhdHMpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJUZW1wbGF0ZXMge1xyXG4gICAgW3RlbXBsYXRlSWQ6IHN0cmluZ106IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKGNoYXJhY3RlclRlbXBsYXRlcz86IGFueSkge1xyXG4gICAgICAgIGlmIChjaGFyYWN0ZXJUZW1wbGF0ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2hhcmFjdGVyVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2hhcmFjdGVyIHRlbXBsYXRlcyBtdXN0IGJlIGFuIGFycmF5JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYXJhY3RlclRlbXBsYXRlcy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdDaGFyYWN0ZXJUZW1wbGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTmV3Q2hhcmFjdGVyVGVtcGxhdGUoY2hhcmFjdGVyVGVtcGxhdGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzW2NoYXJhY3RlclRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdDaGFyYWN0ZXIgdGVtcGxhdGUgezB9IGlzIGFscmVhZHkgZGVmaW5lZCEnLmZvcm1hdChjaGFyYWN0ZXJUZW1wbGF0ZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXNbY2hhcmFjdGVyVGVtcGxhdGUuSWRdID0gY2hhcmFjdGVyVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUoY2hhcmFjdGVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzW2NoYXJhY3RlcklkXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdObyBDaGFyYWN0ZXIgdGVtcGxhdGUgZGVmaW5lZCBmb3IgSWQgezB9IScuZm9ybWF0KGNoYXJhY3RlcklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbY2hhcmFjdGVySWRdO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFbnRpdHlCYXNlIHtcclxuICAgIElkOiBzdHJpbmcgPSAnJztcclxuICAgIGFic3RyYWN0IGdldE5hbWUoKTogc3RyaW5nO1xyXG4gICAgYWJzdHJhY3QgZ2V0SWRsZSgpOiBzdHJpbmc7XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkRW50aXR5OiBFbnRpdHlCYXNlKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZEVudGl0eSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRW50aXR5QmFzZSB9IGZyb20gJy4vRW50aXR5QmFzZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5TGlzdDxUeXBlIGV4dGVuZHMgRW50aXR5QmFzZT4ge1xyXG4gICAgQXJyYXk6IFR5cGVbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQXJyYXkgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQoaXRlbTogVHlwZSkge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5BcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShpdGVtOiBUeXBlKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5BcnJheS5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW55KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5Lmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudEF0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5BcnJheVtpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXlbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZChuYW1lOiBzdHJpbmcsIG51bWJlciA9IDEpOiBUeXBlIHwgbnVsbCB7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gbnVsbDtcclxuICAgICAgICB0aGlzLkFycmF5LnNvbWUoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZ2V0TmFtZSgpLnNlYXJjaChuYW1lKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG51bWJlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQnlJZChpZDogc3RyaW5nLCBudW1iZXIgPSAxKTogVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGxldCBmb3VuZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5BcnJheS5zb21lKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLklkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bWJlciA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBudW1iZXItLTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnRMb25nRm9ybWF0KGluZGVudCA9IHRydWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcmludChpbmRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50U2hvcnRGb3JtYXQoaW5kZW50ID0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByaW50KGluZGVudCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaW50KGluZGVudCA9IHRydWUsIGxvbmdGb3JtYXQgPSB0cnVlKSB7XHJcbiAgICAgICAgbGV0IHJldHVyblN0cmluZyA9ICcnO1xyXG4gICAgICAgIHRoaXMuQXJyYXkuZm9yRWFjaCgoZW50aXR5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXR1cm5TdHJpbmcgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZGVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9IEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gZW50aXR5LmdldE5hbWUoKS5zdGFydFdpdGhVcHBlcigpO1xyXG4gICAgICAgICAgICBpZiAobG9uZ0Zvcm1hdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcgJyArIGVudGl0eS5nZXRJZGxlKCkgKyAnLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVxdWlwbWVudFNsb3QsIEVxdWlwbWVudFNsb3RIZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9FcXVpcG1lbnRTbG90JztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRXF1aXBtZW50IHtcclxuICAgIEFycmF5OiBJdGVtW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkRXF1aXBtZW50OiBFcXVpcG1lbnQpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gc2F2ZWRFcXVpcG1lbnQuQXJyYXkubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdJdGVtID0gbmV3IEl0ZW0oKTtcclxuICAgICAgICAgICAgbmV3SXRlbS5sb2FkRnJvbVNhdmUoaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXdJdGVtO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlU2xvdChzbG90OiBFcXVpcG1lbnRTbG90KSB7XHJcbiAgICAgICAgaWYgKEVxdWlwbWVudFNsb3RIZWxwZXIuZ2V0S2V5KHNsb3QpID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93ICd7MH0gaXMgbm90IGEgcHJvcGVyIGVxdWlwbWVudCBzbG90LicuZm9ybWF0KHNsb3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlcXVpcChzbG90OiBFcXVpcG1lbnRTbG90LCBpdGVtOiBJdGVtIHwgbnVsbCkge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNsb3Qoc2xvdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuQXJyYXlbc2xvdF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGVxdWlwLCB7MH0gYWxyZWFkeSBjb250YWlucyBhbiBpdGVtLicuZm9ybWF0KEVxdWlwbWVudFNsb3RIZWxwZXIuZ2V0S2V5KHNsb3QpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuQXJyYXlbc2xvdF0gPSBpdGVtO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShzbG90OiBFcXVpcG1lbnRTbG90KSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNsb3Qoc2xvdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuQXJyYXlbc2xvdF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkNhbm5vdCByZW1vdmUsIHswfSBkb2Vzbid0IGNvbnRhaW5zIGFuIGl0ZW0uXCIuZm9ybWF0KEVxdWlwbWVudFNsb3RIZWxwZXIuZ2V0S2V5KHNsb3QpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLkFycmF5W3Nsb3RdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChzbG90OiBFcXVpcG1lbnRTbG90KSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNsb3Qoc2xvdCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5W3Nsb3RdO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5LnNvbWUoKGkpID0+IGkuaXNMaWdodFNvdXJjZSgpID09PSB0cnVlKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHbG9iYWxFdmVudHMgfSBmcm9tICcuLi9HbG9iYWxFdmVudHMnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50QXJncyB9IGZyb20gJy4vR2xvYmFsRXZlbnRBcmdzJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4vUm9vbSc7XHJcbmltcG9ydCB7IFJvb21GYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzL1Jvb21GYWN0b3J5JztcclxuaW1wb3J0IHsgSXRlbUZhY3RvcnkgfSBmcm9tICcuLi9mYWN0b3JpZXMvSXRlbUZhY3RvcnknO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJGYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzL0NoYXJhY3RlckZhY3RvcnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNb2RlbCB7XHJcbiAgICBOYW1lOiBzdHJpbmc7XHJcbiAgICBTdGFydGluZ1Jvb206IG51bWJlcjtcclxuICAgIFJvb21zOiBSb29tW107XHJcbiAgICBQbGF5ZXIgPSBuZXcgUGxheWVyKCk7XHJcblxyXG4gICAgSXRlbUZhY3Rvcnk6IEl0ZW1GYWN0b3J5O1xyXG4gICAgQ2hhcmFjdGVyRmFjdG9yeTogQ2hhcmFjdGVyRmFjdG9yeTtcclxuICAgIFJvb21GYWN0b3J5OiBSb29tRmFjdG9yeTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSAnJztcclxuICAgICAgICB0aGlzLlN0YXJ0aW5nUm9vbSA9IDA7XHJcbiAgICAgICAgdGhpcy5Sb29tcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLkl0ZW1GYWN0b3J5ID0gbmV3IEl0ZW1GYWN0b3J5KCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJGYWN0b3J5ID0gbmV3IENoYXJhY3RlckZhY3RvcnkoKTtcclxuICAgICAgICB0aGlzLlJvb21GYWN0b3J5ID0gbmV3IFJvb21GYWN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEdhbWUoc2F2ZWRHYW1lOiBHYW1lTW9kZWwpIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSBzYXZlZEdhbWUuTmFtZTtcclxuICAgICAgICB0aGlzLlN0YXJ0aW5nUm9vbSA9IHNhdmVkR2FtZS5TdGFydGluZ1Jvb207XHJcbiAgICAgICAgZm9yIChsZXQgcm9vbUlkIGluIHNhdmVkR2FtZS5Sb29tcykge1xyXG4gICAgICAgICAgICB0aGlzLlJvb21zW3Jvb21JZF0gPSBuZXcgUm9vbSgpO1xyXG4gICAgICAgICAgICB0aGlzLlJvb21zW3Jvb21JZF0ubG9hZEZyb21TYXZlKHNhdmVkR2FtZS5Sb29tc1tyb29tSWRdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5QbGF5ZXIgPSBuZXcgUGxheWVyKCk7XHJcbiAgICAgICAgdGhpcy5QbGF5ZXIubG9hZEZyb21TYXZlKHNhdmVkR2FtZS5QbGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSb29tKHJvb21JZDogbnVtYmVyKTogUm9vbSB7XHJcbiAgICAgICAgbGV0IHJvb20gPSB0aGlzLlJvb21zW3Jvb21JZF07XHJcbiAgICAgICAgaWYgKHJvb20gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCByb29tVGVtcGxhdGUgPSBHYW1lRGF0YS5Sb29tVGVtcGxhdGVzLmdldFRlbXBsYXRlKHJvb21JZCk7XHJcbiAgICAgICAgICAgIHJvb20gPSB0aGlzLlJvb21zW3Jvb21JZF0gPSB0aGlzLlJvb21GYWN0b3J5LnNwYXduUm9vbShyb29tVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLlJvb21GYWN0b3J5LmxvYWRGcm9tRGF0YShyb29tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvb207XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uOiBhbnkpOiBJdGVtIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXRlbUZhY3Rvcnkuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZDogc3RyaW5nKTogQ2hhcmFjdGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5DaGFyYWN0ZXJGYWN0b3J5LnNwYXduQ2hhcmFjdGVyKGNoYXJhY3RlcklkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJdGVtVHlwZShpdGVtVHlwZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIEdhbWVEYXRhLkl0ZW1UeXBlcy5nZXRJdGVtVHlwZShpdGVtVHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGludm9rZUdsb2JhbEV2ZW50KG5hbWU6IHN0cmluZywgYXJnczogR2xvYmFsRXZlbnRBcmdzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGV2ZW50ID0gR2xvYmFsRXZlbnRzW25hbWVdO1xyXG4gICAgICAgIGlmIChldmVudCA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBldmVudCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkdsb2JhbCBldmVudCB3aXRoIG5hbWUgezB9IGRvZXNuJ3QgZXhpc3RcIi5mb3JtYXQobmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnQoYXJncyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGVzIH0gZnJvbSAnLi9DaGFyYWN0ZXJUZW1wbGF0ZXMnO1xyXG5pbXBvcnQgeyBJdGVtVGVtcGxhdGVzIH0gZnJvbSAnLi9JdGVtVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgSXRlbVR5cGVzIH0gZnJvbSAnLi9JdGVtVHlwZXMnO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGVzIH0gZnJvbSAnLi9Sb29tVGVtcGxhdGVzJztcclxuXHJcbmNsYXNzIEdhbWVEYXRhTW9kZWwge1xyXG4gICAgSXRlbVR5cGVzOiBJdGVtVHlwZXM7XHJcbiAgICBJdGVtVGVtcGxhdGVzOiBJdGVtVGVtcGxhdGVzO1xyXG4gICAgQ2hhcmFjdGVyVGVtcGxhdGVzOiBDaGFyYWN0ZXJUZW1wbGF0ZXM7XHJcbiAgICBSb29tVGVtcGxhdGVzOiBSb29tVGVtcGxhdGVzO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5JdGVtVHlwZXMgPSBuZXcgSXRlbVR5cGVzKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5JdGVtVGVtcGxhdGVzID0gbmV3IEl0ZW1UZW1wbGF0ZXModW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLkNoYXJhY3RlclRlbXBsYXRlcyA9IG5ldyBDaGFyYWN0ZXJUZW1wbGF0ZXModW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLlJvb21UZW1wbGF0ZXMgPSBuZXcgUm9vbVRlbXBsYXRlcyh1bmRlZmluZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEdhbWVEYXRhID0gbmV3IEdhbWVEYXRhTW9kZWwoKTtcclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdsb2JhbEV2ZW50QXJncyB7XHJcbiAgICBUeXBlOiBudW1iZXI7XHJcbiAgICBTZW5kZXI6IGFueTtcclxuICAgIFRlcm1pbmF0ZUNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrO1xyXG4gICAgQ29udGludWVDb21tYW5kQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgdHlwZTogbnVtYmVyLFxyXG4gICAgICAgIHNlbmRlcjogYW55LFxyXG4gICAgICAgIHRlcm1pbmF0ZUNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrLFxyXG4gICAgICAgIGNvbnRpbnVlQ29tbWFuZENhbGxiYWNrOiBGdW5jdGlvbixcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuVHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5TZW5kZXIgPSBzZW5kZXI7XHJcbiAgICAgICAgdGhpcy5UZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2sgPSB0ZXJtaW5hdGVDb21tYW5kQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5Db250aW51ZUNvbW1hbmRDYWxsYmFjayA9IGNvbnRpbnVlQ29tbWFuZENhbGxiYWNrO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcbmltcG9ydCB7IEl0ZW1UeXBlLCBJdGVtVHlwZUhlbHBlciB9IGZyb20gJy4uL2VudW1zL0l0ZW1UeXBlJztcbmltcG9ydCB7IEVudGl0eUJhc2UgfSBmcm9tICcuL0VudGl0eUJhc2UnO1xuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuL0l0ZW1MaXN0JztcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcbmltcG9ydCB7IEl0ZW1Mb2NrIH0gZnJvbSAnLi9JdGVtTG9jayc7XG5pbXBvcnQgeyBJdGVtVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvSXRlbVRlbXBsYXRlJztcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XG5cbmV4cG9ydCBjbGFzcyBJdGVtIGV4dGVuZHMgRW50aXR5QmFzZSB7XG4gICAgU3RhY2s/OiBudW1iZXI7XG4gICAgSW52ZW50b3J5PzogSXRlbUxpc3Q7XG4gICAgTG9jaz86IEl0ZW1Mb2NrO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUZW1wbGF0ZSgpOiBJdGVtVGVtcGxhdGUge1xuICAgICAgICByZXR1cm4gR2FtZURhdGEuSXRlbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZSh0aGlzLklkKTtcbiAgICB9XG5cbiAgICBnZXROYW1lKGdyYW1tYUNhc2UgPSBHcmFtbWFDYXNlLk1pYW5vd25paykge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lO1xuICAgICAgICBpZiAoIXRoaXMuaXNTdGFja2FibGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWVbZ3JhbW1hQ2FzZV0gKyBFbmdpbmUuRGVmYXVsdENvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhY2soKSArICcgJyArIHRoaXMuZ2V0UGx1cmFsTmFtZShncmFtbWFDYXNlKSArIEVuZ2luZS5EZWZhdWx0Q29sb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQbHVyYWxOYW1lKGdyYW1tYUNhc2UgPSBHcmFtbWFDYXNlLk1pYW5vd25paykge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKS5OYW1lO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobmFtZVswXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lW2dyYW1tYUNhc2VdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmdldFN0YWNrKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lWzBdW2dyYW1tYUNhc2VdO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZVsxXVtncmFtbWFDYXNlXTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZVsyXVtncmFtbWFDYXNlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldERlc2NyaXB0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLkRlc2NyaXB0aW9uICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcbiAgICB9XG5cbiAgICBnZXRJZGxlKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLklkbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIExvY2FsLkNvbW1hbmRzLkxvb2suRGVmYXVsdElkbGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5JZGxlITtcbiAgICB9XG5cbiAgICBpc0xpZ2h0U291cmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLklzTGlnaHRTb3VyY2UgPT09IHRydWU7XG4gICAgfVxuXG4gICAgaXNTdGFja2FibGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFRlbXBsYXRlKCkuSXNTdGFja2FibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRlbXBsYXRlKCkuSXNTdGFja2FibGU7XG4gICAgfVxuXG4gICAgZ2V0U3RhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLlN0YWNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLlN0YWNrO1xuICAgIH1cblxuICAgIHNldFN0YWNrKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGFja2FibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5TdGFjayA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU3RhY2sodmFsdWU6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5pc1N0YWNrYWJsZSgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5TdGFjayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TdGFjayA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLlN0YWNrICs9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIEl0ZW1UeXBlSGVscGVyLnBhcnNlKHRoaXMuZ2V0VGVtcGxhdGUoKS5UeXBlKTtcbiAgICB9XG5cbiAgICBpc1Rha2VhYmxlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXRpYzpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhdGljQ29udGFpbmVyOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5MZXZlcjpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SW52ZW50b3J5KCk6IEl0ZW1MaXN0IHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLkludmVudG9yeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5JbnZlbnRvcnk7XG4gICAgfVxuXG4gICAgaXNDb250YWluZXIoKSB7XG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5nZXRUZW1wbGF0ZSgpLlR5cGU7XG4gICAgICAgIHJldHVybiB0eXBlID09IEl0ZW1UeXBlLkNvbnRhaW5lciB8fCB0eXBlID09IEl0ZW1UeXBlLlN0YXRpY0NvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBpc0xvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuTG9jaz8uSXNMb2NrZWQgPT09IHRydWU7XG4gICAgfVxuXG4gICAgc2V0SXNMb2NrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuTG9jayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLkxvY2suSXNMb2NrZWQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBFbnRpdHlMaXN0IH0gZnJvbSAnLi9FbnRpdHlMaXN0JztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbUxpc3QgZXh0ZW5kcyBFbnRpdHlMaXN0PEl0ZW0+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkTGlzdDogSXRlbUxpc3QpIHtcclxuICAgICAgICB0aGlzLkFycmF5ID0gc2F2ZWRMaXN0LkFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3SXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgICAgIG5ld0l0ZW0ubG9hZEZyb21TYXZlKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3SXRlbTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQoaXRlbTogSXRlbSB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpdGVtLmlzU3RhY2thYmxlKCkpIHtcclxuICAgICAgICAgICAgbGV0IGV4aXN0aW5nU3RhY2sgPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kQnlJZChpdGVtLklkKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nU3RhY2sgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGV4aXN0aW5nU3RhY2suYWRkU3RhY2soaXRlbS5nZXRTdGFjaygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5hZGQoaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXkuc29tZSgoaSkgPT4gaS5pc0xpZ2h0U291cmNlKCkgPT09IHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IExvY2tUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9Db21tb24nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1Mb2NrIHtcclxuICAgIElzTG9ja2VkOiBib29sZWFuO1xyXG4gICAgS2V5SWQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHRlbXBsYXRlOiBMb2NrVGVtcGxhdGUpIHtcclxuICAgICAgICB0aGlzLklzTG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLktleUlkID0gJyc7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XHJcblxyXG5jbGFzcyBJdGVtVGVtcGxhdGVzTGlzdCB7XHJcbiAgICBbdGVtcGxhdGVJZDogc3RyaW5nXTogSXRlbVRlbXBsYXRlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbVRlbXBsYXRlcyB7XHJcbiAgICBsaXN0OiBJdGVtVGVtcGxhdGVzTGlzdCA9IG5ldyBJdGVtVGVtcGxhdGVzTGlzdCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1UZW1wbGF0ZXM6IEl0ZW1UZW1wbGF0ZVtdIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1UZW1wbGF0ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlbVRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdGVtcGxhdGVzIG11c3QgYmUgYW4gYXJyYXknO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbVRlbXBsYXRlcy5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdJdGVtVGVtcGxhdGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5ld0l0ZW1UZW1wbGF0ZShpdGVtVGVtcGxhdGU6IEl0ZW1UZW1wbGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmxpc3RbaXRlbVRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoaXRlbVRlbXBsYXRlLklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0W2l0ZW1UZW1wbGF0ZS5JZF0gPSBpdGVtVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUoaXRlbUlkOiBzdHJpbmcpOiBJdGVtVGVtcGxhdGUge1xyXG4gICAgICAgIGlmICh0aGlzLmxpc3RbaXRlbUlkXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdObyBpdGVtIHRlbXBsYXRlIGRlZmluZWQgZm9yIHswfSEnLmZvcm1hdChpdGVtSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0W2l0ZW1JZF07XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEl0ZW1UeXBlcyB7XHJcbiAgICBbaXRlbVR5cGVJZDogc3RyaW5nXTogYW55O1xyXG4gICAgY29uc3RydWN0b3IoaXRlbVR5cGVzVGVtcGxhdGU6IGFueSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChpdGVtVHlwZXNUZW1wbGF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpdGVtVHlwZXNUZW1wbGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdHlwZXMgdGVtcGxhdGUgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtVHlwZXNUZW1wbGF0ZS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5BZGROZXdJdGVtVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgQWRkTmV3SXRlbVR5cGUoaXRlbVR5cGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzW2l0ZW1UeXBlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHR5cGUgezB9IGlzIGFscmVhZHkgZGVmaW5lZCEnLmZvcm1hdChpdGVtVHlwZS5JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXNbaXRlbVR5cGUuSWRdID0gaXRlbVR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgR2V0SXRlbVR5cGUoaXRlbVR5cGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpc1tpdGVtVHlwZU5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdHlwZSAnICsgaXRlbVR5cGVOYW1lICsgJyBpcyBub3QgZGVmaW5lZCEnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1tpdGVtVHlwZU5hbWVdO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQ2hhcmFjdGVyIHtcclxuICAgIExvY2F0aW9uOiBudW1iZXIgPSAwO1xyXG4gICAgUHJldmlvdXNMb2NhdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZFBsYXllcjogUGxheWVyKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZFBsYXllcik7XHJcbiAgICAgICAgc3VwZXIubG9hZEZyb21TYXZlKHNhdmVkUGxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRMb2NhdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkxvY2F0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExvY2F0aW9uKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLkxvY2F0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJldmlvdXNMb2NhdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLlByZXZpb3VzTG9jYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJldmlvdXNMb2NhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5QcmV2aW91c0xvY2F0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuU2VlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5nZXRSb29tKHRoaXMuTG9jYXRpb24pO1xyXG4gICAgICAgIHJldHVybiByb29tLmhhc0xpZ2h0U291cmNlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXJMaXN0IH0gZnJvbSAnLi9DaGFyYWN0ZXJMaXN0JztcclxuaW1wb3J0IHsgR2FtZURhdGEgfSBmcm9tICcuL0dhbWVEYXRhJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgUm9vbUV4aXQgfSBmcm9tICcuL1Jvb21FeGl0JztcclxuaW1wb3J0IHsgUm9vbUV4aXRzTGlzdCB9IGZyb20gJy4vUm9vbUV4aXRzTGlzdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgUm9vbSB7XHJcbiAgICBJZDogbnVtYmVyID0gMDtcclxuICAgIEV4aXRzOiBSb29tRXhpdHNMaXN0ID0gbmV3IFJvb21FeGl0c0xpc3QoKTtcclxuICAgIElzVmlzaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgSXRlbXM6IEl0ZW1MaXN0ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICBDaGFyYWN0ZXJzOiBDaGFyYWN0ZXJMaXN0ID0gbmV3IENoYXJhY3Rlckxpc3QoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgbG9hZEZyb21TYXZlKHNhdmVkUm9vbTogUm9vbSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2F2ZWRSb29tKTtcclxuICAgICAgICB0aGlzLkV4aXRzID0gbmV3IFJvb21FeGl0c0xpc3QoKTtcclxuICAgICAgICBmb3IgKGxldCBleGl0S2V5IGluIHNhdmVkUm9vbS5FeGl0cykge1xyXG4gICAgICAgICAgICB0aGlzLkV4aXRzW2V4aXRLZXldID0gbmV3IFJvb21FeGl0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuRXhpdHNbZXhpdEtleV0ubG9hZEZyb21TYXZlKHNhdmVkUm9vbS5FeGl0c1tleGl0S2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuSXRlbXMgPSBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB0aGlzLkl0ZW1zLmxvYWRGcm9tU2F2ZShzYXZlZFJvb20uSXRlbXMpO1xyXG4gICAgICAgIHRoaXMuQ2hhcmFjdGVycyA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJzLmxvYWRGcm9tU2F2ZShzYXZlZFJvb20uQ2hhcmFjdGVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIEdhbWVEYXRhLlJvb21UZW1wbGF0ZXMuZ2V0VGVtcGxhdGUodGhpcy5JZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW1wbGF0ZSgpLk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGVzY3JpcHRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5EZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJdGVtcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFyYWN0ZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkNoYXJhY3RlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhpdChkaXJlY3Rpb246IERpcmVjdGlvbik6IFJvb21FeGl0IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKHRoaXMuRXhpdHNbZGlyZWN0aW9uXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5FeGl0c1tkaXJlY3Rpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEV4aXRzRGlyZWN0aW9ucygpOiBEaXJlY3Rpb25bXSB7XHJcbiAgICAgICAgcmV0dXJuIERpcmVjdGlvbkhlbHBlci5wYXJzZUFycmF5KE9iamVjdC5rZXlzKHRoaXMuRXhpdHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRUZW1wbGF0ZSgpLklzTmF0dXJhbExpZ2h0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5nZXRJdGVtcygpLmhhc0xpZ2h0U291cmNlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENoYXJhY3RlcnMoKS5oYXNMaWdodFNvdXJjZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9uRmlyc3RFbnRlckV2ZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldFRlbXBsYXRlKCkuT25GaXJzdEVudGVyRXZlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5PbkZpcnN0RW50ZXJFdmVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPbkVudGVyRXZlbnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VGVtcGxhdGUoKS5PbkVudGVyRXZlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVtcGxhdGUoKS5PbkVudGVyRXZlbnQ7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFJvb21Eb29yIHtcclxuICAgIElzTG9ja2VkPzogYm9vbGVhbjtcclxuICAgIElzQ2xvc2VkPzogYm9vbGVhbjtcclxuICAgIEtleUlkPzogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZERvb3I6IFJvb21Eb29yKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZERvb3IpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFJvb21Eb29yIH0gZnJvbSAnLi9Sb29tRG9vcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUm9vbUV4aXQge1xyXG4gICAgUm9vbUlkOiBudW1iZXIgPSAwO1xyXG4gICAgSXNIaWRkZW4/OiBib29sZWFuO1xyXG4gICAgRG9vcj86IFJvb21Eb29yO1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIGxvYWRGcm9tU2F2ZShzYXZlZEV4aXQ6IFJvb21FeGl0KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBzYXZlZEV4aXQpO1xyXG4gICAgICAgIGlmIChzYXZlZEV4aXQuRG9vciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuRG9vciA9IG5ldyBSb29tRG9vcigpO1xyXG4gICAgICAgICAgICB0aGlzLkRvb3IubG9hZEZyb21TYXZlKHNhdmVkRXhpdC5Eb29yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Um9vbUlkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLlJvb21JZDtcclxuICAgIH1cclxuXHJcbiAgICBpc0Rvb3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRG9vciAhPT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQ2xvc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkRvb3I/LklzQ2xvc2VkID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTG9ja2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkRvb3I/LklzTG9ja2VkID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzSGlkZGVuKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklzSGlkZGVuID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEtleUlkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLkRvb3I/LktleUlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkRvb3IuS2V5SWQhO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFJvb21FeGl0IH0gZnJvbSAnLi9Sb29tRXhpdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgUm9vbUV4aXRzTGlzdCB7XHJcbiAgICBbZGlyZWN0aW9uOiBzdHJpbmddOiBSb29tRXhpdDtcclxufVxyXG4iLCJpbXBvcnQgeyBSb29tVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvUm9vbVRlbXBsYXRlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tVGVtcGxhdGVzIHtcclxuICAgIFt0ZW1wbGF0ZUlkOiBudW1iZXJdOiBSb29tVGVtcGxhdGU7XHJcbiAgICBUZW1wbGF0ZXM6IFJvb21UZW1wbGF0ZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Iocm9vbVRlbXBsYXRlcz86IGFueSkge1xyXG4gICAgICAgIGlmIChyb29tVGVtcGxhdGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJvb21UZW1wbGF0ZXMpKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdSb29tIHRlbXBsYXRlcyBtdXN0IGJlIGFuIGFycmF5JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvb21UZW1wbGF0ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3Um9vbVRlbXBsYXRlKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGROZXdSb29tVGVtcGxhdGUocm9vbVRlbXBsYXRlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpc1tyb29tVGVtcGxhdGUuSWRdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ1Jvb20gdGVtcGxhdGUgezB9IGlzIGFscmVhZHkgZGVmaW5lZCEnLmZvcm1hdChyb29tVGVtcGxhdGUuSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzW3Jvb21UZW1wbGF0ZS5JZF0gPSByb29tVGVtcGxhdGU7XHJcbiAgICAgICAgdGhpcy5UZW1wbGF0ZXNbcm9vbVRlbXBsYXRlLklkXSA9IHJvb21UZW1wbGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZW1wbGF0ZShyb29tSWQ6IG51bWJlcik6IFJvb21UZW1wbGF0ZSB7XHJcbiAgICAgICAgaWYgKHRoaXNbcm9vbUlkXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdObyBSb29tIHRlbXBsYXRlIGRlZmluZWQgZm9yIElkIHswfSEnLmZvcm1hdChyb29tSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1tyb29tSWRdO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4vY29tbWFuZHNVdGlscy9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4vY29tbWFuZHNVdGlscy9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBQcm9tcHQgfSBmcm9tICcuL2NvbW1vbkxvZ2ljL1Byb21wdCc7XHJcbmltcG9ydCB7IEluaXRDb21tYW5kcyB9IGZyb20gJy4vY29tbWFuZHNVdGlscy9Jbml0Q29tbWFuZHMnO1xyXG5pbXBvcnQgeyBHYW1lLCBJbml0R2FtZURhdGEsIFZlcnNpb24gfSBmcm9tICcuL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCAnLi9jb21tb25Mb2dpYy9JbnB1dEZ1bmN0aW9ucyc7XHJcbmltcG9ydCAnLi9jb21tb25Mb2dpYy9TdHJpbmdVdGlscyc7XHJcblxyXG5mdW5jdGlvbiBJbml0KCkge1xyXG4gICAgSW5pdEdhbWVEYXRhKCk7XHJcbiAgICBJbml0Q29tbWFuZHMoKTtcclxuICAgIEVuZ2luZS5PdXRwdXQoJ0R1bmdlb24gQ3Jhd2xlciAyLCB3ZXJzamE6Jyk7XHJcbiAgICBFbmdpbmUuT3V0cHV0KFZlcnNpb24pO1xyXG4gICAgQ29tbWFuZHMuR28uY2hhbmdlUGxheWVyTG9jYXRpb24oXHJcbiAgICAgICAgR2FtZS5nZXRSb29tKEdhbWUuU3RhcnRpbmdSb29tKSxcclxuICAgICAgICBuZXcgQ29tbWFuZENhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgICAgIFByb21wdC5QcmludCgpO1xyXG4gICAgICAgIH0pLFxyXG4gICAgKTtcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZnVuY3Rpb24gSW5pdCgpOiB2b2lkO1xyXG59XHJcbmdsb2JhbFRoaXMuSW5pdCA9IEluaXQ7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==