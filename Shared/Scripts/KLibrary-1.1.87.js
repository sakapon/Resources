/*
* KLibrary.js 1.1.87
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

    function isArray(obj) {
        /// <summary>
        ///     指定されたオブジェクトが配列の性質を持っているかどうかを判断します。
        /// </summary>
        /// <param name="obj" type="Object">オブジェクト。</param>
        /// <returns type="Boolean" />

        return obj != null && obj.length != null && !(obj instanceof Function);
    }
    KLibrary.isArray = isArray;

    function toArray(obj) {
        /// <summary>
        ///     指定されたオブジェクトを配列に変換します。arguments に対しても使用できます。
        /// &#10;配列の性質を持っていない場合、プロパティの名前と値のペアの配列となります。
        /// </summary>
        /// <param name="obj" type="Object">オブジェクト。</param>
        /// <returns type="Array" />

        if (obj == null) return [];

        var a = [];
        if (isArray(obj)) {
            a.push.apply(a, obj);
        } else {
            for (var p in obj) {
                a.push({ key: p, value: obj[p] });
            }
        }
        return a;
    }
    KLibrary.toArray = toArray;

    function isNullOrEmpty(obj) {
        /// <summary>
        ///     指定された文字列 (または配列) が null または空文字列 (または空配列) であるかどうかを判断します。
        /// </summary>
        /// <param name="obj" type="Object">文字列または配列。</param>
        /// <returns type="Boolean" />

        return obj == null || obj.length == 0;
    }
    KLibrary.isNullOrEmpty = isNullOrEmpty;

    String.prototype.toDate = function () {
        /// <summary>
        ///     Date 型のオブジェクトに変換します。
        ///     例えば、次の形式の文字列を変換できます。
        /// &#10;    (1) 2012-10-24T02:55:01.568Z
        /// &#10;    (2) /Date(1351047301568+0900)/
        /// </summary>
        /// <returns type="Date" />

        var m = this.match(/^\/Date\(([0-9]+)(.*)\)\/$/g);
        return new Date(m == null ? this : parseInt(RegExp.$1));
    };

    String.prototype.padLeft = function (width, c) {
        /// <summary>
        ///     指定された文字数になるまで、指定された文字を左側に埋め込みます。
        /// </summary>
        /// <param name="width" type="Number">文字数。</param>
        /// <param name="c" type="String">埋め込む文字。</param>
        /// <returns type="String" />

        if (width == null) return this;
        if (c == null) c = " ";

        var s = this;
        while (s.length < width) {
            s = c + s;
        }
        return s;
    };

    String.prototype.padRight = function (width, c) {
        /// <summary>
        ///     指定された文字数になるまで、指定された文字を右側に埋め込みます。
        /// </summary>
        /// <param name="width" type="Number">文字数。</param>
        /// <param name="c" type="String">埋め込む文字。</param>
        /// <returns type="String" />

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
        /// <summary>
        ///     先頭から、指定された文字を削除します。
        /// </summary>
        /// <param name="c" type="String">削除する文字。</param>
        /// <returns type="String" />

        if (c == null) c = " ";

        var s = this;
        while (s.length > 0 && s.charAt(0) == c) {
            s = s.substring(1);
        }
        return s;
    };

    String.prototype.trimRight = function (c) {
        /// <summary>
        ///     末尾から、指定された文字を削除します。
        /// </summary>
        /// <param name="c" type="String">削除する文字。</param>
        /// <returns type="String" />

        if (c == null) c = " ";

        var s = this;
        while (s.length > 0 && s.charAt(s.length - 1) == c) {
            s = s.substring(0, s.length - 1);
        }
        return s;
    };

    String.prototype.trim2 = function (c) {
        /// <summary>
        ///     先頭および末尾から、指定された文字を削除します。
        /// </summary>
        /// <param name="c" type="String">削除する文字。</param>
        /// <returns type="String" />

        if (c == null) c = " ";

        return this.trimLeft(c).trimRight(c);
    };

    Date.prototype.addHours = function (v) {
        /// <summary>
        ///     指定された時間数を加算した新しい DateTime を返します。
        /// </summary>
        /// <param name="v" type="Number">時間数。</param>
        /// <returns type="Date" />

        return new Date(this.getTime() + v * 60 * 60 * 1000);
    }

    function format(_format, args) {
        /// <summary>
        ///     指定された書式を利用して、文字列を置換します。
        /// </summary>
        /// <param name="_format" type="String">書式。</param>
        /// <param name="args" type="String">置換後の文字列の配列。可変長パラメーターとしても指定できます。</param>
        /// <returns type="String" />

        if (!(args instanceof Array)) args = toArray(arguments).slice(1);

        return _format.replace(/\{([0-9]+)(:[^\}]*)?\}/g,
            function (m, g1, g2) {
                var v = args[parseInt(g1)];
                if (v == null) return "";
                return (typeof v === "number" || v instanceof Date) ? v.format(isNullOrEmpty(g2) ? null : g2.substring(1)) : v.toString();
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

        return template.replace(/\$\{([a-zA-Z0-9_\.\[\]]*)(>[^:\}]*)?(:[^\}]*)?\}/g,
            function (m, g1, g2, g3) {
                var v;
                try {
                    v = eval(format("obj{0}{1}", (isNullOrEmpty(g1) || g1.charAt(0) == "[") ? "" : ".", g1));
                } catch (err) {
                    v = null;
                }
                if (!isNullOrEmpty(g2)) {
                    v = eval(g2.substring(1))(v);
                }
                if (v == null) return "";
                var s = (typeof v === "number" || v instanceof Date) ? v.format(isNullOrEmpty(g3) ? null : g3.substring(1)) : v.toString();
                return g3 == ":R" ? s : encodeHtml ? htmlEncode(s) : s;
            });
    }
    KLibrary.formatObject = formatObject;

    Number.prototype.format = function (_format) {
        /// <summary>
        ///     指定された書式を利用して、文字列に変換します。
        /// </summary>
        /// <param name="_format" type="String">書式。</param>
        /// <returns type="String" />

        if (_format == null) return this.toString();

        var number = this;
        return _format.replace(/([nNxX])(\d*)/g,
            function (s, g1, g2) { return formatNumber(number, g1, isNullOrEmpty(g2) ? 0 : parseInt(g2)); });
    };

    function formatNumber(number, c, length) {
        switch (c) {
            case "n":
            case "N": return number.toString().replace(/\d(?=(\d{3})+(\.\d+)?$)/g, "$0,");
            case "x": return padInt(number.toString(16).toLowerCase(), length);
            case "X": return padInt(number.toString(16).toUpperCase(), length);
            default: return c;
        }
    }

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
            function (s) { return formatDateProperty(date, s.charAt(0), s.length); });
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

    function toEntity(obj) {
        /// <summary>
        ///     Entity オブジェクトに変換します。
        /// </summary>
        /// <param name="obj" type="Object">オブジェクトまたはオブジェクトの配列。</param>
        /// <returns type="KLibrary.Entity" />

        return !(obj instanceof Array) ?
            new Entity(obj) :
            obj.select(function (x) { return new Entity(x); });
    };
    KLibrary.toEntity = toEntity;

    var Entity = (function () {
        function Entity(obj) {
            /// <summary>
            ///     Entity クラスの新しいインスタンスを初期化します。
            /// </summary>
            /// <param name="obj" type="Object">オブジェクト。</param>
            /// <returns type="KLibrary.Entity" />

            for (var p in obj) {
                CapsuleProperty(obj, this, p);
            }
        }

        function CapsuleProperty(src, dest, name) {
            dest["_" + name] = src[name];
            Object.defineProperty(dest, name, {
                get: function () {
                    return this["_" + name];
                },
                set: function (v) {
                    this["_" + name] = v;
                    $(this).trigger("propertychanged", [name, v]);
                },
                enumerable: true,
                configurable: true
            });
        }
        return Entity;
    })();
    KLibrary.Entity = Entity;

    (function (ArrayEx) {
        function range(start, count) {
            /// <summary>
            ///     指定した範囲の整数の配列を生成します。
            /// </summary>
            /// <param name="start" type="Number">最初の整数の値。</param>
            /// <param name="count" type="Number">生成する配列の長さ。</param>
            /// <returns type="Array" />

            if (start == null) start = 0;
            if (count == null) count = 0;

            var maxValue = start + count;
            var a = [];
            for (var i = start; i < maxValue; i++) {
                a.push(i);
            }
            return a;
        }
        ArrayEx.range = range;

        Array.prototype.toDictionary = function (toKey, toValue) {
            /// <summary>
            ///     要素からキーおよび値を抽出してディクショナリに変換します。
            /// </summary>
            /// <param name="toKey" type="Function">キーを抽出する関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <param name="toValue" type="Function">値を抽出する関数。省略可能です。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Object" />

            if (toKey == null) return {};
            if (toValue == null) toValue = function (x) { return x; };

            var o = {};
            for (var i = 0; i < this.length; i++) {
                o[toKey.call(this, this[i], i)] = toValue.call(this, this[i], i);
            }
            return o;
        };

        Array.prototype.all = function (predicate) {
            /// <summary>
            ///     すべての要素が条件を満たしているかどうかを判断します。
            /// </summary>
            /// <param name="predicate" type="Function">要素が条件を満たしているかどうかを試す関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Boolean" />

            if (predicate == null) predicate = function (x) { return false; };

            for (var i = 0; i < this.length; i++) {
                if (!predicate.call(this, this[i], i)) {
                    return false;
                }
            }
            return true;
        };

        Array.prototype.any = function (predicate) {
            /// <summary>
            ///     任意の要素が条件を満たしているかどうかを判断します。
            /// </summary>
            /// <param name="predicate" type="Function">要素が条件を満たしているかどうかを試す関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Boolean" />

            if (predicate == null) predicate = function (x) { return true; };

            for (var i = 0; i < this.length; i++) {
                if (predicate.call(this, this[i], i)) {
                    return true;
                }
            }
            return false;
        };

        Array.prototype.contains = function (value) {
            /// <summary>
            ///     指定された要素が含まれているかどうかを判断します。
            /// </summary>
            /// <param name="value" type="Object">検索する値。</param>
            /// <returns type="Boolean" />

            return this.any(function (x) { return x === value; });
        };

        Array.prototype.each = function (action) {
            /// <summary>
            ///     各要素に対して、指定された処理を実行します。
            /// </summary>
            /// <param name="action" type="Function">各要素に対して実行する処理。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Array" />

            if (action == null) return this;

            for (var i = 0; i < this.length; i++) {
                action.call(this, this[i], i);
            }
            return this;
        };

        Array.prototype.first = function (predicate) {
            /// <summary>
            ///     条件を満たす最初の要素を取得します。存在しない場合は null を返します。
            /// </summary>
            /// <param name="predicate" type="Function">要素をフィルターする関数。省略可能です。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Object" />

            if (predicate) {
                for (var i = 0; i < this.length; i++) {
                    if (predicate.call(this, this[i], i)) {
                        return this[i];
                    }
                }
                return null;
            } else {
                return this.length > 0 ? this[0] : null;
            }
        };

        Array.prototype.last = function (predicate) {
            /// <summary>
            ///     条件を満たす最後の要素を取得します。存在しない場合は null を返します。
            /// </summary>
            /// <param name="predicate" type="Function">要素をフィルターする関数。省略可能です。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Object" />

            if (predicate) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (predicate.call(this, this[i], i)) {
                        return this[i];
                    }
                }
                return null;
            } else {
                return this.length > 0 ? this[this.length - 1] : null;
            }
        };

        Array.prototype.groupBy = function (toKey, toValue) {
            /// <summary>
            ///     要素からキーを抽出してグループ化し、要素から値を抽出します。
            /// </summary>
            /// <param name="toKey" type="Function">キーを抽出する関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <param name="toValue" type="Function">値を抽出する関数。省略可能です。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Array" />

            var d = this.groupByToDictionary(toKey, toValue);
            return toArray(d);
        };

        Array.prototype.groupByToDictionary = function (toKey, toValue) {
            /// <summary>
            ///     要素からキーを抽出してグループ化し、要素から値を抽出してディクショナリに変換します。
            /// </summary>
            /// <param name="toKey" type="Function">キーを抽出する関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <param name="toValue" type="Function">値を抽出する関数。省略可能です。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Object" />

            if (toKey == null) return {};
            if (toValue == null) toValue = function (x) { return x; };

            var d = {};
            for (var i = 0; i < this.length; i++) {
                var key = toKey.call(this, this[i], i);
                var value = toValue.call(this, this[i], i);
                if (!d[key]) d[key] = [];
                d[key].push(value);
            }
            return d;
        };

        Array.prototype.orderBy = function (toKey) {
            /// <summary>
            ///     要素をキーに従って昇順に並べ替えます。
            /// </summary>
            /// <param name="toKey" type="Function">キーを抽出する関数。this に配列、第 1 引数に要素が渡されます。</param>
            /// <returns type="Array" />

            if (toKey == null) return this;

            var a = this.slice(0);
            for (var i = 0; i < a.length - 1; i++) {
                for (var j = i + 1; j < a.length; j++) {
                    if (toKey.call(this, a[i]) > toKey.call(this, a[j])) {
                        var o = a[i];
                        a[i] = a[j];
                        a[j] = o;
                    }
                }
            }
            return a;
        };

        Array.prototype.select = function (selector) {
            /// <summary>
            ///     要素を新たな値に射影します。
            /// </summary>
            /// <param name="selector" type="Function">要素を変換する関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Array" />

            if (selector == null) return this;

            var a = [];
            for (var i = 0; i < this.length; i++) {
                a.push(selector.call(this, this[i], i));
            }
            return a;
        };

        Array.prototype.where = function (predicate) {
            /// <summary>
            ///     要素をフィルター処理します。
            /// </summary>
            /// <param name="predicate" type="Function">要素をフィルターする関数。this に配列、第 1 引数に要素、第 2 引数にインデックスが渡されます。</param>
            /// <returns type="Array" />

            if (predicate == null) return this;

            var a = [];
            for (var i = 0; i < this.length; i++) {
                if (predicate.call(this, this[i], i)) {
                    a.push(this[i]);
                }
            }
            return a;
        };
    })(KLibrary.ArrayEx || (KLibrary.ArrayEx = {}));
    var ArrayEx = KLibrary.ArrayEx;

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
                try {
                    styleSheet.insertRule(format("{0} { {1} }", r.selector, r.style), i);
                } catch (err) { }
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
                while (sheet.rules.length > 0) {
                    sheet.removeRule(0);
                }
            } else {
                sheet = document.createStyleSheet();
                sheetIndex = document.styleSheets.length - 1;
            }

            for (var i = 0; i < cssRules.length; i++) {
                var r = cssRules[i];
                try {
                    sheet.addRule(r.selector, r.style);
                } catch (err) { }
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
            if (document.cookie == null) return defaultValue;

            var regexp = new RegExp("^\\s*" + key + "=([^;]*)$", "g");
            var pair = document.cookie.split(";").last(function (x) { return x.search(regexp) != -1; });
            if (pair == null) return defaultValue;
            return decodeURIComponent(RegExp.$1);
        }
        IO.getCookie = getCookie;

        function setCookie(key, value, days, domain, path, isSecure) {
            /// <summary>
            ///     Cookie に、キーと値のペアを格納します。
            /// </summary>
            /// <param name="key" type="String">キー。</param>
            /// <param name="value" type="String">値。</param>
            /// <param name="days" type="Number">有効な日数。値が指定されない場合、現在のセッションでのみ有効です。</param>
            /// <param name="domain" type="String">ドメイン。"localhost" は無効となるようです。</param>
            /// <param name="path" type="String">パス。</param>
            /// <param name="isSecure" type="Boolean">HTTPS かどうかを示す値。</param>

            var cookie = format("{0}={1};", key, encodeURIComponent(value));
            if (days) {
                var expired = new Date();
                expired.setTime(expired.getTime() + days * 24 * 60 * 60 * 1000);
                cookie = format("{0} expires={1};", cookie, expired.toGMTString());
            }
            if (domain) {
                cookie = format("{0} domain={1};", cookie, domain);
            }
            if (path) {
                cookie = format("{0} path={1};", cookie, path);
            }
            if (isSecure) {
                cookie += " secure";
            }
            document.cookie = cookie;
        }
        IO.setCookie = setCookie;
    })(KLibrary.IO || (KLibrary.IO = {}));
    var IO = KLibrary.IO;

    (function (Uri) {
        function getTopDomain() {
            /// <summary>
            ///     現在の URL から、トップレベルのドメインを取得します。
            /// &#10;例えば abc.def.com の場合、def.com となります。
            /// </summary>
            /// <returns type="String" />

            var m = document.domain.match(/([^\.]+\.)?[^\.]+$/g);
            if (m == null) return "";
            return m[0];
        }
        Uri.getTopDomain = getTopDomain;

        function getQueryString() {
            /// <summary>
            ///     現在の URL から、クエリ文字列をディクショナリとして取得します。
            /// </summary>
            /// <returns type="Object" />

            var s = document.location.search;
            if (isNullOrEmpty(s)) return {};

            var d = s.trimLeft("?").split("&")
                .select(function (x) {
                    var p = x.split("=");
                    return { key: p[0].toLowerCase(), value: decodeURIComponent(p[1]) };
                })
                .groupByToDictionary(function (x) { return x.key; }, function (x) { return x.value; });
            for (var p in d) {
                d[p] = d[p].join(",");
            }
            return d;
        }
        Uri.getQueryString = getQueryString;

        function getAnchor() {
            /// <summary>
            ///     現在の URL から、アンカー (ハッシュ) を取得します。
            /// </summary>
            /// <returns type="String" />

            if (!document.location.hash || document.location.hash.charAt(0) != "#") return null;
            return document.location.hash.substring(1);
        }
        Uri.getAnchor = getAnchor;
    })(KLibrary.Uri || (KLibrary.Uri = {}));
    var Uri = KLibrary.Uri;
})(KLibrary || (KLibrary = {}));

(function ($) {
    $.ajaxGetByForm = function (url, data) {
        /// <summary>
        ///     フォーム形式のデータを GET メソッドで送信し、JSON 形式のデータを受信します。
        /// </summary>
        /// <param name="url" type="String">送信先の URL。</param>
        /// <param name="data" type="Object">送信するオブジェクト。</param>
        /// <returns type="Object" />

        return $.ajax(url, {
            type: "GET",
            data: data,
            dataType: "json"
        });
    };

    $.ajaxGetByJSON = function (url, data) {
        /// <summary>
        ///     JSON 形式のデータを GET メソッドで送信し、JSON 形式のデータを受信します。
        /// </summary>
        /// <param name="url" type="String">送信先の URL。</param>
        /// <param name="data" type="Object">送信するオブジェクト。</param>
        /// <returns type="Object" />

        return $.ajax(url, {
            type: "GET",
            data: data == null ? undefined : { q: JSON.stringify(data) },
            dataType: "json"
        });
    };

    $.ajaxInvokeByForm = function (url, data, method) {
        /// <summary>
        ///     フォーム形式のデータを送信し、JSON 形式のデータを受信します。
        /// </summary>
        /// <param name="url" type="String">送信先の URL。</param>
        /// <param name="data" type="Object">送信するオブジェクト。</param>
        /// <param name="method" type="String">HTTP メソッド。既定値は POST。</param>
        /// <returns type="Object" />

        return $.ajax(url, {
            type: method == null ? "POST" : method,
            data: data,
            dataType: "json"
        });
    };

    $.ajaxInvokeByJSON = function (url, data, method) {
        /// <summary>
        ///     JSON 形式のデータを送信し、JSON 形式のデータを受信します。
        /// </summary>
        /// <param name="url" type="String">送信先の URL。</param>
        /// <param name="data" type="Object">送信するオブジェクト。</param>
        /// <param name="method" type="String">HTTP メソッド。既定値は POST。</param>
        /// <returns type="Object" />

        return $.ajax(url, {
            type: method == null ? "POST" : method,
            data: data == null ? undefined : JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    $.fn.descendantsAndSelf = function (selector) {
        /// <summary>
        ///     この要素およびこの要素のすべての子孫要素から、セレクターで要素を抽出します。
        /// </summary>
        /// <param name="selector" type="String">セレクター。</param>
        /// <returns type="jQuery" />

        return this.filter(selector).add(this.find(selector));
    };

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

    $.fn.updateTarget = function () {
        /// <summary>
        ///     ソースからターゲットへデータを転送します。
        /// </summary>
        /// <returns type="jQuery" />

        this
            .descendantsAndSelf("[data-context]")
            .empty()
            .each(function (i) {
                var target = $(this);
                var source = eval(target.data("context"));
                if (source == null) return;

                var templateEl = target.data("template") ? $("#" + target.data("template")) : target.next("script:first");
                if (templateEl.length == 0) return;
                var template = templateEl.html();

                $(source)
                    .map(function () {
                        var formatted = KLibrary.formatObject(template, this, true);
                        return $(formatted).get();
                    })
                    .appendTo(target);
            });
        return this;
    };

    $.fn.bindData = function () {
        /// <summary>
        ///     この要素および子孫要素をデータにバインドします。
        /// </summary>
        /// <returns type="jQuery" />

        this
            .descendantsAndSelf("[data-context]")
            .each(function (i) {
                var target = $(this);
                var source = eval(target.data("context"));
                if (source == null) return;
                if ((source instanceof Object) && !(source instanceof KLibrary.Entity) && !(source instanceof Date)) {
                    source = eval(target.data("context") + " = KLibrary.toEntity(source);");
                }

                target.updateTarget();
                $(source).on("propertychanged", function (e, n, v) {
                    target.updateTarget();
                });
            });
        return this;
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
