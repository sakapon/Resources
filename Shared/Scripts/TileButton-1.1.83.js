/*
* TileButton.js 1.1.83
* Copyright © 2012, Keiho Sakapon.
*
* Prerequisites:
*     jQuery 1.7.2 (or later)
*     KLibrary.js 1.1.83
*/

(function ($) {
    var nsCss = KLibrary.Css;
    var nsIO = KLibrary.IO;
    var topDomain = KLibrary.Uri.getTopDomain();
    if (topDomain == "localhost") topDomain = null;

    var settings = {
        // ページの前景色。
        bodyForeColor: "#000",
        // ページの背景色。
        bodyBackColor: "#FFF",
        // アクセント カラー。
        accentColor: "#1BA1E2"
    };
    $.tileButton = { settings: settings };

    $.fn.tileButton = function (options) {
        /// <summary>
        ///     この要素の子孫要素に Tile Button を設定します。
        /// </summary>
        /// <param name="options" type="Object">
        ///     設定値のオプション。
        /// &#10;    bodyForeColor: ページの前景色。
        /// &#10;    bodyBackColor: ページの背景色。
        /// &#10;    accentColor: アクセント カラー。
        /// </param>
        /// <returns type="jQuery" />

        $.extend(settings, options);
        settings.bodyForeColor = nsIO.getCookie("TileBodyForeColor", settings.bodyForeColor);
        settings.bodyBackColor = nsIO.getCookie("TileBodyBackColor", settings.bodyBackColor);
        settings.accentColor = nsIO.getCookie("TileAccentColor", settings.accentColor);
        setBodyColor();
        setAccentColor();

        this.on("click", ".tile-body-color", function () {
            settings.bodyForeColor = $(this).data("foreColor");
            settings.bodyBackColor = $(this).data("backColor");
            setBodyColor();
            nsIO.setCookie("TileBodyForeColor", settings.bodyForeColor, 365, topDomain, "/");
            nsIO.setCookie("TileBodyBackColor", settings.bodyBackColor, 365, topDomain, "/");
        });
        this.on("click", ".tile-accent-color", function () {
            settings.accentColor = $(this).css("background-color");
            setAccentColor();
            nsIO.setCookie("TileAccentColor", settings.accentColor, 365, topDomain, "/");
        });
        setVisualStates(this, ".tile-text", "tile-text-pressed", 0.55);
        setVisualStates(this, ".tile-image", "tile-image-pressed", 0.55);
        setVisualStates(this, ".tile-body-color", "tile-body-color-pressed", 0.55);
        setVisualStates(this, ".tile-accent-color", "tile-accent-color-pressed", 0.55);
        this.busyIndicator();
        return this;
    };

    function setBodyColor() {
        /// <summary>
        ///     背景色を設定します。
        /// </summary>

        nsCss.setCssRules("TileBodyColorStyle",
            nsCss.createCssRule("body", KLibrary.format("color: {0}; background-color: {1};", settings.bodyForeColor, settings.bodyBackColor)),
            nsCss.createCssRule(".tile-text, .tile-image, .tile-body-color, .tile-accent-color", KLibrary.format("border-color: {0};", settings.bodyBackColor)));
    }

    function setAccentColor() {
        /// <summary>
        ///     アクセント カラーを設定します。
        /// </summary>

        nsCss.setCssRules("TileAccentColorStyle",
            nsCss.createCssRule(".tile-text, .tile-image, .tile-body-color, .tile-accent-color", KLibrary.format("background-color: {0};", settings.accentColor)),
            nsCss.createCssRule(".accent-fore-color", KLibrary.format("color: {0};", settings.accentColor)),
            nsCss.createCssRule(".accent-back-color, .busy-line div, .busy-roll div", KLibrary.format("background-color: {0};", settings.accentColor)),
            nsCss.createCssRule(".accent-border-color", KLibrary.format("border-color: {0};", settings.accentColor)),
            nsCss.createCssRule("::selection", KLibrary.format("background-color: {0};", settings.accentColor)));
    }

    function setVisualStates($element, selector, activeClass, focusOpacity) {
        /// <summary>
        ///     表示状態を設定します。
        /// </summary>
        /// <param name="$element" type="jQuery">jQuery。</param>
        /// <param name="selector" type="String">適用対象となるセレクター。</param>
        /// <param name="activeClass" type="String">アクティブ状態に適用するクラスの名前。</param>
        /// <param name="focusOpacity" type="String">フォーカスまたはホバー状態に適用する不透明度。</param>

        $element
            .on("focusin", selector, function () { $(this).fadeTo(0, focusOpacity); })
            .on("focusout", selector, function () { $(this).fadeTo(0, 1).removeClass(activeClass); })
            .on("mouseover", selector, function () { $(this).fadeTo(0, focusOpacity); })
            .on("mouseout", selector, function () { $(this).fadeTo(0, 1).removeClass(activeClass); })
            .on("mousedown", selector, function () { $(this).fadeTo(0, 1).addClass(activeClass); })
            .on("mouseup", selector, function () { $(this).fadeTo(0, focusOpacity).removeClass(activeClass); })
            .on("keydown", selector, function (e) { if (e.keyCode == 13 || this.tagName.toUpperCase() != "A" && e.keyCode == 32) $(this).fadeTo(0, 1).addClass(activeClass); })
            .on("keyup", selector, function (e) { if (e.keyCode == 13 || this.tagName.toUpperCase() != "A" && e.keyCode == 32) $(this).fadeTo(0, focusOpacity).removeClass(activeClass); })
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

        this.descendantsAndSelf(".busy-line, .busy-roll").hide();
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
