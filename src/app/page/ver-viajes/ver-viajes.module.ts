import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerViajesPageRoutingModule } from './ver-viajes-routing.module';

import { VerViajesPage } from './ver-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerViajesPageRoutingModule
  ],
  declarations: [VerViajesPage]
})
export class VerViajesPageModule {}
