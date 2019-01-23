import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveUsersComponent } from './users.component';
import { OliveUserEditorComponent } from './user-editor/user-editor.component';
import { OliveEditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { OliveSharedModule } from '../../../core/shared.module';

const routes = [
  {
      path     : 'users',
      component: OliveUsersComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveUsersComponent,
    OliveUserEditorComponent,
    OliveEditUserDialogComponent
  ],
  entryComponents: [
    OliveEditUserDialogComponent
  ]
})
export class OliveUsersModule { }
