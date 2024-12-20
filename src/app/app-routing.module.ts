import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { TabBarComponent } from './page/tab-bar/tab-bar.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';

const redireccionarLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
    path: '',
    component: TabBarComponent,
    canActivate: [AngularFireAuthGuard], 
    data: { authGuardPipe: redireccionarLogin },
    children: [
      { 
        path: 'home',
        loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule),
      },
      {
        path: 'mapa',
        loadChildren: () => import('./page/mapa/mapa.module').then( m => m.MapaPageModule)
      },
      {
        path: 'historial',
        loadChildren: () => import('./page/historial/historial.module').then( m => m.HistorialPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./page/account/account.module').then( m => m.AccountPageModule)
      },
      {
        path: 'principal',
        loadChildren: () => import('./page/principal/principal.module').then(m => m.PrincipalPageModule)
      },
      {
        path: 'ruta-auto',
        loadChildren: () => import('./page/ruta-auto/ruta-auto.module').then(m => m.RutaAutoPageModule)
      },
      {
        path: 'ruta-moto',
        loadChildren: () => import('./page/ruta-moto/ruta-moto.module').then(m => m.RutaMotoPageModule)
      },
      {
        path: 'solicitar-grua',
        loadChildren: () => import('./page/solicitar-grua/solicitar-grua.module').then(m => m.SolicitarGruaPageModule)
      },
      {
        path: 'testapi',
        loadChildren: () => import('./page/testapi/testapi.module').then(m => m.TestapiPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./page/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./page/settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./page/help/help.module').then(m => m.HelpPageModule)
      },
      {
        path: 'agregar-vehiculo',
        loadChildren: () => import('./page/agregar-vehiculo/agregar-vehiculo.module').then( m => m.AgregarVehiculoPageModule)
      },
      {
        path: 'agregar-viaje',
        loadChildren: () => import('./page/agregar-viaje/agregar-viaje.module').then( m => m.AgregarViajePageModule)
      },
      {
        path: 'listado-vehiculos',
        loadChildren: () => import('./page/listado-vehiculos/listado-vehiculos.module').then( m => m.ListadoVehiculosPageModule)
      },
      {
        path: 'ver-viajes',
        loadChildren: () => import('./page/ver-viajes/ver-viajes.module').then( m => m.VerViajesPageModule)
      }, 
      {
        path: '**',
        component: PageNotFoundComponent
      }       
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
