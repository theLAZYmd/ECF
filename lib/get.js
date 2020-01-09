"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var Get = /** @class */ (function () {
    function Get() {
    }
    /**
     * Builds an array of elements out of all the children of a given parent element
     */
    Get.findChildren = function (obj, filter) {
        var children = [];
        for (var _i = 0, _a = obj.children || []; _i < _a.length; _i++) {
            var child = _a[_i];
            if (filter(child))
                children.push(child);
            if (child.children)
                children.push.apply(children, Get.findChildren(child, filter));
        }
        return children;
    };
    /**
     * Takes a given HTML element and nicely parses the text within
     */
    Get.findText = function (obj) {
        var x = Get.findChildren(obj, function (child) { return child.type === 'text' && !!child.data && !!child.data.toString().trim(); });
        return x.map(function (elem) {
            if (!elem || !elem.data)
                return '';
            return elem.data.toString().replace('*', '').trim();
        }).join('\n');
    };
    Get.tables = function (data, _a) {
        var _b = (_a === void 0 ? {} : _a).columnNames, columnNames = _b === void 0 ? [] : _b;
        var tables = [];
        var $ = cheerio_1.default.load(data);
        $('table').each(function () {
            var table = [];
            var headers = [];
            var queries = ['thead tr th', 'tbody tr th'];
            var q = queries.shift();
            var _loop_1 = function () {
                var j = 0;
                $(this_1).find(q).each(function (i, element) {
                    var colspan = element.attribs.colspan ? Number(element.attribs.colspan) : 1;
                    var k = 0;
                    while (colspan >= 1) {
                        var text = Get.findText(element).replace(/\s+/g, '');
                        var str = text;
                        while (headers.includes(str)) {
                            k++;
                            str = text + '_' + k.toString();
                        }
                        headers[i + j] = str;
                        if (colspan > 1)
                            j++;
                        colspan--;
                    }
                });
                q = queries.shift();
            };
            var this_1 = this;
            do {
                _loop_1();
            } while (!headers[0] && q);
            var last = '';
            $(this).find('tbody tr').each(function (i) {
                var obj = {};
                $(this).find('td').each(function (j, element) {
                    var header = headers[j] || columnNames[j];
                    if (!header)
                        return;
                    if (obj[header])
                        return;
                    var text = '';
                    if (element.type !== 'text') {
                        text = Get.findText(element);
                    }
                    obj[header] = text || '';
                });
                if (Object.values(obj).every(function (v) { return !v; }))
                    return;
                var header = headers[0] || columnNames[0];
                if (!obj[header])
                    obj[header] = last;
                table.push(obj);
                last = obj[header];
            });
            tables.push(table);
        });
        return tables;
    };
    return Get;
}());
exports.default = Get;
//# sourceMappingURL=get.js.map