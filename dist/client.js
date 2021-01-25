"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var Md5_typescript_1 = require("Md5-typescript");
var msgpackr_1 = require("msgpackr");
var ws_1 = __importDefault(require("ws"));
module.exports = /** @class */ (function () {
    function Penguin(userName, password) {
        this.loggedIn = false;
        this.crumbs = {};
        this.added = false;
        this.connected = false;
        this.userName = userName;
        this.password = password;
        this.rndK = 'a94c5ed2140fc249ee3ce0729e19af5a';
        this.msgpackr = new msgpackr_1.Packr({ useRecords: false });
    }
    Penguin.prototype.connect = function (ip, port) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.socket = new ws_1.default("wss://" + ip + ":" + port + "/", {
                    origin: 'https://play.cprewritten.net',
                    rejectUnauthorized: false
                });
                this.socket.on('open', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.connected = true;
                                if (!!this.loggedIn) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.sendLogin()];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2: return [4 /*yield*/, this.sendJoinWorld()];
                            case 3: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); });
                this.socket.on('message', function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                data = this.msgpackr.unpack(e);
                                if (this.debug && (String(data).search('engine') == -1))
                                    console.log(chalk_1.default.yellowBright("[+] PACKET RECV " + JSON.stringify(data)));
                                return [4 /*yield*/, this.handlePacket(data)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.socket.on('error', function (err) {
                    return console.log(chalk_1.default.redBright("Sorry, there was an error creating a connection to CPRewritten! Error: " + err.toString().replace('Error: ', "")));
                });
                return [2 /*return*/];
            });
        });
    };
    Penguin.prototype.startHeartBeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.emitPacket('engine:heart_beat', [])];
                    case 1:
                        _a.sent();
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.emitPacket('engine:heart_beat', [])];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        }); }); }, 10000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.sendLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.emitPacket('login:u', [this.userName, this.hashPasswordCP(this.password)])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.random_add = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var coins;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    coins = this.ranCoin(2500);
                                    console.log(chalk_1.default.magentaBright("[+] Randomly added " + coins + " coins..."));
                                    return [4 /*yield*/, this.sendJoinRoom(903)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.emitPacket("game:over", [coins, 407, 692])];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.waitFor(function (_) { return _this.added === true; }).then(function (_) { return res(); })];
                                case 3:
                                    _a.sent();
                                    this.added = false;
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Penguin.prototype.fast_max = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var coins;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    coins = 99990;
                                    console.log(chalk_1.default.magentaBright("[+] Added " + coins + " coins..."));
                                    return [4 /*yield*/, this.sendJoinRoom(903)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.emitPacket("game:over", [coins, 407, 692])];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.waitFor(function (_) { return _this.added === true; }).then(function (_) { return res(); })];
                                case 3:
                                    _a.sent();
                                    this.added = false; // set to false so that new coins from packet can be received.
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ;
    Penguin.prototype.addCoins = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.isNum = /^\d+$/.test(amount);
                                    if (amount < 5 || amount >= 100000 || this.isNum === false)
                                        return [2 /*return*/, rej()];
                                    console.log(chalk_1.default.magentaBright("[+] Adding " + amount + " coins..."));
                                    return [4 /*yield*/, this.sendJoinRoom(903)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.emitPacket("game:over", [parseInt(amount), 407, 692])];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.waitFor(function (_) { return _this.added === true; }).then(function (_) { return res(); })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }).catch(function () {
                        if (amount < 5)
                            console.log(chalk_1.default.redBright('[-] Add more coins!\n'));
                        if (amount >= 100000)
                            console.log(chalk_1.default.redBright('[-] Are you trying to get banned?\n'));
                        if (_this.isNum === false)
                            console.log(chalk_1.default.redBright('[-] Numbers only!\n'));
                    })];
            });
        });
    };
    ;
    Penguin.prototype.ranCoin = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    ;
    Penguin.prototype.sendJoinWorld = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.emitPacket('world:auth', [this.id, this.token])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.sendJoinRoom = function (room, x, y) {
        if (room === void 0) { room = -1; }
        if (x === void 0) { x = 4; }
        if (y === void 0) { y = 38; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.emitPacket('navigation:join_room', [room, x, y])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.swapMd5 = function (password) {
        return password.substr(16, 16) + password.substr(0, 16);
    };
    Penguin.prototype.hashPasswordCP = function (password) {
        password = Md5_typescript_1.Md5.init(password).toUpperCase();
        password = this.swapMd5(password);
        password += this.rndK;
        password += 'Y(02.>\'H}t":E1';
        password = Md5_typescript_1.Md5.init(password);
        return this.swapMd5(password);
    };
    Penguin.prototype.emitPacket = function (action, params) {
        return __awaiter(this, void 0, void 0, function () {
            var packet;
            return __generator(this, function (_a) {
                packet = { action: action, params: params };
                if (this.debug)
                    console.log(chalk_1.default.yellowBright("[+] PACKET SENT " + JSON.stringify(packet)));
                packet = this.msgpackr.pack(packet);
                this.socket.send(packet);
                return [2 /*return*/];
            });
        });
    };
    Penguin.prototype.handlePacket = function (packet) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = packet.action;
                        switch (_a) {
                            case 'login:u': return [3 /*break*/, 1];
                            case 'world:auth': return [3 /*break*/, 3];
                            case 'engine:get_crumbs': return [3 /*break*/, 5];
                            case 'game:over': return [3 /*break*/, 7];
                            case 'engine:prompt': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.handleLogin(packet.params)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, this.handleJoinWorld()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, this.handleProccessCrumbs(packet.params)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        this.added = true;
                        this.penguinData.coins = packet.params[0];
                        console.log(chalk_1.default.magentaBright('[+] Done!'));
                        console.log(chalk_1.default.yellowBright("\nYour Current Coins: " + this.penguinData.coins));
                        return [3 /*break*/, 9];
                    case 8:
                        this.handlePrompt(packet.params);
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.handleProccessCrumbs = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.crumbs[params[0]] = params[1];
                        if (!(params[0] == "tour_messages")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sendJoinRoom()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.handlePrompt = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (params[0] === 'login') {
                    this.socket.close(); // close connection to tcp socket
                    console.log(chalk_1.default.redBright("[-] Error: " + params[1]));
                    return [2 /*return*/, process.exit()];
                }
                return [2 /*return*/];
            });
        });
    };
    Penguin.prototype.handleJoinWorld = function () {
        return __awaiter(this, void 0, void 0, function () {
            var crumbs, _i, crumbs_1, crumb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.startHeartBeat()];
                    case 1:
                        _a.sent();
                        crumbs = ["client", "item", "room", "game", "furniture", "igloo", "location", "puffle", "igloo_music", "postcard", "stamps", "stamp_polaroids", "stamp_cover", "pins", "frame_hacks", "characters", "safe_chat", "jokes", "tour_messages"];
                        _i = 0, crumbs_1 = crumbs;
                        _a.label = 2;
                    case 2:
                        if (!(_i < crumbs_1.length)) return [3 /*break*/, 5];
                        crumb = crumbs_1[_i];
                        return [4 /*yield*/, this.emitPacket('engine:get_crumbs', [crumb])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Penguin.prototype.handleLogin = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.id = params[0];
                this.nickname = params[1];
                this.token = params[2];
                this.penguinData = params[3];
                this.loggedIn = true;
                console.log(chalk_1.default.magentaBright("Username: " + this.nickname));
                console.log(chalk_1.default.yellowBright("Current Coins: " + this.penguinData.coins + "\n"));
                console.log(chalk_1.default.yellowBright("CPR Server Version: " + params[params.length - 1] + "\n"));
                return [2 /*return*/];
            });
        });
    };
    Penguin.prototype.sleep = function (time) {
        return new Promise(function (resolve) { return setTimeout(resolve, time); });
    };
    Penguin.prototype.waitFor = function (conditionFunction) {
        var poll = function (resolve) { if (conditionFunction())
            resolve();
        else
            setTimeout(function (_) { return poll(resolve); }, 400); };
        return new Promise(poll);
    };
    Penguin.prototype.banner = function () {
        console.log(chalk_1.default.blueBright("       \n   ___ ___ ___    ___     _          _      _    _         \n  / __| _ \\ _ \\  / __|___(_)_ _     /_\\  __| |__| |___ _ _ \n | (__|  _/   / | (__/ _ \\ | ' \\   / _ \\/ _` / _` / -_) '_|\n  \\___|_| |_|_\\  \\___\\___/_|_||_| /_/ \\_\\__,_\\__,_\\___|_|  \n                  created by benjii#0420                     \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t "));
    };
    return Penguin;
}());
//# sourceMappingURL=client.js.map