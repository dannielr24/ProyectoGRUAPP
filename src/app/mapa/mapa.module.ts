import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapaPage } from './mapa.page';
import { RouterModule } from '@angular/router';
import { TabBarModule } from '../tab-bar/tab-bar.module'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: MapaPage
      }
    ])
  ],
  declarations: [MapaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapaPageModule {}
