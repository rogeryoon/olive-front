import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';

import { User } from '@quick/models/user.model';
import { Role } from '@quick/models/role.model';

import { OliveUserEditorComponent } from '../user-editor/user-editor.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'olive-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class OliveEditUserDialogComponent implements AfterViewInit {

  @ViewChild(OliveUserEditorComponent)
    editUser: OliveUserEditorComponent;

    get userName(): any
    {
        return this.data.user ? { name: this.data.user.userName } : null;
    }

    constructor(
        public dialogRef: MatDialogRef<OliveEditUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User, roles: Role[] })
    {
    }

    ngAfterViewInit()
    {
        this.editUser.userSaved$.subscribe(user => this.dialogRef.close(user));
    }

    cancel(): void
    {
        this.dialogRef.close(null);
    }

}
