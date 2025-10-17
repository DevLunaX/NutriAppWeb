import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Citas } from './citas/citas';
import { Recordatorio } from './recordatorio/recordatorio';

export const routes: Routes = [
  {path:'', component:Main},
  {path:'citas', component:Citas},
  {path:'recordatorio', component: Recordatorio}

];
