import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModeComponent} from '../mode/mode.component';
import {referenceContainer} from '../app.component';

@Component({
    selector: 'lower',
    templateUrl: './lower.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class LowerComponent extends ModeComponent implements OnInit {

    y: any;
    t: any;

    message: string = '';

    constructor() {
        super();
    }

    ngOnInit() {
    }

    /* Forwarded methods section */

    set showDifficultySelection(value: boolean) {
        referenceContainer.instance.showDifficultySelection = value;
    }
    get showDifficultySelection(): boolean {
        return referenceContainer.instance.showDifficultySelection;
    }
    selectPitch(...args: any[]): void {
        referenceContainer.instance.y.selectPitch(...args);
    }
    selectSubstitute(...args: any[]): void {
        referenceContainer.instance.y.selectSubstitute(...args);
    }
    clickLineup(...args: any[]): void {
        referenceContainer.instance.y.clickLineup(...args);
    }
    generateTeam(...args: any[]): void {
        referenceContainer.instance.y.generateTeam(...args);
    }
    teamJapan(...args: any[]): void {
        referenceContainer.instance.y.teamJapan(...args);
    }

}
