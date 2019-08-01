import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs/Subject';

import { Role } from '@quick/models/role.model';
import { Permission } from '@quick/models/permission.model';
import { AlertService, MessageSeverity } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

@Component({
  selector: 'olive-role-editor',
  templateUrl: './role-editor.component.html',
  styleUrls: ['./role-editor.component.scss']
})
export class OliveRoleEditorComponent implements OnChanges {
  @ViewChild('form')
  private form: NgForm;

  selectedPermissions: SelectionModel<Permission>;
  private isNewRole = false;
  private onRoleSaved = new Subject<Role>();

  @Input() role: Role = new Role();
  @Input() allPermissions: Permission[] = [];

  roleForm: FormGroup;
  roleSaved$ = this.onRoleSaved.asObservable();

  get name() {
    return this.roleForm.get('name');
  }

  constructor(
    private alertService: AlertService,
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    this.selectedPermissions = new SelectionModel<Permission>(true, []);
  }

  ngOnChanges() {
    if (this.role) {
      this.isNewRole = false;
    }
    else {
      this.isNewRole = true;
      this.role = new Role();
    }

    this.resetForm();
  }

  public save() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.roleForm.valid) {
      return;
    }

    this.alertService.startLoadingMessage('Saving changes...');

    const editedRole = this.getEditedRole();

    if (this.isNewRole) {
      this.accountService.newRole(editedRole).subscribe(
        role => this.saveSuccessHelper(role),
        error => this.saveFailedHelper(error));

    }
    else {
      this.accountService.updateRole(editedRole).subscribe(
        response => this.saveSuccessHelper(editedRole),
        error => this.saveFailedHelper(error));
    }
  }

  private getEditedRole(): Role {
    const formModel = this.roleForm.value;

    return {
      id: this.role.id,
      name: formModel.name,
      description: formModel.description,
      permissions: this.selectedPermissions.selected,
      usersCount: 0
    };
  }

  private saveSuccessHelper(role?: Role) {
    this.alertService.stopLoadingMessage();

    if (this.isNewRole) {
      this.alertService.showMessage('Success', `Role \"${role.name}\" was created successfully`, MessageSeverity.success);
    }
    else {
      this.alertService.showMessage('Success', `Changes to role \"${role.name}\" was saved successfully`, MessageSeverity.success);
    }

    if (!this.isNewRole) {
      if (this.accountService.currentUser.roles.some(r => r === this.role.name)) {
        this.refreshLoggedInUser();
      }

      role.usersCount = this.role.usersCount;
    }

    this.onRoleSaved.next(role);
  }

  private refreshLoggedInUser() {
    this.accountService.refreshLoggedInUser()
      .subscribe(user => { },
        error => {
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Refresh failed', 'An error occurred whilst refreshing logged in user information from the server', MessageSeverity.error, error);
        });
  }

  private saveFailedHelper(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'The below errors occurred whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  private cancel() {
    this.resetForm();

    this.alertService.resetStickyMessage();
  }

  private selectAll() {
    this.selectedPermissions.select(...this.allPermissions);
  }

  private toggleGroup(groupName: string) {
    const permissions = this.allPermissions
      .filter(p => p.groupName === groupName);

    if (permissions.length) {
      if (this.selectedPermissions.isSelected(permissions[0])) {
        this.selectedPermissions.deselect(...permissions);
      }
      else {
        this.selectedPermissions.select(...permissions);
      }
    }
  }

  private buildForm() {
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ''
    });
  }

  private resetForm(replace = false) {
    this.roleForm.reset({
      name: this.role.name || '',
      description: this.role.description || ''
    });

    const selectedPermissions = this.role.permissions
      ? this.allPermissions.filter(x => this.role.permissions.find(y => y.value === x.value))
      : [];

    this.selectedPermissions = new SelectionModel<Permission>(true, selectedPermissions);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

}
