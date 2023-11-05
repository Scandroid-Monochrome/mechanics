import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DecimalPipe } from '@angular/common';
import { AiComponent } from './ai/ai.component';
import { Magic15Component } from './ai/magic15/magic15.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnimationComponent } from './mechanics/animation/animation.component';
import { KinematicsComponent } from './mechanics/animation/kinematics/kinematics.component';
import { ForceAnalysisComponent } from './mechanics/force-analysis/force-analysis.component';
import { MechanicsComponent } from './mechanics/mechanics.component';
import { ThermoComponent } from './thermo/thermo.component';
import { BitOperatorComponent } from './assembly/bit-operator/bit-operator.component';
import { AssemblyComponent } from './assembly/assembly.component';

@NgModule({
  declarations: [
    AppComponent,
    ThermoComponent,
    MechanicsComponent,
    ForceAnalysisComponent,
    AnimationComponent,
    KinematicsComponent,
    Magic15Component,
    AiComponent,
    BitOperatorComponent,
    AssemblyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatCardModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatRadioModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatInputModule,
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
