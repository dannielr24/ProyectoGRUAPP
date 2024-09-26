import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from './tab-bar.component'; 
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes, ROUTES, RoutesRecognized } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
      path: '',
      component: TabBarComponent
    }
  ];

@NgModule({
  declarations: [TabBarComponent], 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [TabBarComponent] 
})
export class TabBarModule {}
