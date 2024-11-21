import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarGruaPageRoutingModule } from './solicitar-grua-routing.module';

import { SolicitarGruaPage } from './solicitar-grua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarGruaPageRoutingModule
  ],
  declarations: [SolicitarGruaPage]
})
export class SolicitarGruaPageModule {}
