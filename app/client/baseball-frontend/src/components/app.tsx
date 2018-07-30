import { createElement, component_t } from 'nominal-create-element/createElement.esm';
import { classAdapter } from './adapter/class';
import { styleAdapter } from './adapter/style';
import { Baseball } from '../core/baseball';

// todo remove jquery
const $ = (window as any).$;

export class App implements component_t {
    public element: HTMLElement;

    public showMessage: boolean = true;
    public holdUpTimeouts: any[];
    public begin: boolean = false;
    public expandScoreboard: boolean = false;
    public allowInput: boolean = true;
    public lastTimeout: number = -1;
    public showDifficultySelection: boolean = false;

    public constructor(public game: any, public translator: any) {
        if (localStorage) {
            const storedMode = localStorage.__$yakyuuaikoukai_text_mode;
            if (storedMode === 'e' || storedMode === 'n') {
                this.mode(storedMode);
            }
        }
        game.updateFlightPath = this.updateFlightPath = Baseball.service.Animator.updateFlightPath.bind(this);

        const bat = $('.target .swing.stance-indicator');
        const showBat = function (event) {
            if (game.humanBatting()) {
                const offset = $('.target').offset();
                const relativeOffset = {
                    x: event.pageX - offset.left,
                    y: 200 - (event.pageY - offset.top)
                };
                const angle = game.setBatAngle(relativeOffset.x, relativeOffset.y);
                bat.css({
                    top: 200 - relativeOffset.y + "px",
                    left: relativeOffset.x + "px",
                    transform: "rotate(" + angle + "deg) rotateY(" + (game.batter.bats == "left" ? 0 : -0) + "deg)"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    bat.hide();
                } else {
                    bat.show();
                }
            }
        };
        const glove = $('.target .glove.stance-indicator');
        const showGlove = function (event) {
            if (game.humanPitching()) {
                const offset = $('.target').offset();
                const relativeOffset = {
                    x: event.pageX - offset.left,
                    y: 200 - (event.pageY - offset.top)
                };
                glove.css({
                    top: 200 - relativeOffset.y + "px",
                    left: relativeOffset.x + "px"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    glove.hide();
                } else {
                    glove.show();
                }
            }
        };

        game.startOpponentPitching = function (callback) {
            game.updateFlightPath(callback);
        };
        game.umpire.onSideChange = function () {
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

    public template(): HTMLElement {
        const y = this.game;
        const t = this.translator;
        return (this.element = (
            <div class="container">
                <blocking />
                <div class={`play-begins ${this.begin ? '' : 'blocked'}`} />
                <upper />
                <div class="main-area noselect row">
                    <field />
                    <div class="webgl-bg-container" />
                    <div class="webgl-container" />
                    <div class="row">
                        <div class="col-md-4 background-color visible-lg visible-md">
                            <ul class="list-group pitch-record">
                                {y.log.pitchRecord[this.mode()].map((event, i) => {
                                    return (
                                        <li class="list-group-item">
                                            {i > 0 ? <span>{event}</span> : <strong>{event}</strong>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div class="col-md-4">
                            <div class="opponent-indicator">
                                <em>{t('Opponent connected')}</em>
                            </div>
                            <div
                                class={
                                    'windup ' + y.humanControl === 'none' ||
                                    y.humanBatting() ||
                                    y.opponentConnected
                                        ? 'winding'
                                        : ''
                                }
                            />
                            <div class="no-swing">
                                <div class="input-area" click={e => this.indicate(e)} />
                                <div
                                    class={`target live ${y.stage} ${(() => {
                                        if (y.humanBatting()) {
                                            return 'batting';
                                        }
                                        if (y.humanPitching()) {
                                            return 'pitching';
                                        }
                                    })()}`}
                                />
                                <div class="indicator baseball pitch hide" />
                                <div class="indicator baseball break hide" />
                                <div
                                    class={
                                        'indicator swing player ' +
                                        classAdapter({
                                            left: y.batterRunner.bats === 'left',
                                            right: y.batterRunner.bats === 'right',
                                            hide: y.humanBatting() || y.swingResult.looking
                                        })
                                    }
                                    style={styleAdapter({
                                        top: 200 - y.pitchInFlight.y - y.swingResult.y + 'px',
                                        left: y.pitchInFlight.x + y.swingResult.x + 'px',
                                        transform:
                                            'rotate(' +
                                            y.swingResult.angle +
                                            'deg) rotateY(' +
                                            (y.batterRunner.bats == 'left' ? 12 : -12) +
                                            'deg)'
                                    })}
                                />
                                <div
                                    class={
                                        'indicator swing stance-indicator opponent ' +
                                        classAdapter({
                                            left: y.batter.bats == 'left',
                                            right: y.batter.bats == 'right',
                                            hide: !y.humanBatting()
                                        })
                                    }
                                />
                                <div
                                    class={
                                        'indicator glove stance-indicator hide ' +
                                        classAdapter({
                                            left: y.pitcher.team.positions.catcher.throws == 'left',
                                            right: y.pitcher.team.positions.catcher.throws == 'right',
                                            hide: !y.humanPitching()
                                        })
                                    }
                                />
                                <div class={'strikezone ' + (() => {})()}>
                                    {(() => {
                                        if (this.showMessage) {
                                            return <span class="strikezone-message">{t('Click Here')}</span>;
                                        }
                                    })()}
                                </div>
                            </div>
                            <div class="centered">
                                <div
                                    class={
                                        'batter-stats ' +
                                        classAdapter({
                                            lefty: y.batter.bats === 'left',
                                            righty: y.batter.bats === 'right'
                                        })
                                    }
                                >
                                    {y.batter.bats === 'left' && !y.opponentConnected && y.humanBatting() ? (
                                        <button
                                            class={
                                                'btn small batter-ready ' +
                                                classAdapter({ disabled: !y.batter.ready })
                                            }
                                            click={() => {
                                                y.batterReady(!y.batter.ready);
                                            }}
                                        >
                                            {t('Batter Ready')}
                                        </button>
                                    ) : (
                                        ''
                                    )}
                                    <section class="inline-block">
                                        <strong>{y.batter.getName()}</strong>
                                        <br />
                                        {(() => {
                                            if (y.batter.bats !== 'left') {
                                                return '';
                                            }
                                            return (
                                                (y.batter.hero ? (
                                                    <span class="glyphicon glyphicon-chevron-up" />
                                                ) : (
                                                    ''
                                                )) + t('LHB')
                                            );
                                        })()}
                                        <span class="defining anti-color">
                                            {y.batter.getDefiningBattingCharacteristic()}
                                        </span>
                                        {(() => {
                                            if (y.batter.bats !== 'right') {
                                                return '';
                                            }
                                            return (
                                                (y.batter.hero ? (
                                                    <span class="glyphicon glyphicon-chevron-up" />
                                                ) : (
                                                    ''
                                                )) + t('RHB')
                                            );
                                        })()}
                                    </section>
                                    {y.batter.bats === 'right' && !y.opponentConnected && y.humanBatting() ? (
                                        <button
                                            class={
                                                'btn small batter-ready ' +
                                                classAdapter({ disabled: !y.batter.ready })
                                            }
                                            click={() => {
                                                y.batterReady(!y.batter.ready);
                                            }}
                                        >
                                            {t('Batter Ready')}
                                        </button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 background-color visible-lg visible-md">
                            <ul class="list-group pitch-record">
                                {y.log.shortRecord[this.mode()].map((event, i) => {
                                    return (
                                        <li class="list-group-item">
                                            {i > 0 ? <span>{event}</span> : <strong>{event}</strong>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <lower />
            </div>
        ));
    }

    public holdUp(): void {
        (document.querySelector('.input-area') as HTMLDivElement).click();
    }

    public updateFlightPath(): void {
        throw new Error('delayed binding');
    }

    public indicate(event: Event & any): void {
        const { game } = this;
        if (!this.allowInput) {
            return;
        }
        if (game.humanPitching()) {
            this.allowInput = false;
            game.pitcher.windingUp = false;
        }
        if (game.pitcher.windingUp) {
            return;
        }
        const offset = $('.target').offset();
        const relativeOffset = {
            x: event.pageX - offset.left,
            y: 200 - (event.pageY - offset.top)
        };
        clearTimeout(this.lastTimeout);
        while (this.holdUpTimeouts.length) {
            clearTimeout(this.holdUpTimeouts.shift());
        }
        this.showMessage = false;
        game.receiveInput(relativeOffset.x, relativeOffset.y, function (callback) {
            game.updateFlightPath(callback);
        });
    }

    private mode(mode?: string): string {
        if (mode) {
            this.translator.mode = mode;
        }
        return this.translator.mode || 'e';
    }
}
