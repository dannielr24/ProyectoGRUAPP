import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaAutoPage } from './ruta-auto.page';

const routes: Routes = [
  {
    path: '',
    component: RutaAutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaAutoPageRoutingModule {}
