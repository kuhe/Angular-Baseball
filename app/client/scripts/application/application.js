import ng from '@angular/core';

import 'core-js/client/shim.min'
import 'zone.js/dist/zone';
import Reflect from 'reflect-metadata/Reflect';
window.Reflect = Reflect;

import 'rxjs/bundles/Rx.umd';

import '@angular/core/bundles/core.umd';
import '@angular/common/bundles/common.umd';
import '@angular/compiler/bundles/compiler.umd';
import '@angular/platform-browser/bundles/platform-browser.umd';
import '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd';

import 'gsap/src/uncompressed/TweenMax';
import 'three';

import IndexController from './controllers/IndexController';
import BattersDirective from './directives/battersData';
import BatteryDirective from './directives/batteryData';
import FieldDirective from './directives/field';
import FlagDirective from './directives/flag';
import RatingBlockDirective from './directives/ratingBlock';
import ScoreboardDirective from './directives/scoreboard';

import './services/SocketService';
import './services/ToIterable';

import { cacheKey } from './cacheKey';

window.cacheKey = cacheKey;

// Angular 1.x
if (typeof angular === 'object') {

    var app = angular.module('YakyuuAikoukai', ['directives'])
        .controller('IndexController', ['$scope', IndexController]);

    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{{');
        $interpolateProvider.endSymbol('}}');
    });

    angular.module('directives', [])
        .directive('scoreboard', ScoreboardDirective)
        .directive('batters', BattersDirective)
        .directive('battery', BatteryDirective)
        .directive('field', FieldDirective)
        .directive('ratingBlock', RatingBlockDirective)
        .directive('teamFlag', FlagDirective);

} else { // Angular 2+

    (function(app) {
        document.addEventListener('DOMContentLoaded', function() {
            ng.core.enableProdMode();
            ng.platformBrowserDynamic.bootstrap(app.Main);
        });
    })(window.app || (window.app = {}));

}