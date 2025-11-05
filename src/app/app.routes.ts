// ESTE ES EL ARCHIVO routes.ts CORREGIDO
import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Citas } from './citas/citas';
import { Recordatorio } from './recordatorio/recordatorio';
import { Reporte } from './reporte/reporte';

// (Si tienes un componente Pacientes, impórtalo aquí)
// import { Pacientes } from './pacientes/pacientes';

export const routes: Routes = [

  // 1. Cuando la URL esté vacía ('/'), redirige a '/recordatorio'

  // 2. Rutas que coinciden con los botones del HTML
  { path: 'recordatorio', component: Recordatorio },
  { path: 'citas', component: Citas },

  // 3. Ruta corregida (de 'reporte' a 'reportes')
  { path: 'reportes', component: Reporte },

  // 4. Ruta que faltaba (asegúrate de que el componente 'Main' es el correcto para Pacientes)
  { path: 'pacientes', component: Main }
  // Si tienes un componente Pacientes:
  // { path: 'pacientes', component: Pacientes }
];
