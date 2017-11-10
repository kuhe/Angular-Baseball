import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BattersDataComponent } from './batters-data/batters-data.component';
import { BatteryDataComponent } from './battery-data/battery-data.component';
import { FieldComponent } from './field/field.component';
import { FlagComponent } from './flag/flag.component';
import { RatingBlockComponent } from './rating-block/rating-block.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { ToIterablePipe } from './to-iterable.pipe';


@NgModule({
    declarations: [
        AppComponent,
        BattersDataComponent,
        BatteryDataComponent,
        FieldComponent,
        FlagComponent,
        RatingBlockComponent,
        ScoreboardComponent,
        ToIterablePipe
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
