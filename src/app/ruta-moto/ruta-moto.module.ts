import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaMotoPageRoutingModule } from './ruta-moto-routing.module';

import { RutaMotoPage } from './ruta-moto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaMotoPageRoutingModule
  ],
  declarations: [RutaMotoPage]
})
export class RutaMotoPageModule {}
