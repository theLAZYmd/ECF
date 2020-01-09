"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var regexes = __importStar(require("./utils/regexes"));
var Parse = /** @class */ (function () {
    function Parse() {
    }
    /**
     * Parses a searchstring and returns a query object
     */
    Parse.searchstring = function (argument) {
        var def = Object.assign({}, interfaces_1.SearchDefaults);
        if (typeof argument === 'string') {
            if (argument.includes(',')) {
                var args = argument.split(',');
                if (args.length > 2)
                    throw new SyntaxError('max 1 comma in searchstring');
                def.lastName = args[0].trim();
                var remainder = args[1].split(regexes.spaces);
                def.firstName = remainder[0].trim();
                def.middleName = remainder.slice(1).join(' ');
            }
            else {
                var names = argument.split(regexes.spaces);
                def.lastName = names.pop();
                if (names[0])
                    def.firstName = names.shift();
                if (names[0])
                    def.middleName = names.join(' ');
            }
        }
        else if (argument instanceof Array) {
            var names = argument;
            def.lastName = names.pop();
            if (names[0])
                def.firstName = names.shift();
            if (names[0])
                def.middleName = names.join(' ');
        }
        else if (typeof argument === 'object') {
            for (var _i = 0, _a = Object.keys(argument); _i < _a.length; _i++) {
                var k = _a[_i];
                if (interfaces_1.keys.indexOf(k) === -1)
                    throw new SyntaxError('Invalid property ' + k);
                if (argument[k])
                    def[k] = argument[k];
            }
        }
        else
            throw new TypeError('Argument must be a string, array, or object');
        return def;
    };
    Parse.grading = function (arr) {
        var _a, _b;
        var obj = arr.reduce(function (acc, curr) {
            acc[curr.Field] = curr.Value;
            return acc;
        }, {});
        var initial = this.userResults([obj])[0];
        var date = new Date((arr.find(function (entry) { return entry.Field === 'Class'; })
            .Description || '')
            .split('-')
            .reverse()
            .join('-'));
        initial.clubs = (_b = (_a = arr.find(function (elem) { return elem.Field === 'Club' || elem.Field === 'Club(s)'; })) === null || _a === void 0 ? void 0 : _a.Value) === null || _b === void 0 ? void 0 : _b.split('\n');
        if (obj.Nation)
            initial.federation = obj.Nation;
        if (obj.FIDE)
            initial.FIDE = obj.FIDE;
        initial.dateRenewed = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        };
        var standardIndex = arr.findIndex(function (element) { return element.Field === 'Standard'; });
        initial.standard = arr.slice(standardIndex + 1, standardIndex + 6)
            .reduce(function (acc, curr) {
            if (curr.Field === 'Category')
                acc.category = curr.Value;
            else if (curr.Field === 'Grade') {
                if (!acc.rating)
                    acc.rating = Number(curr.Value);
                else
                    acc.unamendedRating = Number(curr.Value);
            }
            else if (curr.Field === 'Games') {
                if (!acc.played)
                    acc.played = Number(curr.Value);
                else
                    acc.playedLastYear = Number(curr.Value);
            }
            return acc;
        }, {});
        var rapidIndex = arr.findIndex(function (element) { return element.Field === 'Rapid'; });
        initial.rapidplay = arr.slice(rapidIndex + 1, rapidIndex + 6)
            .reduce(function (acc, curr) {
            if (curr.Field === 'Category')
                acc.category = curr.Value;
            else if (curr.Field === 'Grade') {
                if (!acc.rating)
                    acc.rating = Number(curr.Value);
                else
                    acc.unamendedRating = Number(curr.Value);
            }
            else if (curr.Field === 'Games') {
                if (!acc.played)
                    acc.played = Number(curr.Value);
                else
                    acc.playedLastYear = Number(curr.Value);
            }
            return acc;
        }, {});
        return initial;
    };
    Parse.history = function (arr) {
        return arr.map(function (curr) {
            var _a = curr.List.split(' '), month = _a[0], _year = _a[1];
            var year = parseInt(_year);
            var standard = parseInt(curr.StandardplayGrade);
            var standardCategory = curr.StandardplayGrade.slice(-1);
            var rapidplay = parseInt(curr.RapidplayGrade_1);
            var rapidplayCategory = curr.RapidplayGrade_1.slice(-1);
            return { year: year, month: month, standard: standard, standardCategory: standardCategory, rapidplay: rapidplay, rapidplayCategory: rapidplayCategory };
        });
    };
    Parse.userResults = function (arr) {
        return arr.map(function (curr) {
            var obj = {};
            obj.id = curr.Ref;
            if (curr.Member)
                obj.member = curr.Member;
            if (curr.Name) {
                obj.name = curr.Name;
                var names = obj.name.split(',');
                obj.lastName = names.shift();
                if (names[0]) {
                    var remainder = names[0].trim().split(regexes.spaces);
                    obj.firstName = remainder.shift();
                    if (remainder[0])
                        obj.middleName = remainder.join(' ');
                }
            }
            if (curr.Age)
                obj.age = Number(curr.Age);
            if (curr.Club)
                obj.club = curr.Club;
            obj.standard = {
                rating: Number(curr.Standard),
                category: curr.Standard_1,
                previousRating: Number(curr.Previous),
                previousCategory: curr.Previous_1
            };
            obj.rapidplay = {
                rating: Number(curr.Rapidplay),
                category: curr.Rapidplay_1,
                previousRating: Number(curr.Previous_2),
                previousCategory: curr.Previous_3
            };
            return obj;
        });
    };
    Parse.clubResults = function (arr) {
        return arr;
    };
    return Parse;
}());
exports.default = Parse;
//# sourceMappingURL=parse.js.map