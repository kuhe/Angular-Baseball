(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.yakyuu = {})));
}(this, (function (exports) { 'use strict';

    /**
     * A "component" here is any object that has an element property and a render method.
     * The render method should provide an HTMLElement which is assigned to the element property.
     *
     * The main reason being that the #render(component_t) function also provided here uses both fields
     * to perform a swap in the DOM tree node.
     *
     * @typedef {object} component_t
     * @property {HTMLElement|null} element
     * @method {Function<HTMLElement>} template
     */


    /**
     *
     * Creates elements zzz.
     *
     * @param {string} tag - name of the element type.
     * @example div
     *      createElement('div'); // equivalent to document.createElement('div');
     *
     * @param {string} [classNameOrAttributes=''] - css class name or an object of attributes.
     * @example class
     *      createElement('div', 'my-css-class');
     * @example attributes
     *      createElement('div', {
     *          click: function (event) {}; // event listeners use their event name as key.
     *          id: 'my-css-id',
     *          role: 'button'
     *      });
     *
     *
     * @param {string|HTMLElement|HTMLElement[]} [body] - string or elements to form the body.
     *        This is a rest parameter, and you may provide any of the following:
     *
     * @example one string
     *      createElement('div', {}, 'body content string');
     *
     * @example one or more HTMLElements or nested arrays thereof
     *
     *      createElement('div', {},
     *          div(), div(), null, div(), [div(), div(), [div(), div()]]
     *      );
     *      // the nested elements will all be normalized to a flat array of child nodes,
     *      // and falsy values will be ignored.
     *
     * @returns {HTMLElement}
     *
     */
    function createElement(tag, classNameOrAttributes/*, ...body*/) {

        var i = 2;
        var _c = classNameOrAttributes;
        var props;
        var className = _c || '';
        _c = _c || '';
        if (typeof _c === 'object') {
            if ('innerHTML' in _c || 'length' in _c) {
                --i;
                className = '';
            } else {
                props = _c;
                className = props.class || props.className || '';
                delete props.class;
                delete props.className;
            }
        }

        var el = document.createElement(tag);

        if (className) el.className = className;

        for (var k in props || {}) {
            var v = props[k];
            if (typeof v === 'function') {
                el.addEventListener(k, v);
                continue;
            }
            el.setAttribute(k, v);
        }

        for (; i < arguments.length; ++i) {
            var children = flatten(arguments[i]);
            for (var j = 0; j < children.length; ++j) {
                var child = children[j];
                if (typeof child === 'string' || typeof child === 'number') {
                    el.innerHTML += arguments[i];
                } else {
                    el.appendChild(child);
                }
            }
        }

        return el;

    }

    /**
     * @private
     * @param {*} arr - possibly nested array.
     * @returns {*[]}
     */
    function flatten(arr) {

        if (
            typeof arr !== 'object' ||
            !('length' in arr) ||
            ('innerHTML' in arr)
        ) {
            if (arr) {
                return [arr];
            }
            return [];
        }

        var out = [];

        var i = 0;
        for (; i < arr.length; ++i) {
            var item = arr[i];
            if (
                (typeof item === 'object') &&
                ('length' in item) &&
                !('innerHTML' in item)
            ) {
                Array.prototype.push.apply(out, flatten(item));
            } else if (item) {
                out.push(item);
            }
        }

        return out;

    }

    function classAdapter(conditionalNames) {
        return Object.keys(conditionalNames)
            .map(function (rule) {
            if (conditionalNames[rule]) {
                return rule;
            }
            return '';
        })
            .filter(Boolean)
            .join(' ');
    }

    function styleAdapter(css) {
        return Object.keys(css)
            .map(function (k) {
            return k + ": " + css[k];
        })
            .join(';');
    }

    var App = /** @class */ (function () {
        function App(game, translator) {
            this.game = game;
            this.translator = translator;
        }
        App.prototype.template = function () {
            var _this = this;
            var y = this.game;
            var t = this.translator;
            return (this.element = (createElement("div", { class: "container" },
                createElement("blocking", null),
                createElement("div", { class: "play-begins " + (this.begin ? '' : 'blocked') }),
                createElement("upper", null),
                createElement("div", { class: "main-area noselect row" },
                    createElement("field", null),
                    createElement("div", { class: "webgl-bg-container" }),
                    createElement("div", { class: "webgl-container" }),
                    createElement("div", { class: "row" },
                        createElement("div", { class: "col-md-4 background-color visible-lg visible-md" },
                            createElement("ul", { class: "list-group pitch-record" }, y.log.pitchRecord[this.mode()].map(function (event, i) {
                                return (createElement("li", { class: "list-group-item" }, i > 0 ? createElement("span", null, event) : createElement("strong", null, event)));
                            }))),
                        createElement("div", { class: "col-md-4" },
                            createElement("div", { class: "opponent-indicator" },
                                createElement("em", null, t('Opponent connected'))),
                            createElement("div", { class: 'windup ' + y.humanControl === 'none' ||
                                    y.humanBatting() ||
                                    y.opponentConnected
                                    ? 'winding'
                                    : '' }),
                            createElement("div", { class: "no-swing" },
                                createElement("div", { class: "input-area", click: function (e) { return _this.indicate(e); } }),
                                createElement("div", { class: "target live " + y.stage + " " + (function () {
                                        if (y.humanBatting()) {
                                            return 'batting';
                                        }
                                        if (y.humanPitching()) {
                                            return 'pitching';
                                        }
                                    })() }),
                                createElement("div", { class: "indicator baseball pitch hide" }),
                                createElement("div", { class: "indicator baseball break hide" }),
                                createElement("div", { class: 'indicator swing player ' +
                                        classAdapter({
                                            left: y.batterRunner.bats === 'left',
                                            right: y.batterRunner.bats === 'right',
                                            hide: y.humanBatting() || y.swingResult.looking
                                        }), style: styleAdapter({
                                        top: 200 - y.pitchInFlight.y - y.swingResult.y + 'px',
                                        left: y.pitchInFlight.x + y.swingResult.x + 'px',
                                        transform: 'rotate(' +
                                            y.swingResult.angle +
                                            'deg) rotateY(' +
                                            (y.batterRunner.bats == 'left' ? 12 : -12) +
                                            'deg)'
                                    }) }),
                                createElement("div", { class: 'indicator swing stance-indicator opponent ' +
                                        classAdapter({
                                            left: y.batter.bats == 'left',
                                            right: y.batter.bats == 'right',
                                            hide: !y.humanBatting()
                                        }) }),
                                createElement("div", { class: 'indicator glove stance-indicator hide ' +
                                        classAdapter({
                                            left: y.pitcher.team.positions.catcher.throws == 'left',
                                            right: y.pitcher.team.positions.catcher.throws == 'right',
                                            hide: !y.humanPitching()
                                        }) }),
                                createElement("div", { class: 'strikezone ' + (function () { })() }, (function () {
                                    if (_this.showMessage) {
                                        return createElement("span", { class: "strikezone-message" }, t('Click Here'));
                                    }
                                })())),
                            createElement("div", { class: "centered" },
                                createElement("div", { class: 'batter-stats ' +
                                        classAdapter({
                                            lefty: y.batter.bats === 'left',
                                            righty: y.batter.bats === 'right'
                                        }) },
                                    y.batter.bats === 'left' && !y.opponentConnected && y.humanBatting() ? (createElement("button", { class: 'btn small batter-ready ' +
                                            classAdapter({ disabled: !y.batter.ready }), click: function () {
                                            y.batterReady(!y.batter.ready);
                                        } }, t('Batter Ready'))) : (''),
                                    createElement("section", { class: "inline-block" },
                                        createElement("strong", null, y.batter.getName()),
                                        createElement("br", null),
                                        (function () {
                                            if (y.batter.bats !== 'left') {
                                                return '';
                                            }
                                            return ((y.batter.hero ? (createElement("span", { class: "glyphicon glyphicon-chevron-up" })) : ('')) + t('LHB'));
                                        })(),
                                        createElement("span", { class: "defining anti-color" }, y.batter.getDefiningBattingCharacteristic()),
                                        (function () {
                                            if (y.batter.bats !== 'right') {
                                                return '';
                                            }
                                            return ((y.batter.hero ? (createElement("span", { class: "glyphicon glyphicon-chevron-up" })) : ('')) + t('RHB'));
                                        })()),
                                    y.batter.bats === 'right' && !y.opponentConnected && y.humanBatting() ? (createElement("button", { class: 'btn small batter-ready ' +
                                            classAdapter({ disabled: !y.batter.ready }), click: function () {
                                            y.batterReady(!y.batter.ready);
                                        } }, t('Batter Ready'))) : ('')))),
                        createElement("div", { class: "col-md-4 background-color visible-lg visible-md" },
                            createElement("ul", { class: "list-group pitch-record" }, y.log.shortRecord[this.mode()].map(function (event, i) {
                                return (createElement("li", { class: "list-group-item" }, i > 0 ? createElement("span", null, event) : createElement("strong", null, event)));
                            }))))),
                createElement("lower", null))));
        };
        App.prototype.indicate = function (event) {
            // todo
        };
        App.prototype.mode = function () {
            return this.translator.mode;
        };
        return App;
    }());

    function main() {
        var Baseball = window.Baseball;
        var game = new Baseball.Game();
        var app = new App(game, Baseball.util.text);
        document.body.appendChild(app.template());
        return 0;
    }
    window.main = main;

    exports.main = main;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
