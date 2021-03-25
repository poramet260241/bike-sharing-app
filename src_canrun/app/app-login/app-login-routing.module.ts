import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppLoginPage } from './app-login.page';

const routes: Routes = [
  {
    path: '',
    component: AppLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppLoginPageRoutingModule {}
