import { createElement, component_t } from 'nominal-create-element.esm';
import { classAdapter } from './adapter/class';
import { styleAdapter } from './adapter/style';

export class App implements component_t {
    public element: HTMLElement;

    public constructor(public game: any, public translator: any) {}
    private showMessage: boolean;
    private begin: boolean;

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
                                {y.log.pitchRecord[y.mode()].map((event, i) => {
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
                                    y.opponentConneccted
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
                                {y.log.shortRecord[y.mode()].map((event, i) => {
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

    private indicate(event: Event): void {
        // todo
    }
}
