import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TabBarComponent } from './tab-bar.component';

@NgModule({
  declarations: [TabBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports: [TabBarComponent] 
})
export class TabBarModule {}
