import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { MapaPage } from './mapa/mapa.page';
import { HistorialPage } from './historial/historial.page';
import { TabBarComponent } from './tab-bar/tab-bar.component';

const redireccionarLogin = () => redirectUnauthorizedTo(['/login'])
const routes: Routes = [
  {
    path: '',
    component: TabBarComponent,
    children: [
      { 
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'mapa',
        loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule)
      },
      {
        path: 'historial',
        loadChildren: () => import('./historial/historial.module').then( m => m.HistorialPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./page/account/account.module').then( m => m.AccountPageModule)
      }
    ]
  },     
      {
        path: 'login',
        loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
      },      
      {
        path: 'crearuser',
        loadChildren: () => import('./page/crearuser/crearuser.module').then( m => m.CrearuserPageModule)
      },
      {
        path: 'recuperarpass',
        loadChildren: () => import('./page/recuperarpass/recuperarpass.module').then( m => m.RecuperarpassPageModule)
      },
      {
        path: 'principal',
        canActivate: [AngularFireAuthGuard], data:{authGuardPipe:redireccionarLogin},
        loadChildren: () => import('./page/principal/principal.module').then( m => m.PrincipalPageModule)
      },
      
    ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
