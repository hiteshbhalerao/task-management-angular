import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', loadComponent: () => import('./pages/task-list.component').then((m) => m.TaskListComponent) },
  { path: 'tasks/new', loadComponent: () => import('./pages/task-form.component').then((m) => m.TaskFormComponent) },
  { path: 'tasks/:id/edit', loadComponent: () => import('./pages/task-form.component').then((m) => m.TaskFormComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found.component').then((m) => m.NotFoundComponent) }
];
