import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarGruaPage } from './solicitar-grua.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarGruaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarGruaPageRoutingModule {}
