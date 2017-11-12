import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {BattersDataComponent} from './batters-data/batters-data.component';
import {BatteryDataComponent} from './battery-data/battery-data.component';
import {FieldComponent} from './field/field.component';
import {FlagComponent} from './flag/flag.component';
import {RatingBlockComponent} from './rating-block/rating-block.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {ToIterablePipe} from './to-iterable.pipe';
import {LowerComponent} from './lower/lower.component';
import {UpperComponent} from './upper/upper.component';
import {ModeComponent} from './mode/mode.component';
import {BlockingComponent} from './blocking/blocking.component';


@NgModule({
    declarations: [
        AppComponent,
        BattersDataComponent,
        BatteryDataComponent,
        FieldComponent,
        FlagComponent,
        RatingBlockComponent,
        ScoreboardComponent,
        ToIterablePipe,
        LowerComponent,
        UpperComponent,
        ModeComponent,
        BlockingComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
