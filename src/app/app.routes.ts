import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Citas } from './citas/citas';
import { Recordatorio } from './recordatorio/recordatorio';
import { Reporte } from './reporte/reporte';


export const routes: Routes = [
  {path:'', component:Main},
  {path:'citas', component:Citas},
  {path:'recordatorio', component: Recordatorio},
  {path:'citas', component: Citas},
  {path: 'reporte', component:Reporte}



];
