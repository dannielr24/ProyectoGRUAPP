import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearuserPage } from './crearuser.page';

const routes: Routes = [
  {
    path: '',
    component: CrearuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearuserPageRoutingModule {}
