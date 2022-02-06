import { ChangeDetectionStrategy, Component } from '@angular/core';
import Baseball from './baseball-lib';
import { ModeComponent } from './mode/mode.component';
import {UserIdleDetector} from "../services/UserIdleDetector";

declare function require(file: string): any;
const TweenMax = require('gsap/TweenMax');

const $win95 = window as any;

$win95.TweenMax = TweenMax;
const $: any = $win95.$;

/**
 *
 * Shoe-horn angular1 code into angular5 :).
 * @param $scope
 *
 */
const IndexController = function($scope) {
    const text = Baseball.util.text;
    const Game = Baseball.Game;

    if (!~$win95.location.toString().indexOf('localhost') &&
        !~$win95.location.protocol.indexOf('https')) {
        $win95.location.protocol = 'https:';
    }

    $win95.s = $scope;
    $scope.t = text;
    $scope.y = new Game();

    if (localStorage) {
        const storedMode = localStorage.__$yakyuuaikoukai_text_mode;
        if (storedMode === 'e' || storedMode === 'n') {
            $scope.mode(storedMode);
        }
    }

    $scope.abbreviatePosition = Baseball.util.text.abbreviatePosition;
};

@Component({
    selector: 'application-hook',
    templateUrl: './app.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent extends ModeComponent {
    y: any; // {Baseball.model.Game}
    t: (translationString: string) => string;

    constructor() {
        super();
        IndexController(this);
        referenceContainer.instance = this;
        this.idleDetector.start();
    }

    idleDetector: UserIdleDetector = new UserIdleDetector();
    holdUpTimeouts: number[];
    begin: boolean;
    expandScoreboard: boolean;
    updateFlightPath:  (callback: () => void) => void;
    allowInput: boolean;
    holdUp: () => void;
    indicate: (event: { pageY: number, pageX: number }) => void;

    /**
     * Carryover from angular 1 code.
     */
    bindMethods() {
        const $scope = this;
        const Animator = Baseball.service.Animator;
        $scope.begin = true;
        const game = $scope.y;
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        game.updateFlightPath = $scope.updateFlightPath = Animator.updateFlightPath.bind($scope);

        // avoid scope cycles, any other easy way?
        const bat = $('.target .swing.stance-indicator');
        const showBat = function(event) {
            if (game.humanBatting()) {
                const offset = $('.target').offset();
                const relativeOffset = {
                    x: event.pageX - offset.left,
                    y: 200 - (event.pageY - offset.top)
                };
                const angle = game.setBatAngle(relativeOffset.x, relativeOffset.y);
                bat.css({
                    top: 200 - relativeOffset.y + 'px',
                    left: relativeOffset.x + 'px',
                    transform:
                        'rotate(' +
                        angle +
                        'deg) rotateY(' +
                        (game.batter.bats == 'left' ? 0 : -0) +
                        'deg)'
                });
                if (
                    relativeOffset.x > 200 ||
                    relativeOffset.x < 0 ||
                    relativeOffset.y > 200 ||
                    relativeOffset.y < 0
                ) {
                    bat.hide();
                } else {
                    bat.show();
                }
            }
        };
        const glove = $('.target .glove.stance-indicator');
        const showGlove = function(event) {
            if (game.humanPitching()) {
                const offset = $('.target').offset();
                const relativeOffset = {
                    x: event.pageX - offset.left,
                    y: 200 - (event.pageY - offset.top)
                };
                glove.css({
                    top: 200 - relativeOffset.y + 'px',
                    left: relativeOffset.x + 'px'
                });
                if (
                    relativeOffset.x > 200 ||
                    relativeOffset.x < 0 ||
                    relativeOffset.y > 200 ||
                    relativeOffset.y < 0
                ) {
                    glove.hide();
                } else {
                    glove.show();
                }
            }
        };

        $scope.allowInput = true;
        $scope.holdUp = function() {
            $('.input-area').click();
        };
        game.startOpponentPitching = function(callback) {
            $scope.updateFlightPath(callback);
        };
        $scope.indicate = function($event) {
            if (!$scope.allowInput) {
                return;
            }
            if (game.humanPitching()) {
                $scope.allowInput = false;
                game.pitcher.windingUp = false;
            }
            if (game.pitcher.windingUp) {
                return;
            }
            var offset = $('.target').offset();
            var relativeOffset = {
                x: $event.pageX - offset.left,
                y: 200 - ($event.pageY - offset.top)
            };
            clearTimeout($scope.lastTimeout);
            while ($scope.holdUpTimeouts.length) {
                clearTimeout($scope.holdUpTimeouts.shift());
            }
            $scope.showMessage = false;
            game.receiveInput(relativeOffset.x, relativeOffset.y, function(callback) {
                $scope.updateFlightPath(callback);
            });
        };
        game.umpire.onSideChange = function() {
            if (game.humanBatting()) {
                $('.input-area').mousemove(showBat);
            } else {
                $('.input-area').unbind('mousemove', showBat);
                bat.hide();
            }
            if (game.humanPitching()) {
                $('.input-area').mousemove(showGlove);
            } else {
                $('.input-area').unbind('mousemove', showGlove);
                glove.hide();
            }
        };
        game.umpire.onSideChange();
    }

    showMessage: boolean;
    lastTimeout: number;
    showDifficultySelection: boolean;
}

export const referenceContainer: { instance: AppComponent } = {
    instance: null
};
