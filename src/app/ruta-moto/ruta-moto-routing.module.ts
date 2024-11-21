import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaMotoPage } from './ruta-moto.page';

const routes: Routes = [
  {
    path: '',
    component: RutaMotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaMotoPageRoutingModule {}
