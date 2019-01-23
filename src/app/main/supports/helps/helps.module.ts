import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveHelpsComponent } from './helps.component';
import { OliveHelpByCategoryComponent } from './help-by-category/help-by-category.component';
import { OliveHelpArticleComponent } from './help-article/help-article.component';
import { OliveHelpService } from './services/help.service';
import { OliveSharedModule } from '../../../core/shared.module';
import { OliveHelpEndpointService } from './services/help-endpoint.service';

const routes = [
  {
      path     : 'helps',
      component: OliveHelpsComponent,
      resolve  : {
        categoryHelps: OliveHelpService
      }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule,

    OliveSharedModule
  ],
  declarations: [
    OliveHelpsComponent,
    OliveHelpByCategoryComponent,
    OliveHelpArticleComponent
  ],
  providers: [
    OliveHelpService,
    OliveHelpEndpointService
  ],
  exports: [
    OliveHelpByCategoryComponent
  ],
  entryComponents: [
    OliveHelpArticleComponent
  ]
})
export class OliveHelpModule { }
