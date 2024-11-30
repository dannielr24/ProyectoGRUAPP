import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrincipalPageRoutingModule } from './principal-routing.module';
import { PrincipalPage } from './principal.page';
import { TabBarModule } from 'src/app/page/tab-bar/tab-bar.module';
import { TabBarComponent } from 'src/app/page/tab-bar/tab-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPageRoutingModule,
    TabBarModule
  ],
  declarations: [PrincipalPage]
})
export class PrincipalPageModule {}
