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
var request_promise_1 = __importDefault(require("request-promise"));
var get_1 = __importDefault(require("./get"));
var parse_1 = __importDefault(require("./parse"));
var profile = 'http://www.ecfgrading.org.uk/new/player.php?PlayerCode=|';
var users = 'http://ecfgrading.org.uk/new/glist.php?&player=|';
var clubs = 'http://ecfgrading.org.uk/new/glist.php?&club=|';
var club = 'http://ecfgrading.org.uk/new/glist.php?Code=|';
//const fide = 'http://ratings.fide.com/card.phtml?event=|';
var ECF = /** @class */ (function () {
    function ECF() {
    }
    /**
     * Searches both clubs and users
     */
    ECF.search = function (argument, parse) {
        if (parse === void 0) { parse = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, ECF.searchUsers(argument, parse)];
                    case 1:
                        _a.Users = _b.sent();
                        return [4 /*yield*/, ECF.searchClubs(argument, parse)];
                    case 2: return [2 /*return*/, (_a.Clubs = _b.sent(),
                            _a)];
                }
            });
        });
    };
    /**
     * Returns search data for users
     */
    ECF.searchUsers = function (argument, parse) {
        if (parse === void 0) { parse = true; }
        return __awaiter(this, void 0, void 0, function () {
            var searchObj, query, uri, data, tables, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchObj = parse_1.default.searchstring(argument);
                        if (!searchObj.lastName)
                            throw new SyntaxError('Must specify a last name to search');
                        query = searchObj.lastName;
                        if (searchObj.firstName)
                            query += ',%20' + searchObj.firstName;
                        uri = users.replace('|', query);
                        return [4 /*yield*/, request_promise_1.default.get({
                                uri: uri,
                                timeout: 10000
                            })];
                    case 1:
                        data = _a.sent();
                        tables = get_1.default.tables(data);
                        results = tables[0];
                        if (parse)
                            return [2 /*return*/, parse_1.default.userResults(results)];
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Returns search data for clubs
     */
    ECF.searchClubs = function (searchstring, parse) {
        if (searchstring === void 0) { searchstring = ''; }
        if (parse === void 0) { parse = true; }
        return __awaiter(this, void 0, void 0, function () {
            var uri, data, tables, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = clubs.replace('|', searchstring);
                        return [4 /*yield*/, request_promise_1.default.get({
                                uri: uri,
                                timeout: 10000
                            })];
                    case 1:
                        data = _a.sent();
                        tables = get_1.default.tables(data);
                        results = tables[0];
                        if (parse)
                            results = parse_1.default.clubResults(results);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Gets an ECF profile from a user's ID
     * @param {string} id
     * @returns {Promise<Table>}
     * @public
     */
    ECF.profile = function (code, parse) {
        if (parse === void 0) { parse = true; }
        return __awaiter(this, void 0, void 0, function () {
            var uri, data, tables, _a, grading, history;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        uri = profile.replace('|', code);
                        return [4 /*yield*/, request_promise_1.default.get({
                                uri: uri,
                                timeout: 10000
                            })];
                    case 1:
                        data = _b.sent();
                        tables = get_1.default.tables(data);
                        _a = tables, grading = _a[0], history = _a[1];
                        if (parse) {
                            return [2 /*return*/, {
                                    grading: parse_1.default.grading(grading),
                                    history: parse_1.default.history(history)
                                }];
                        }
                        ;
                        return [2 /*return*/, { grading: grading, history: history }];
                }
            });
        });
    };
    /**
     * Gets an ECF club from a club's ID
     */
    ECF.club = function (code, parse) {
        if (parse === void 0) { parse = true; }
        return __awaiter(this, void 0, void 0, function () {
            var uri, data, tables, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = club.replace('|', code);
                        return [4 /*yield*/, request_promise_1.default.get({
                                uri: uri,
                                timeout: 10000
                            })];
                    case 1:
                        data = _a.sent();
                        tables = get_1.default.tables(data);
                        results = tables[0];
                        //if (parse) return Parse.userResults(results);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return ECF;
}());
exports.default = ECF;
//# sourceMappingURL=index.js.map