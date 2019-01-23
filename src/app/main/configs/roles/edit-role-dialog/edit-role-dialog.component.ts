import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Permission } from '@quick/models/permission.model';
import { Role } from '@quick/models/role.model';
import { AccountService } from '@quick/services/account.service';

import { OliveRoleEditorComponent } from '../role-editor/role-editor.component';

@Component({
  selector: 'olive-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class OliveEditRoleDialogComponent implements AfterViewInit {
  @ViewChild(OliveRoleEditorComponent)
  roleEditor: OliveRoleEditorComponent;

  get roleName(): any {
    return this.data.role ? { name: this.data.role.name } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<OliveRoleEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role, allPermissions: Permission[] },
    private accountService: AccountService
  ) {
  }

  ngAfterViewInit() {
    this.roleEditor.roleSaved$.subscribe(role => this.dialogRef.close(role));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }
}
