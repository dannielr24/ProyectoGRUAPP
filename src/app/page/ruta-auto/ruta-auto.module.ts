import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaAutoPageRoutingModule } from './ruta-auto-routing.module';

import { RutaAutoPage } from './ruta-auto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaAutoPageRoutingModule
  ],
  declarations: [RutaAutoPage]
})
export class RutaAutoPageModule {}
