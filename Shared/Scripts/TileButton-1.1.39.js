/*
* TileButton.js 1.1.39
* Copyright © 2012, Keiho Sakapon.
*
* Prerequisites:
*     jQuery 1.7.2 (or later)
*     KLibrary.js 1.1.39
*/

var TileButton;
(function (TileButton) {
    // ページの前景色。
    TileButton.bodyForeColor = "#101010";
    // ページの背景色。
    TileButton.bodyBackColor = "#F0F0F0";
    // アクセント カラー。
    TileButton.accentColor = "#1BA1E2";
})(TileButton || (TileButton = {}));

(function ($) {
    $.fn.tileButton = function () {
        /// <summary>
        ///     子孫要素にタイル ボタンを設定します。
        /// </summary>
        /// <returns type="jQuery" />

        TileButton.bodyForeColor = KLibrary.IO.getCookie("TileBodyForeColor", TileButton.bodyForeColor);
        TileButton.bodyBackColor = KLibrary.IO.getCookie("TileBodyBackColor", TileButton.bodyBackColor);
        TileButton.accentColor = KLibrary.IO.getCookie("TileAccentColor", TileButton.accentColor);

        setBodyColor();
        setAccentColor();
        this.find(".tile-body-color")
            .click(function () {
                TileButton.bodyForeColor = $(this).data("foreColor");
                TileButton.bodyBackColor = $(this).data("backColor");
                setBodyColor();
                KLibrary.IO.setCookie("TileBodyForeColor", TileButton.bodyForeColor);
                KLibrary.IO.setCookie("TileBodyBackColor", TileButton.bodyBackColor);
            });
        this.find(".tile-accent-color")
            .click(function () {
                TileButton.accentColor = $(this).css("background-color");
                setAccentColor();
                KLibrary.IO.setCookie("TileAccentColor", TileButton.accentColor);
            });
        setVisualStates(this.find(".tile-text"), "tile-text-pressed", 0.55);
        setVisualStates(this.find(".tile-image"), "tile-image-pressed", 0.55);
        setVisualStates(this.find(".tile-body-color"), "tile-body-color-pressed", 0.55);
        setVisualStates(this.find(".tile-accent-color"), "tile-accent-color-pressed", 0.55);
        return this;
    };

    function setBodyColor() {
        /// <summary>
        ///     背景色を設定します。
        /// </summary>

        KLibrary.Css.setCssRules("TileBodyColorStyle",
            KLibrary.Css.createCssRule("body", KLibrary.format("color: {0}; background-color: {1};", TileButton.bodyForeColor, TileButton.bodyBackColor)),
            KLibrary.Css.createCssRule(".tile-text, .tile-image, .tile-body-color, .tile-accent-color", KLibrary.format("border-color: {0};", TileButton.bodyBackColor)));
    }

    function setAccentColor() {
        /// <summary>
        ///     アクセント カラーを設定します。
        /// </summary>

        KLibrary.Css.setCssRules("TileAccentColorStyle",
            KLibrary.Css.createCssRule(".tile-text, .tile-image, .tile-body-color, .tile-accent-color", KLibrary.format("background-color: {0};", TileButton.accentColor)),
            KLibrary.Css.createCssRule(".accent-fore-color", KLibrary.format("color: {0};", TileButton.accentColor)),
            KLibrary.Css.createCssRule(".accent-back-color", KLibrary.format("background-color: {0};", TileButton.accentColor)),
            KLibrary.Css.createCssRule(".accent-border-color", KLibrary.format("border-color: {0};", TileButton.accentColor)),
            KLibrary.Css.createCssRule("::selection", KLibrary.format("background-color: {0};", TileButton.accentColor)));
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
})(jQuery);
