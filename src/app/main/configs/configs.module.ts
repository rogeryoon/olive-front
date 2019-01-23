import { NgModule } from '@angular/core';

import { OliveUsersModule } from './users/users.module';
import { OliveRolesModule } from './roles/roles.module';
import { OliveCompaniesModule } from '../supports/companies/companies.module';

@NgModule({
  imports: [
    OliveUsersModule,
    OliveRolesModule,
    OliveCompaniesModule
  ],
  declarations: [

  ],
  providers: [

  ],
})
export class OliveConfigsModule { }
