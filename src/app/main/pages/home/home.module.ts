import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveHomeComponent } from './home.component';
import { HomeResolver } from './home-resolver';
import { OliveHelpModule } from '../../supports/helps/helps.module';
import { OliveHelpService } from '../../supports/helps/services/help.service';
import { OliveSharedModule } from '../../../core/shared.module';

const routes = [
  {
      path     : '', 
      component: OliveHomeComponent,
      resolve: { helps: HomeResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule,

    OliveHelpModule,

    OliveSharedModule
  ],
  declarations: [OliveHomeComponent],
  providers: [
    HomeResolver,
    OliveHelpService
  ]
})
export class OliveHomeModule { }
