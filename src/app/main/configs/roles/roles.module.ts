import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { OliveRolesComponent } from './roles.component';
import { OliveSharedModule } from '../../../core/shared.module';
import { OliveEditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { OliveRoleEditorComponent } from './role-editor/role-editor.component';


const routes = [
  {
      path     : 'roles',
      component: OliveRolesComponent
  }
];

@NgModule({
  imports: 
  [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),
    
    OliveSharedModule
  ],
  declarations: [
    OliveRolesComponent,
    OliveEditRoleDialogComponent,
    OliveRoleEditorComponent
  ],
  entryComponents: [
    OliveEditRoleDialogComponent
  ]
})
export class OliveRolesModule { }
