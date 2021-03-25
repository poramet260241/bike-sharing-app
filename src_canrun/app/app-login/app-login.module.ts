import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppLoginPageRoutingModule } from './app-login-routing.module';

import { AppLoginPage } from './app-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppLoginPageRoutingModule
  ],
  declarations: [AppLoginPage]
})
export class AppLoginPageModule {}
