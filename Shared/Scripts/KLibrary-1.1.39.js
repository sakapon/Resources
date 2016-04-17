﻿/*
* KLibrary.js 1.1.39
* Copyright © 2012, Keiho Sakapon.
*
* Prerequisites:
*     jQuery 1.7.2 (or later)
*/

var KLibrary;
(function (KLibrary) {
    function copyObject(src, dest) {
        /// <summary>
        ///     オブジェクトのプロパティの値をコピーします。
        /// </summary>
        /// <param name="src" type="Object">コピー元のオブジェクト。</param>
        /// <param name="dest" type="Object">コピー先のオブジェクト。</param>

        if (src == null) return;
        if (dest == null) return;

        for (var p in src) {
            dest[p] = src[p];
        }
    }
    KLibrary.copyObject = copyObject;

    function toArray(args) {
        /// <summary>
        ///     配列に変換します。主に、arguments に対して使用します。
        /// </summary>
        /// <param name="args" type="String">配列の性質を持つオブジェクト。arguments など。</param>
        /// <returns type="Array" />

        var r = [];
        r.push.apply(r, args);
        return r;
    }
    KLibrary.toArray = toArray;

    String.prototype.padLeft = function (width, c) {
        if (width == null) return this;
        if (c == null) c = " ";

        var s = this;
        while (s.length < width) {
            s = c + s;
        }
        return s;
    };

    String.prototype.padRight = function (width, c) {
        if (width == null) return this;
        if (c == null) c = " ";

        var s = this;
        while (s.length < width) {
            s = s + c;
        }
        return s;
    };

    function padInt(n, width) {
        return n.toString().padLeft(width, "0");
    }

    String.prototype.trimLeft = function (c) {
        if (c == null) c = " ";

        var s = this;
        while (s.length > 0 && s[0] == c) {
            s = s.substring(1);
        }
        return s;
    };

    String.prototype.trimRight = function (c) {
        if (c == null) c = " ";

        var s = this;
        while (s.length > 0 && s[s.length - 1] == c) {
            s = s.substring(0, s.length - 1);
        }
        return s;
    };

    String.prototype.trim = function (c) {
        if (c == null) c = " ";

        return this.trimLeft(c).trimRight(c);
    };

    function format(_format, args) {
        /// <summary>
        ///     指定された書式を利用して、文字列を置換します。
        /// </summary>
        /// <param name="_format" type="String">書式。</param>
        /// <param name="args" type="String">置換後の文字列の配列。可変長パラメーターとしても指定できます。</param>
        /// <returns type="String" />

        var a = arguments;
        return _format.replace(/\{([0-9]+)(:[^\}]*)?\}/g,
            function (m, g0, g1) {
                var v = args instanceof Array ? args[parseInt(g0)] : a[parseInt(g0) + 1];
                if (v == null) return "";
                return v instanceof Date ? v.format(g1 != null ? g1.substring(1) : null) : v.toString();
            });
    }
    KLibrary.format = format;

    function formatObject(template, obj, encodeHtml) {
        /// <summary>
        ///     指定されたテンプレートをオブジェクトに適用して、文字列を置換します。
        /// </summary>
        /// <param name="template" type="String">テンプレート。</param>
        /// <param name="obj" type="Object">オブジェクト。</param>
        /// <param name="encodeHtml" type="Boolean">HTML としてエンコードするかどうかを示す値。</param>
        /// <returns type="String" />

        return template.replace(/\$\{([a-zA-Z0-9_\.]+)(:[^\}]*)?\}/g,
            function (m, g0, g1) {
                var v;
                try {
                    v = eval("obj." + g0);
                } catch (err) {
                    v = null;
                }
                if (v == null) return "";
                var s = v instanceof Date ? v.format(g1 != null ? g1.substring(1) : null) : v.toString();
                return g1 == ":R" ? s : encodeHtml ? htmlEncode(s) : s;
            });
    }
    KLibrary.formatObject = formatObject;

    Date.prototype.format = function (_format) {
        /// <summary>
        ///     指定された書式を利用して、文字列に変換します。
        /// </summary>
        /// <param name="_format" type="String">書式。</param>
        /// <returns type="String" />

        if (_format == null) {
            switch (getLanguage().toLowerCase()) {
                case "ja":
                    _format = "yyyy/MM/dd HH:mm:ss";
                    break;
                default:
                    _format = "M/d/yyyy h:mm:ss tt";
                    break;
            }
        }

        var date = this;
        return _format.replace(/y{1,5}|M{1,4}|d{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,3}|t{1,2}|z{1,3}/g,
            function (s) { return formatDateProperty(date, s[0], s.length); });
    };

    function formatDateProperty(date, c, length) {
        switch (c) {
            case "y":
                var year = length > 2 ? date.getFullYear() : date.getFullYear() % 100;
                return padInt(year, length);
            case "M": return length > 2 ? getMonthName(date.getMonth() + 1, length == 3) : padInt(date.getMonth() + 1, length);
            case "d": return length > 2 ? getDayOfWeekName(date.getDay(), length == 3) : padInt(date.getDate(), length);
            case "h": return padInt(date.getHours() % 12, length);
            case "H": return padInt(date.getHours(), length);
            case "m": return padInt(date.getMinutes(), length);
            case "s": return padInt(date.getSeconds(), length);
            case "f": return padInt(date.getMilliseconds(), 3).substr(0, length);
            case "t": return (date.getHours() < 12 ? "AM" : "PM").substr(0, length);
            case "z":
                var offset = date.getTimezoneOffset();
                var sign = offset < 0 ? "+" : offset > 0 ? "-" : "";
                if (length > 2) {
                    var offsetH = Math.floor(Math.abs(offset) / 60);
                    var offsetM = Math.abs(offset) % 60;
                    return sign + padInt(offsetH, 2) + ":" + padInt(offsetM, 2);
                } else {
                    return sign + (length == 2 && Math.abs(offset) < 600 ? "0" : "") + (Math.abs(offset) / 60).toString();
                }
            default: return c;
        }
    }

    var _monthNames;
    var _getMonthFull;
    var _getMonthShort;
    function getMonthName(month, short) {
        if (_getMonthFull == null) {
            switch (getLanguage().toLowerCase()) {
                case "ja":
                    _getMonthFull = function (i) { return i.toString() + "月"; };
                    _getMonthShort = function (i) { return i.toString(); };
                    break;
                default:
                    _monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    _getMonthFull = function (i) { return _monthNames[i]; };
                    _getMonthShort = function (i) { return _monthNames[i].substr(0, 3); };
                    break;
            }
        }
        return (!short ? _getMonthFull : _getMonthShort)(month);
    }

    var _dowNames;
    var _getDowFull;
    var _getDowShort;
    function getDayOfWeekName(dayOfWeek, short) {
        if (_getDowFull == null) {
            switch (getLanguage().toLowerCase()) {
                case "ja":
                    _dowNames = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
                    _getDowFull = function (i) { return _dowNames[i]; };
                    _getDowShort = function (i) { return _dowNames[i].substr(0, 1); };
                    break;
                default:
                    _dowNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    _getDowFull = function (i) { return _dowNames[i]; };
                    _getDowShort = function (i) { return _dowNames[i].substr(0, 3); };
                    break;
            }
        }
        return (!short ? _getDowFull : _getDowShort)(dayOfWeek);
    }

    function getLanguage() {
        /// <summary>
        ///     現在のブラウザーの言語を取得します。
        ///     例えば、日本語の場合は ja です。
        /// </summary>
        /// <returns type="String" />

        var l = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        if (l == null) return undefined;
        return l.split("-")[0];
    }
    KLibrary.getLanguage = getLanguage;

    function htmlEncode(s) {
        /// <summary>
        ///     HTML 文字列をエンコードします。
        /// </summary>
        /// <param name="s" type="String">文字列。</param>
        /// <returns type="String" />

        return s.replace(/["&'<>]/g, htmlEncodeChar);
    }
    KLibrary.htmlEncode = htmlEncode;

    function htmlEncodeChar(c) {
        switch (c) {
            case "\"": return "&quot;";
            case "&": return "&amp;";
            case "\'": return "&#39;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            default: return c;
        }
    }

    (function (Css) {
        var cssRulesIndexes = {};

        function setCssRules(id, cssRules) {
            /// <summary>
            ///     CSS のルールを設定します。
            /// </summary>
            /// <param name="id" type="String">style 要素の ID。</param>
            /// <param name="cssRules" type="Object">CSS のルールの配列。可変長パラメーターとしても指定できます。このオブジェクトは、createCssRule 関数で作成できます。</param>

            if (id == null) return;
            if (!(cssRules instanceof Array)) cssRules = toArray(arguments).slice(1);

            if (cssRulesIndexes[id] == null) {
                var isCompleted = setCssRulesToHead(id, cssRules);
                if (isCompleted) return;
                cssRulesIndexes[id] = setCssRulesToDocument(null, cssRules);
            } else {
                cssRulesIndexes[id] = setCssRulesToDocument(cssRulesIndexes[id], cssRules);
            }
        }
        Css.setCssRules = setCssRules;

        function setCssRulesToHead(id, cssRules) {
            /// <summary>
            ///     CSS のルールを head 要素に設定します。
            ///     戻り値は、設定に成功したかどうかを示す値です。
            /// </summary>
            /// <param name="id" type="String">style 要素の ID。</param>
            /// <param name="cssRules" type="Object">CSS のルールの配列。可変長パラメーターとしても指定できます。このオブジェクトは、createCssRule 関数で作成できます。</param>
            /// <returns type="Boolean" />

            if (id == null) return;
            if (!(cssRules instanceof Array)) cssRules = toArray(arguments).slice(1);

            $("#" + id).remove();
            var styleSheet = $("<style></style>")
                .attr("id", id)
                .attr("type", "text/css")
                .appendTo("head")[0].sheet;
            if (!styleSheet) return false;
            cssRules.forEach(function (r, i) {
                styleSheet.insertRule(format("{0} { {1} }", r.selector, r.style), i);
            });
            return true;
        }
        Css.setCssRulesToHead = setCssRulesToHead;

        function setCssRulesToDocument(sheetIndex, cssRules) {
            /// <summary>
            ///     CSS のルールを document に設定します。IE8 で利用します。
            ///     戻り値は、設定されたスタイル シートの番号です。
            /// </summary>
            /// <param name="sheetIndex" type="Number">スタイル シートの番号。</param>
            /// <param name="cssRules" type="Object">CSS のルールの配列。可変長パラメーターとしても指定できます。このオブジェクトは、createCssRule 関数で作成できます。</param>
            /// <returns type="Number" />

            if (sheetIndex == null) sheetIndex = document.styleSheets.length;
            if (!(cssRules instanceof Array)) cssRules = toArray(arguments).slice(1);

            var sheet = sheetIndex < document.styleSheets.length ? document.styleSheets[sheetIndex] : null;
            if (sheet) {
                while (sheet.cssRules.length > 0) {
                    sheet.removeRule(0);
                }
            } else {
                sheet = document.createStyleSheet();
                sheetIndex = document.styleSheets.length - 1;
            }

            for (var i = 0; i < cssRules.length; i++) {
                var r = cssRules[i];
                var selectors = r.selector.split(",");
                for (var j = 0; j < selectors.length; j++) {
                    sheet.addRule(selectors[j], r.style);
                }
            }
            return sheetIndex;
        }
        Css.setCssRulesToDocument = setCssRulesToDocument;

        function createCssRule(selector, style) {
            return { selector: selector, style: style };
        }
        Css.createCssRule = createCssRule;
    })(KLibrary.Css || (KLibrary.Css = {}));
    var Css = KLibrary.Css;

    (function (IO) {
        function getCookie(key, defaultValue) {
            /// <summary>
            ///     Cookie から、指定されたキーに対応する値を取得します。
            /// </summary>
            /// <param name="key" type="String">キー。</param>
            /// <param name="defaultValue" type="String">キーが存在しなかった場合に使用される既定値。</param>
            /// <returns type="String" />

            if (key == null) return defaultValue;
            if (!document.cookie) return defaultValue;

            var regexp = new RegExp("(^|;)\\s*" + key + "=([^;]*)($|;)", "g");
            var m = document.cookie.match(regexp);
            if (m == null) return defaultValue;
            return unescape(RegExp.$2);
        }
        IO.getCookie = getCookie;

        function setCookie(key, value, validDays) {
            /// <summary>
            ///     Cookie に、キーと値のペアを格納します。
            /// </summary>
            /// <param name="key" type="String">キー。</param>
            /// <param name="value" type="String">値。</param>
            /// <param name="validDays" type="Number">有効な日数。既定値は 365 です。</param>

            if (validDays == null) validDays = 365;

            var expired = new Date();
            expired.setTime(expired.getTime() + validDays * 24 * 60 * 60 * 1000);
            document.cookie = format("{0}={1}; expires={2};", key, escape(value), expired.toGMTString());
        }
        IO.setCookie = setCookie;
    })(KLibrary.IO || (KLibrary.IO = {}));
    var IO = KLibrary.IO;
})(KLibrary || (KLibrary = {}));

(function ($) {
    $.fn.defineProperty = function (name, getFunc, setFunc) {
        /// <summary>
        ///     オブジェクトにプロパティを定義します。
        ///     型の prototype オブジェクトを指定した場合、その型のインスタンス全体に対して有効になります。
        /// </summary>
        /// <param name="name" type="String">プロパティの名前。</param>
        /// <param name="getFunc" type="Function">値を取得するための関数。</param>
        /// <param name="setFunc" type="Function">値を設定するための関数。</param>
        /// <returns type="jQuery" />

        if (name == null) return this;

        return this.each(function (i) {
            if (this == null) return;
            Object.defineProperty(this, name, {
                get: getFunc,
                set: setFunc,
                enumerable: true,
                configurable: true
            });
        });
    };

    $.fn.bindData = function (itemsSource, itemTemplate) {
        /// <summary>
        ///     現在の要素をデータにバインドします。
        /// </summary>
        /// <param name="itemsSource" type="Object">データとなるオブジェクト。</param>
        /// <param name="itemTemplate" type="String">単一のデータに対するテンプレート、またはその ID セレクター。</param>
        /// <returns type="jQuery" />

        // TODO: this が複数の場合。
        var template =
            itemTemplate == null ? $("#" + this.data("itemTemplateId")).text() :
            itemTemplate[0] == "#" ? $(itemTemplate).text() :
            itemTemplate;
        var elements = $(itemsSource)
            .map(function () {
                var formatted = KLibrary.formatObject(template, this, true);
                return $(formatted).get();
            });
        return this
            .empty()
            .append(elements);
    };

    $.fn.setIsEnabled = function (isEnabled) {
        /// <summary>
        ///     要素の状態を、有効または無効に設定します。
        /// </summary>
        /// <param name="isEnabled" type="Boolean">要素が有効であるかどうかを示す値。</param>
        /// <returns type="jQuery" />

        return isEnabled ? this.removeAttr("disabled") : this.attr("disabled", "disabled");
    };
})(jQuery);
