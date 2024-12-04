import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerViajesPage } from './ver-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: VerViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerViajesPageRoutingModule {}
