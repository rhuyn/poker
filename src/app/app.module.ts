import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/routing.module';
import { HomeComponent } from './routing/pages/home/home.component';
import { CalculatorService } from './services/calculator.service';
import { ValidityService } from './services/validity.service';
import { HandService } from './services/hand.service';
import { UserInputComponent } from './components/user-input/user-input.component';
import { ResultsComponent } from './components/results/results.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserInputComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [CalculatorService, ValidityService, HandService],
  bootstrap: [AppComponent]
})
export class AppModule { }
