/*
* TileButton.js 1.1.61
* Copyright © 2012, Keiho Sakapon.
*
* Prerequisites:
*     jQuery 1.7.2 (or later)
*     KLibrary.js 1.1.61
*/

var TileButton;
(function (TileButton) {
    // ページの前景色。
    TileButton.bodyForeColor = "#000";
    // ページの背景色。
    TileButton.bodyBackColor = "#FFF";
    // アクセント カラー。
    TileButton.accentColor = "#1BA1E2";
})(TileButton || (TileButton = {}));

(function ($) {
    var nsCss = KLibrary.Css;
    var nsIO = KLibrary.IO;

    $.fn.tileButton = function () {
        /// <summary>
        ///     この要素および子孫要素に Tile Button を設定します。
        /// </summary>
        /// <returns type="jQuery" />

        TileButton.bodyForeColor = nsIO.getCookie("TileBodyForeColor", TileButton.bodyForeColor);
        TileButton.bodyBackColor = nsIO.getCookie("TileBodyBackColor", TileButton.bodyBackColor);
        TileButton.accentColor = nsIO.getCookie("TileAccentColor", TileButton.accentColor);
        setBodyColor();
        setAccentColor();

        this.descendantsAndSelf(".tile-body-color")
            .click(function () {
                TileButton.bodyForeColor = $(this).data("foreColor");
                TileButton.bodyBackColor = $(this).data("backColor");
                setBodyColor();
                nsIO.setCookie("TileBodyForeColor", TileButton.bodyForeColor);
                nsIO.setCookie("TileBodyBackColor", TileButton.bodyBackColor);
            });
        this.descendantsAndSelf(".tile-accent-color")
            .click(function () {
                TileButton.accentColor = $(this).css("background-color");
                setAccentColor();
                nsIO.setCookie("TileAccentColor", TileButton.accentColor);
            });
        setVisualStates(this.descendantsAndSelf(".tile-text"), "tile-text-pressed", 0.55);
        setVisualStates(this.descendantsAndSelf(".tile-image"), "tile-image-pressed", 0.55);
        setVisualStates(this.descendantsAndSelf(".tile-body-color"), "tile-body-color-pressed", 0.55);
        setVisualStates(this.descendantsAndSelf(".tile-accent-color"), "tile-accent-color-pressed", 0.55);
        this.busyIndicator();
        return this;
    };

    function setBodyColor() {
        /// <summary>
        ///     背景色を設定します。
        /// </summary>

        nsCss.setCssRules("TileBodyColorStyle",
            nsCss.createCssRule("body", KLibrary.format("color: {0}; background-color: {1};", TileButton.bodyForeColor, TileButton.bodyBackColor)),
            nsCss.createCssRule(".tile-text, .tile-image, .tile-body-color, .tile-accent-color", KLibrary.format("border-color: {0};", TileButton.bodyBackColor)));
    }

    function setAccentColor() {
        /// <summary>
        ///     アクセント カラーを設定します。
        /// </summary>

        nsCss.setCssRules("TileAccentColorStyle",
            nsCss.createCssRule(".tile-text, .tile-image, .tile-body-color, .tile-accent-color", KLibrary.format("background-color: {0};", TileButton.accentColor)),
            nsCss.createCssRule(".accent-fore-color", KLibrary.format("color: {0};", TileButton.accentColor)),
            nsCss.createCssRule(".accent-back-color, .busy-line div, .busy-roll div", KLibrary.format("background-color: {0};", TileButton.accentColor)),
            nsCss.createCssRule(".accent-border-color", KLibrary.format("border-color: {0};", TileButton.accentColor)),
            nsCss.createCssRule("::selection", KLibrary.format("background-color: {0};", TileButton.accentColor)));
    }

    function setVisualStates(jQuery, activeClass, focusOpacity) {
        /// <summary>
        ///     表示状態を設定します。
        /// </summary>
        /// <param name="jQuery" type="jQuery">jQuery。</param>
        /// <param name="activeClass" type="String">アクティブ状態に適用するクラスの名前。</param>
        /// <param name="focusOpacity" type="String">フォーカスまたはホバー状態に適用する不透明度。</param>

        jQuery
            .focusin(function () { $(this).fadeTo(0, focusOpacity); })
            .focusout(function () { $(this).fadeTo(0, 1).removeClass(activeClass); })
            .mouseover(function () { $(this).fadeTo(0, focusOpacity); })
            .mouseout(function () { $(this).fadeTo(0, 1).removeClass(activeClass); })
            .mousedown(function () { $(this).fadeTo(0, 1).addClass(activeClass); })
            .mouseup(function () { $(this).fadeTo(0, focusOpacity).removeClass(activeClass); })
            .keydown(function (e) { if (e.keyCode == 13 || this.tagName.toUpperCase() != "A" && e.keyCode == 32) $(this).fadeTo(0, 1).addClass(activeClass); })
            .keyup(function (e) { if (e.keyCode == 13 || this.tagName.toUpperCase() != "A" && e.keyCode == 32) $(this).fadeTo(0, focusOpacity).removeClass(activeClass); })
            ;
    }

    var busyRollPoints = [{ left: 15, top: 5 }, { left: 24, top: 10 }, { left: 24, top: 20 }, { left: 15, top: 25 }, { left: 6, top: 20 }, { left: 6, top: 10}];
    var busyRollMovePoints = $(busyRollPoints)
        .map(function () {
            var p = {};
            KLibrary.copyObject(this, p);
            p.left = p.left - 1;
            p.top = p.top - 1;
            return p;
        })
        .get();

    $.fn.busyIndicator = function () {
        /// <summary>
        ///     この要素および子孫要素に Busy Indicator を設定します。
        /// </summary>
        /// <returns type="jQuery" />

        this.descendantsAndSelf(".busy-line")
            .append($("<div></div><div></div><div></div><div></div><div></div>"))
            .children("div")
            .each(function (i) {
                runBusyLine($(this).delay(160 * i));
            });

        var busyRollDivs = $(busyRollPoints)
            .map(function () { return $("<div></div>").css(this).get(); })
            .add($("<div></div>").css(busyRollMovePoints[5]).addClass("busy-roll-move"));
        var busyRoll = this.descendantsAndSelf(".busy-roll")
            .append(busyRollDivs);
        runBusyRoll(busyRoll.children("div.busy-roll-move"), 0);

        return this;
    };

    function runBusyLine(jQuery) {
        /// <summary>
        ///     直線状の Busy Indicator のアニメーションを開始します。
        /// </summary>
        /// <param name="jQuery" type="jQuery">移動する点を表す jQuery。</param>

        var width = $("body").width() - 14;
        jQuery
            .animate({ left: 0.4 * width }, 1000)
            .animate({ left: 0.6 * width }, 1500, "linear")
            .animate({ left: width }, 1000)
            .animate({ left: 0 }, 0, null, function () { runBusyLine(jQuery); });
    }

    function runBusyRoll(jQuery, i) {
        /// <summary>
        ///     回転する Busy Indicator のアニメーションを開始します。
        /// </summary>
        /// <param name="jQuery" type="jQuery">移動する点を表す jQuery。</param>
        /// <param name="i" type="Number">点の番号。</param>

        jQuery
            .delay(200)
            .animate(busyRollMovePoints[i], 0, null, function () { runBusyRoll(jQuery, (i + 1) % 6); });
    }
})(jQuery);
