/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/CommandCallback.ts":
/*!********************************!*\
  !*** ./src/CommandCallback.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CommandCallback": () => (/* binding */ CommandCallback)
/* harmony export */ });
var CommandCallback = /** @class */ (function () {
    function CommandCallback(callback) {
        this.callback = callback;
        this.callbackCalled = false;
        this.interruptFlow = false;
    }
    /** If command can cause interruptFlow, make sure to call this method at the end of command execution */
    CommandCallback.prototype.CallIfNotCalled = function () {
        if (!this.callbackCalled) {
            this.callback();
            this.callbackCalled = true;
        }
    };
    return CommandCallback;
}());



/***/ }),

/***/ "./src/CommandParser.ts":
/*!******************************!*\
  !*** ./src/CommandParser.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CommandParser": () => (/* binding */ CommandParser)
/* harmony export */ });
var CommandParser = /** @class */ (function () {
    function CommandParser(commandString) {
        this.commandString = commandString;
        this.parsedCommand = '';
        this.parsedArguments = null;
        this.parsedNumbers = null;
        this.parsedCount = null;
    }
    CommandParser.prototype.getCommand = function () {
        if (this.parsedCommand === '') {
            this.parseCommand();
        }
        this.parsedCommand = this.parsedCommand.toLowerCase();
        return this.parsedCommand;
    };
    CommandParser.prototype.parseCommand = function () {
        var spaceIndex = this.commandString.indexOf(' ');
        if (spaceIndex === -1) {
            this.parsedCommand = this.commandString;
        }
        else {
            this.parsedCommand = this.commandString.slice(0, spaceIndex);
        }
    };
    CommandParser.prototype.getArgument = function (index) {
        if (this.parsedArguments === null) {
            this.parseArguments();
        }
        if (this.parsedArguments === null || this.parsedArguments[index] === undefined) {
            return null;
        }
        return this.parsedArguments[index];
    };
    CommandParser.prototype.getNumber = function (index) {
        if (this.parsedNumbers === null) {
            this.parseArguments();
        }
        if (this.parsedNumbers === null || this.parsedNumbers[index] === undefined) {
            return 1;
        }
        return this.parsedNumbers[index];
    };
    CommandParser.prototype.getCount = function (index) {
        if (this.parsedCount === null) {
            this.parseArguments();
        }
        if (this.parsedCount === null || this.parsedCount[index] === undefined) {
            return null;
        }
        return this.parsedCount[index];
    };
    CommandParser.prototype.parseArguments = function () {
        this.parsedArguments = [];
        this.parsedNumbers = [];
        this.parsedCount = [];
        var startIndex = this.commandString.indexOf(' ');
        var endIndex;
        var currentCommand = this.commandString;
        var currentArgumentNumber = 0;
        while (startIndex !== -1) {
            startIndex++;
            currentArgumentNumber++;
            var parsedNumber = null;
            var parsedCount = null;
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
                var currentIndex = 1;
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
    };
    return CommandParser;
}());



/***/ }),

/***/ "./src/CommandTree.ts":
/*!****************************!*\
  !*** ./src/CommandTree.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CommandTree": () => (/* binding */ CommandTree)
/* harmony export */ });
/* harmony import */ var _commands_Command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commands/Command */ "./src/commands/Command.ts");

var CommandTree = /** @class */ (function () {
    function CommandTree() {
        this.root = { command: null };
    }
    CommandTree.prototype.AddNewCommand = function (name, object) {
        if (!name || name === '') {
            throw 'New command name cannot be null or empty';
        }
        this.ValidateCommandObject(object);
        var currentNode = this.root;
        name.toLowerCase()
            .split('')
            .forEach(function (currentChar) {
            if (currentNode[currentChar] === undefined) {
                currentNode[currentChar] = { command: object };
            }
            currentNode = currentNode[currentChar];
        });
    };
    CommandTree.prototype.SetDefaultCommand = function (object) {
        this.ValidateCommandObject(object);
        this.root.command = object;
    };
    CommandTree.prototype.ValidateCommandObject = function (object) {
        if (object === undefined || object === null) {
            throw 'Command object cannot be null';
        }
        if (!(object instanceof _commands_Command__WEBPACK_IMPORTED_MODULE_0__.Command)) {
            throw 'Command object must extend Command class';
        }
    };
    CommandTree.prototype.GetCommand = function (name) {
        var _this = this;
        var currentNode = this.root;
        name.toLowerCase()
            .split('')
            .some(function (currentChar) {
            if (currentNode[currentChar] === undefined) {
                //command not found- return default command
                currentNode = _this.root;
                return true;
            }
            currentNode = currentNode[currentChar];
            return false;
        });
        return currentNode.command;
    };
    return CommandTree;
}());



/***/ }),

/***/ "./src/CommandsManager.ts":
/*!********************************!*\
  !*** ./src/CommandsManager.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Commands": () => (/* binding */ Commands)
/* harmony export */ });
/* harmony import */ var _CommandCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CommandCallback */ "./src/CommandCallback.ts");
/* harmony import */ var _CommandParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CommandParser */ "./src/CommandParser.ts");
/* harmony import */ var _CommandTree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CommandTree */ "./src/CommandTree.ts");
/* harmony import */ var _commonLogic_Prompt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commonLogic/Prompt */ "./src/commonLogic/Prompt.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var CommandList = /** @class */ (function () {
    function CommandList() {
    }
    return CommandList;
}());
var CommandsManager = /** @class */ (function (_super) {
    __extends(CommandsManager, _super);
    function CommandsManager() {
        var _this = _super.call(this) || this;
        _this.Commands = {};
        _this.Tree = new _CommandTree__WEBPACK_IMPORTED_MODULE_2__.CommandTree();
        _this.isCommandExecuting = false;
        _this.commandQueue = [];
        return _this;
    }
    CommandsManager.prototype.Execute = function (command) {
        this.commandQueue.push(command);
        if (this.isCommandExecuting === false) {
            this.isCommandExecuting = true;
            this.ExecuteNext();
        }
    };
    CommandsManager.prototype.ExecuteNext = function () {
        var _this = this;
        if (this.commandQueue.length <= 0) {
            this.isCommandExecuting = false;
            return;
        }
        var command = this.commandQueue[0];
        this.commandQueue.shift();
        var parser = new _CommandParser__WEBPACK_IMPORTED_MODULE_1__.CommandParser(command);
        var commandName = parser.getCommand();
        var commandObject = this.Tree.GetCommand(commandName);
        if (commandObject === undefined || commandObject === null) {
            throw 'Command object for {0} not found'.format(commandName);
        }
        Engine.Output('');
        commandObject.Execute(parser, new _CommandCallback__WEBPACK_IMPORTED_MODULE_0__.CommandCallback(function () { return _this.AfterExecute(); }));
    };
    CommandsManager.prototype.AfterExecute = function () {
        Engine.Output('');
        _commonLogic_Prompt__WEBPACK_IMPORTED_MODULE_3__.Prompt.Print();
        this.ExecuteNext();
    };
    CommandsManager.prototype.SetDefaultCommand = function (commandObject) {
        this.Tree.SetDefaultCommand(commandObject);
    };
    CommandsManager.prototype.RegisterCommand = function (name, object) {
        this.Tree.AddNewCommand(name, object);
        var commandList = this;
        commandList[name] = object;
    };
    return CommandsManager;
}(CommandList));
var Commands = new CommandsManager();


/***/ }),

/***/ "./src/GlobalEvents.ts":
/*!*****************************!*\
  !*** ./src/GlobalEvents.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobalEvents": () => (/* binding */ GlobalEvents)
/* harmony export */ });
/* harmony import */ var _commonLogic_EngineUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commonLogic/EngineUtils */ "./src/commonLogic/EngineUtils.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InitGameData */ "./src/InitGameData.ts");


var GlobalEventsClass = /** @class */ (function () {
    function GlobalEventsClass() {
    }
    GlobalEventsClass.prototype.TestGlobalEvent = function (args) {
        _commonLogic_EngineUtils__WEBPACK_IMPORTED_MODULE_0__.EngineUtils.OutputPrinter(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.GlobalEvents.TestGlobalEvent.Message, args.ContinueCommandCallback);
        return true;
    };
    return GlobalEventsClass;
}());
var GlobalEvents = new GlobalEventsClass();


/***/ }),

/***/ "./src/InitCommands.ts":
/*!*****************************!*\
  !*** ./src/InitCommands.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InitCommands": () => (/* binding */ InitCommands)
/* harmony export */ });
/* harmony import */ var _commands_Down__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commands/Down */ "./src/commands/Down.ts");
/* harmony import */ var _commands_Drop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commands/Drop */ "./src/commands/Drop.ts");
/* harmony import */ var _commands_East__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./commands/East */ "./src/commands/East.ts");
/* harmony import */ var _commands_Eval__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commands/Eval */ "./src/commands/Eval.ts");
/* harmony import */ var _commands_Go__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./commands/Go */ "./src/commands/Go.ts");
/* harmony import */ var _commands_Inventory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./commands/Inventory */ "./src/commands/Inventory.ts");
/* harmony import */ var _commands_Json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./commands/Json */ "./src/commands/Json.ts");
/* harmony import */ var _commands_Look__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./commands/Look */ "./src/commands/Look.ts");
/* harmony import */ var _commands_NoCommand__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./commands/NoCommand */ "./src/commands/NoCommand.ts");
/* harmony import */ var _commands_North__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./commands/North */ "./src/commands/North.ts");
/* harmony import */ var _commands_Reload__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./commands/Reload */ "./src/commands/Reload.ts");
/* harmony import */ var _commands_Scan__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./commands/Scan */ "./src/commands/Scan.ts");
/* harmony import */ var _commands_South__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./commands/South */ "./src/commands/South.ts");
/* harmony import */ var _commands_Take__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./commands/Take */ "./src/commands/Take.ts");
/* harmony import */ var _commands_Test__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./commands/Test */ "./src/commands/Test.ts");
/* harmony import */ var _commands_Up__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./commands/Up */ "./src/commands/Up.ts");
/* harmony import */ var _commands_West__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./commands/West */ "./src/commands/West.ts");
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./CommandsManager */ "./src/CommandsManager.ts");


















function InitCommands() {
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.SetDefaultCommand(new _commands_NoCommand__WEBPACK_IMPORTED_MODULE_8__.NoCommand());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Down', new _commands_Down__WEBPACK_IMPORTED_MODULE_0__.Down());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Drop', new _commands_Drop__WEBPACK_IMPORTED_MODULE_1__.Drop());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('East', new _commands_East__WEBPACK_IMPORTED_MODULE_2__.East());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Eval', new _commands_Eval__WEBPACK_IMPORTED_MODULE_3__.Eval());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Go', new _commands_Go__WEBPACK_IMPORTED_MODULE_4__.Go());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Inventory', new _commands_Inventory__WEBPACK_IMPORTED_MODULE_5__.Inventory());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Json', new _commands_Json__WEBPACK_IMPORTED_MODULE_6__.Json());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Look', new _commands_Look__WEBPACK_IMPORTED_MODULE_7__.Look());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('North', new _commands_North__WEBPACK_IMPORTED_MODULE_9__.North());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Reload', new _commands_Reload__WEBPACK_IMPORTED_MODULE_10__.Reload());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('South', new _commands_South__WEBPACK_IMPORTED_MODULE_12__.South());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Scan', new _commands_Scan__WEBPACK_IMPORTED_MODULE_11__.Scan());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Take', new _commands_Take__WEBPACK_IMPORTED_MODULE_13__.Take());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Test', new _commands_Test__WEBPACK_IMPORTED_MODULE_14__.Test());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('Up', new _commands_Up__WEBPACK_IMPORTED_MODULE_15__.Up());
    _CommandsManager__WEBPACK_IMPORTED_MODULE_17__.Commands.RegisterCommand('West', new _commands_West__WEBPACK_IMPORTED_MODULE_16__.West());
}


/***/ }),

/***/ "./src/InitGameData.ts":
/*!*****************************!*\
  !*** ./src/InitGameData.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Local": () => (/* binding */ Local),
/* harmony export */   "Game": () => (/* binding */ Game),
/* harmony export */   "Version": () => (/* binding */ Version),
/* harmony export */   "InitGameData": () => (/* binding */ InitGameData)
/* harmony export */ });
/* harmony import */ var _res_ItemTypes_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../res/ItemTypes.json */ "./res/ItemTypes.json");
/* harmony import */ var _res_Items_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../res/Items.json */ "./res/Items.json");
/* harmony import */ var _res_Characters_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../res/Characters.json */ "./res/Characters.json");
/* harmony import */ var _res_Local_pl_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../res/Local.pl.json */ "./res/Local.pl.json");
/* harmony import */ var _model_Game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/Game */ "./src/model/Game.ts");
/* harmony import */ var _model_ItemTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./model/ItemTypes */ "./src/model/ItemTypes.ts");
/* harmony import */ var _model_CharacterTemplates__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./model/CharacterTemplates */ "./src/model/CharacterTemplates.ts");
/* harmony import */ var _model_ItemTemplates__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./model/ItemTemplates */ "./src/model/ItemTemplates.ts");
/* harmony import */ var _model_GameData__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./model/GameData */ "./src/model/GameData.ts");









var Local = {};
var Game = new _model_Game__WEBPACK_IMPORTED_MODULE_4__.GameModel();
var Version = '';
function InitGameData() {
    Game = new _model_Game__WEBPACK_IMPORTED_MODULE_4__.GameModel();
    Game.LoadFromTemplate();
    _model_GameData__WEBPACK_IMPORTED_MODULE_8__.GameData.ItemTypes = new _model_ItemTypes__WEBPACK_IMPORTED_MODULE_5__.ItemTypesModel(_res_ItemTypes_json__WEBPACK_IMPORTED_MODULE_0__.ItemTypes);
    _model_GameData__WEBPACK_IMPORTED_MODULE_8__.GameData.ItemTemplates = new _model_ItemTemplates__WEBPACK_IMPORTED_MODULE_7__.ItemTemplatesModel(_res_Items_json__WEBPACK_IMPORTED_MODULE_1__.ItemsTemplates);
    _model_GameData__WEBPACK_IMPORTED_MODULE_8__.GameData.CharacterTemplates = new _model_CharacterTemplates__WEBPACK_IMPORTED_MODULE_6__.CharacterTemplatesModel(_res_Characters_json__WEBPACK_IMPORTED_MODULE_2__.CharactersTemplates);
    Local = _res_Local_pl_json__WEBPACK_IMPORTED_MODULE_3__.Local;
    Version = Engine.LoadData('version.txt').replace('\n', Engine.EndLine);
    Game.Player.Location = Game.StartingRoom;
}


/***/ }),

/***/ "./src/Utils.ts":
/*!**********************!*\
  !*** ./src/Utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};
String.prototype.startWithUpper = function () {
    return this[0].toUpperCase() + this.slice(1);
};
String.prototype.isNumber = function () {
    return /^\d+$/.test(this);
};
String.prototype.isNullOrEmpty = function () {
    return this === null || this === '';
};



/***/ }),

/***/ "./src/commands/Command.ts":
/*!*********************************!*\
  !*** ./src/commands/Command.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Command": () => (/* binding */ Command)
/* harmony export */ });
var Command = /** @class */ (function () {
    function Command() {
    }
    Command.prototype.Execute = function (command, commandCallback) {
        this.ExecuteBody(command, commandCallback);
        if (!commandCallback.interruptFlow) {
            commandCallback.CallIfNotCalled();
        }
    };
    Command.prototype.ExecuteBody = function (command, commandCallback) { };
    return Command;
}());



/***/ }),

/***/ "./src/commands/Down.ts":
/*!******************************!*\
  !*** ./src/commands/Down.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Down": () => (/* binding */ Down)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Down = /** @class */ (function (_super) {
    __extends(Down, _super);
    function Down() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Down.prototype.ExecuteBody = function (_command, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Go.goToDirection(_enums_Direction__WEBPACK_IMPORTED_MODULE_1__.Direction.down, commandCallback);
    };
    return Down;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/Drop.ts":
/*!******************************!*\
  !*** ./src/commands/Drop.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Drop": () => (/* binding */ Drop)
/* harmony export */ });
/* harmony import */ var _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Drop = /** @class */ (function (_super) {
    __extends(Drop, _super);
    function Drop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Drop.prototype.ExecuteBody = function (command) {
        var argument = command.getArgument(1);
        if (argument === null) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Drop.NoArgument);
            return;
        }
        if (argument.toLowerCase() === 'all') {
            if (!_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.getInventory().any()) {
                Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Drop.NoItems);
                return;
            }
            this.dropAll();
        }
        else {
            var item = _InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.getInventory().find(argument, command.getNumber(1));
            if (item === null) {
                Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Drop.NoItemFound.format(argument));
                return;
            }
            this.dropItem(item);
        }
    };
    Drop.prototype.dropAll = function () {
        while (_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.getInventory().any()) {
            this.dropItem(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.getInventory().elementAt(0));
        }
    };
    Drop.prototype.dropItem = function (item) {
        _InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.getInventory().remove(item);
        _InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.Location).getItems().add(item);
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Drop.Dropped.format(item.getName(_enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__.GrammaCase.Biernik)));
    };
    return Drop;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/East.ts":
/*!******************************!*\
  !*** ./src/commands/East.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "East": () => (/* binding */ East)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var East = /** @class */ (function (_super) {
    __extends(East, _super);
    function East() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    East.prototype.ExecuteBody = function (_, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Go.goToDirection(_enums_Direction__WEBPACK_IMPORTED_MODULE_1__.Direction.east, commandCallback);
    };
    return East;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/Eval.ts":
/*!******************************!*\
  !*** ./src/commands/Eval.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Eval": () => (/* binding */ Eval)
/* harmony export */ });
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Eval = /** @class */ (function (_super) {
    __extends(Eval, _super);
    function Eval() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Eval.prototype.ExecuteBody = function (command) {
        var argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        Engine.Output(eval(argument));
    };
    return Eval;
}(_Command__WEBPACK_IMPORTED_MODULE_0__.Command));



/***/ }),

/***/ "./src/commands/Go.ts":
/*!****************************!*\
  !*** ./src/commands/Go.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Go": () => (/* binding */ Go)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _enums_GlobalEventType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums/GlobalEventType */ "./src/enums/GlobalEventType.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _model_GlobalEventArgs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../model/GlobalEventArgs */ "./src/model/GlobalEventArgs.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var Go = /** @class */ (function (_super) {
    __extends(Go, _super);
    function Go() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Go.prototype.ExecuteBody = function (command, commandCallback) {
        var direction = null;
        var argument = command.getArgument(1);
        if (argument !== null) {
            direction = _enums_Direction__WEBPACK_IMPORTED_MODULE_1__.DirectionHelper.parseShort(argument.toLowerCase());
        }
        if (direction === null) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_3__.Local.Commands.Go.WrongDirection);
            return;
        }
        this.goToDirection(direction, commandCallback);
    };
    Go.prototype.goToDirection = function (direction, commandCallback) {
        var exit = _InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.Player.getLocation()).getExit(direction);
        if (exit === null || exit.isHidden()) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_3__.Local.Commands.Go.NoPassage);
            return;
        }
        if (exit.isClosed()) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_3__.Local.Commands.Go.PassageClosed);
            return;
        }
        var newRoom = _InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.GetRoom(exit.GetRoomId());
        _InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.Player.setPreviousLocation(_InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.Player.getLocation());
        this.changePlayerLocation(newRoom, commandCallback);
    };
    Go.prototype.changePlayerLocation = function (room, commandCallback) {
        var _this = this;
        _InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.Player.Location = room.Id;
        room.IsVisited = true;
        this.onEnterGlobalEvents(room, function () { return _this.afterOnEnterGlobalEvents(room, commandCallback); }, commandCallback);
    };
    Go.prototype.afterOnEnterGlobalEvents = function (room, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Look.lookRoom(room);
        //TODO: Zdarzenia przy wejściu
        commandCallback.CallIfNotCalled();
    };
    Go.prototype.onEnterGlobalEvents = function (room, continueCallback, finishCallback) {
        if (room.getOnFirstEnterEvent() !== null) {
            var interrupt = _InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.InvokeGlobalEvent(room.getOnFirstEnterEvent(), new _model_GlobalEventArgs__WEBPACK_IMPORTED_MODULE_4__.GlobalEventArgs(_enums_GlobalEventType__WEBPACK_IMPORTED_MODULE_2__.GlobalEventType.BeforeRoomEnter, room, finishCallback, continueCallback));
            delete room.OnFirstEnterEvent;
            if (interrupt === true) {
                finishCallback.interruptFlow = true;
                return;
            }
        }
        if (room.getOnEnterEvent() !== null) {
            var interrupt = _InitGameData__WEBPACK_IMPORTED_MODULE_3__.Game.InvokeGlobalEvent(room.getOnEnterEvent(), new _model_GlobalEventArgs__WEBPACK_IMPORTED_MODULE_4__.GlobalEventArgs(_enums_GlobalEventType__WEBPACK_IMPORTED_MODULE_2__.GlobalEventType.BeforeRoomEnter, room, finishCallback, continueCallback));
            if (interrupt === true) {
                finishCallback.interruptFlow = true;
                return;
            }
        }
        continueCallback();
    };
    return Go;
}(_Command__WEBPACK_IMPORTED_MODULE_5__.Command));



/***/ }),

/***/ "./src/commands/Inventory.ts":
/*!***********************************!*\
  !*** ./src/commands/Inventory.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Inventory": () => (/* binding */ Inventory)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Inventory = /** @class */ (function (_super) {
    __extends(Inventory, _super);
    function Inventory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Inventory.prototype.ExecuteBody = function (command) {
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Local.Commands.Inventory.YourItems);
        if (!_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.Player.getInventory().any()) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Local.Commands.Inventory.NoItems.format(Engine.NonBreakingSpace.repeat(4)));
        }
        else {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.Player.getInventory().printShortFormat());
        }
    };
    return Inventory;
}(_Command__WEBPACK_IMPORTED_MODULE_1__.Command));



/***/ }),

/***/ "./src/commands/Json.ts":
/*!******************************!*\
  !*** ./src/commands/Json.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Json": () => (/* binding */ Json)
/* harmony export */ });
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Json = /** @class */ (function (_super) {
    __extends(Json, _super);
    function Json() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Json.prototype.ExecuteBody = function (command) {
        var argument = command.getArgument(1);
        if (argument === null) {
            return;
        }
        Engine.Output(JSON.stringify(eval(argument)));
    };
    return Json;
}(_Command__WEBPACK_IMPORTED_MODULE_0__.Command));



/***/ }),

/***/ "./src/commands/Look.ts":
/*!******************************!*\
  !*** ./src/commands/Look.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Look": () => (/* binding */ Look)
/* harmony export */ });
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Look = /** @class */ (function (_super) {
    __extends(Look, _super);
    function Look() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Look.prototype.ExecuteBody = function (command) {
        var room = _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.Location);
        if (!_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.canSee()) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Look.CantSee);
            return;
        }
        var argument = command.getArgument(1);
        if (argument === null) {
            this.lookRoom(room);
            return;
        }
        var character = room.getCharacters().find(argument, command.getNumber(1));
        if (character !== null) {
            this.lookCharacter(character);
            return;
        }
        var item = room.getItems().find(argument, command.getNumber(1));
        if (item !== null) {
            this.lookItem(item);
            return;
        }
        item = _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.getInventory().find(argument, command.getNumber(1));
        if (item !== null) {
            this.lookItem(item);
            return;
        }
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Look.NoObject.format(command.getArgument(1)));
    };
    Look.prototype.lookRoom = function (room) {
        var message = '';
        message += room.getName() + Engine.EndLine;
        message += this.exitsString(room) + Engine.EndLine;
        message += Engine.EndLine;
        message += room.Description;
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
    };
    Look.prototype.lookItem = function (item) {
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Look.YouLookAt.format(item.getName(_enums_GrammaCase__WEBPACK_IMPORTED_MODULE_1__.GrammaCase.Celownik)));
        Engine.Output(item.getDescription());
    };
    Look.prototype.lookCharacter = function (character) {
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Look.YouLookAt.format(character.getName(_enums_GrammaCase__WEBPACK_IMPORTED_MODULE_1__.GrammaCase.Celownik)));
        Engine.Output(character.getDescription());
        //TODO: stan zdrowia
    };
    Look.prototype.exitsString = function (room) {
        var returnString = '|g' + _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Look.Exits + ': [ ';
        var firstExit = true;
        var directions = room.getExitsDirections();
        directions.forEach(function (direction) {
            if (!firstExit) {
                returnString += ', ';
            }
            firstExit = false;
            returnString += _enums_Direction__WEBPACK_IMPORTED_MODULE_0__.DirectionHelper.getLocale(direction);
        });
        returnString += ' ]|W';
        return returnString;
    };
    return Look;
}(_Command__WEBPACK_IMPORTED_MODULE_3__.Command));



/***/ }),

/***/ "./src/commands/NoCommand.ts":
/*!***********************************!*\
  !*** ./src/commands/NoCommand.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoCommand": () => (/* binding */ NoCommand)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var NoCommand = /** @class */ (function (_super) {
    __extends(NoCommand, _super);
    function NoCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoCommand.prototype.ExecuteBody = function (_) {
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Local.Commands.NoCommand.NoCommand);
    };
    return NoCommand;
}(_Command__WEBPACK_IMPORTED_MODULE_1__.Command));



/***/ }),

/***/ "./src/commands/North.ts":
/*!*******************************!*\
  !*** ./src/commands/North.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "North": () => (/* binding */ North)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var North = /** @class */ (function (_super) {
    __extends(North, _super);
    function North() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    North.prototype.ExecuteBody = function (_, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Go.goToDirection(_enums_Direction__WEBPACK_IMPORTED_MODULE_1__.Direction.north, commandCallback);
    };
    return North;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/Reload.ts":
/*!********************************!*\
  !*** ./src/commands/Reload.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Reload": () => (/* binding */ Reload)
/* harmony export */ });
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Reload = /** @class */ (function (_super) {
    __extends(Reload, _super);
    function Reload() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Reload.prototype.ExecuteBody = function (command) {
        Engine.Reload();
    };
    return Reload;
}(_Command__WEBPACK_IMPORTED_MODULE_0__.Command));



/***/ }),

/***/ "./src/commands/Scan.ts":
/*!******************************!*\
  !*** ./src/commands/Scan.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scan": () => (/* binding */ Scan)
/* harmony export */ });
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Scan = /** @class */ (function (_super) {
    __extends(Scan, _super);
    function Scan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scan.prototype.ExecuteBody = function (command) {
        var _this = this;
        var room = _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.getLocation());
        if (!_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.canSee()) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Scan.CantSee);
            return;
        }
        var playerRoom = _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.Location);
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Scan.LookingAroundYouSee);
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Scan.Here);
        Engine.Output(this.printCharacters(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.Player.Location));
        _enums_Direction__WEBPACK_IMPORTED_MODULE_0__.DirectionHelper.forEach(function (direction) {
            var exit = playerRoom.getExit(direction);
            if (exit !== null && !exit.isHidden() && !exit.isClosed()) {
                Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Scan.InDirection.format(_enums_Direction__WEBPACK_IMPORTED_MODULE_0__.DirectionHelper.getLocale(direction, _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_1__.GrammaCase.Miejscownik)));
                Engine.Output(_this.printCharacters(exit.RoomId));
            }
        });
    };
    Scan.prototype.printCharacters = function (roomId) {
        var room = _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Game.GetRoom(roomId);
        if (!room.getCharacters().any()) {
            return Engine.NonBreakingSpace.repeat(4) + _InitGameData__WEBPACK_IMPORTED_MODULE_2__.Local.Commands.Scan.NoOneThere;
        }
        return room.getCharacters().printShortFormat(true);
    };
    return Scan;
}(_Command__WEBPACK_IMPORTED_MODULE_3__.Command));



/***/ }),

/***/ "./src/commands/South.ts":
/*!*******************************!*\
  !*** ./src/commands/South.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "South": () => (/* binding */ South)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var South = /** @class */ (function (_super) {
    __extends(South, _super);
    function South() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    South.prototype.ExecuteBody = function (_, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Go.goToDirection(_enums_Direction__WEBPACK_IMPORTED_MODULE_1__.Direction.south, commandCallback);
    };
    return South;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/Take.ts":
/*!******************************!*\
  !*** ./src/commands/Take.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Take": () => (/* binding */ Take)
/* harmony export */ });
/* harmony import */ var _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Take = /** @class */ (function (_super) {
    __extends(Take, _super);
    function Take() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Take.prototype.ExecuteBody = function (command) {
        var argument1 = command.getArgument(1);
        if (argument1 === null) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Take.NoArgument);
            return;
        }
        if (command.getArgument(2) === null) {
            if (argument1.toLowerCase() === 'all') {
                if (!_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.Location).getItems().any()) {
                    Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Take.NoItems);
                    return;
                }
                this.takeAllFromLocation();
            }
            else {
                var itemList = _InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.Location).getItems();
                var item = itemList.find(argument1, command.getNumber(1));
                if (item === null) {
                    Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Take.NoItemFound.format(argument1));
                    return;
                }
                this.takeItemFromLocation(item, itemList);
            }
        }
        else {
            //TODO: Take from container
            Engine.Output('​¯\\_(ツ)_/¯');
        }
    };
    Take.prototype.takeItemFromLocation = function (item, itemList) {
        if (!item.isTakeable()) {
            Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Take.CannotPickUp.format(item.getName(_enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__.GrammaCase.Dopelniacz)));
            return false;
        }
        this.takeItem(item, itemList);
        Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Local.Commands.Take.PickedUp.format(item.getName(_enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__.GrammaCase.Biernik)));
        return true;
    };
    Take.prototype.takeAllFromLocation = function () {
        var itemList = _InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.Location).getItems();
        var i = 0;
        for (var item = itemList.elementAt(i); item != null; item = itemList.elementAt(i)) {
            if (!this.takeItemFromLocation(item, itemList)) {
                i++;
            }
        }
    };
    Take.prototype.takeItem = function (item, itemList) {
        itemList.remove(item);
        _InitGameData__WEBPACK_IMPORTED_MODULE_1__.Game.Player.getInventory().add(item);
    };
    return Take;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/Test.ts":
/*!******************************!*\
  !*** ./src/commands/Test.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Test": () => (/* binding */ Test)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Test = /** @class */ (function (_super) {
    __extends(Test, _super);
    function Test() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Test.prototype.ExecuteBody = function (command) {
        Engine.Output(command.getCommand() +
            ' ' +
            command.getNumber(1) +
            command.getArgument(1) +
            ' ' +
            command.getNumber(2) +
            command.getArgument(2) +
            ' ' +
            _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.getName() +
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
    };
    return Test;
}(_Command__WEBPACK_IMPORTED_MODULE_1__.Command));



/***/ }),

/***/ "./src/commands/Up.ts":
/*!****************************!*\
  !*** ./src/commands/Up.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Up": () => (/* binding */ Up)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Up = /** @class */ (function (_super) {
    __extends(Up, _super);
    function Up() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Up.prototype.ExecuteBody = function (_, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Go.goToDirection(_enums_Direction__WEBPACK_IMPORTED_MODULE_1__.Direction.up, commandCallback);
    };
    return Up;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commands/West.ts":
/*!******************************!*\
  !*** ./src/commands/West.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "West": () => (/* binding */ West)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _Command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Command */ "./src/commands/Command.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var West = /** @class */ (function (_super) {
    __extends(West, _super);
    function West() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    West.prototype.ExecuteBody = function (_, commandCallback) {
        _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Go.goToDirection(_enums_Direction__WEBPACK_IMPORTED_MODULE_1__.Direction.west, commandCallback);
    };
    return West;
}(_Command__WEBPACK_IMPORTED_MODULE_2__.Command));



/***/ }),

/***/ "./src/commonLogic/CharacterFactory.ts":
/*!*********************************************!*\
  !*** ./src/commonLogic/CharacterFactory.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CharacterFactory": () => (/* binding */ CharacterFactory)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _model_Character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/Character */ "./src/model/Character.ts");
/* harmony import */ var _model_Equipment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/Equipment */ "./src/model/Equipment.ts");
/* harmony import */ var _model_GameData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/GameData */ "./src/model/GameData.ts");
/* harmony import */ var _model_ItemList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../model/ItemList */ "./src/model/ItemList.ts");





var CharacterFactory = /** @class */ (function () {
    function CharacterFactory() {
    }
    CharacterFactory.prototype.SpawnCharacter = function (characterId) {
        var template = _model_GameData__WEBPACK_IMPORTED_MODULE_3__.GameData.CharacterTemplates.getTemplate(characterId);
        var character = new _model_Character__WEBPACK_IMPORTED_MODULE_1__.Character();
        character = this.LoadFromTemplate(character, template);
        return character;
    };
    CharacterFactory.prototype.LoadFromTemplate = function (character, template) {
        character.Id = template.Id;
        character.Name = template.Name;
        character.Description = template.Description;
        character.Idle = template.Idle;
        var inventoryModel = new _model_ItemList__WEBPACK_IMPORTED_MODULE_4__.ItemList();
        if (template.Inventory !== undefined) {
            template.Inventory.forEach(function (itemDefinition) {
                inventoryModel.add(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.SpawnItem(itemDefinition));
            });
        }
        character.Inventory = inventoryModel;
        var equipmentModel = new _model_Equipment__WEBPACK_IMPORTED_MODULE_2__.Equipment();
        if (template.Equipment !== undefined) {
            template.Equipment.forEach(function (eq) {
                equipmentModel.equip(eq.Slot, _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.SpawnItem(eq.Item));
            });
        }
        character.Equipment = equipmentModel;
        return character;
    };
    CharacterFactory.prototype.LoadFromSave = function (saveCharacter) {
        var character = new _model_Character__WEBPACK_IMPORTED_MODULE_1__.Character();
        Object.assign(character, saveCharacter);
        var inventoryModel = new _model_ItemList__WEBPACK_IMPORTED_MODULE_4__.ItemList();
        if (saveCharacter.Inventory !== undefined) {
            saveCharacter.Inventory.forEach(function (savedItem) {
                inventoryModel.add(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.LoadItemFromSave(savedItem));
            });
        }
        character.Inventory = inventoryModel;
        var equipmentModel = new _model_Equipment__WEBPACK_IMPORTED_MODULE_2__.Equipment();
        if (saveCharacter.Equipment !== undefined) {
            saveCharacter.Equipment.forEach(function (eq) {
                equipmentModel.equip(eq.Slot, _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.LoadItemFromSave(eq.Item));
            });
        }
        character.Equipment = equipmentModel;
        return character;
    };
    return CharacterFactory;
}());



/***/ }),

/***/ "./src/commonLogic/EngineUtils.ts":
/*!****************************************!*\
  !*** ./src/commonLogic/EngineUtils.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EngineUtils": () => (/* binding */ EngineUtils)
/* harmony export */ });
var EngineUtilsClass = /** @class */ (function () {
    function EngineUtilsClass() {
    }
    EngineUtilsClass.prototype.OutputPrinter = function (message, callback, delay, isNewLine) {
        if (delay === void 0) { delay = 60; }
        if (isNewLine === void 0) { isNewLine = true; }
        this.skipPrinter = false;
        this.printNext(message, callback, delay, isNewLine);
    };
    EngineUtilsClass.prototype.printNext = function (message, callback, delay, isNewLine) {
        var _this = this;
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
        setTimeout(function () {
            _this.printNext(message.slice(1), callback, delay, isNewLine);
        }, delay);
    };
    EngineUtilsClass.prototype.SkipPrinter = function () {
        this.skipPrinter = true;
    };
    return EngineUtilsClass;
}());
var EngineUtils = new EngineUtilsClass();


/***/ }),

/***/ "./src/commonLogic/InputFunctions.ts":
/*!*******************************************!*\
  !*** ./src/commonLogic/InputFunctions.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputFunctions": () => (/* binding */ InputFunctions)
/* harmony export */ });
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _EngineUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EngineUtils */ "./src/commonLogic/EngineUtils.ts");


var InputFunctions = 'true';
function Execute(command) {
    _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.Execute(command);
}
function SkipPrinter() {
    _EngineUtils__WEBPACK_IMPORTED_MODULE_1__.EngineUtils.SkipPrinter();
}
function ResumeExecution() {
    _CommandsManager__WEBPACK_IMPORTED_MODULE_0__.Commands.ExecuteNext();
}
__webpack_require__.g.Execute = Execute;
__webpack_require__.g.SkipPrinter = SkipPrinter;
__webpack_require__.g.ResumeExecution = ResumeExecution;


/***/ }),

/***/ "./src/commonLogic/ItemFactory.ts":
/*!****************************************!*\
  !*** ./src/commonLogic/ItemFactory.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemFactory": () => (/* binding */ ItemFactory)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _model_GameData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/GameData */ "./src/model/GameData.ts");
/* harmony import */ var _model_Item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/Item */ "./src/model/Item.ts");
/* harmony import */ var _model_ItemList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/ItemList */ "./src/model/ItemList.ts");
/* harmony import */ var _Random__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Random */ "./src/commonLogic/Random.ts");





var ItemFactory = /** @class */ (function () {
    function ItemFactory() {
    }
    ItemFactory.prototype.spawnItem = function (itemDefinition) {
        var item = null;
        if (typeof itemDefinition === 'string') {
            return this.spawnItemByTemplateId(itemDefinition);
        }
        else {
            if (this.isItemChanceTemplate(itemDefinition)) {
                if (itemDefinition.Chance !== undefined) {
                    if (_Random__WEBPACK_IMPORTED_MODULE_4__.Random.nextInt(1, 100) > itemDefinition.Chance) {
                        return null;
                    }
                }
                var templateId = itemDefinition.ItemId;
                item = this.spawnItemByTemplateId(templateId);
                if (itemDefinition.Stack !== undefined) {
                    item.setStack(this.stackValue(itemDefinition.Stack));
                }
                this.resolveInventory(itemDefinition, item);
            }
            else {
                var selectetItemIndex = this.resolveRandomItemIndex(itemDefinition);
                var templateId = itemDefinition.ItemId[selectetItemIndex];
                if (templateId === null) {
                    return null;
                }
                item = this.spawnItemByTemplateId(templateId);
                if (itemDefinition.Stack !== undefined) {
                    if (itemDefinition.ItemId.length !== itemDefinition.Stack.length) {
                        throw 'Item definition has {0} specified ids but only {1} spiecified stacks'.format(itemDefinition.ItemId.length, itemDefinition.Stack.length);
                    }
                    item.setStack(this.stackValue(itemDefinition.Stack[selectetItemIndex]));
                }
            }
            return item;
        }
    };
    ItemFactory.prototype.isItemChanceTemplate = function (itemDefinition) {
        return typeof itemDefinition !== 'string' && typeof itemDefinition.ItemId === 'string';
    };
    ItemFactory.prototype.spawnItemByTemplateId = function (templateId) {
        var template = _model_GameData__WEBPACK_IMPORTED_MODULE_1__.GameData.ItemTemplates.getTemplate(templateId);
        var item = new _model_Item__WEBPACK_IMPORTED_MODULE_2__.Item();
        Object.assign(item, template);
        return item;
    };
    ItemFactory.prototype.resolveRandomItemIndex = function (itemDefinition) {
        if (itemDefinition.ChanceList === undefined) {
            itemDefinition.ChanceList = [];
            itemDefinition.ItemId.forEach(function () {
                var _a;
                (_a = itemDefinition.ChanceList) === null || _a === void 0 ? void 0 : _a.push(1);
            });
        }
        if (itemDefinition.ItemId.length !== itemDefinition.ChanceList.length) {
            throw 'Item definition has {0} specified ids but only {1} spiecified chances in ChanceList'.format(itemDefinition.ItemId.length, itemDefinition.ChanceList.length);
        }
        var chanceSum = itemDefinition.ChanceList.reduce(function (a, b) { return a + b; });
        var selectedCahnce = _Random__WEBPACK_IMPORTED_MODULE_4__.Random.nextInt(1, chanceSum);
        chanceSum = 0;
        for (var i = 0; i < itemDefinition.ChanceList.length; i++) {
            chanceSum += itemDefinition.ChanceList[i];
            if (selectedCahnce <= chanceSum) {
                return i;
            }
        }
        return 0; //should never occur
    };
    ItemFactory.prototype.resolveInventory = function (itemDefinition, item) {
        if (itemDefinition.Inventory !== undefined) {
            var inventory_1 = item.getInventory();
            if (inventory_1 === null) {
                inventory_1 = item.Inventory = new _model_ItemList__WEBPACK_IMPORTED_MODULE_3__.ItemList();
            }
            itemDefinition.Inventory.forEach(function (itemDefinition) {
                inventory_1 === null || inventory_1 === void 0 ? void 0 : inventory_1.add(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.SpawnItem(itemDefinition));
            });
        }
    };
    ItemFactory.prototype.stackValue = function (stack) {
        if (stack === undefined || stack === null) {
            return 1;
        }
        if (typeof stack === 'number') {
            return stack;
        }
        else {
            return _Random__WEBPACK_IMPORTED_MODULE_4__.Random.nextInt(stack.Min, stack.Max);
        }
    };
    ItemFactory.prototype.LoadFromSave = function (saveItem) {
        var item = new _model_Item__WEBPACK_IMPORTED_MODULE_2__.Item();
        Object.assign(item, saveItem);
        if (item.getInventory() !== null) {
            var inventoryModel = new _model_ItemList__WEBPACK_IMPORTED_MODULE_3__.ItemList();
            inventoryModel.loadFromSave(item.getInventory());
            item.Inventory = inventoryModel;
        }
        return item;
    };
    return ItemFactory;
}());



/***/ }),

/***/ "./src/commonLogic/Prompt.ts":
/*!***********************************!*\
  !*** ./src/commonLogic/Prompt.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Prompt": () => (/* binding */ Prompt)
/* harmony export */ });
var PromptClass = /** @class */ (function () {
    function PromptClass() {
    }
    PromptClass.prototype.Print = function () {
        Engine.Output('$ ', false);
    };
    return PromptClass;
}());
var Prompt = new PromptClass();


/***/ }),

/***/ "./src/commonLogic/Random.ts":
/*!***********************************!*\
  !*** ./src/commonLogic/Random.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Random": () => (/* binding */ Random)
/* harmony export */ });
var RandomClass = /** @class */ (function () {
    function RandomClass() {
    }
    RandomClass.prototype.nextInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return RandomClass;
}());
var Random = new RandomClass();


/***/ }),

/***/ "./src/commonLogic/RoomFactory.ts":
/*!****************************************!*\
  !*** ./src/commonLogic/RoomFactory.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoomFactory": () => (/* binding */ RoomFactory)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _model_CharacterList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/CharacterList */ "./src/model/CharacterList.ts");
/* harmony import */ var _model_ItemList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/ItemList */ "./src/model/ItemList.ts");
/* harmony import */ var _model_Room__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/Room */ "./src/model/Room.ts");
/* harmony import */ var _model_RoomExit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../model/RoomExit */ "./src/model/RoomExit.ts");
/* harmony import */ var _model_RoomExitsList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../model/RoomExitsList */ "./src/model/RoomExitsList.ts");






var RoomFactory = /** @class */ (function () {
    function RoomFactory() {
    }
    RoomFactory.prototype.SpawnRoom = function (template) {
        var room = new _model_Room__WEBPACK_IMPORTED_MODULE_3__.Room();
        Object.assign(room, template);
        return room;
    };
    RoomFactory.prototype.LoadRoomData = function (room, template) {
        var _a;
        var exitsModel = new _model_RoomExitsList__WEBPACK_IMPORTED_MODULE_5__.RoomExitsList();
        (_a = template.Exits) === null || _a === void 0 ? void 0 : _a.forEach(function (exit) {
            var direction = exit.Direction;
            exitsModel[direction] = new _model_RoomExit__WEBPACK_IMPORTED_MODULE_4__.RoomExit(exit);
        });
        room.Exits = exitsModel;
        var items = new _model_ItemList__WEBPACK_IMPORTED_MODULE_2__.ItemList();
        items.loadFromTemplate(room.Items);
        room.Items = items;
        if (template.Characters !== undefined) {
            var charactersModel_1 = new _model_CharacterList__WEBPACK_IMPORTED_MODULE_1__.CharacterList();
            template.Characters.forEach(function (characterId) {
                charactersModel_1.add(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.SpawnCharacter(characterId));
            });
            room.Characters = charactersModel_1;
        }
        room.IsLoaded = true;
    };
    return RoomFactory;
}());



/***/ }),

/***/ "./src/enums/Direction.ts":
/*!********************************!*\
  !*** ./src/enums/Direction.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Direction": () => (/* binding */ Direction),
/* harmony export */   "DirectionHelper": () => (/* binding */ DirectionHelper)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _EnumHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
/* harmony import */ var _GrammaCase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GrammaCase */ "./src/enums/GrammaCase.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Direction;
(function (Direction) {
    Direction["north"] = "north";
    Direction["south"] = "south";
    Direction["east"] = "east";
    Direction["west"] = "west";
    Direction["up"] = "up";
    Direction["down"] = "down";
})(Direction || (Direction = {}));
var DirectionHelperClass = /** @class */ (function (_super) {
    __extends(DirectionHelperClass, _super);
    function DirectionHelperClass() {
        return _super.call(this, Direction) || this;
    }
    DirectionHelperClass.prototype.getLocale = function (direction, grammaCase) {
        if (grammaCase === void 0) { grammaCase = _GrammaCase__WEBPACK_IMPORTED_MODULE_2__.GrammaCase.Mianownik; }
        return _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Local.Directions[direction][grammaCase];
    };
    return DirectionHelperClass;
}(_EnumHelper__WEBPACK_IMPORTED_MODULE_1__.EnumHelper));
var DirectionHelper = new DirectionHelperClass();


/***/ }),

/***/ "./src/enums/EnumHelper.ts":
/*!*********************************!*\
  !*** ./src/enums/EnumHelper.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EnumHelper": () => (/* binding */ EnumHelper)
/* harmony export */ });
var EnumHelper = /** @class */ (function () {
    function EnumHelper(source) {
        this.source = source;
    }
    EnumHelper.prototype.parse = function (value) {
        for (var key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key === value) {
                    return this.source[key];
                }
            }
        }
        return null;
    };
    EnumHelper.prototype.parseArray = function (values) {
        var _this = this;
        var array = [];
        values.forEach(function (key) {
            var direction = _this.parse(key);
            if (direction !== null) {
                array.push(direction);
            }
        });
        return array;
    };
    EnumHelper.prototype.contains = function (string) {
        for (var key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key === string) {
                    return true;
                }
            }
        }
        return false;
    };
    EnumHelper.prototype.parseShort = function (string) {
        for (var key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (key.startsWith(string)) {
                    return this.source[key];
                }
            }
        }
        return null;
    };
    EnumHelper.prototype.getKey = function (value) {
        for (var key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                if (this.source[key] === value) {
                    return key;
                }
            }
        }
        return null;
    };
    EnumHelper.prototype.forEach = function (callback) {
        for (var key in this.source) {
            if (this.source.hasOwnProperty(key)) {
                callback(this.source[key], key);
            }
        }
    };
    return EnumHelper;
}());



/***/ }),

/***/ "./src/enums/EquipmentSlot.ts":
/*!************************************!*\
  !*** ./src/enums/EquipmentSlot.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EquipmentSlot": () => (/* binding */ EquipmentSlot),
/* harmony export */   "EquipmentSlotHelper": () => (/* binding */ EquipmentSlotHelper)
/* harmony export */ });
/* harmony import */ var _EnumHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

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
})(EquipmentSlot || (EquipmentSlot = {}));
var EquipmentSlotHelperClass = /** @class */ (function (_super) {
    __extends(EquipmentSlotHelperClass, _super);
    function EquipmentSlotHelperClass() {
        return _super.call(this, EquipmentSlot) || this;
    }
    return EquipmentSlotHelperClass;
}(_EnumHelper__WEBPACK_IMPORTED_MODULE_0__.EnumHelper));
var EquipmentSlotHelper = new EquipmentSlotHelperClass();


/***/ }),

/***/ "./src/enums/GlobalEventType.ts":
/*!**************************************!*\
  !*** ./src/enums/GlobalEventType.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobalEventType": () => (/* binding */ GlobalEventType),
/* harmony export */   "GlobalEventTypeHelper": () => (/* binding */ GlobalEventTypeHelper)
/* harmony export */ });
/* harmony import */ var _EnumHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var GlobalEventType;
(function (GlobalEventType) {
    GlobalEventType[GlobalEventType["BeforeRoomEnter"] = 1] = "BeforeRoomEnter";
})(GlobalEventType || (GlobalEventType = {}));
var GlobalEventTypeHelperClass = /** @class */ (function (_super) {
    __extends(GlobalEventTypeHelperClass, _super);
    function GlobalEventTypeHelperClass() {
        return _super.call(this, GlobalEventType) || this;
    }
    return GlobalEventTypeHelperClass;
}(_EnumHelper__WEBPACK_IMPORTED_MODULE_0__.EnumHelper));
var GlobalEventTypeHelper = new GlobalEventTypeHelperClass();


/***/ }),

/***/ "./src/enums/GrammaCase.ts":
/*!*********************************!*\
  !*** ./src/enums/GrammaCase.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GrammaCase": () => (/* binding */ GrammaCase),
/* harmony export */   "GrammaCaseHelper": () => (/* binding */ GrammaCaseHelper)
/* harmony export */ });
/* harmony import */ var _EnumHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var GrammaCase;
(function (GrammaCase) {
    GrammaCase[GrammaCase["Mianownik"] = 0] = "Mianownik";
    GrammaCase[GrammaCase["Dopelniacz"] = 1] = "Dopelniacz";
    GrammaCase[GrammaCase["Celownik"] = 2] = "Celownik";
    GrammaCase[GrammaCase["Biernik"] = 3] = "Biernik";
    GrammaCase[GrammaCase["Narzednik"] = 4] = "Narzednik";
    GrammaCase[GrammaCase["Miejscownik"] = 5] = "Miejscownik";
    GrammaCase[GrammaCase["Wolacz"] = 6] = "Wolacz";
})(GrammaCase || (GrammaCase = {}));
var GrammaCaseHelperClass = /** @class */ (function (_super) {
    __extends(GrammaCaseHelperClass, _super);
    function GrammaCaseHelperClass() {
        return _super.call(this, GrammaCase) || this;
    }
    return GrammaCaseHelperClass;
}(_EnumHelper__WEBPACK_IMPORTED_MODULE_0__.EnumHelper));
var GrammaCaseHelper = new GrammaCaseHelperClass();


/***/ }),

/***/ "./src/enums/ItemType.ts":
/*!*******************************!*\
  !*** ./src/enums/ItemType.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemType": () => (/* binding */ ItemType),
/* harmony export */   "ItemTypeHelper": () => (/* binding */ ItemTypeHelper)
/* harmony export */ });
/* harmony import */ var _EnumHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EnumHelper */ "./src/enums/EnumHelper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

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
})(ItemType || (ItemType = {}));
var ItemTypeHelperClass = /** @class */ (function (_super) {
    __extends(ItemTypeHelperClass, _super);
    function ItemTypeHelperClass() {
        return _super.call(this, ItemType) || this;
    }
    return ItemTypeHelperClass;
}(_EnumHelper__WEBPACK_IMPORTED_MODULE_0__.EnumHelper));
var ItemTypeHelper = new ItemTypeHelperClass();


/***/ }),

/***/ "./src/model/Character.ts":
/*!********************************!*\
  !*** ./src/model/Character.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Character": () => (/* binding */ Character)
/* harmony export */ });
/* harmony import */ var _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
/* harmony import */ var _EntityBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EntityBase */ "./src/model/EntityBase.ts");
/* harmony import */ var _Equipment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Equipment */ "./src/model/Equipment.ts");
/* harmony import */ var _ItemList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ItemList */ "./src/model/ItemList.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Character.prototype.getName = function (grammaCase) {
        if (grammaCase === void 0) { grammaCase = _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__.GrammaCase.Mianownik; }
        return this.Name[grammaCase];
    };
    Character.prototype.getDescription = function () {
        return this.Description;
    };
    Character.prototype.getIdle = function () {
        return this.Idle;
    };
    Character.prototype.getInventory = function () {
        if (this.Inventory === undefined) {
            return new _ItemList__WEBPACK_IMPORTED_MODULE_3__.ItemList();
        }
        return this.Inventory;
    };
    Character.prototype.getEquipment = function () {
        if (this.Equipment === undefined) {
            return new _Equipment__WEBPACK_IMPORTED_MODULE_2__.Equipment();
        }
        return this.Equipment;
    };
    Character.prototype.hasLightSource = function () {
        return this.getEquipment().hasLightSource();
    };
    return Character;
}(_EntityBase__WEBPACK_IMPORTED_MODULE_1__.EntityBase));



/***/ }),

/***/ "./src/model/CharacterList.ts":
/*!************************************!*\
  !*** ./src/model/CharacterList.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CharacterList": () => (/* binding */ CharacterList)
/* harmony export */ });
/* harmony import */ var _EntityList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EntityList */ "./src/model/EntityList.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var CharacterList = /** @class */ (function (_super) {
    __extends(CharacterList, _super);
    function CharacterList() {
        return _super.call(this) || this;
    }
    CharacterList.prototype.hasLightSource = function () {
        return this.Array.some(function (c) { return c.hasLightSource() === true; });
    };
    return CharacterList;
}(_EntityList__WEBPACK_IMPORTED_MODULE_0__.EntityList));



/***/ }),

/***/ "./src/model/CharacterTemplates.ts":
/*!*****************************************!*\
  !*** ./src/model/CharacterTemplates.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CharacterTemplatesModel": () => (/* binding */ CharacterTemplatesModel)
/* harmony export */ });
var CharacterTemplatesModel = /** @class */ (function () {
    function CharacterTemplatesModel(characterTemplates) {
        var _this = this;
        if (characterTemplates === undefined) {
            return;
        }
        if (!Array.isArray(characterTemplates)) {
            throw 'Character templates must be an array';
        }
        characterTemplates.forEach(function (value, index) {
            _this.addNewCharacterTemplate(value);
        });
    }
    CharacterTemplatesModel.prototype.addNewCharacterTemplate = function (characterTemplate) {
        if (this[characterTemplate.Id] !== undefined) {
            throw 'Character template {0} is already defined!'.format(characterTemplate.Id);
        }
        this[characterTemplate.Id] = characterTemplate;
    };
    CharacterTemplatesModel.prototype.getTemplate = function (characterId) {
        if (this[characterId] === undefined) {
            throw 'No Character template defined for Id {0}!'.format(characterId);
        }
        return this[characterId];
    };
    return CharacterTemplatesModel;
}());



/***/ }),

/***/ "./src/model/EntityBase.ts":
/*!*********************************!*\
  !*** ./src/model/EntityBase.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntityBase": () => (/* binding */ EntityBase)
/* harmony export */ });
var EntityBase = /** @class */ (function () {
    function EntityBase() {
    }
    return EntityBase;
}());



/***/ }),

/***/ "./src/model/EntityList.ts":
/*!*********************************!*\
  !*** ./src/model/EntityList.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntityList": () => (/* binding */ EntityList)
/* harmony export */ });
var EntityList = /** @class */ (function () {
    function EntityList() {
        this.Array = [];
    }
    EntityList.prototype.add = function (item) {
        if (item === null) {
            return;
        }
        this.Array.push(item);
    };
    EntityList.prototype.remove = function (item) {
        var index = this.Array.indexOf(item);
        if (index > -1) {
            this.Array.splice(index, 1);
        }
    };
    EntityList.prototype.any = function () {
        return this.Array.length > 0;
    };
    EntityList.prototype.elementAt = function (index) {
        if (this.Array[index] === undefined) {
            return null;
        }
        return this.Array[index];
    };
    EntityList.prototype.length = function () {
        return this.Array.length;
    };
    EntityList.prototype.find = function (name, number) {
        if (number === void 0) { number = 1; }
        var found = null;
        this.Array.some(function (item) {
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
    };
    EntityList.prototype.findById = function (id, number) {
        if (number === void 0) { number = 1; }
        var found = null;
        this.Array.some(function (item) {
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
    };
    EntityList.prototype.printLongFormat = function (indent) {
        if (indent === void 0) { indent = true; }
        return this.print(indent, true);
    };
    EntityList.prototype.printShortFormat = function (indent) {
        if (indent === void 0) { indent = true; }
        return this.print(indent, false);
    };
    EntityList.prototype.print = function (indent, longFormat) {
        if (indent === void 0) { indent = true; }
        if (longFormat === void 0) { longFormat = true; }
        var returnString = '';
        this.Array.forEach(function (entity) {
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
    };
    return EntityList;
}());



/***/ }),

/***/ "./src/model/Equipment.ts":
/*!********************************!*\
  !*** ./src/model/Equipment.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Equipment": () => (/* binding */ Equipment)
/* harmony export */ });
/* harmony import */ var _enums_EquipmentSlot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/EquipmentSlot */ "./src/enums/EquipmentSlot.ts");

var Equipment = /** @class */ (function () {
    function Equipment() {
        this.Array = [];
    }
    Equipment.prototype.validateSlot = function (slot) {
        if (_enums_EquipmentSlot__WEBPACK_IMPORTED_MODULE_0__.EquipmentSlotHelper.getKey(slot) === null) {
            throw '{0} is not a proper equipment slot.'.format(slot);
        }
    };
    Equipment.prototype.equip = function (slot, item) {
        if (item === null) {
            return;
        }
        this.validateSlot(slot);
        if (this.Array[slot] !== undefined) {
            throw 'Cannot equip, {0} already contains an item.'.format(_enums_EquipmentSlot__WEBPACK_IMPORTED_MODULE_0__.EquipmentSlotHelper.getKey(slot));
        }
        this.Array[slot] = item;
    };
    Equipment.prototype.remove = function (slot) {
        this.validateSlot(slot);
        if (this.Array[slot] === undefined) {
            throw "Cannot remove, {0} doesn't contains an item.".format(_enums_EquipmentSlot__WEBPACK_IMPORTED_MODULE_0__.EquipmentSlotHelper.getKey(slot));
        }
        delete this.Array[slot];
    };
    Equipment.prototype.get = function (slot) {
        this.validateSlot(slot);
        if (this.Array[slot] === undefined) {
            return null;
        }
        return this.Array[slot];
    };
    Equipment.prototype.hasLightSource = function () {
        return this.Array.some(function (i) { return i.isLightSource() === true; });
    };
    return Equipment;
}());



/***/ }),

/***/ "./src/model/Game.ts":
/*!***************************!*\
  !*** ./src/model/Game.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameModel": () => (/* binding */ GameModel)
/* harmony export */ });
/* harmony import */ var _commonLogic_CharacterFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../commonLogic/CharacterFactory */ "./src/commonLogic/CharacterFactory.ts");
/* harmony import */ var _commonLogic_ItemFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../commonLogic/ItemFactory */ "./src/commonLogic/ItemFactory.ts");
/* harmony import */ var _commonLogic_RoomFactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonLogic/RoomFactory */ "./src/commonLogic/RoomFactory.ts");
/* harmony import */ var _GlobalEvents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../GlobalEvents */ "./src/GlobalEvents.ts");
/* harmony import */ var _GameData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GameData */ "./src/model/GameData.ts");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Player */ "./src/model/Player.ts");
/* harmony import */ var _res_Game_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../res/Game.json */ "./res/Game.json");







var GameModel = /** @class */ (function () {
    function GameModel() {
        this.Name = '';
        this.StartingRoom = 0;
        this.Rooms = [];
        this.ItemFactory = new _commonLogic_ItemFactory__WEBPACK_IMPORTED_MODULE_1__.ItemFactory();
        this.CharacterFactory = new _commonLogic_CharacterFactory__WEBPACK_IMPORTED_MODULE_0__.CharacterFactory();
        this.RoomFactory = new _commonLogic_RoomFactory__WEBPACK_IMPORTED_MODULE_2__.RoomFactory();
    }
    GameModel.prototype.LoadFromTemplate = function () {
        //Object.assign(this, template);
        var player = new _Player__WEBPACK_IMPORTED_MODULE_5__.Player(undefined);
        //this.CharacterFactory.LoadFromTemplate(player, this.Player);
        this.Player = player;
        for (var i = 0; i < _res_Game_json__WEBPACK_IMPORTED_MODULE_6__.GameTemplate.Rooms.length; i++) {
            this.Rooms[i] = this.RoomFactory.SpawnRoom(_res_Game_json__WEBPACK_IMPORTED_MODULE_6__.GameTemplate.Rooms[i]);
            if (this.Rooms[i].Id !== i) {
                throw 'Room with Id {0} is placed on index {1}, fix Rooms data'.format(this.Rooms[i].Id, i);
            }
        }
    };
    GameModel.prototype.getName = function () {
        return this.Name;
    };
    GameModel.prototype.GetRoom = function (roomId) {
        var room = this.Rooms[roomId];
        if (room === undefined) {
            throw 'Invalid Room Id: {0}'.format(roomId);
        }
        if (!room.isLoaded()) {
            this.RoomFactory.LoadRoomData(room, _res_Game_json__WEBPACK_IMPORTED_MODULE_6__.GameTemplate.Rooms[roomId]);
        }
        return room;
    };
    GameModel.prototype.SpawnItem = function (itemDefinition) {
        return this.ItemFactory.spawnItem(itemDefinition);
    };
    GameModel.prototype.LoadItemFromSave = function (saveItem) {
        return this.ItemFactory.LoadFromSave(saveItem);
    };
    GameModel.prototype.SpawnCharacter = function (characterId) {
        return this.CharacterFactory.SpawnCharacter(characterId);
    };
    GameModel.prototype.LoadCharacterFromSave = function (saveCharacter) {
        return this.CharacterFactory.LoadFromSave(saveCharacter);
    };
    GameModel.prototype.GetItemType = function (itemTypeName) {
        return _GameData__WEBPACK_IMPORTED_MODULE_4__.GameData.ItemTypes.GetItemType(itemTypeName);
    };
    GameModel.prototype.InvokeGlobalEvent = function (name, args) {
        var event = _GlobalEvents__WEBPACK_IMPORTED_MODULE_3__.GlobalEvents[name];
        if (event === undefined || typeof event !== 'function') {
            throw "Global event with name {0} doesn't exist".format(name);
        }
        return event(args);
    };
    return GameModel;
}());



/***/ }),

/***/ "./src/model/GameData.ts":
/*!*******************************!*\
  !*** ./src/model/GameData.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameData": () => (/* binding */ GameData)
/* harmony export */ });
/* harmony import */ var _CharacterTemplates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CharacterTemplates */ "./src/model/CharacterTemplates.ts");
/* harmony import */ var _ItemTemplates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ItemTemplates */ "./src/model/ItemTemplates.ts");
/* harmony import */ var _ItemTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ItemTypes */ "./src/model/ItemTypes.ts");



var GameDataModel = /** @class */ (function () {
    function GameDataModel() {
        this.ItemTypes = new _ItemTypes__WEBPACK_IMPORTED_MODULE_2__.ItemTypesModel(undefined);
        this.ItemTemplates = new _ItemTemplates__WEBPACK_IMPORTED_MODULE_1__.ItemTemplatesModel(undefined);
        this.CharacterTemplates = new _CharacterTemplates__WEBPACK_IMPORTED_MODULE_0__.CharacterTemplatesModel(undefined);
    }
    return GameDataModel;
}());
var GameData = new GameDataModel();


/***/ }),

/***/ "./src/model/GlobalEventArgs.ts":
/*!**************************************!*\
  !*** ./src/model/GlobalEventArgs.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobalEventArgs": () => (/* binding */ GlobalEventArgs)
/* harmony export */ });
var GlobalEventArgs = /** @class */ (function () {
    function GlobalEventArgs(type, sender, finishCommandCallback, continueCommandCallback) {
        this.Type = type;
        this.Sender = sender;
        this.FinishCommandCallback = finishCommandCallback;
        this.ContinueCommandCallback = continueCommandCallback;
    }
    return GlobalEventArgs;
}());



/***/ }),

/***/ "./src/model/Item.ts":
/*!***************************!*\
  !*** ./src/model/Item.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Item": () => (/* binding */ Item)
/* harmony export */ });
/* harmony import */ var _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/GrammaCase */ "./src/enums/GrammaCase.ts");
/* harmony import */ var _enums_ItemType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums/ItemType */ "./src/enums/ItemType.ts");
/* harmony import */ var _EntityBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EntityBase */ "./src/model/EntityBase.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Item.prototype.getName = function (grammaCase) {
        if (grammaCase === void 0) { grammaCase = _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__.GrammaCase.Mianownik; }
        if (!this.isStackable()) {
            return this.Name[grammaCase] + Engine.DefaultColor;
        }
        else {
            return this.getStack() + ' ' + this.getPluralName(grammaCase) + Engine.DefaultColor;
        }
    };
    Item.prototype.getPluralName = function (grammaCase) {
        if (grammaCase === void 0) { grammaCase = _enums_GrammaCase__WEBPACK_IMPORTED_MODULE_0__.GrammaCase.Mianownik; }
        if (!Array.isArray(this.Name[0])) {
            return this.Name[grammaCase];
        }
        else {
            switch (this.getStack()) {
                case 1:
                    return this.Name[0][grammaCase];
                case 2:
                case 3:
                case 4:
                    return this.Name[1][grammaCase];
                default:
                    return this.Name[2][grammaCase];
            }
        }
    };
    Item.prototype.getDescription = function () {
        return this.Description + Engine.DefaultColor;
    };
    Item.prototype.getIdle = function () {
        if (this.Idle === undefined) {
            return 'leży na ziemi';
        }
        return this.Idle;
    };
    Item.prototype.isLightSource = function () {
        return this.IsLightSource === true;
    };
    Item.prototype.isStackable = function () {
        if (this.IsStackable === undefined) {
            return false;
        }
        return this.IsStackable;
    };
    Item.prototype.getStack = function () {
        if (this.Stack === undefined) {
            return 1;
        }
        return this.Stack;
    };
    Item.prototype.setStack = function (value) {
        if (this.isStackable()) {
            this.Stack = value;
        }
    };
    Item.prototype.addStack = function (value) {
        if (this.isStackable()) {
            if (this.Stack === undefined) {
                this.Stack = 1;
            }
            this.Stack += value;
        }
    };
    Item.prototype.getType = function () {
        return this.Type;
    };
    Item.prototype.isTakeable = function () {
        switch (this.getType()) {
            case _enums_ItemType__WEBPACK_IMPORTED_MODULE_1__.ItemType.Static:
            case _enums_ItemType__WEBPACK_IMPORTED_MODULE_1__.ItemType.StaticContainer:
            case _enums_ItemType__WEBPACK_IMPORTED_MODULE_1__.ItemType.Lever:
                return false;
            default:
                return true;
        }
    };
    Item.prototype.getInventory = function () {
        if (this.Inventory === undefined) {
            return null;
        }
        return this.Inventory;
    };
    return Item;
}(_EntityBase__WEBPACK_IMPORTED_MODULE_2__.EntityBase));



/***/ }),

/***/ "./src/model/ItemList.ts":
/*!*******************************!*\
  !*** ./src/model/ItemList.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemList": () => (/* binding */ ItemList)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _EntityList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EntityList */ "./src/model/EntityList.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ItemList = /** @class */ (function (_super) {
    __extends(ItemList, _super);
    function ItemList() {
        return _super.call(this) || this;
    }
    ItemList.prototype.loadFromTemplate = function (template) {
        var _this = this;
        if (template !== undefined) {
            template.forEach(function (itemDefinition) {
                _this.add(_InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.SpawnItem(itemDefinition));
            });
        }
    };
    ItemList.prototype.loadFromSave = function (saveItemList) {
        Object.assign(this, saveItemList);
        for (var i = 0; i < this.Array.length; i++) {
            this.Array[i] = _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.LoadItemFromSave(this.Array[i]);
        }
    };
    ItemList.prototype.add = function (item) {
        if (item === null) {
            return;
        }
        if (item.isStackable()) {
            var existingStack = _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.Player.getInventory().findById(item.Id);
            if (existingStack !== null) {
                existingStack.addStack(item.getStack());
                return;
            }
        }
        _super.prototype.add.call(this, item);
    };
    ItemList.prototype.hasLightSource = function () {
        return this.Array.some(function (i) { return i.isLightSource() === true; });
    };
    return ItemList;
}(_EntityList__WEBPACK_IMPORTED_MODULE_1__.EntityList));



/***/ }),

/***/ "./src/model/ItemTemplates.ts":
/*!************************************!*\
  !*** ./src/model/ItemTemplates.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemTemplatesModel": () => (/* binding */ ItemTemplatesModel)
/* harmony export */ });
var ItemTemplatesModel = /** @class */ (function () {
    function ItemTemplatesModel(itemTemplates) {
        var _this = this;
        if (itemTemplates === undefined) {
            return;
        }
        if (!Array.isArray(itemTemplates)) {
            throw 'Item templates must be an array';
        }
        itemTemplates.forEach(function (value, index) {
            _this.AddNewItemTemplate(value);
        });
    }
    ItemTemplatesModel.prototype.AddNewItemTemplate = function (itemTemplate) {
        if (this[itemTemplate.Id] !== undefined) {
            throw 'Item template {0} is already defined!'.format(itemTemplate.Id);
        }
        this[itemTemplate.Id] = itemTemplate;
    };
    ItemTemplatesModel.prototype.getTemplate = function (itemId) {
        if (this[itemId] === undefined) {
            throw 'No item template defined for {0}!'.format(itemId);
        }
        return this[itemId];
    };
    return ItemTemplatesModel;
}());



/***/ }),

/***/ "./src/model/ItemTypes.ts":
/*!********************************!*\
  !*** ./src/model/ItemTypes.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ItemTypesModel": () => (/* binding */ ItemTypesModel)
/* harmony export */ });
var ItemTypesModel = /** @class */ (function () {
    function ItemTypesModel(itemTypesTemplate) {
        var _this = this;
        if (itemTypesTemplate === undefined) {
            return;
        }
        if (!Array.isArray(itemTypesTemplate)) {
            throw 'Item types template must be an array';
        }
        itemTypesTemplate.forEach(function (value, index) {
            _this.AddNewItemType(value);
        });
    }
    ItemTypesModel.prototype.AddNewItemType = function (itemType) {
        if (this[itemType.Id] !== undefined) {
            throw 'Item type {0} is already defined!'.format(itemType.Id);
        }
        this[itemType.Id] = itemType;
    };
    ItemTypesModel.prototype.GetItemType = function (itemTypeName) {
        if (this[itemTypeName] === undefined) {
            throw 'Item type ' + itemTypeName + ' is not defined!';
        }
        return this[itemTypeName];
    };
    return ItemTypesModel;
}());



/***/ }),

/***/ "./src/model/Player.ts":
/*!*****************************!*\
  !*** ./src/model/Player.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _Character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Character */ "./src/model/Character.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(template) {
        var _this = _super.call(this) || this;
        if (_this.Location === undefined) {
            _this.Location = 0;
        }
        if (_this.PreviousLocation === undefined) {
            _this.PreviousLocation = 0;
        }
        return _this;
    }
    Player.prototype.getLocation = function () {
        return this.Location;
    };
    Player.prototype.setLocation = function (value) {
        this.Location = value;
    };
    Player.prototype.getPreviousLocation = function () {
        return this.PreviousLocation;
    };
    Player.prototype.setPreviousLocation = function (value) {
        this.PreviousLocation = value;
    };
    Player.prototype.canSee = function () {
        var room = _InitGameData__WEBPACK_IMPORTED_MODULE_0__.Game.GetRoom(this.Location);
        return room.hasLightSource();
    };
    return Player;
}(_Character__WEBPACK_IMPORTED_MODULE_1__.Character));



/***/ }),

/***/ "./src/model/Room.ts":
/*!***************************!*\
  !*** ./src/model/Room.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Room": () => (/* binding */ Room)
/* harmony export */ });
/* harmony import */ var _enums_Direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums/Direction */ "./src/enums/Direction.ts");
/* harmony import */ var _CharacterList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CharacterList */ "./src/model/CharacterList.ts");
/* harmony import */ var _ItemList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ItemList */ "./src/model/ItemList.ts");



var Room = /** @class */ (function () {
    function Room() {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.IsNaturalLight = false;
        this.Exits = {};
        this.IsVisited = false;
        this.OnFirstEnterEvent = null;
    }
    Room.prototype.isLoaded = function () {
        return this.IsLoaded;
    };
    Room.prototype.getName = function () {
        return this.Name;
    };
    Room.prototype.getItems = function () {
        if (this.Items === undefined) {
            return new _ItemList__WEBPACK_IMPORTED_MODULE_2__.ItemList();
        }
        return this.Items;
    };
    Room.prototype.getCharacters = function () {
        if (this.Characters === undefined) {
            return new _CharacterList__WEBPACK_IMPORTED_MODULE_1__.CharacterList();
        }
        return this.Characters;
    };
    Room.prototype.getExit = function (direction) {
        if (this.Exits[direction] === undefined) {
            return null;
        }
        return this.Exits[direction];
    };
    Room.prototype.getExitsDirections = function () {
        return _enums_Direction__WEBPACK_IMPORTED_MODULE_0__.DirectionHelper.parseArray(Object.keys(this.Exits));
    };
    Room.prototype.hasLightSource = function () {
        if (this.IsNaturalLight === true) {
            return true;
        }
        if (this.getItems().hasLightSource()) {
            return true;
        }
        if (this.getCharacters().hasLightSource()) {
            return true;
        }
        return false;
    };
    Room.prototype.getOnFirstEnterEvent = function () {
        if (this.OnFirstEnterEvent === undefined) {
            return null;
        }
        return this.OnFirstEnterEvent;
    };
    Room.prototype.getOnEnterEvent = function () {
        if (this.OnEnterEvent === undefined) {
            return null;
        }
        return this.OnEnterEvent;
    };
    return Room;
}());



/***/ }),

/***/ "./src/model/RoomExit.ts":
/*!*******************************!*\
  !*** ./src/model/RoomExit.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoomExit": () => (/* binding */ RoomExit)
/* harmony export */ });
var RoomExit = /** @class */ (function () {
    function RoomExit(template) {
        this.RoomId = 0;
        Object.assign(this, template);
        delete this.Direction;
    }
    RoomExit.prototype.GetRoomId = function () {
        return this.RoomId;
    };
    RoomExit.prototype.isDoor = function () {
        return this.IsDoor === true;
    };
    RoomExit.prototype.isClosed = function () {
        return this.IsClosed === true;
    };
    RoomExit.prototype.isLocked = function () {
        return this.IsLocked === true;
    };
    RoomExit.prototype.isHidden = function () {
        return this.IsHidden === true;
    };
    RoomExit.prototype.getKeyNumber = function () {
        if (this.KeyNumber == undefined) {
            return null;
        }
        return this.KeyNumber;
    };
    return RoomExit;
}());



/***/ }),

/***/ "./src/model/RoomExitsList.ts":
/*!************************************!*\
  !*** ./src/model/RoomExitsList.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoomExitsList": () => (/* binding */ RoomExitsList)
/* harmony export */ });
var RoomExitsList = /** @class */ (function () {
    function RoomExitsList() {
    }
    return RoomExitsList;
}());



/***/ }),

/***/ "./res/Characters.json":
/*!*****************************!*\
  !*** ./res/Characters.json ***!
  \*****************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"Character-Schema.json","CharactersTemplates":[{"Id":"cave-rat","Name":["szczur jaskiniowy","szczura jaskiniowego","szczurowi jaskiniowemu","szczura jaskiniowego","szczurem jaskiniowym","szczurze jaskiniowym","szczurze jaskiniowy"],"Description":"Szczury jaskiniowe są nieco większe od szczurów miejskich, są jednak porównywalnie obrzydliwe. Bure, mokre futerko pokrywa prawie jedno łokciowego gryzonia, który skrzętnie przeszukuje otoczenie w poszukiwaniu pożywienia. Odgłos małych pazurków uderzających w kamienną posadzkę towarzyszy każdemu ruchowi szczura.","Idle":"szpera dookoła","Equipment":[{"Slot":"Torso","Item":"rat-skin"}]}]}');

/***/ }),

/***/ "./res/Game.json":
/*!***********************!*\
  !*** ./res/Game.json ***!
  \***********************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"Game-Schema.json","GameTemplate":{"Name":"nazwa gry","StartingRoom":0,"Rooms":[{"Id":0,"Name":"Początek korytarza","Description":"Rozglądając się dookoła dostrzegasz głównie ciemność. Wąski słup światła wpadający z dziury w suficie jest jedynym źródłem światła. Miejsce to wygląda na jakiś stary, podziemny tunel. Przejście za twoimi plecami zostało zasypane gruzem, kamieniami i ziemią, którą teraz porastają chwasty i trawa. Patrząc wprost widzisz morze kamienia ginące w mroku poza światłem. Interesująca wydaje się jedynie dziura w podłodze, umieszczona bezpośrednia pod tą w suficie. Słup światła nurkuje do niej ginąc gdzieś dużo, dużo niżej.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":1}],"Items":["stick-wood",{"ItemId":"gold","Stack":10},{"ItemId":"stick-wood","Chance":100},{"ItemId":["stick-wood","stick-wood-2","gold"],"ChanceList":[33,33,34],"Stack":[1,1,50]}]},{"Id":1,"Name":"Podziemny korytarz","Description":"Korytarz wyłożony jest starymi kamiennymi płytami. Takie same płytki na ścianach, podłodze, suficie, od tego kamienia zaczyna kręcić ci się w głowie. Niektóre z nich powypadały ze swoich miejsc, tworzą teraz warstwę gruzu na podłodze. Większość z tych, które pozostały jest porośnięta mchem. Sztucznie uformowany kamień powoli poddaje się otaczającej go naturze.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":2},{"Direction":"south","RoomId":0}],"Characters":["cave-rat"],"Items":[{"ItemId":"wooden-chest","Inventory":["sapphire-round"]}],"OnFirstEnterEvent":"TestGlobalEvent"},{"Id":2,"Name":"Podziemny korytarz","Description":"Im dalej od źródła światła tym bardziej korytarz pogłębia się ciemności i dostrzegasz coraz mniej. Cienie robią się nadzwyczaj długie, niknące w ciemności znajdującej się przed tobą. Refleksje światła na nieporośniętych mchem płytkach stają się coraz słabsze, natomiast podłoga wydaje się być pokryta dywanem mroku.","IsNaturalLight":true,"Exits":[{"Direction":"north","RoomId":3},{"Direction":"south","RoomId":1}]}]}}');

/***/ }),

/***/ "./res/ItemTypes.json":
/*!****************************!*\
  !*** ./res/ItemTypes.json ***!
  \****************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"ItemType-Schema.json","ItemTypes":[{"Id":"Weapon1H","Slot":"MainHand","Name":["broń jednoręczna","broni jednoręcznej","broni jednoręcznej","broń jednoręczną","bronią jednoręczną","broni jednoręcznej","broni jednoręczna"]},{"Id":"Weapon2H","Slot":"MainHand","Name":["broń dwuręczna","broni dwuręcznej","broni dwuręcznej","broń dwuręczną","bronią dwuręczną","broni dwuręcznej","broni dwuręczna"]},{"Id":"Shield","Slot":"OffHand","Name":["tarcza","tarczy","tarczy","tarczę","tarczą","tarczy","tarczo"]},{"Id":"Armor","Slot":"Torso","Name":["pancerz","pancerza","pancerzowi","pancerz","pancerzem","pancerzu","pancerzu"]},{"Id":"Shoulders","Slot":"Arms","Name":["naramienniki","naramienników","naramiennikom","naramienniki","naramiennikami","naramiennikach","naramienniki"]},{"Id":"Gloves","Slot":"Hands","Name":["rękawice","rękawic","rękawicom","rękawice","rękawicami","rękawicach","rękawice"]},{"Id":"Greaves","Slot":"Legs","Name":["nagolenniki","nagolenników","nagolennikom","nagolenniki","nagolennikami","nagolennikach","nagolenniki"]},{"Id":"Boots","Slot":"Legs","Name":["buty","butów","butom","buty","butami","butach","buty"]}]}');

/***/ }),

/***/ "./res/Items.json":
/*!************************!*\
  !*** ./res/Items.json ***!
  \************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"Item-Schema.json","ItemsTemplates":[{"Id":"gold","Name":[["|Yzłota moneta","|Yzłotej monety","|Yzłotej monecie","|Yzłotą monetę","|Yzłotą monetą","|Yzłotej monecie","|Yzłota moneto"],["|Yzłote monety","|Yzłotych monet","|Yzłotym monetom","|Yzłote monety","|Yzłotymi monetami","|Yzłotych monetach","|Yzłote monety"],["|Yzłotych monet","|Yzłotych monet","|Yzłotym monetom","|Yzłotych monet","|Yzłotymi monetami","|Yzłotych monetach","|Yzłotych monet"]],"Description":"|YZłoto, złoto, złoto, złoto.","Type":"Currency","IsStackable":true},{"Id":"stick-wood","Name":["drewniany drąg","drewnianego drąga","drewnianemu drągowi","drewniany drąg","drewnianym drągiem","drewnianym drągu","drewniany drągu"],"Idle":"leży u twoich stóp","Description":"Ten kawał kija wygląda na oderwaną i wyschniętą gałęź jakiegoś drzewa. Nie jest on całkiem prosty, zawiera kilka sęków i nieregularności ale jest długi na kilka łokci i może całkiem sprawnie posłużyć jako improwizowana broń.","Type":"Weapon1H"},{"Id":"stick-wood-2","Name":["inny drewniany drąg","innego drewnianego drąga","innemu drewnianemu drągowi","inny drewniany drąg","innym drewnianym drągiem","innym drewnianym drągu","inny drewniany drągu"],"Idle":"leży u twoich stóp","Description":"Ten kawał kija wygląda na oderwaną i wyschniętą gałęź jakiegoś drzewa. Nie jest on całkiem prosty, zawiera kilka sęków i nieregularności ale jest długi na kilka łokci i może całkiem sprawnie posłużyć jako improwizowana broń.","Type":"Weapon1H"},{"Id":"rat-skin","Name":["szczurza skóra","szczurzej skóry","szczurzej skórze","szczurzą skórę","szczurzą skórą","szczurzej skórze","szczurza skóro"],"Description":"Opis skóry szczura.","Type":"WildArmor"},{"Id":"wooden-chest","Name":["drewniana skrzynia","drewnianej skrzyni","drewnianej skrzyni","drewnianą skrzynię","drewnianą skrzynią","drwnianej skrzyni","drewniana skrzynio"],"Description":"Opis drewnianej skrzyni","Type":"StaticContainer","Idle":"stoi pod ścianą"},{"Id":"sapphire-round","Name":["okrągły szafir","okrągłego szafiru","okrągłemu szafirowi","okrągły szafir","okrągłym szafirem","okrągłym szafirze","okrągły szafirze"],"Description":"Szafir jest kamieniem szlachetnym o barwie ciemno niebieskiej. Zazwyczaj klejnoty szlifowane są w sześcienne lub inne kanciaste kształty, ten jednak jest uformowany w kształt kuli. Przyglądając się bliżej nie zauważasz żadnych śladów szlifowania, zachwyca cię również niezwykła perfekcja kuli.","Type":"Quest"}]}');

/***/ }),

/***/ "./res/Local.pl.json":
/*!***************************!*\
  !*** ./res/Local.pl.json ***!
  \***************************/
/***/ ((module) => {

module.exports = JSON.parse('{"Local":{"Directions":{"north":["północ","północy","północy","północ","północą","północy","północy"],"south":["południe","południa","południu","południe","południem","południu","południu"],"east":["wschód","wschodu","wschodowi","wschód","wschodem","wschodzie","wschodzie"],"west":["zachód","zachodu","zachodowi","zachód","zachodem","zachodzie","zachodzie"],"up":["góra","góry","górze","górę","górą","górze","góro"],"down":["dół","dołu","dołowi","dół","dołem","dole","dole"]},"Commands":{"Drop":{"NoArgument":"Co chcesz wyrzucić?","NoItems":"Przecież nic nie masz biedaku.","NoItemFound":"Nie masz czegoś takiego jak {0}.","Dropped":"Upuszczasz {0}."},"Go":{"WrongDirection":"Może lepiej zostać tutaj i zjeść kilka pierogów?","NoPassage":"Nie możesz tam pójść.","PassageClosed":"Przejście jest zamknięte."},"Inventory":{"YourItems":"Obecnie przy sobie posiadasz:","NoItems":"{0}Ogólnie nic"},"Look":{"CantSee":"Nic nie widzisz w tej ciemności.","NoObject":"Tu nie ma nic takiego jak {0}.","YouLookAt":"Przyglądasz się {0}.","Exits":"Wyjścia"},"NoCommand":{"NoCommand":"Chyba ty."},"Scan":{"CantSee":"Nic nie widzisz w tej ciemności.","LookingAroundYouSee":"Rozglądajac się dookoła dostrzegasz:","Here":"Tutaj:","InDirection":"Na {0}:","NoOneThere":"nikogo nie ma"},"Take":{"NoArgument":"Wziąć co?","NoItems":"Nic tu nie ma.","NoItemFound":"Tutaj nie ma czegoś takiego jak {0}.","CannotPickUp":"Nie możesz podnieść {0}.","PickedUp":"Podnosisz {0}."}},"GlobalEvents":{"TestGlobalEvent":{"Message":"Testing global events..."}}}}');

/***/ })

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/Init.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CommandCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CommandCallback */ "./src/CommandCallback.ts");
/* harmony import */ var _CommandsManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CommandsManager */ "./src/CommandsManager.ts");
/* harmony import */ var _commonLogic_Prompt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./commonLogic/Prompt */ "./src/commonLogic/Prompt.ts");
/* harmony import */ var _InitCommands__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InitCommands */ "./src/InitCommands.ts");
/* harmony import */ var _InitGameData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./InitGameData */ "./src/InitGameData.ts");
/* harmony import */ var _commonLogic_InputFunctions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./commonLogic/InputFunctions */ "./src/commonLogic/InputFunctions.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");







function Init() {
    (0,_InitGameData__WEBPACK_IMPORTED_MODULE_4__.InitGameData)();
    (0,_InitCommands__WEBPACK_IMPORTED_MODULE_3__.InitCommands)();
    Engine.Output('Dungeon Crawler 2, wersja:');
    Engine.Output(_InitGameData__WEBPACK_IMPORTED_MODULE_4__.Version);
    _CommandsManager__WEBPACK_IMPORTED_MODULE_1__.Commands.Go.changePlayerLocation(_InitGameData__WEBPACK_IMPORTED_MODULE_4__.Game.GetRoom(_InitGameData__WEBPACK_IMPORTED_MODULE_4__.Game.StartingRoom), new _CommandCallback__WEBPACK_IMPORTED_MODULE_0__.CommandCallback(function () {
        Engine.Output('');
        _commonLogic_Prompt__WEBPACK_IMPORTED_MODULE_2__.Prompt.Print();
    }));
}
__webpack_require__.g.Init = Init;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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azovLy8uL3NyYy9Db21tYW5kQ2FsbGJhY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1hbmRQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1hbmRUcmVlLnRzIiwid2VicGFjazovLy8uL3NyYy9Db21tYW5kc01hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dsb2JhbEV2ZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW5pdENvbW1hbmRzLnRzIiwid2VicGFjazovLy8uL3NyYy9Jbml0R2FtZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Db21tYW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Eb3duLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Ecm9wLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9FYXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9FdmFsLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Hby50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvSW52ZW50b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Kc29uLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Mb29rLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9Ob0NvbW1hbmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL05vcnRoLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9SZWxvYWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1NjYW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRzL1NvdXRoLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9UYWtlLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9UZXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tYW5kcy9VcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbWFuZHMvV2VzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvQ2hhcmFjdGVyRmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvRW5naW5lVXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL0lucHV0RnVuY3Rpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9JdGVtRmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uTG9naWMvUHJvbXB0LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21tb25Mb2dpYy9SYW5kb20udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbkxvZ2ljL1Jvb21GYWN0b3J5LnRzIiwid2VicGFjazovLy8uL3NyYy9lbnVtcy9EaXJlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0VudW1IZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0VxdWlwbWVudFNsb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudW1zL0dsb2JhbEV2ZW50VHlwZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvR3JhbW1hQ2FzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW51bXMvSXRlbVR5cGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0NoYXJhY3Rlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvQ2hhcmFjdGVyTGlzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvQ2hhcmFjdGVyVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9FbnRpdHlCYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9FbnRpdHlMaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9FcXVpcG1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0dhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0dhbWVEYXRhLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9HbG9iYWxFdmVudEFyZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0l0ZW1MaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVGVtcGxhdGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbC9JdGVtVHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvUm9vbUV4aXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1Jvb21FeGl0c0xpc3QudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL0luaXQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENvbW1hbmRDYWxsYmFjayB7XHJcbiAgICBjYWxsYmFjazogRnVuY3Rpb247XHJcbiAgICBjYWxsYmFja0NhbGxlZDogYm9vbGVhbjtcclxuICAgIGludGVycnVwdEZsb3c6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcihjYWxsYmFjazogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaW50ZXJydXB0RmxvdyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBJZiBjb21tYW5kIGNhbiBjYXVzZSBpbnRlcnJ1cHRGbG93LCBtYWtlIHN1cmUgdG8gY2FsbCB0aGlzIG1ldGhvZCBhdCB0aGUgZW5kIG9mIGNvbW1hbmQgZXhlY3V0aW9uICovXHJcbiAgICBDYWxsSWZOb3RDYWxsZWQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbGxiYWNrQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja0NhbGxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBDb21tYW5kUGFyc2VyIHtcclxuICAgIGNvbW1hbmRTdHJpbmc6IHN0cmluZztcclxuICAgIHBhcnNlZENvbW1hbmQ6IHN0cmluZztcclxuICAgIHBhcnNlZEFyZ3VtZW50czogc3RyaW5nW10gfCBudWxsO1xyXG4gICAgcGFyc2VkTnVtYmVyczogbnVtYmVyW10gfCBudWxsO1xyXG4gICAgcGFyc2VkQ291bnQ6IG51bWJlcltdIHwgbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKGNvbW1hbmRTdHJpbmc6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFN0cmluZyA9IGNvbW1hbmRTdHJpbmc7XHJcbiAgICAgICAgdGhpcy5wYXJzZWRDb21tYW5kID0gJyc7XHJcbiAgICAgICAgdGhpcy5wYXJzZWRBcmd1bWVudHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGFyc2VkTnVtYmVycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wYXJzZWRDb3VudCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29tbWFuZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJzZWRDb21tYW5kID09PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQ29tbWFuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcnNlZENvbW1hbmQgPSB0aGlzLnBhcnNlZENvbW1hbmQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZWRDb21tYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlQ29tbWFuZCgpIHtcclxuICAgICAgICBsZXQgc3BhY2VJbmRleCA9IHRoaXMuY29tbWFuZFN0cmluZy5pbmRleE9mKCcgJyk7XHJcbiAgICAgICAgaWYgKHNwYWNlSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VkQ29tbWFuZCA9IHRoaXMuY29tbWFuZFN0cmluZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlZENvbW1hbmQgPSB0aGlzLmNvbW1hbmRTdHJpbmcuc2xpY2UoMCwgc3BhY2VJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEFyZ3VtZW50KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJzZWRBcmd1bWVudHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUFyZ3VtZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYXJzZWRBcmd1bWVudHMgPT09IG51bGwgfHwgdGhpcy5wYXJzZWRBcmd1bWVudHNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlZEFyZ3VtZW50c1tpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TnVtYmVyKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJzZWROdW1iZXJzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VBcmd1bWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFyc2VkTnVtYmVycyA9PT0gbnVsbCB8fCB0aGlzLnBhcnNlZE51bWJlcnNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlZE51bWJlcnNbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvdW50KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJzZWRDb3VudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQXJndW1lbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhcnNlZENvdW50ID09PSBudWxsIHx8IHRoaXMucGFyc2VkQ291bnRbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlZENvdW50W2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUFyZ3VtZW50cygpIHtcclxuICAgICAgICB0aGlzLnBhcnNlZEFyZ3VtZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMucGFyc2VkTnVtYmVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMucGFyc2VkQ291bnQgPSBbXTtcclxuICAgICAgICBsZXQgc3RhcnRJbmRleCA9IHRoaXMuY29tbWFuZFN0cmluZy5pbmRleE9mKCcgJyk7XHJcbiAgICAgICAgbGV0IGVuZEluZGV4O1xyXG4gICAgICAgIGxldCBjdXJyZW50Q29tbWFuZCA9IHRoaXMuY29tbWFuZFN0cmluZztcclxuICAgICAgICBsZXQgY3VycmVudEFyZ3VtZW50TnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKHN0YXJ0SW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0SW5kZXgrKztcclxuICAgICAgICAgICAgY3VycmVudEFyZ3VtZW50TnVtYmVyKys7XHJcbiAgICAgICAgICAgIGxldCBwYXJzZWROdW1iZXIgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgcGFyc2VkQ291bnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy91c3V3YW15IG5pZXBvdHJ6ZWJuZSBzcGFjamVcclxuICAgICAgICAgICAgd2hpbGUgKHN0YXJ0SW5kZXggPCBjdXJyZW50Q29tbWFuZC5sZW5ndGggJiYgY3VycmVudENvbW1hbmRbc3RhcnRJbmRleF0gPT09ICcgJykge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb21tYW5kID0gY3VycmVudENvbW1hbmQuc2xpY2Uoc3RhcnRJbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q29tbWFuZCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB3eWNpxIVnYW5pZSBudW1lcnUgZGxhIGFyZ3VtZW50dVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmRbMF0uaXNOdW1iZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJbmRleCA9IDE7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4IDwgY3VycmVudENvbW1hbmQubGVuZ3RoICYmIGN1cnJlbnRDb21tYW5kW2N1cnJlbnRJbmRleF0uaXNOdW1iZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kW2N1cnJlbnRJbmRleF0gPT09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZE51bWJlciA9IE51bWJlci5wYXJzZUludChjdXJyZW50Q29tbWFuZC5zbGljZSgwLCBjdXJyZW50SW5kZXgpLCAxMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZWROdW1iZXJzW2N1cnJlbnRBcmd1bWVudE51bWJlcl0gPSBwYXJzZWROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbW1hbmQgPSBjdXJyZW50Q29tbWFuZC5zbGljZShjdXJyZW50SW5kZXggKyAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRDb21tYW5kID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9qZXplbGkgbmllIHdza2F6YW5vIGxpY3pieSwgdG8gZG9tecWbbG5pZSBqZXN0IDFcclxuICAgICAgICAgICAgaWYgKHBhcnNlZE51bWJlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZWROdW1iZXJzW2N1cnJlbnRBcmd1bWVudE51bWJlcl0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJzZWRDb3VudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZWRDb3VudFtjdXJyZW50QXJndW1lbnROdW1iZXJdID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy93eWNpxIVnYW5pZSB0cmXFm2NpIGFyZ3VtZW50dVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENvbW1hbmRbMF0gPT09ICdcIicpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSBjdXJyZW50Q29tbWFuZC5pbmRleE9mKCdcIicsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGN1cnJlbnRDb21tYW5kLmluZGV4T2YoJyAnLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBlbmRJbmRleCA9IGN1cnJlbnRDb21tYW5kLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXJzZWRBcmd1bWVudHNbY3VycmVudEFyZ3VtZW50TnVtYmVyXSA9IGN1cnJlbnRDb21tYW5kLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KTtcclxuICAgICAgICAgICAgc3RhcnRJbmRleCA9IGVuZEluZGV4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9jb21tYW5kcy9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kVHJlZSB7XHJcbiAgICByb290OiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSB7IGNvbW1hbmQ6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBBZGROZXdDb21tYW5kKG5hbWU6IHN0cmluZywgb2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lIHx8IG5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdOZXcgY29tbWFuZCBuYW1lIGNhbm5vdCBiZSBudWxsIG9yIGVtcHR5JztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5WYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gdGhpcy5yb290O1xyXG5cclxuICAgICAgICBuYW1lLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgLnNwbGl0KCcnKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoY3VycmVudENoYXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZVtjdXJyZW50Q2hhcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXSA9IHsgY29tbWFuZDogb2JqZWN0IH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgU2V0RGVmYXVsdENvbW1hbmQob2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgdGhpcy5WYWxpZGF0ZUNvbW1hbmRPYmplY3Qob2JqZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yb290LmNvbW1hbmQgPSBvYmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgVmFsaWRhdGVDb21tYW5kT2JqZWN0KG9iamVjdDogQ29tbWFuZCkge1xyXG4gICAgICAgIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCB8fCBvYmplY3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IGNhbm5vdCBiZSBudWxsJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgQ29tbWFuZCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IG11c3QgZXh0ZW5kIENvbW1hbmQgY2xhc3MnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBHZXRDb21tYW5kKG5hbWU6IHN0cmluZyk6IENvbW1hbmQge1xyXG4gICAgICAgIGxldCBjdXJyZW50Tm9kZSA9IHRoaXMucm9vdDtcclxuXHJcbiAgICAgICAgbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIC5zcGxpdCgnJylcclxuICAgICAgICAgICAgLnNvbWUoKGN1cnJlbnRDaGFyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGVbY3VycmVudENoYXJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbW1hbmQgbm90IGZvdW5kLSByZXR1cm4gZGVmYXVsdCBjb21tYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlW2N1cnJlbnRDaGFyXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZS5jb21tYW5kO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4vQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL2NvbW1hbmRzL0NvbW1hbmQnO1xyXG5pbXBvcnQgeyBEb3duIH0gZnJvbSAnLi9jb21tYW5kcy9Eb3duJztcclxuaW1wb3J0IHsgRHJvcCB9IGZyb20gJy4vY29tbWFuZHMvRHJvcCc7XHJcbmltcG9ydCB7IEVhc3QgfSBmcm9tICcuL2NvbW1hbmRzL0Vhc3QnO1xyXG5pbXBvcnQgeyBFdmFsIH0gZnJvbSAnLi9jb21tYW5kcy9FdmFsJztcclxuaW1wb3J0IHsgR28gfSBmcm9tICcuL2NvbW1hbmRzL0dvJztcclxuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi9jb21tYW5kcy9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBKc29uIH0gZnJvbSAnLi9jb21tYW5kcy9Kc29uJztcclxuaW1wb3J0IHsgTG9vayB9IGZyb20gJy4vY29tbWFuZHMvTG9vayc7XHJcbmltcG9ydCB7IE5vcnRoIH0gZnJvbSAnLi9jb21tYW5kcy9Ob3J0aCc7XHJcbmltcG9ydCB7IFJlbG9hZCB9IGZyb20gJy4vY29tbWFuZHMvUmVsb2FkJztcclxuaW1wb3J0IHsgU2NhbiB9IGZyb20gJy4vY29tbWFuZHMvU2Nhbic7XHJcbmltcG9ydCB7IFNvdXRoIH0gZnJvbSAnLi9jb21tYW5kcy9Tb3V0aCc7XHJcbmltcG9ydCB7IFRha2UgfSBmcm9tICcuL2NvbW1hbmRzL1Rha2UnO1xyXG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnLi9jb21tYW5kcy9UZXN0JztcclxuaW1wb3J0IHsgVXAgfSBmcm9tICcuL2NvbW1hbmRzL1VwJztcclxuaW1wb3J0IHsgV2VzdCB9IGZyb20gJy4vY29tbWFuZHMvV2VzdCc7XHJcbmltcG9ydCB7IENvbW1hbmRUcmVlIH0gZnJvbSAnLi9Db21tYW5kVHJlZSc7XHJcbmltcG9ydCB7IFByb21wdCB9IGZyb20gJy4vY29tbW9uTG9naWMvUHJvbXB0JztcclxuXHJcbmNsYXNzIENvbW1hbmRMaXN0IHtcclxuICAgIERvd246IERvd247XHJcbiAgICBEcm9wOiBEcm9wO1xyXG4gICAgRWFzdDogRWFzdDtcclxuICAgIEV2YWw6IEV2YWw7XHJcbiAgICBHbzogR287XHJcbiAgICBJbnZlbnRvcnk6IEludmVudG9yeTtcclxuICAgIEpzb246IEpzb247XHJcbiAgICBMb29rOiBMb29rO1xyXG4gICAgTm9ydGg6IE5vcnRoO1xyXG4gICAgUmVsb2FkOiBSZWxvYWQ7XHJcbiAgICBTb3V0aDogU291dGg7XHJcbiAgICBTY2FuOiBTY2FuO1xyXG4gICAgVGFrZTogVGFrZTtcclxuICAgIFRlc3Q6IFRlc3Q7XHJcbiAgICBVcDogVXA7XHJcbiAgICBXZXN0OiBXZXN0O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29tbWFuZERpY3Rpb25hcnkge1xyXG4gICAgW2NvbW1hbmROYW1lOiBzdHJpbmddOiBDb21tYW5kO1xyXG59XHJcblxyXG5jbGFzcyBDb21tYW5kc01hbmFnZXIgZXh0ZW5kcyBDb21tYW5kTGlzdCB7XHJcbiAgICBUcmVlOiBDb21tYW5kVHJlZTtcclxuICAgIGlzQ29tbWFuZEV4ZWN1dGluZzogYm9vbGVhbjtcclxuICAgIGNvbW1hbmRRdWV1ZTogYW55W107XHJcbiAgICBDb21tYW5kczogQ29tbWFuZERpY3Rpb25hcnkgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuVHJlZSA9IG5ldyBDb21tYW5kVHJlZSgpO1xyXG4gICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29tbWFuZEV4ZWN1dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuRXhlY3V0ZU5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgRXhlY3V0ZU5leHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFF1ZXVlLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNDb21tYW5kRXhlY3V0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRRdWV1ZVswXTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIGxldCBwYXJzZXIgPSBuZXcgQ29tbWFuZFBhcnNlcihjb21tYW5kKTtcclxuICAgICAgICBsZXQgY29tbWFuZE5hbWUgPSBwYXJzZXIuZ2V0Q29tbWFuZCgpO1xyXG5cclxuICAgICAgICBsZXQgY29tbWFuZE9iamVjdCA9IHRoaXMuVHJlZS5HZXRDb21tYW5kKGNvbW1hbmROYW1lKTtcclxuICAgICAgICBpZiAoY29tbWFuZE9iamVjdCA9PT0gdW5kZWZpbmVkIHx8IGNvbW1hbmRPYmplY3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NvbW1hbmQgb2JqZWN0IGZvciB7MH0gbm90IGZvdW5kJy5mb3JtYXQoY29tbWFuZE5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgY29tbWFuZE9iamVjdC5FeGVjdXRlKHBhcnNlciwgbmV3IENvbW1hbmRDYWxsYmFjaygoKSA9PiB0aGlzLkFmdGVyRXhlY3V0ZSgpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgQWZ0ZXJFeGVjdXRlKCkge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJycpO1xyXG4gICAgICAgIFByb21wdC5QcmludCgpO1xyXG4gICAgICAgIHRoaXMuRXhlY3V0ZU5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBTZXREZWZhdWx0Q29tbWFuZChjb21tYW5kT2JqZWN0OiBDb21tYW5kKSB7XHJcbiAgICAgICAgdGhpcy5UcmVlLlNldERlZmF1bHRDb21tYW5kKGNvbW1hbmRPYmplY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIFJlZ2lzdGVyQ29tbWFuZDxDb21tYW5kTmFtZSBleHRlbmRzIGtleW9mIENvbW1hbmRMaXN0PihuYW1lOiBDb21tYW5kTmFtZSwgb2JqZWN0OiBDb21tYW5kTGlzdFtDb21tYW5kTmFtZV0pIHtcclxuICAgICAgICB0aGlzLlRyZWUuQWRkTmV3Q29tbWFuZChuYW1lLCBvYmplY3QpO1xyXG4gICAgICAgIGxldCBjb21tYW5kTGlzdCA9IHRoaXMgYXMgQ29tbWFuZExpc3Q7XHJcbiAgICAgICAgY29tbWFuZExpc3RbbmFtZV0gPSBvYmplY3Q7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgQ29tbWFuZHMgPSBuZXcgQ29tbWFuZHNNYW5hZ2VyKCk7XHJcbiIsImltcG9ydCB7IEVuZ2luZVV0aWxzIH0gZnJvbSAnLi9jb21tb25Mb2dpYy9FbmdpbmVVdGlscyc7XHJcbmltcG9ydCB7IExvY2FsIH0gZnJvbSAnLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudEFyZ3MgfSBmcm9tICcuL21vZGVsL0dsb2JhbEV2ZW50QXJncyc7XHJcblxyXG5jbGFzcyBHbG9iYWxFdmVudHNDbGFzcyB7XHJcbiAgICBbY29tbWFuZE5hbWU6IHN0cmluZ106IChhcmdzOiBHbG9iYWxFdmVudEFyZ3MpID0+IGJvb2xlYW47XHJcbiAgICBUZXN0R2xvYmFsRXZlbnQoYXJnczogR2xvYmFsRXZlbnRBcmdzKSB7XHJcbiAgICAgICAgRW5naW5lVXRpbHMuT3V0cHV0UHJpbnRlcihMb2NhbC5HbG9iYWxFdmVudHMuVGVzdEdsb2JhbEV2ZW50Lk1lc3NhZ2UsIGFyZ3MuQ29udGludWVDb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEdsb2JhbEV2ZW50cyA9IG5ldyBHbG9iYWxFdmVudHNDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBEb3duIH0gZnJvbSAnLi9jb21tYW5kcy9Eb3duJztcclxuaW1wb3J0IHsgRHJvcCB9IGZyb20gJy4vY29tbWFuZHMvRHJvcCc7XHJcbmltcG9ydCB7IEVhc3QgfSBmcm9tICcuL2NvbW1hbmRzL0Vhc3QnO1xyXG5pbXBvcnQgeyBFdmFsIH0gZnJvbSAnLi9jb21tYW5kcy9FdmFsJztcclxuaW1wb3J0IHsgR28gfSBmcm9tICcuL2NvbW1hbmRzL0dvJztcclxuaW1wb3J0IHsgSW52ZW50b3J5IH0gZnJvbSAnLi9jb21tYW5kcy9JbnZlbnRvcnknO1xyXG5pbXBvcnQgeyBKc29uIH0gZnJvbSAnLi9jb21tYW5kcy9Kc29uJztcclxuaW1wb3J0IHsgTG9vayB9IGZyb20gJy4vY29tbWFuZHMvTG9vayc7XHJcbmltcG9ydCB7IE5vQ29tbWFuZCB9IGZyb20gJy4vY29tbWFuZHMvTm9Db21tYW5kJztcclxuaW1wb3J0IHsgTm9ydGggfSBmcm9tICcuL2NvbW1hbmRzL05vcnRoJztcclxuaW1wb3J0IHsgUmVsb2FkIH0gZnJvbSAnLi9jb21tYW5kcy9SZWxvYWQnO1xyXG5pbXBvcnQgeyBTY2FuIH0gZnJvbSAnLi9jb21tYW5kcy9TY2FuJztcclxuaW1wb3J0IHsgU291dGggfSBmcm9tICcuL2NvbW1hbmRzL1NvdXRoJztcclxuaW1wb3J0IHsgVGFrZSB9IGZyb20gJy4vY29tbWFuZHMvVGFrZSc7XHJcbmltcG9ydCB7IFRlc3QgfSBmcm9tICcuL2NvbW1hbmRzL1Rlc3QnO1xyXG5pbXBvcnQgeyBVcCB9IGZyb20gJy4vY29tbWFuZHMvVXAnO1xyXG5pbXBvcnQgeyBXZXN0IH0gZnJvbSAnLi9jb21tYW5kcy9XZXN0JztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuL0NvbW1hbmRzTWFuYWdlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gSW5pdENvbW1hbmRzKCkge1xyXG4gICAgQ29tbWFuZHMuU2V0RGVmYXVsdENvbW1hbmQobmV3IE5vQ29tbWFuZCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0Rvd24nLCBuZXcgRG93bigpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRHJvcCcsIG5ldyBEcm9wKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnRWFzdCcsIG5ldyBFYXN0KCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdFdmFsJywgbmV3IEV2YWwoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdHbycsIG5ldyBHbygpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ0ludmVudG9yeScsIG5ldyBJbnZlbnRvcnkoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdKc29uJywgbmV3IEpzb24oKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdMb29rJywgbmV3IExvb2soKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdOb3J0aCcsIG5ldyBOb3J0aCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1JlbG9hZCcsIG5ldyBSZWxvYWQoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdTb3V0aCcsIG5ldyBTb3V0aCgpKTtcclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnU2NhbicsIG5ldyBTY2FuKCkpO1xyXG5cclxuICAgIENvbW1hbmRzLlJlZ2lzdGVyQ29tbWFuZCgnVGFrZScsIG5ldyBUYWtlKCkpO1xyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdUZXN0JywgbmV3IFRlc3QoKSk7XHJcblxyXG4gICAgQ29tbWFuZHMuUmVnaXN0ZXJDb21tYW5kKCdVcCcsIG5ldyBVcCgpKTtcclxuXHJcbiAgICBDb21tYW5kcy5SZWdpc3RlckNvbW1hbmQoJ1dlc3QnLCBuZXcgV2VzdCgpKTtcclxufVxyXG4iLCJpbXBvcnQgeyBJdGVtVHlwZXMgfSBmcm9tICcuLi9yZXMvSXRlbVR5cGVzLmpzb24nO1xyXG5pbXBvcnQgeyBJdGVtc1RlbXBsYXRlcyB9IGZyb20gJy4uL3Jlcy9JdGVtcy5qc29uJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyc1RlbXBsYXRlcyB9IGZyb20gJy4uL3Jlcy9DaGFyYWN0ZXJzLmpzb24nO1xyXG5pbXBvcnQgeyBMb2NhbCBhcyBMb2NhbFBsIH0gZnJvbSAnLi4vcmVzL0xvY2FsLnBsLmpzb24nO1xyXG5pbXBvcnQgeyBHYW1lTW9kZWwgfSBmcm9tICcuL21vZGVsL0dhbWUnO1xyXG5pbXBvcnQgeyBJdGVtVHlwZXNNb2RlbCB9IGZyb20gJy4vbW9kZWwvSXRlbVR5cGVzJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGVzTW9kZWwgfSBmcm9tICcuL21vZGVsL0NoYXJhY3RlclRlbXBsYXRlcyc7XHJcbmltcG9ydCB7IEl0ZW1UZW1wbGF0ZXNNb2RlbCB9IGZyb20gJy4vbW9kZWwvSXRlbVRlbXBsYXRlcyc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9tb2RlbC9HYW1lRGF0YSc7XHJcblxyXG5leHBvcnQgdmFyIExvY2FsOiBhbnkgPSB7fTtcclxuZXhwb3J0IHZhciBHYW1lOiBHYW1lTW9kZWwgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbmV4cG9ydCB2YXIgVmVyc2lvbiA9ICcnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEluaXRHYW1lRGF0YSgpIHtcclxuICAgIEdhbWUgPSBuZXcgR2FtZU1vZGVsKCk7XHJcbiAgICBHYW1lLkxvYWRGcm9tVGVtcGxhdGUoKTtcclxuICAgIEdhbWVEYXRhLkl0ZW1UeXBlcyA9IG5ldyBJdGVtVHlwZXNNb2RlbChJdGVtVHlwZXMpO1xyXG4gICAgR2FtZURhdGEuSXRlbVRlbXBsYXRlcyA9IG5ldyBJdGVtVGVtcGxhdGVzTW9kZWwoSXRlbXNUZW1wbGF0ZXMpO1xyXG4gICAgR2FtZURhdGEuQ2hhcmFjdGVyVGVtcGxhdGVzID0gbmV3IENoYXJhY3RlclRlbXBsYXRlc01vZGVsKENoYXJhY3RlcnNUZW1wbGF0ZXMpO1xyXG4gICAgTG9jYWwgPSBMb2NhbFBsO1xyXG4gICAgVmVyc2lvbiA9IEVuZ2luZS5Mb2FkRGF0YSgndmVyc2lvbi50eHQnKS5yZXBsYWNlKCdcXG4nLCBFbmdpbmUuRW5kTGluZSk7XHJcblxyXG4gICAgR2FtZS5QbGF5ZXIuTG9jYXRpb24gPSBHYW1lLlN0YXJ0aW5nUm9vbTtcclxufVxyXG4iLCJleHBvcnQge307XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBpbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgICAgICBmb3JtYXQoLi4uYXJnczogYW55W10pOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhcnRXaXRoVXBwZXIoKTogc3RyaW5nO1xyXG4gICAgICAgIGlzTnVtYmVyKCk6IGJvb2xlYW47XHJcbiAgICAgICAgaXNOdWxsT3JFbXB0eSgpOiBib29sZWFuO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICguLi5hcmdzOiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2g6IHN0cmluZywgbnVtYmVyOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPT0gJ3VuZGVmaW5lZCcgPyBhcmdzW251bWJlcl0gOiBtYXRjaDtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5zdGFydFdpdGhVcHBlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzWzBdLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnNsaWNlKDEpO1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5pc051bWJlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAvXlxcZCskLy50ZXN0KHRoaXMpO1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5pc051bGxPckVtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMgPT09IG51bGwgfHwgdGhpcyA9PT0gJyc7XHJcbn07XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBFeGVjdXRlKGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5FeGVjdXRlQm9keShjb21tYW5kLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgICAgIGlmICghY29tbWFuZENhbGxiYWNrLmludGVycnVwdEZsb3cpIHtcclxuICAgICAgICAgICAgY29tbWFuZENhbGxiYWNrLkNhbGxJZk5vdENhbGxlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge31cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRG93biBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoX2NvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24uZG93biwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERyb3AgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkRyb3AuTm9Bcmd1bWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhcmd1bWVudC50b0xvd2VyQ2FzZSgpID09PSAnYWxsJykge1xyXG4gICAgICAgICAgICBpZiAoIUdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFueSgpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkRyb3AuTm9JdGVtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZHJvcEFsbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuZmluZChhcmd1bWVudCwgY29tbWFuZC5nZXROdW1iZXIoMSkpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLk5vSXRlbUZvdW5kLmZvcm1hdChhcmd1bWVudCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRyb3BJdGVtKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcm9wQWxsKCkge1xyXG4gICAgICAgIHdoaWxlIChHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRyb3BJdGVtKEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmVsZW1lbnRBdCgwKSEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcm9wSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkucmVtb3ZlKGl0ZW0pO1xyXG4gICAgICAgIEdhbWUuR2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKS5hZGQoaXRlbSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Ecm9wLkRyb3BwZWQuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkJpZXJuaWspKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVhc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgQ29tbWFuZHMuR28uZ29Ub0RpcmVjdGlvbihEaXJlY3Rpb24uZWFzdCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2YWwgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQgPSBjb21tYW5kLmdldEFyZ3VtZW50KDEpO1xyXG4gICAgICAgIGlmIChhcmd1bWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoZXZhbChhcmd1bWVudCkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb25IZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBHbG9iYWxFdmVudFR5cGUgfSBmcm9tICcuLi9lbnVtcy9HbG9iYWxFdmVudFR5cGUnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50QXJncyB9IGZyb20gJy4uL21vZGVsL0dsb2JhbEV2ZW50QXJncyc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgR28gZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIsIGNvbW1hbmRDYWxsYmFjazogQ29tbWFuZENhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gRGlyZWN0aW9uSGVscGVyLnBhcnNlU2hvcnQoYXJndW1lbnQudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5Xcm9uZ0RpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ29Ub0RpcmVjdGlvbihkaXJlY3Rpb24sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgZ29Ub0RpcmVjdGlvbihkaXJlY3Rpb246IGFueSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZXhpdCA9IEdhbWUuR2V0Um9vbShHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKS5nZXRFeGl0KGRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChleGl0ID09PSBudWxsIHx8IGV4aXQuaXNIaWRkZW4oKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkdvLk5vUGFzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChleGl0LmlzQ2xvc2VkKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Hby5QYXNzYWdlQ2xvc2VkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld1Jvb20gPSBHYW1lLkdldFJvb20oZXhpdC5HZXRSb29tSWQoKSk7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuc2V0UHJldmlvdXNMb2NhdGlvbihHYW1lLlBsYXllci5nZXRMb2NhdGlvbigpKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVBsYXllckxvY2F0aW9uKG5ld1Jvb20sIGNvbW1hbmRDYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGxheWVyTG9jYXRpb24ocm9vbTogUm9vbSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBHYW1lLlBsYXllci5Mb2NhdGlvbiA9IHJvb20uSWQ7XHJcbiAgICAgICAgcm9vbS5Jc1Zpc2l0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLm9uRW50ZXJHbG9iYWxFdmVudHMocm9vbSwgKCkgPT4gdGhpcy5hZnRlck9uRW50ZXJHbG9iYWxFdmVudHMocm9vbSwgY29tbWFuZENhbGxiYWNrKSwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBhZnRlck9uRW50ZXJHbG9iYWxFdmVudHMocm9vbTogUm9vbSwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Mb29rLmxvb2tSb29tKHJvb20pO1xyXG4gICAgICAgIC8vVE9ETzogWmRhcnplbmlhIHByenkgd2VqxZtjaXVcclxuICAgICAgICBjb21tYW5kQ2FsbGJhY2suQ2FsbElmTm90Q2FsbGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbnRlckdsb2JhbEV2ZW50cyhyb29tOiBSb29tLCBjb250aW51ZUNhbGxiYWNrOiBGdW5jdGlvbiwgZmluaXNoQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChyb29tLmdldE9uRmlyc3RFbnRlckV2ZW50KCkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGludGVycnVwdCA9IEdhbWUuSW52b2tlR2xvYmFsRXZlbnQoXHJcbiAgICAgICAgICAgICAgICByb29tLmdldE9uRmlyc3RFbnRlckV2ZW50KCksXHJcbiAgICAgICAgICAgICAgICBuZXcgR2xvYmFsRXZlbnRBcmdzKEdsb2JhbEV2ZW50VHlwZS5CZWZvcmVSb29tRW50ZXIsIHJvb20sIGZpbmlzaENhbGxiYWNrLCBjb250aW51ZUNhbGxiYWNrKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZGVsZXRlIHJvb20uT25GaXJzdEVudGVyRXZlbnQ7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcnJ1cHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGZpbmlzaENhbGxiYWNrLmludGVycnVwdEZsb3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocm9vbS5nZXRPbkVudGVyRXZlbnQoKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaW50ZXJydXB0ID0gR2FtZS5JbnZva2VHbG9iYWxFdmVudChcclxuICAgICAgICAgICAgICAgIHJvb20uZ2V0T25FbnRlckV2ZW50KCksXHJcbiAgICAgICAgICAgICAgICBuZXcgR2xvYmFsRXZlbnRBcmdzKEdsb2JhbEV2ZW50VHlwZS5CZWZvcmVSb29tRW50ZXIsIHJvb20sIGZpbmlzaENhbGxiYWNrLCBjb250aW51ZUNhbGxiYWNrKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKGludGVycnVwdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgZmluaXNoQ2FsbGJhY2suaW50ZXJydXB0RmxvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRpbnVlQ2FsbGJhY2soKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IEdhbWUsIExvY2FsIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgSW52ZW50b3J5IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5JbnZlbnRvcnkuWW91ckl0ZW1zKTtcclxuICAgICAgICBpZiAoIUdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuSW52ZW50b3J5Lk5vSXRlbXMuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCg0KSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkucHJpbnRTaG9ydEZvcm1hdCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IGFyZ3VtZW50ID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KEpTT04uc3RyaW5naWZ5KGV2YWwoYXJndW1lbnQpKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuLi9tb2RlbC9DaGFyYWN0ZXInO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuLi9tb2RlbC9Sb29tJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9vayBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5HZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCFHYW1lLlBsYXllci5jYW5TZWUoKSkge1xyXG4gICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suQ2FudFNlZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBhcmd1bWVudCA9IGNvbW1hbmQuZ2V0QXJndW1lbnQoMSk7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va1Jvb20ocm9vbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjaGFyYWN0ZXIgPSByb29tLmdldENoYXJhY3RlcnMoKS5maW5kKGFyZ3VtZW50LCBjb21tYW5kLmdldE51bWJlcigxKSk7XHJcbiAgICAgICAgaWYgKGNoYXJhY3RlciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvb2tDaGFyYWN0ZXIoY2hhcmFjdGVyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGl0ZW0gPSByb29tLmdldEl0ZW1zKCkuZmluZChhcmd1bWVudCwgY29tbWFuZC5nZXROdW1iZXIoMSkpO1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9va0l0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0gPSBHYW1lLlBsYXllci5nZXRJbnZlbnRvcnkoKS5maW5kKGFyZ3VtZW50LCBjb21tYW5kLmdldE51bWJlcigxKSk7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb29rSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLk5vT2JqZWN0LmZvcm1hdChjb21tYW5kLmdldEFyZ3VtZW50KDEpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9va1Jvb20ocm9vbTogUm9vbSkge1xyXG4gICAgICAgIGxldCBtZXNzYWdlID0gJyc7XHJcbiAgICAgICAgbWVzc2FnZSArPSByb29tLmdldE5hbWUoKSArIEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gdGhpcy5leGl0c1N0cmluZyhyb29tKSArIEVuZ2luZS5FbmRMaW5lO1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgbWVzc2FnZSArPSByb29tLkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGlmIChyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IEVuZ2luZS5FbmRMaW5lICsgRW5naW5lLkVuZExpbmUgKyByb29tLmdldENoYXJhY3RlcnMoKS5wcmludExvbmdGb3JtYXQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm9vbS5nZXRJdGVtcygpLmFueSgpKSB7XHJcbiAgICAgICAgICAgIGlmICghcm9vbS5nZXRDaGFyYWN0ZXJzKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gRW5naW5lLkVuZExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVzc2FnZSArPSBFbmdpbmUuRW5kTGluZSArIHJvb20uZ2V0SXRlbXMoKS5wcmludExvbmdGb3JtYXQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb29rSXRlbShpdGVtOiBJdGVtKSB7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5Mb29rLllvdUxvb2tBdC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQ2Vsb3duaWspKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dChpdGVtLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tDaGFyYWN0ZXIoY2hhcmFjdGVyOiBDaGFyYWN0ZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLkxvb2suWW91TG9va0F0LmZvcm1hdChjaGFyYWN0ZXIuZ2V0TmFtZShHcmFtbWFDYXNlLkNlbG93bmlrKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoY2hhcmFjdGVyLmdldERlc2NyaXB0aW9uKCkpO1xyXG4gICAgICAgIC8vVE9ETzogc3RhbiB6ZHJvd2lhXHJcbiAgICB9XHJcblxyXG4gICAgZXhpdHNTdHJpbmcocm9vbTogUm9vbSk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJldHVyblN0cmluZyA9ICd8ZycgKyBMb2NhbC5Db21tYW5kcy5Mb29rLkV4aXRzICsgJzogWyAnO1xyXG4gICAgICAgIGxldCBmaXJzdEV4aXQgPSB0cnVlO1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb25zID0gcm9vbS5nZXRFeGl0c0RpcmVjdGlvbnMoKTtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXhpdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcsICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmlyc3RFeGl0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBEaXJlY3Rpb25IZWxwZXIuZ2V0TG9jYWxlKGRpcmVjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuU3RyaW5nICs9ICcgXXxXJztcclxuICAgICAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb0NvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KF86IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLk5vQ29tbWFuZC5Ob0NvbW1hbmQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb3J0aCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi5ub3J0aCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlbG9hZCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoY29tbWFuZDogQ29tbWFuZFBhcnNlcikge1xyXG4gICAgICAgIEVuZ2luZS5SZWxvYWQoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IEdyYW1tYUNhc2UgfSBmcm9tICcuLi9lbnVtcy9HcmFtbWFDYXNlJztcclxuaW1wb3J0IHsgR2FtZSwgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2FuIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShjb21tYW5kOiBDb21tYW5kUGFyc2VyKSB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBHYW1lLkdldFJvb20oR2FtZS5QbGF5ZXIuZ2V0TG9jYXRpb24oKSk7XHJcblxyXG4gICAgICAgIGlmICghR2FtZS5QbGF5ZXIuY2FuU2VlKCkpIHtcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TY2FuLkNhbnRTZWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwbGF5ZXJSb29tID0gR2FtZS5HZXRSb29tKEdhbWUuUGxheWVyLkxvY2F0aW9uKTtcclxuXHJcbiAgICAgICAgRW5naW5lLk91dHB1dChMb2NhbC5Db21tYW5kcy5TY2FuLkxvb2tpbmdBcm91bmRZb3VTZWUpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuU2Nhbi5IZXJlKTtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KHRoaXMucHJpbnRDaGFyYWN0ZXJzKEdhbWUuUGxheWVyLkxvY2F0aW9uKSk7XHJcblxyXG4gICAgICAgIERpcmVjdGlvbkhlbHBlci5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgbGV0IGV4aXQgPSBwbGF5ZXJSb29tLmdldEV4aXQoZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGV4aXQgIT09IG51bGwgJiYgIWV4aXQuaXNIaWRkZW4oKSAmJiAhZXhpdC5pc0Nsb3NlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICAgICAgICAgIExvY2FsLkNvbW1hbmRzLlNjYW4uSW5EaXJlY3Rpb24uZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEaXJlY3Rpb25IZWxwZXIuZ2V0TG9jYWxlKGRpcmVjdGlvbiwgR3JhbW1hQ2FzZS5NaWVqc2Nvd25payksXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KHRoaXMucHJpbnRDaGFyYWN0ZXJzKGV4aXQuUm9vbUlkKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50Q2hhcmFjdGVycyhyb29tSWQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCByb29tID0gR2FtZS5HZXRSb29tKHJvb21JZCk7XHJcbiAgICAgICAgaWYgKCFyb29tLmdldENoYXJhY3RlcnMoKS5hbnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpICsgTG9jYWwuQ29tbWFuZHMuU2Nhbi5Ob09uZVRoZXJlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb20uZ2V0Q2hhcmFjdGVycygpLnByaW50U2hvcnRGb3JtYXQodHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tbWFuZENhbGxiYWNrIH0gZnJvbSAnLi4vQ29tbWFuZENhbGxiYWNrJztcclxuaW1wb3J0IHsgQ29tbWFuZFBhcnNlciB9IGZyb20gJy4uL0NvbW1hbmRQYXJzZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kcyB9IGZyb20gJy4uL0NvbW1hbmRzTWFuYWdlcic7XHJcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNvdXRoIGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBFeGVjdXRlQm9keShfOiBDb21tYW5kUGFyc2VyLCBjb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaykge1xyXG4gICAgICAgIENvbW1hbmRzLkdvLmdvVG9EaXJlY3Rpb24oRGlyZWN0aW9uLnNvdXRoLCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBHYW1lLCBMb2NhbCB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuLi9tb2RlbC9JdGVtJztcclxuaW1wb3J0IHsgSXRlbUxpc3QgfSBmcm9tICcuLi9tb2RlbC9JdGVtTGlzdCc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRha2UgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBsZXQgYXJndW1lbnQxID0gY29tbWFuZC5nZXRBcmd1bWVudCgxKTtcclxuICAgICAgICBpZiAoYXJndW1lbnQxID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Ob0FyZ3VtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbW1hbmQuZ2V0QXJndW1lbnQoMikgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50MS50b0xvd2VyQ2FzZSgpID09PSAnYWxsJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFHYW1lLkdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCkuYW55KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBFbmdpbmUuT3V0cHV0KExvY2FsLkNvbW1hbmRzLlRha2UuTm9JdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlQWxsRnJvbUxvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUxpc3QgPSBHYW1lLkdldFJvb20oR2FtZS5QbGF5ZXIuTG9jYXRpb24pLmdldEl0ZW1zKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGl0ZW1MaXN0LmZpbmQoYXJndW1lbnQxLCBjb21tYW5kLmdldE51bWJlcigxKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5Ob0l0ZW1Gb3VuZC5mb3JtYXQoYXJndW1lbnQxKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtLCBpdGVtTGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL1RPRE86IFRha2UgZnJvbSBjb250YWluZXJcclxuICAgICAgICAgICAgRW5naW5lLk91dHB1dCgn4oCLwq9cXFxcXyjjg4QpXy/CrycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtOiBJdGVtLCBpdGVtTGlzdDogSXRlbUxpc3QpIHtcclxuICAgICAgICBpZiAoIWl0ZW0uaXNUYWtlYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5DYW5ub3RQaWNrVXAuZm9ybWF0KGl0ZW0uZ2V0TmFtZShHcmFtbWFDYXNlLkRvcGVsbmlhY3opKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudGFrZUl0ZW0oaXRlbSwgaXRlbUxpc3QpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoTG9jYWwuQ29tbWFuZHMuVGFrZS5QaWNrZWRVcC5mb3JtYXQoaXRlbS5nZXROYW1lKEdyYW1tYUNhc2UuQmllcm5paykpKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0YWtlQWxsRnJvbUxvY2F0aW9uKCkge1xyXG4gICAgICAgIGxldCBpdGVtTGlzdCA9IEdhbWUuR2V0Um9vbShHYW1lLlBsYXllci5Mb2NhdGlvbikuZ2V0SXRlbXMoKTtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaXRlbSA9IGl0ZW1MaXN0LmVsZW1lbnRBdChpKTsgaXRlbSAhPSBudWxsOyBpdGVtID0gaXRlbUxpc3QuZWxlbWVudEF0KGkpKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50YWtlSXRlbUZyb21Mb2NhdGlvbihpdGVtLCBpdGVtTGlzdCkpIHtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWtlSXRlbShpdGVtOiBJdGVtLCBpdGVtTGlzdDogSXRlbUxpc3QpIHtcclxuICAgICAgICBpdGVtTGlzdC5yZW1vdmUoaXRlbSk7XHJcbiAgICAgICAgR2FtZS5QbGF5ZXIuZ2V0SW52ZW50b3J5KCkuYWRkKGl0ZW0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICcuL0NvbW1hbmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3QgZXh0ZW5kcyBDb21tYW5kIHtcclxuICAgIEV4ZWN1dGVCb2R5KGNvbW1hbmQ6IENvbW1hbmRQYXJzZXIpIHtcclxuICAgICAgICBFbmdpbmUuT3V0cHV0KFxyXG4gICAgICAgICAgICBjb21tYW5kLmdldENvbW1hbmQoKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXROdW1iZXIoMSkgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXRBcmd1bWVudCgxKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXROdW1iZXIoMikgK1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZC5nZXRBcmd1bWVudCgyKSArXHJcbiAgICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgICAgR2FtZS5nZXROYW1lKCkgK1xyXG4gICAgICAgICAgICAgICAgJyBhYWEnLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoXHJcbiAgICAgICAgICAgICdOYXp5d2FtIHNpxJkgfGJ7MH18Vy4gVGFrIHxCezB9fFcgdG8gd8WCYcWbbmllIG1vamUgaW1pxJkuIEEgbmllLCBtb8W8ZSB0byBqZWRuYWsgfFJ7MX18Vz8gTmllZWUsIGNoeWJhIHxHezJ9fFcuLi4gTmllLCB0byBuaWUgdG8uLi4gV2llbSEgfFB7M318VyB0byBtb2plIHByYXdkeml3ZSBpbWnEmSEnLmZvcm1hdChcclxuICAgICAgICAgICAgICAgICdHYW1lLlBsYXllci5nZXROYW1lKCknLFxyXG4gICAgICAgICAgICAgICAgJ1dvanRlayBQxJlkeml3w7NyJyxcclxuICAgICAgICAgICAgICAgICdTa3J6eXBlayBOYWRhY2h1JyxcclxuICAgICAgICAgICAgICAgICdaZHppb2NobyBNb2N6eXfEhXMnLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnQ3phcyBuYSBrb2xvciB0ZXN0IScpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xiRGFyayBCbHVlezB9fEJCbHVlJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfGdEYXJrIEdyZWVuezB9fEdHcmVlbicuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlLnJlcGVhdCgyKSkpO1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJ3xjRGFyayBDeWFuezB9fENDeWFuJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDMpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHJEYXJrIFJlZHswfXxSUmVkJy5mb3JtYXQoRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHBEYXJrIFB1cnBsZSB8UFB1cnBsZScuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHlEYXJrIFllbGxvdyB8WVllbGxvdycuZm9ybWF0KEVuZ2luZS5Ob25CcmVha2luZ1NwYWNlKSk7XHJcbiAgICAgICAgRW5naW5lLk91dHB1dCgnfHNEYXJrIEdyZXl7MH18U0dyZXknLmZvcm1hdChFbmdpbmUuTm9uQnJlYWtpbmdTcGFjZS5yZXBlYXQoMykpKTtcclxuICAgICAgICB0aHJvdyAnVGVzdCBleGNlcHRpb24nO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRQYXJzZXIgfSBmcm9tICcuLi9Db21tYW5kUGFyc2VyJztcclxuaW1wb3J0IHsgQ29tbWFuZHMgfSBmcm9tICcuLi9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi9lbnVtcy9EaXJlY3Rpb24nO1xyXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnLi9Db21tYW5kJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVcCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi51cCwgY29tbWFuZENhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuLi9Db21tYW5kQ2FsbGJhY2snO1xyXG5pbXBvcnQgeyBDb21tYW5kUGFyc2VyIH0gZnJvbSAnLi4vQ29tbWFuZFBhcnNlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRGlyZWN0aW9uIH0gZnJvbSAnLi4vZW51bXMvRGlyZWN0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJy4vQ29tbWFuZCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VzdCBleHRlbmRzIENvbW1hbmQge1xyXG4gICAgRXhlY3V0ZUJvZHkoXzogQ29tbWFuZFBhcnNlciwgY29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2spIHtcclxuICAgICAgICBDb21tYW5kcy5Hby5nb1RvRGlyZWN0aW9uKERpcmVjdGlvbi53ZXN0LCBjb21tYW5kQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEVxdWlwbWVudFNsb3RIZWxwZXIgfSBmcm9tICcuLi9lbnVtcy9FcXVpcG1lbnRTbG90JztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEVxdWlwbWVudCB9IGZyb20gJy4uL21vZGVsL0VxdWlwbWVudCc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ2hhcmFjdGVyVGVtcGxhdGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlckZhY3Rvcnkge1xyXG4gICAgU3Bhd25DaGFyYWN0ZXIoY2hhcmFjdGVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IEdhbWVEYXRhLkNoYXJhY3RlclRlbXBsYXRlcy5nZXRUZW1wbGF0ZShjaGFyYWN0ZXJJZCk7XHJcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoKTtcclxuICAgICAgICBjaGFyYWN0ZXIgPSB0aGlzLkxvYWRGcm9tVGVtcGxhdGUoY2hhcmFjdGVyLCB0ZW1wbGF0ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgTG9hZEZyb21UZW1wbGF0ZShjaGFyYWN0ZXI6IENoYXJhY3RlciwgdGVtcGxhdGU6IENoYXJhY3RlclRlbXBsYXRlKSB7XHJcbiAgICAgICAgY2hhcmFjdGVyLklkID0gdGVtcGxhdGUuSWQ7XHJcbiAgICAgICAgY2hhcmFjdGVyLk5hbWUgPSB0ZW1wbGF0ZS5OYW1lO1xyXG4gICAgICAgIGNoYXJhY3Rlci5EZXNjcmlwdGlvbiA9IHRlbXBsYXRlLkRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGNoYXJhY3Rlci5JZGxlID0gdGVtcGxhdGUuSWRsZTtcclxuXHJcbiAgICAgICAgbGV0IGludmVudG9yeU1vZGVsID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLkludmVudG9yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLkludmVudG9yeS5mb3JFYWNoKChpdGVtRGVmaW5pdGlvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnlNb2RlbC5hZGQoR2FtZS5TcGF3bkl0ZW0oaXRlbURlZmluaXRpb24pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYXJhY3Rlci5JbnZlbnRvcnkgPSBpbnZlbnRvcnlNb2RlbDtcclxuXHJcbiAgICAgICAgbGV0IGVxdWlwbWVudE1vZGVsID0gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5FcXVpcG1lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5FcXVpcG1lbnQuZm9yRWFjaCgoZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIGVxdWlwbWVudE1vZGVsLmVxdWlwKGVxLlNsb3QsIEdhbWUuU3Bhd25JdGVtKGVxLkl0ZW0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYXJhY3Rlci5FcXVpcG1lbnQgPSBlcXVpcG1lbnRNb2RlbDtcclxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyO1xyXG4gICAgfVxyXG5cclxuICAgIExvYWRGcm9tU2F2ZShzYXZlQ2hhcmFjdGVyOiBhbnkpIHtcclxuICAgICAgICBsZXQgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oY2hhcmFjdGVyLCBzYXZlQ2hhcmFjdGVyKTtcclxuXHJcbiAgICAgICAgbGV0IGludmVudG9yeU1vZGVsID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgaWYgKHNhdmVDaGFyYWN0ZXIuSW52ZW50b3J5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2F2ZUNoYXJhY3Rlci5JbnZlbnRvcnkuZm9yRWFjaCgoc2F2ZWRJdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeU1vZGVsLmFkZChHYW1lLkxvYWRJdGVtRnJvbVNhdmUoc2F2ZWRJdGVtKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGFyYWN0ZXIuSW52ZW50b3J5ID0gaW52ZW50b3J5TW9kZWw7XHJcblxyXG4gICAgICAgIGxldCBlcXVpcG1lbnRNb2RlbCA9IG5ldyBFcXVpcG1lbnQoKTtcclxuICAgICAgICBpZiAoc2F2ZUNoYXJhY3Rlci5FcXVpcG1lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzYXZlQ2hhcmFjdGVyLkVxdWlwbWVudC5mb3JFYWNoKChlcTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcXVpcG1lbnRNb2RlbC5lcXVpcChlcS5TbG90LCBHYW1lLkxvYWRJdGVtRnJvbVNhdmUoZXEuSXRlbSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhcmFjdGVyLkVxdWlwbWVudCA9IGVxdWlwbWVudE1vZGVsO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIEVuZ2luZVV0aWxzQ2xhc3Mge1xyXG4gICAgc2tpcFByaW50ZXI6IGJvb2xlYW47XHJcblxyXG4gICAgT3V0cHV0UHJpbnRlcihtZXNzYWdlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgZGVsYXkgPSA2MCwgaXNOZXdMaW5lID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuc2tpcFByaW50ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnByaW50TmV4dChtZXNzYWdlLCBjYWxsYmFjaywgZGVsYXksIGlzTmV3TGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnROZXh0KG1lc3NhZ2U6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyLCBpc05ld0xpbmU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAobWVzc2FnZS5pc051bGxPckVtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKGlzTmV3TGluZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgRW5naW5lLk91dHB1dCgnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5za2lwUHJpbnRlciA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBFbmdpbmUuT3V0cHV0KG1lc3NhZ2VbMF0sIGZhbHNlKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcmludE5leHQobWVzc2FnZS5zbGljZSgxKSwgY2FsbGJhY2ssIGRlbGF5LCBpc05ld0xpbmUpO1xyXG4gICAgICAgIH0sIGRlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICBTa2lwUHJpbnRlcigpIHtcclxuICAgICAgICB0aGlzLnNraXBQcmludGVyID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBFbmdpbmVVdGlscyA9IG5ldyBFbmdpbmVVdGlsc0NsYXNzKCk7XHJcbiIsImltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi4vQ29tbWFuZHNNYW5hZ2VyJztcclxuaW1wb3J0IHsgRW5naW5lVXRpbHMgfSBmcm9tICcuL0VuZ2luZVV0aWxzJztcclxuXHJcbmV4cG9ydCB2YXIgSW5wdXRGdW5jdGlvbnMgPSAndHJ1ZSc7XHJcblxyXG5mdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZykge1xyXG4gICAgQ29tbWFuZHMuRXhlY3V0ZShjb21tYW5kKTtcclxufVxyXG5cclxuZnVuY3Rpb24gU2tpcFByaW50ZXIoKSB7XHJcbiAgICBFbmdpbmVVdGlscy5Ta2lwUHJpbnRlcigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXN1bWVFeGVjdXRpb24oKSB7XHJcbiAgICBDb21tYW5kcy5FeGVjdXRlTmV4dCgpO1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBmdW5jdGlvbiBFeGVjdXRlKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQ7XHJcbiAgICBmdW5jdGlvbiBTa2lwUHJpbnRlcigpOiB2b2lkO1xyXG4gICAgZnVuY3Rpb24gUmVzdW1lRXhlY3V0aW9uKCk6IHZvaWQ7XHJcbn1cclxuZ2xvYmFsLkV4ZWN1dGUgPSBFeGVjdXRlO1xyXG5nbG9iYWwuU2tpcFByaW50ZXIgPSBTa2lwUHJpbnRlcjtcclxuZ2xvYmFsLlJlc3VtZUV4ZWN1dGlvbiA9IFJlc3VtZUV4ZWN1dGlvbjtcclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi4vbW9kZWwvR2FtZURhdGEnO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi4vbW9kZWwvSXRlbSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi4vbW9kZWwvSXRlbUxpc3QnO1xyXG5pbXBvcnQgeyBJdGVtQ2hhbmNlT25lT2ZUZW1wbGF0ZSwgSXRlbUNoYW5jZVRlbXBsYXRlLCBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCwgU3RhY2sgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ29tbW9uJztcclxuaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XHJcbmltcG9ydCB7IFJhbmRvbSB9IGZyb20gJy4vUmFuZG9tJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVtRmFjdG9yeSB7XHJcbiAgICBzcGF3bkl0ZW0oaXRlbURlZmluaXRpb246IEl0ZW1MaXN0VGVtcGxhdGVFbGVtZW50KTogSXRlbSB8IG51bGwge1xyXG4gICAgICAgIGxldCBpdGVtID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtRGVmaW5pdGlvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKGl0ZW1EZWZpbml0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0l0ZW1DaGFuY2VUZW1wbGF0ZShpdGVtRGVmaW5pdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtRGVmaW5pdGlvbi5DaGFuY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChSYW5kb20ubmV4dEludCgxLCAxMDApID4gaXRlbURlZmluaXRpb24uQ2hhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZUlkID0gaXRlbURlZmluaXRpb24uSXRlbUlkO1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLlN0YWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFN0YWNrKHRoaXMuc3RhY2tWYWx1ZShpdGVtRGVmaW5pdGlvbi5TdGFjaykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlSW52ZW50b3J5KGl0ZW1EZWZpbml0aW9uLCBpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RldEl0ZW1JbmRleCA9IHRoaXMucmVzb2x2ZVJhbmRvbUl0ZW1JbmRleChpdGVtRGVmaW5pdGlvbik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVJZCA9IGl0ZW1EZWZpbml0aW9uLkl0ZW1JZFtzZWxlY3RldEl0ZW1JbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLlN0YWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93ICdJdGVtIGRlZmluaXRpb24gaGFzIHswfSBzcGVjaWZpZWQgaWRzIGJ1dCBvbmx5IHsxfSBzcGllY2lmaWVkIHN0YWNrcycuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLlN0YWNrLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRTdGFjayh0aGlzLnN0YWNrVmFsdWUoaXRlbURlZmluaXRpb24uU3RhY2tbc2VsZWN0ZXRJdGVtSW5kZXhdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzSXRlbUNoYW5jZVRlbXBsYXRlKGl0ZW1EZWZpbml0aW9uOiBJdGVtTGlzdFRlbXBsYXRlRWxlbWVudCk6IGl0ZW1EZWZpbml0aW9uIGlzIEl0ZW1DaGFuY2VUZW1wbGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtRGVmaW5pdGlvbiAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZCA9PT0gJ3N0cmluZyc7XHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd25JdGVtQnlUZW1wbGF0ZUlkKHRlbXBsYXRlSWQ6IHN0cmluZyk6IEl0ZW0ge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZTogSXRlbVRlbXBsYXRlID0gR2FtZURhdGEuSXRlbVRlbXBsYXRlcy5nZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcclxuICAgICAgICBsZXQgaXRlbSA9IG5ldyBJdGVtKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihpdGVtLCB0ZW1wbGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlUmFuZG9tSXRlbUluZGV4KGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlT25lT2ZUZW1wbGF0ZSk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3QgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5DaGFuY2VMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkl0ZW1JZC5mb3JFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLkNoYW5jZUxpc3Q/LnB1c2goMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSXRlbUlkLmxlbmd0aCAhPT0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gZGVmaW5pdGlvbiBoYXMgezB9IHNwZWNpZmllZCBpZHMgYnV0IG9ubHkgezF9IHNwaWVjaWZpZWQgY2hhbmNlcyBpbiBDaGFuY2VMaXN0Jy5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgICBpdGVtRGVmaW5pdGlvbi5JdGVtSWQubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY2hhbmNlU3VtID0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5yZWR1Y2UoKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBhICsgYik7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2FobmNlID0gUmFuZG9tLm5leHRJbnQoMSwgY2hhbmNlU3VtKTtcclxuICAgICAgICBjaGFuY2VTdW0gPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaGFuY2VTdW0gKz0gaXRlbURlZmluaXRpb24uQ2hhbmNlTGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkQ2FobmNlIDw9IGNoYW5jZVN1bSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7IC8vc2hvdWxkIG5ldmVyIG9jY3VyXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlSW52ZW50b3J5KGl0ZW1EZWZpbml0aW9uOiBJdGVtQ2hhbmNlVGVtcGxhdGUsIGl0ZW06IEl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbURlZmluaXRpb24uSW52ZW50b3J5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGludmVudG9yeSA9IGl0ZW0uZ2V0SW52ZW50b3J5KCk7XHJcbiAgICAgICAgICAgIGlmIChpbnZlbnRvcnkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeSA9IGl0ZW0uSW52ZW50b3J5ID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbURlZmluaXRpb24uSW52ZW50b3J5LmZvckVhY2goKGl0ZW1EZWZpbml0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeT8uYWRkKEdhbWUuU3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YWNrVmFsdWUoc3RhY2s6IFN0YWNrKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoc3RhY2sgPT09IHVuZGVmaW5lZCB8fCBzdGFjayA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdGFjayA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YWNrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSYW5kb20ubmV4dEludChzdGFjay5NaW4sIHN0YWNrLk1heCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIExvYWRGcm9tU2F2ZShzYXZlSXRlbTogYW55KTogSXRlbSB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgSXRlbSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaXRlbSwgc2F2ZUl0ZW0pO1xyXG4gICAgICAgIGlmIChpdGVtLmdldEludmVudG9yeSgpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnZlbnRvcnlNb2RlbCA9IG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgICAgICBpbnZlbnRvcnlNb2RlbC5sb2FkRnJvbVNhdmUoaXRlbS5nZXRJbnZlbnRvcnkoKSk7XHJcbiAgICAgICAgICAgIGl0ZW0uSW52ZW50b3J5ID0gaW52ZW50b3J5TW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFByb21wdENsYXNzIHtcclxuICAgIFByaW50KCkge1xyXG4gICAgICAgIEVuZ2luZS5PdXRwdXQoJyQgJywgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIFByb21wdCA9IG5ldyBQcm9tcHRDbGFzcygpO1xyXG4iLCJjbGFzcyBSYW5kb21DbGFzcyB7XHJcbiAgICBuZXh0SW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIFJhbmRvbSA9IG5ldyBSYW5kb21DbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyTGlzdCB9IGZyb20gJy4uL21vZGVsL0NoYXJhY3Rlckxpc3QnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4uL21vZGVsL0l0ZW1MaXN0JztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4uL21vZGVsL1Jvb20nO1xyXG5pbXBvcnQgeyBSb29tRXhpdCB9IGZyb20gJy4uL21vZGVsL1Jvb21FeGl0JztcclxuaW1wb3J0IHsgUm9vbUV4aXRzTGlzdCB9IGZyb20gJy4uL21vZGVsL1Jvb21FeGl0c0xpc3QnO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvUm9vbVRlbXBsYXRlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tRmFjdG9yeSB7XHJcbiAgICBTcGF3blJvb20odGVtcGxhdGU6IFJvb21UZW1wbGF0ZSkge1xyXG4gICAgICAgIGxldCByb29tID0gbmV3IFJvb20oKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHJvb20sIHRlbXBsYXRlKTtcclxuICAgICAgICByZXR1cm4gcm9vbTtcclxuICAgIH1cclxuXHJcbiAgICBMb2FkUm9vbURhdGEocm9vbTogUm9vbSwgdGVtcGxhdGU6IFJvb21UZW1wbGF0ZSkge1xyXG4gICAgICAgIGxldCBleGl0c01vZGVsID0gbmV3IFJvb21FeGl0c0xpc3QoKTtcclxuICAgICAgICB0ZW1wbGF0ZS5FeGl0cz8uZm9yRWFjaCgoZXhpdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gZXhpdC5EaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGV4aXRzTW9kZWxbZGlyZWN0aW9uXSA9IG5ldyBSb29tRXhpdChleGl0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByb29tLkV4aXRzID0gZXhpdHNNb2RlbDtcclxuXHJcbiAgICAgICAgbGV0IGl0ZW1zID0gbmV3IEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgaXRlbXMubG9hZEZyb21UZW1wbGF0ZShyb29tLkl0ZW1zKTtcclxuICAgICAgICByb29tLkl0ZW1zID0gaXRlbXM7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5DaGFyYWN0ZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcnNNb2RlbCA9IG5ldyBDaGFyYWN0ZXJMaXN0KCk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLkNoYXJhY3RlcnMuZm9yRWFjaCgoY2hhcmFjdGVySWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYXJhY3RlcnNNb2RlbC5hZGQoR2FtZS5TcGF3bkNoYXJhY3RlcihjaGFyYWN0ZXJJZCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcm9vbS5DaGFyYWN0ZXJzID0gY2hhcmFjdGVyc01vZGVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm9vbS5Jc0xvYWRlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTG9jYWwgfSBmcm9tICcuLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSAnLi9FbnVtSGVscGVyJztcclxuaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4vR3JhbW1hQ2FzZSc7XHJcblxyXG5leHBvcnQgZW51bSBEaXJlY3Rpb24ge1xyXG4gICAgbm9ydGggPSAnbm9ydGgnLFxyXG4gICAgc291dGggPSAnc291dGgnLFxyXG4gICAgZWFzdCA9ICdlYXN0JyxcclxuICAgIHdlc3QgPSAnd2VzdCcsXHJcbiAgICB1cCA9ICd1cCcsXHJcbiAgICBkb3duID0gJ2Rvd24nLFxyXG59XHJcblxyXG5jbGFzcyBEaXJlY3Rpb25IZWxwZXJDbGFzcyBleHRlbmRzIEVudW1IZWxwZXI8RGlyZWN0aW9uPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihEaXJlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExvY2FsZShkaXJlY3Rpb246IERpcmVjdGlvbiwgZ3JhbW1hQ2FzZSA9IEdyYW1tYUNhc2UuTWlhbm93bmlrKSB7XHJcbiAgICAgICAgcmV0dXJuIExvY2FsLkRpcmVjdGlvbnNbZGlyZWN0aW9uXVtncmFtbWFDYXNlXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBEaXJlY3Rpb25IZWxwZXIgPSBuZXcgRGlyZWN0aW9uSGVscGVyQ2xhc3MoKTtcclxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudW1IZWxwZXI8RW51bVR5cGU+IHtcclxuICAgIHNvdXJjZTogYW55O1xyXG4gICAgY29uc3RydWN0b3Ioc291cmNlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh2YWx1ZTogc3RyaW5nKTogRW51bVR5cGUgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2Vba2V5XSBhcyBFbnVtVHlwZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZUFycmF5KHZhbHVlczogc3RyaW5nW10pIHtcclxuICAgICAgICBsZXQgYXJyYXk6IEVudW1UeXBlW10gPSBbXTtcclxuICAgICAgICB2YWx1ZXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb246IEVudW1UeXBlIHwgbnVsbCA9IHRoaXMucGFyc2Uoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRhaW5zKHN0cmluZzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZVNob3J0KHN0cmluZzogc3RyaW5nKTogRW51bVR5cGUgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKHN0cmluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2Vba2V5XSBhcyBFbnVtVHlwZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRLZXkodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3VyY2Vba2V5XSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZvckVhY2goY2FsbGJhY2s6IHsgKHZhbHVlOiBFbnVtVHlwZSwga2V5OiBzdHJpbmcpOiB2b2lkIH0pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodGhpcy5zb3VyY2Vba2V5XSwga2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSBcIi4vRW51bUhlbHBlclwiO1xyXG5cclxuZXhwb3J0IGVudW0gRXF1aXBtZW50U2xvdCB7XHJcbiAgICBOb25lID0gMCxcclxuICAgIFRvcnNvID0gMSxcclxuICAgIEFybXMgPSAyLFxyXG4gICAgSGFuZHMgPSAzLFxyXG4gICAgTGVncyA9IDQsXHJcbiAgICBGZWV0cyA9IDUsXHJcbiAgICBIZWFkID0gNixcclxuICAgIE1haW5IYW5kID0gNyxcclxuICAgIE9mZkhhbmQgPSA4LFxyXG4gICAgU2hpcnQgPSA5LFxyXG4gICAgUGFudHMgPSAxMCxcclxuICAgIENvYXQgPSAxMSxcclxuICAgIFJpZ2h0UmluZyA9IDEyLFxyXG4gICAgTGVmdFJpbmcgPSAxMyxcclxuICAgIE5lY2tsYWNlID0gMTQsXHJcbiAgICBUb3JjaCA9IDE1LFxyXG59XHJcblxyXG5jbGFzcyBFcXVpcG1lbnRTbG90SGVscGVyQ2xhc3MgZXh0ZW5kcyBFbnVtSGVscGVyPEVxdWlwbWVudFNsb3Q+IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKEVxdWlwbWVudFNsb3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEVxdWlwbWVudFNsb3RIZWxwZXIgPSBuZXcgRXF1aXBtZW50U2xvdEhlbHBlckNsYXNzKCk7XHJcbiIsImltcG9ydCB7IEVudW1IZWxwZXIgfSBmcm9tIFwiLi9FbnVtSGVscGVyXCI7XHJcblxyXG5leHBvcnQgZW51bSBHbG9iYWxFdmVudFR5cGUge1xyXG4gICAgQmVmb3JlUm9vbUVudGVyID0gMSxcclxufVxyXG5cclxuY2xhc3MgR2xvYmFsRXZlbnRUeXBlSGVscGVyQ2xhc3MgZXh0ZW5kcyBFbnVtSGVscGVyPEdsb2JhbEV2ZW50VHlwZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoR2xvYmFsRXZlbnRUeXBlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBHbG9iYWxFdmVudFR5cGVIZWxwZXIgPSBuZXcgR2xvYmFsRXZlbnRUeXBlSGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgRW51bUhlbHBlciB9IGZyb20gXCIuL0VudW1IZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBlbnVtIEdyYW1tYUNhc2Uge1xyXG4gICAgTWlhbm93bmlrID0gMCwgLy9rb2dvIGNvIGplc3RcclxuICAgIERvcGVsbmlhY3ogPSAxLCAvL2tvZ28gY3plZ28gbmllIG1hXHJcbiAgICBDZWxvd25payA9IDIsIC8va29tdSBjemVtdSBzaWUgcHJ6eWdsYWRhbVxyXG4gICAgQmllcm5payA9IDMsIC8va29nbyBjbyB3aWR6ZSwgdXB1c3pjemFtXHJcbiAgICBOYXJ6ZWRuaWsgPSA0LCAvL3oga2ltIHogY3p5bSBpZGVcclxuICAgIE1pZWpzY293bmlrID0gNSwgLy9vIGtpbSBvIGN6eW0gbW93aWVcclxuICAgIFdvbGFjeiA9IDYsIC8vbyBrb2dveiB0byBtb2plIHNrcm9tbmUgb2N6eSBtYWphIHphc3pjenl0IHBvc3RyemVnYWNcclxufVxyXG5cclxuY2xhc3MgR3JhbW1hQ2FzZUhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxHcmFtbWFDYXNlPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihHcmFtbWFDYXNlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBHcmFtbWFDYXNlSGVscGVyID0gbmV3IEdyYW1tYUNhc2VIZWxwZXJDbGFzcygpO1xyXG4iLCJpbXBvcnQgeyBFbnVtSGVscGVyIH0gZnJvbSBcIi4vRW51bUhlbHBlclwiO1xyXG5cclxuZXhwb3J0IGVudW0gSXRlbVR5cGUge1xyXG4gICAgV2VhcG9uMUggPSAnV2VhcG9uMUgnLFxyXG4gICAgV2VhcG9uMkggPSAnV2VhcG9uMkgnLFxyXG4gICAgU2hpZWxkID0gJ1NoaWVsZCcsXHJcbiAgICBBcm1vciA9ICdBcm1vcicsXHJcbiAgICBTaG91bGRlcnMgPSAnU2hvdWxkZXJzJyxcclxuICAgIEdsb3ZlcyA9ICdHbG92ZXMnLFxyXG4gICAgR3JlYXZlcyA9ICdHcmVhdmVzJyxcclxuICAgIEJvb3RzID0gJ0Jvb3RzJyxcclxuICAgIEhlbG1ldCA9ICdIZWxtZXQnLFxyXG4gICAgU2hpcnQgPSAnU2hpcnQnLFxyXG4gICAgUGFudHMgPSAnUGFudHMnLFxyXG4gICAgV2lsZFNoaWVsZCA9ICdXaWxkU2hpZWxkJyxcclxuICAgIFdpbGRBcm1vciA9ICdXaWxkQXJtb3InLFxyXG4gICAgV2lsZFNob3VsZGVycyA9ICdXaWxkU2hvdWxkZXJzJyxcclxuICAgIFdpbGRHbG92ZXMgPSAnV2lsZEdsb3ZlcycsXHJcbiAgICBXaWxkR3JlYXZlcyA9ICdXaWxkR3JlYXZlcycsXHJcbiAgICBXaWxkQm9vdHMgPSAnV2lsZEJvb3RzJyxcclxuICAgIFdpbGRIZWxtZXQgPSAnV2lsZEhlbG1ldCcsXHJcbiAgICBSaW5nID0gJ1JpbmcnLFxyXG4gICAgTmVja2xhY2UgPSAnTmVja2xhY2UnLFxyXG4gICAgUG90aW9uID0gJ1BvdGlvbicsXHJcbiAgICBGb29kID0gJ0Zvb2QnLFxyXG4gICAgVHJhc2ggPSAnVHJhc2gnLFxyXG4gICAgQ3VycmVuY3kgPSAnQ3VycmVuY3knLFxyXG4gICAgQ29udGFpbmVyID0gJ0NvbnRhaW5lcicsXHJcbiAgICBTdGF0aWNDb250YWluZXIgPSAnU3RhdGljQ29udGFpbmVyJyxcclxuICAgIFF1ZXN0ID0gJ1F1ZXN0JyxcclxuICAgIFN0YXRpYyA9ICdTdGF0aWMnLFxyXG4gICAgTGV2ZXIgPSAnTGV2ZXInLFxyXG59XHJcblxyXG5jbGFzcyBJdGVtVHlwZUhlbHBlckNsYXNzIGV4dGVuZHMgRW51bUhlbHBlcjxJdGVtVHlwZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoSXRlbVR5cGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIEl0ZW1UeXBlSGVscGVyID0gbmV3IEl0ZW1UeXBlSGVscGVyQ2xhc3MoKTtcclxuIiwiaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBFbnRpdHlCYXNlIH0gZnJvbSAnLi9FbnRpdHlCYXNlJztcclxuaW1wb3J0IHsgRXF1aXBtZW50IH0gZnJvbSAnLi9FcXVpcG1lbnQnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4vSXRlbUxpc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3RlciBleHRlbmRzIEVudGl0eUJhc2Uge1xyXG4gICAgTmFtZTogc3RyaW5nW107XHJcbiAgICBEZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgSWRsZTogc3RyaW5nO1xyXG4gICAgSW52ZW50b3J5OiBJdGVtTGlzdDtcclxuICAgIEVxdWlwbWVudDogRXF1aXBtZW50O1xyXG5cclxuICAgIGdldE5hbWUoZ3JhbW1hQ2FzZSA9IEdyYW1tYUNhc2UuTWlhbm93bmlrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTmFtZVtncmFtbWFDYXNlXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREZXNjcmlwdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5EZXNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZGxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklkbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW52ZW50b3J5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLkludmVudG9yeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgSXRlbUxpc3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSW52ZW50b3J5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVxdWlwbWVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5FcXVpcG1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVxdWlwbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5FcXVpcG1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzTGlnaHRTb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RXF1aXBtZW50KCkuaGFzTGlnaHRTb3VyY2UoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEVudGl0eUxpc3QgfSBmcm9tICcuL0VudGl0eUxpc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJhY3Rlckxpc3QgZXh0ZW5kcyBFbnRpdHlMaXN0PENoYXJhY3Rlcj4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChjKSA9PiBjLmhhc0xpZ2h0U291cmNlKCkgPT09IHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJUZW1wbGF0ZXNNb2RlbCB7XHJcbiAgICBbdGVtcGxhdGVJZDogc3RyaW5nXTogYW55O1xyXG4gICAgY29uc3RydWN0b3IoY2hhcmFjdGVyVGVtcGxhdGVzOiBhbnkgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyVGVtcGxhdGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNoYXJhY3RlclRlbXBsYXRlcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0NoYXJhY3RlciB0ZW1wbGF0ZXMgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGFyYWN0ZXJUZW1wbGF0ZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3Q2hhcmFjdGVyVGVtcGxhdGUodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5ld0NoYXJhY3RlclRlbXBsYXRlKGNoYXJhY3RlclRlbXBsYXRlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpc1tjaGFyYWN0ZXJUZW1wbGF0ZS5JZF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2hhcmFjdGVyIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoY2hhcmFjdGVyVGVtcGxhdGUuSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzW2NoYXJhY3RlclRlbXBsYXRlLklkXSA9IGNoYXJhY3RlclRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKGNoYXJhY3RlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpc1tjaGFyYWN0ZXJJZF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnTm8gQ2hhcmFjdGVyIHRlbXBsYXRlIGRlZmluZWQgZm9yIElkIHswfSEnLmZvcm1hdChjaGFyYWN0ZXJJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW2NoYXJhY3RlcklkXTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5QmFzZSB7XHJcbiAgICBJZDogc3RyaW5nO1xyXG4gICAgYWJzdHJhY3QgZ2V0TmFtZSgpOiBzdHJpbmc7XHJcbiAgICBhYnN0cmFjdCBnZXRJZGxlKCk6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBFbnRpdHlCYXNlIH0gZnJvbSAnLi9FbnRpdHlCYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlMaXN0PFR5cGUgZXh0ZW5kcyBFbnRpdHlCYXNlPiB7XHJcbiAgICBBcnJheTogVHlwZVtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5BcnJheSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZChpdGVtOiBUeXBlKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkFycmF5LnB1c2goaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGl0ZW06IFR5cGUpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLkFycmF5LmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5BcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQXJyYXkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50QXQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheVtpbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgbGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkFycmF5Lmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kKG5hbWU6IHN0cmluZywgbnVtYmVyID0gMSk6IFR5cGUgfCBudWxsIHtcclxuICAgICAgICBsZXQgZm91bmQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuQXJyYXkuc29tZSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5nZXROYW1lKCkuc2VhcmNoKG5hbWUpID49IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRCeUlkKGlkOiBzdHJpbmcsIG51bWJlciA9IDEpOiBUeXBlIHwgbnVsbCB7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gbnVsbDtcclxuICAgICAgICB0aGlzLkFycmF5LnNvbWUoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uSWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG51bWJlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBwcmludExvbmdGb3JtYXQoaW5kZW50ID0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByaW50KGluZGVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnRTaG9ydEZvcm1hdChpbmRlbnQgPSB0cnVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpbnQoaW5kZW50LCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpbnQoaW5kZW50ID0gdHJ1ZSwgbG9uZ0Zvcm1hdCA9IHRydWUpIHtcclxuICAgICAgICBsZXQgcmV0dXJuU3RyaW5nID0gJyc7XHJcbiAgICAgICAgdGhpcy5BcnJheS5mb3JFYWNoKChlbnRpdHkpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJldHVyblN0cmluZyAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBFbmdpbmUuRW5kTGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5kZW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gRW5naW5lLk5vbkJyZWFraW5nU3BhY2UucmVwZWF0KDQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVyblN0cmluZyArPSBlbnRpdHkuZ2V0TmFtZSgpLnN0YXJ0V2l0aFVwcGVyKCk7XHJcbiAgICAgICAgICAgIGlmIChsb25nRm9ybWF0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5TdHJpbmcgKz0gJyAnICsgZW50aXR5LmdldElkbGUoKSArICcuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXR1cm5TdHJpbmc7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRXF1aXBtZW50U2xvdCwgRXF1aXBtZW50U2xvdEhlbHBlciB9IGZyb20gJy4uL2VudW1zL0VxdWlwbWVudFNsb3QnO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSAnLi9JdGVtJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFcXVpcG1lbnQge1xyXG4gICAgQXJyYXk6IEl0ZW1bXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQXJyYXkgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZVNsb3Qoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIGlmIChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnezB9IGlzIG5vdCBhIHByb3BlciBlcXVpcG1lbnQgc2xvdC4nLmZvcm1hdChzbG90KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXF1aXAoc2xvdDogRXF1aXBtZW50U2xvdCwgaXRlbTogSXRlbSB8IG51bGwpIHtcclxuICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBlcXVpcCwgezB9IGFscmVhZHkgY29udGFpbnMgYW4gaXRlbS4nLmZvcm1hdChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLkFycmF5W3Nsb3RdID0gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG4gICAgICAgIGlmICh0aGlzLkFycmF5W3Nsb3RdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJDYW5ub3QgcmVtb3ZlLCB7MH0gZG9lc24ndCBjb250YWlucyBhbiBpdGVtLlwiLmZvcm1hdChFcXVpcG1lbnRTbG90SGVscGVyLmdldEtleShzbG90KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWxldGUgdGhpcy5BcnJheVtzbG90XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoc2xvdDogRXF1aXBtZW50U2xvdCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVTbG90KHNsb3QpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5BcnJheVtzbG90XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheVtzbG90XTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChpKSA9PiBpLmlzTGlnaHRTb3VyY2UoKSA9PT0gdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2hhcmFjdGVyRmFjdG9yeSB9IGZyb20gJy4uL2NvbW1vbkxvZ2ljL0NoYXJhY3RlckZhY3RvcnknO1xyXG5pbXBvcnQgeyBJdGVtRmFjdG9yeSB9IGZyb20gJy4uL2NvbW1vbkxvZ2ljL0l0ZW1GYWN0b3J5JztcclxuaW1wb3J0IHsgUm9vbUZhY3RvcnkgfSBmcm9tICcuLi9jb21tb25Mb2dpYy9Sb29tRmFjdG9yeSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50cyB9IGZyb20gJy4uL0dsb2JhbEV2ZW50cyc7XHJcbmltcG9ydCB7IEdhbWVUZW1wbGF0ZSB9IGZyb20gJy4uL3RlbXBsYXRlcy9HYW1lVGVtcGxhdGUnO1xyXG5pbXBvcnQgeyBDaGFyYWN0ZXIgfSBmcm9tICcuL0NoYXJhY3Rlcic7XHJcbmltcG9ydCB7IEdhbWVEYXRhIH0gZnJvbSAnLi9HYW1lRGF0YSc7XHJcbmltcG9ydCB7IEdsb2JhbEV2ZW50QXJncyB9IGZyb20gJy4vR2xvYmFsRXZlbnRBcmdzJztcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gJy4vSXRlbSc7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vUGxheWVyJztcclxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4vUm9vbSc7XHJcbmltcG9ydCB7IEdhbWVUZW1wbGF0ZSBhcyBUZW1wbGF0ZSB9IGZyb20gJy4uLy4uL3Jlcy9HYW1lLmpzb24nO1xyXG5pbXBvcnQgeyBSb29tVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvUm9vbVRlbXBsYXRlJztcclxuaW1wb3J0IHsgQ2hhcmFjdGVyVGVtcGxhdGUgfSBmcm9tICcuLi90ZW1wbGF0ZXMvQ2hhcmFjdGVyVGVtcGxhdGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVNb2RlbCB7XHJcbiAgICBOYW1lOiBzdHJpbmc7XHJcbiAgICBTdGFydGluZ1Jvb206IG51bWJlcjtcclxuICAgIFJvb21zOiBhbnlbXTtcclxuICAgIEl0ZW1GYWN0b3J5OiBJdGVtRmFjdG9yeTtcclxuICAgIENoYXJhY3RlckZhY3Rvcnk6IENoYXJhY3RlckZhY3Rvcnk7XHJcbiAgICBSb29tRmFjdG9yeTogUm9vbUZhY3Rvcnk7XHJcbiAgICBQbGF5ZXI6IFBsYXllcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSAnJztcclxuICAgICAgICB0aGlzLlN0YXJ0aW5nUm9vbSA9IDA7XHJcbiAgICAgICAgdGhpcy5Sb29tcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLkl0ZW1GYWN0b3J5ID0gbmV3IEl0ZW1GYWN0b3J5KCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJGYWN0b3J5ID0gbmV3IENoYXJhY3RlckZhY3RvcnkoKTtcclxuICAgICAgICB0aGlzLlJvb21GYWN0b3J5ID0gbmV3IFJvb21GYWN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgTG9hZEZyb21UZW1wbGF0ZSgpIHtcclxuICAgICAgICAvL09iamVjdC5hc3NpZ24odGhpcywgdGVtcGxhdGUpO1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgLy90aGlzLkNoYXJhY3RlckZhY3RvcnkuTG9hZEZyb21UZW1wbGF0ZShwbGF5ZXIsIHRoaXMuUGxheWVyKTtcclxuICAgICAgICB0aGlzLlBsYXllciA9IHBsYXllcjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBUZW1wbGF0ZS5Sb29tcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLlJvb21zW2ldID0gdGhpcy5Sb29tRmFjdG9yeS5TcGF3blJvb20oVGVtcGxhdGUuUm9vbXNbaV0gYXMgUm9vbVRlbXBsYXRlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuUm9vbXNbaV0uSWQgIT09IGkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93ICdSb29tIHdpdGggSWQgezB9IGlzIHBsYWNlZCBvbiBpbmRleCB7MX0sIGZpeCBSb29tcyBkYXRhJy5mb3JtYXQodGhpcy5Sb29tc1tpXS5JZCwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIEdldFJvb20ocm9vbUlkOiBudW1iZXIpOiBSb29tIHtcclxuICAgICAgICBsZXQgcm9vbSA9IHRoaXMuUm9vbXNbcm9vbUlkXTtcclxuICAgICAgICBpZiAocm9vbSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJbnZhbGlkIFJvb20gSWQ6IHswfScuZm9ybWF0KHJvb21JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcm9vbS5pc0xvYWRlZCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuUm9vbUZhY3RvcnkuTG9hZFJvb21EYXRhKHJvb20sIFRlbXBsYXRlLlJvb21zW3Jvb21JZF0gYXMgUm9vbVRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvb207XHJcbiAgICB9XHJcblxyXG4gICAgU3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uOiBhbnkpOiBJdGVtIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXRlbUZhY3Rvcnkuc3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBMb2FkSXRlbUZyb21TYXZlKHNhdmVJdGVtOiBhbnkpOiBJdGVtIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5JdGVtRmFjdG9yeS5Mb2FkRnJvbVNhdmUoc2F2ZUl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIFNwYXduQ2hhcmFjdGVyKGNoYXJhY3RlcklkOiBzdHJpbmcpOiBDaGFyYWN0ZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkNoYXJhY3RlckZhY3RvcnkuU3Bhd25DaGFyYWN0ZXIoY2hhcmFjdGVySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIExvYWRDaGFyYWN0ZXJGcm9tU2F2ZShzYXZlQ2hhcmFjdGVyOiBhbnkpOiBDaGFyYWN0ZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkNoYXJhY3RlckZhY3RvcnkuTG9hZEZyb21TYXZlKHNhdmVDaGFyYWN0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIEdldEl0ZW1UeXBlKGl0ZW1UeXBlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gR2FtZURhdGEuSXRlbVR5cGVzLkdldEl0ZW1UeXBlKGl0ZW1UeXBlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgSW52b2tlR2xvYmFsRXZlbnQobmFtZTogc3RyaW5nLCBhcmdzOiBHbG9iYWxFdmVudEFyZ3MpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgZXZlbnQgPSBHbG9iYWxFdmVudHNbbmFtZV07XHJcbiAgICAgICAgaWYgKGV2ZW50ID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIGV2ZW50ICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiR2xvYmFsIGV2ZW50IHdpdGggbmFtZSB7MH0gZG9lc24ndCBleGlzdFwiLmZvcm1hdChuYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBldmVudChhcmdzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDaGFyYWN0ZXJUZW1wbGF0ZXNNb2RlbCB9IGZyb20gJy4vQ2hhcmFjdGVyVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgSXRlbVRlbXBsYXRlc01vZGVsIH0gZnJvbSAnLi9JdGVtVGVtcGxhdGVzJztcclxuaW1wb3J0IHsgSXRlbVR5cGVzTW9kZWwgfSBmcm9tICcuL0l0ZW1UeXBlcyc7XHJcblxyXG5jbGFzcyBHYW1lRGF0YU1vZGVsIHtcclxuICAgIEl0ZW1UeXBlczogSXRlbVR5cGVzTW9kZWw7XHJcbiAgICBJdGVtVGVtcGxhdGVzOiBJdGVtVGVtcGxhdGVzTW9kZWw7XHJcbiAgICBDaGFyYWN0ZXJUZW1wbGF0ZXM6IENoYXJhY3RlclRlbXBsYXRlc01vZGVsO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5JdGVtVHlwZXMgPSBuZXcgSXRlbVR5cGVzTW9kZWwodW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLkl0ZW1UZW1wbGF0ZXMgPSBuZXcgSXRlbVRlbXBsYXRlc01vZGVsKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5DaGFyYWN0ZXJUZW1wbGF0ZXMgPSBuZXcgQ2hhcmFjdGVyVGVtcGxhdGVzTW9kZWwodW5kZWZpbmVkKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBHYW1lRGF0YSA9IG5ldyBHYW1lRGF0YU1vZGVsKCk7XHJcbiIsImltcG9ydCB7IENvbW1hbmRDYWxsYmFjayB9IGZyb20gJy4uL0NvbW1hbmRDYWxsYmFjayc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2xvYmFsRXZlbnRBcmdzIHtcclxuICAgIFR5cGU6IG51bWJlcjtcclxuICAgIFNlbmRlcjogYW55O1xyXG4gICAgRmluaXNoQ29tbWFuZENhbGxiYWNrOiBDb21tYW5kQ2FsbGJhY2s7XHJcbiAgICBDb250aW51ZUNvbW1hbmRDYWxsYmFjazogRnVuY3Rpb247XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBudW1iZXIsIHNlbmRlcjogYW55LCBmaW5pc2hDb21tYW5kQ2FsbGJhY2s6IENvbW1hbmRDYWxsYmFjaywgY29udGludWVDb21tYW5kQ2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5UeXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLlNlbmRlciA9IHNlbmRlcjtcclxuICAgICAgICB0aGlzLkZpbmlzaENvbW1hbmRDYWxsYmFjayA9IGZpbmlzaENvbW1hbmRDYWxsYmFjaztcclxuICAgICAgICB0aGlzLkNvbnRpbnVlQ29tbWFuZENhbGxiYWNrID0gY29udGludWVDb21tYW5kQ2FsbGJhY2s7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR3JhbW1hQ2FzZSB9IGZyb20gJy4uL2VudW1zL0dyYW1tYUNhc2UnO1xyXG5pbXBvcnQgeyBJdGVtVHlwZSB9IGZyb20gJy4uL2VudW1zL0l0ZW1UeXBlJztcclxuaW1wb3J0IHsgRW50aXR5QmFzZSB9IGZyb20gJy4vRW50aXR5QmFzZSc7XHJcbmltcG9ydCB7IEl0ZW1MaXN0IH0gZnJvbSAnLi9JdGVtTGlzdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbSBleHRlbmRzIEVudGl0eUJhc2Uge1xyXG4gICAgcmVhZG9ubHkgTmFtZTogYW55O1xyXG4gICAgcmVhZG9ubHkgRGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIHJlYWRvbmx5IElkbGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHJlYWRvbmx5IElzTGlnaHRTb3VyY2U6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XHJcbiAgICByZWFkb25seSBJc1N0YWNrYWJsZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcclxuICAgIFN0YWNrOiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBUeXBlOiBJdGVtVHlwZTtcclxuICAgIEludmVudG9yeTogSXRlbUxpc3QgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgZ2V0TmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNTdGFja2FibGUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5OYW1lW2dyYW1tYUNhc2VdICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGFjaygpICsgJyAnICsgdGhpcy5nZXRQbHVyYWxOYW1lKGdyYW1tYUNhc2UpICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGx1cmFsTmFtZShncmFtbWFDYXNlID0gR3JhbW1hQ2FzZS5NaWFub3duaWspIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5OYW1lWzBdKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5OYW1lW2dyYW1tYUNhc2VdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5nZXRTdGFjaygpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuTmFtZVswXVtncmFtbWFDYXNlXTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5OYW1lWzFdW2dyYW1tYUNhc2VdO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5OYW1lWzJdW2dyYW1tYUNhc2VdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldERlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkRlc2NyaXB0aW9uICsgRW5naW5lLkRlZmF1bHRDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZGxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLklkbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2xlxbx5IG5hIHppZW1pJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSWRsZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklzTGlnaHRTb3VyY2UgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdGFja2FibGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuSXNTdGFja2FibGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLklzU3RhY2thYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFN0YWNrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLlN0YWNrID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLlN0YWNrO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN0YWNrKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1N0YWNrYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuU3RhY2sgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU3RhY2sodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU3RhY2thYmxlKCkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuU3RhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TdGFjayA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5TdGFjayArPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5UeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVGFrZWFibGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmdldFR5cGUoKSkge1xyXG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXRpYzpcclxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGF0aWNDb250YWluZXI6XHJcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuTGV2ZXI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW52ZW50b3J5KCk6IEl0ZW1MaXN0IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKHRoaXMuSW52ZW50b3J5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkludmVudG9yeTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSAnLi4vSW5pdEdhbWVEYXRhJztcclxuaW1wb3J0IHsgRW50aXR5TGlzdCB9IGZyb20gJy4vRW50aXR5TGlzdCc7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tICcuL0l0ZW0nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW1MaXN0IGV4dGVuZHMgRW50aXR5TGlzdDxJdGVtPiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tVGVtcGxhdGUodGVtcGxhdGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLmZvckVhY2goKGl0ZW1EZWZpbml0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKEdhbWUuU3Bhd25JdGVtKGl0ZW1EZWZpbml0aW9uKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbVNhdmUoc2F2ZUl0ZW1MaXN0OiBhbnkpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNhdmVJdGVtTGlzdCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLkFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQXJyYXlbaV0gPSBHYW1lLkxvYWRJdGVtRnJvbVNhdmUodGhpcy5BcnJheVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZChpdGVtOiBJdGVtIHwgbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW0uaXNTdGFja2FibGUoKSkge1xyXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdTdGFjayA9IEdhbWUuUGxheWVyLmdldEludmVudG9yeSgpLmZpbmRCeUlkKGl0ZW0uSWQpO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdTdGFjayAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZXhpc3RpbmdTdGFjay5hZGRTdGFjayhpdGVtLmdldFN0YWNrKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLmFkZChpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNMaWdodFNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5BcnJheS5zb21lKChpKSA9PiBpLmlzTGlnaHRTb3VyY2UoKSA9PT0gdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSXRlbVRlbXBsYXRlIH0gZnJvbSAnLi4vdGVtcGxhdGVzL0l0ZW1UZW1wbGF0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbVRlbXBsYXRlc01vZGVsIHtcclxuICAgIFt0ZW1wbGF0ZUlkOiBzdHJpbmddOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihpdGVtVGVtcGxhdGVzOiBhbnkgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoaXRlbVRlbXBsYXRlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpdGVtVGVtcGxhdGVzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0ZW1wbGF0ZXMgbXVzdCBiZSBhbiBhcnJheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtVGVtcGxhdGVzLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkFkZE5ld0l0ZW1UZW1wbGF0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgQWRkTmV3SXRlbVRlbXBsYXRlKGl0ZW1UZW1wbGF0ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaXRlbVRlbXBsYXRlLklkXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdJdGVtIHRlbXBsYXRlIHswfSBpcyBhbHJlYWR5IGRlZmluZWQhJy5mb3JtYXQoaXRlbVRlbXBsYXRlLklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpc1tpdGVtVGVtcGxhdGUuSWRdID0gaXRlbVRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRlbXBsYXRlKGl0ZW1JZDogc3RyaW5nKTogSXRlbVRlbXBsYXRlIHtcclxuICAgICAgICBpZiAodGhpc1tpdGVtSWRdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ05vIGl0ZW0gdGVtcGxhdGUgZGVmaW5lZCBmb3IgezB9IScuZm9ybWF0KGl0ZW1JZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW2l0ZW1JZF07XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEl0ZW1UeXBlc01vZGVsIHtcclxuICAgIFtpdGVtVHlwZUlkOiBzdHJpbmddOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihpdGVtVHlwZXNUZW1wbGF0ZTogYW55IHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1UeXBlc1RlbXBsYXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW1UeXBlc1RlbXBsYXRlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0eXBlcyB0ZW1wbGF0ZSBtdXN0IGJlIGFuIGFycmF5JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW1UeXBlc1RlbXBsYXRlLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkFkZE5ld0l0ZW1UeXBlKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBBZGROZXdJdGVtVHlwZShpdGVtVHlwZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaXRlbVR5cGUuSWRdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgJ0l0ZW0gdHlwZSB7MH0gaXMgYWxyZWFkeSBkZWZpbmVkIScuZm9ybWF0KGl0ZW1UeXBlLklkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpc1tpdGVtVHlwZS5JZF0gPSBpdGVtVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBHZXRJdGVtVHlwZShpdGVtVHlwZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzW2l0ZW1UeXBlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyAnSXRlbSB0eXBlICcgKyBpdGVtVHlwZU5hbWUgKyAnIGlzIG5vdCBkZWZpbmVkISc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW2l0ZW1UeXBlTmFtZV07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4uL0luaXRHYW1lRGF0YSc7XHJcbmltcG9ydCB7IENoYXJhY3RlciB9IGZyb20gJy4vQ2hhcmFjdGVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBDaGFyYWN0ZXIge1xyXG4gICAgTG9jYXRpb246IG51bWJlcjtcclxuICAgIFByZXZpb3VzTG9jYXRpb246IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZTogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuTG9jYXRpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLkxvY2F0aW9uID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuUHJldmlvdXNMb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuUHJldmlvdXNMb2NhdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldExvY2F0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTG9jYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TG9jYXRpb24odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuTG9jYXRpb24gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcmV2aW91c0xvY2F0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuUHJldmlvdXNMb2NhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcmV2aW91c0xvY2F0aW9uKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLlByZXZpb3VzTG9jYXRpb24gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjYW5TZWUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHJvb20gPSBHYW1lLkdldFJvb20odGhpcy5Mb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHJvb20uaGFzTGlnaHRTb3VyY2UoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbkhlbHBlciB9IGZyb20gJy4uL2VudW1zL0RpcmVjdGlvbic7XHJcbmltcG9ydCB7IENoYXJhY3Rlckxpc3QgfSBmcm9tICcuL0NoYXJhY3Rlckxpc3QnO1xyXG5pbXBvcnQgeyBJdGVtTGlzdCB9IGZyb20gJy4vSXRlbUxpc3QnO1xyXG5pbXBvcnQgeyBSb29tRXhpdCB9IGZyb20gJy4vUm9vbUV4aXQnO1xyXG5pbXBvcnQgeyBSb29tRXhpdHNMaXN0IH0gZnJvbSAnLi9Sb29tRXhpdHNMaXN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tIHtcclxuICAgIElkOiBudW1iZXI7XHJcbiAgICBOYW1lOiBzdHJpbmc7XHJcbiAgICBEZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gICAgSXNOYXR1cmFsTGlnaHQ6IGJvb2xlYW47XHJcbiAgICBFeGl0czogUm9vbUV4aXRzTGlzdDtcclxuICAgIElzVmlzaXRlZDogYm9vbGVhbjtcclxuICAgIE9uRmlyc3RFbnRlckV2ZW50OiBhbnk7XHJcbiAgICBJc0xvYWRlZDogYm9vbGVhbjtcclxuICAgIEl0ZW1zOiBJdGVtTGlzdDtcclxuICAgIENoYXJhY3RlcnM6IENoYXJhY3Rlckxpc3Q7XHJcbiAgICBPbkVudGVyRXZlbnQ6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuSWQgPSAwO1xyXG4gICAgICAgIHRoaXMuTmFtZSA9ICcnO1xyXG4gICAgICAgIHRoaXMuRGVzY3JpcHRpb24gPSAnJztcclxuICAgICAgICB0aGlzLklzTmF0dXJhbExpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5FeGl0cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuSXNWaXNpdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5PbkZpcnN0RW50ZXJFdmVudCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaXNMb2FkZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXNMb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEl0ZW1zKCkge1xyXG4gICAgICAgIGlmICh0aGlzLkl0ZW1zID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJdGVtTGlzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5JdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGFyYWN0ZXJzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLkNoYXJhY3RlcnMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENoYXJhY3Rlckxpc3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuQ2hhcmFjdGVycztcclxuICAgIH1cclxuXHJcbiAgICBnZXRFeGl0KGRpcmVjdGlvbjogRGlyZWN0aW9uKTogUm9vbUV4aXQgfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5FeGl0c1tkaXJlY3Rpb25dID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLkV4aXRzW2RpcmVjdGlvbl07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RXhpdHNEaXJlY3Rpb25zKCk6IERpcmVjdGlvbltdIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aW9uSGVscGVyLnBhcnNlQXJyYXkoT2JqZWN0LmtleXModGhpcy5FeGl0cykpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0xpZ2h0U291cmNlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLklzTmF0dXJhbExpZ2h0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5nZXRJdGVtcygpLmhhc0xpZ2h0U291cmNlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdldENoYXJhY3RlcnMoKS5oYXNMaWdodFNvdXJjZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9uRmlyc3RFbnRlckV2ZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLk9uRmlyc3RFbnRlckV2ZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLk9uRmlyc3RFbnRlckV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9uRW50ZXJFdmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5PbkVudGVyRXZlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuT25FbnRlckV2ZW50O1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBSb29tRXhpdCB7XHJcbiAgICBSb29tSWQ6IG51bWJlcjtcclxuICAgIElzRG9vcjogYm9vbGVhbiB8IHVuZGVmaW5lZDtcclxuICAgIElzQ2xvc2VkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xyXG4gICAgSXNMb2NrZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XHJcbiAgICBJc0hpZGRlbjogYm9vbGVhbiB8IHVuZGVmaW5lZDtcclxuICAgIEtleU51bWJlcjogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgRGlyZWN0aW9uOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZTogdW5rbm93bikge1xyXG4gICAgICAgIHRoaXMuUm9vbUlkID0gMDtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHRlbXBsYXRlKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5EaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgR2V0Um9vbUlkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLlJvb21JZDtcclxuICAgIH1cclxuXHJcbiAgICBpc0Rvb3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSXNEb29yID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQ2xvc2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklzQ2xvc2VkID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTG9ja2VkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklzTG9ja2VkID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzSGlkZGVuKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLklzSGlkZGVuID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEtleU51bWJlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5LZXlOdW1iZXIgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5LZXlOdW1iZXI7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUm9vbUV4aXQgfSBmcm9tICcuL1Jvb21FeGl0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBSb29tRXhpdHNMaXN0IHtcclxuICAgIFtkaXJlY3Rpb246IHN0cmluZ106IFJvb21FeGl0O1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBDb21tYW5kQ2FsbGJhY2sgfSBmcm9tICcuL0NvbW1hbmRDYWxsYmFjayc7XHJcbmltcG9ydCB7IENvbW1hbmRzIH0gZnJvbSAnLi9Db21tYW5kc01hbmFnZXInO1xyXG5pbXBvcnQgeyBQcm9tcHQgfSBmcm9tICcuL2NvbW1vbkxvZ2ljL1Byb21wdCc7XHJcbmltcG9ydCB7IEluaXRDb21tYW5kcyB9IGZyb20gJy4vSW5pdENvbW1hbmRzJztcclxuaW1wb3J0IHsgR2FtZSwgSW5pdEdhbWVEYXRhLCBWZXJzaW9uIH0gZnJvbSAnLi9Jbml0R2FtZURhdGEnO1xyXG5pbXBvcnQgJy4vY29tbW9uTG9naWMvSW5wdXRGdW5jdGlvbnMnO1xyXG5pbXBvcnQgJy4vVXRpbHMnO1xyXG5cclxuZnVuY3Rpb24gSW5pdCgpIHtcclxuICAgIEluaXRHYW1lRGF0YSgpO1xyXG4gICAgSW5pdENvbW1hbmRzKCk7XHJcbiAgICBFbmdpbmUuT3V0cHV0KCdEdW5nZW9uIENyYXdsZXIgMiwgd2Vyc2phOicpO1xyXG4gICAgRW5naW5lLk91dHB1dChWZXJzaW9uKTtcclxuICAgIENvbW1hbmRzLkdvLmNoYW5nZVBsYXllckxvY2F0aW9uKFxyXG4gICAgICAgIEdhbWUuR2V0Um9vbShHYW1lLlN0YXJ0aW5nUm9vbSksXHJcbiAgICAgICAgbmV3IENvbW1hbmRDYWxsYmFjaygoKSA9PiB7XHJcbiAgICAgICAgICAgIEVuZ2luZS5PdXRwdXQoJycpO1xyXG4gICAgICAgICAgICBQcm9tcHQuUHJpbnQoKTtcclxuICAgICAgICB9KSxcclxuICAgICk7XHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIGZ1bmN0aW9uIEluaXQoKTogdm9pZDtcclxufVxyXG5nbG9iYWwuSW5pdCA9IEluaXQ7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==