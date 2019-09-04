import { Component, OnDestroy, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { User } from '@quick/models/user.model';
import { Role } from '@quick/models/role.model';
import { UserEdit } from '@quick/models/user-edit.model';
import { Permission } from '@quick/models/permission.model';

import { AlertService, MessageSeverity } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveLookupDialogComponent } from 'app/core/components/dialogs/lookup-dialog/lookup-dialog.component';
import { MatDialog } from '@angular/material';
import { OliveCompanyGroupService } from 'app/main/supports/services/company-group.service';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OliveBaseComponent } from 'app/core/components/extends/base/base.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { CompanyGroup } from 'app/main/supports/models/company-group.model';
import { requiredValidator, equalValidator } from 'app/core/validators/general-validators';

const Selected = 'selected';
const Id = 'id';
const Name = 'name';
const Memo = 'memo';
const CreateUtc = 'createdUtc';

@Component({
  selector: 'olive-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class OliveUserEditorComponent extends OliveBaseComponent implements OnChanges, OnDestroy {

  @ViewChild('form')
  private form: NgForm;

  isNewUser = false;
  isSaving = false;
  isChangePassword = false;

  private passwordWatcher: Subscription;
  private onUserSaved = new Subject<User>();

  @Input() user: User = new User();
  @Input() roles: Role[] = [];
  @Input() isEditMode = false;

  savedCompanyGroupId: number;

  userProfileForm: FormGroup;
  userSaved$ = this.onUserSaved.asObservable();

  get userName() {
    return this.userProfileForm.get('userName');
  }

  get companyGroupName() {
    return this.userProfileForm.get('companyGroupName');
  }

  get email() {
    return this.userProfileForm.get('email');
  }

  get password() {
    return this.userProfileForm.get('password');
  }

  get currentPassword() {
    return this.password.get('currentPassword');
  }

  get newPassword() {
    return this.password.get('newPassword');
  }

  get confirmPassword() {
    return this.password.get('confirmPassword');
  }

  get assignedRoles() {
    return this.userProfileForm.get('roles');
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

  get canAssignCompanyGroups() {
    return this.accountService.userHasPermission(Permission.assignCompanyGroups);
  }

  get assignableRoles(): Role[] {
    return this.roles;
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService, translator: FuseTranslationLoaderService,
    private accountService: AccountService, private formBuilder: FormBuilder,
    private dialog: MatDialog, private companyGroupService: OliveCompanyGroupService
  ) {
    super(translator);
    this.buildForm();
  }

  ngOnChanges() {
    if (this.user) {
      this.isNewUser = false;
    }
    else {
      this.isNewUser = true;
      this.user = new User();
      this.user.isEnabled = true;
    }

    this.setRoles();

    this.resetForm();
  }

  ngOnDestroy() {
    this.passwordWatcher.unsubscribe();
  }

  public setUser(user?: User, roles?: Role[]) {
    this.user = user;
    if (roles) {
      this.roles = [...roles];
    }

    this.ngOnChanges();
  }

  private buildForm() {
    this.userProfileForm = this.formBuilder.group({
      jobTitle: '',
      userName: ['', requiredValidator()],
      companyGroupName: ['', requiredValidator()],
      email: ['', [requiredValidator(), Validators.email]],
      password: this.formBuilder.group({
        currentPassword: ['', requiredValidator()],
        newPassword: ['', [requiredValidator(), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
        confirmPassword: ['', [requiredValidator(), equalValidator('newPassword')]],
      }),
      roles: '',
      fullName: '',
      phoneNumber: '',
      isEnabled: ''
    });

    this.passwordWatcher = this.newPassword.valueChanges.subscribe(() => this.confirmPassword.updateValueAndValidity());
  }

  public resetForm(stopEditing: boolean = false) {
    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.user) {
      this.isNewUser = true;
      this.user = new User();
    }

    if (this.isNewUser) {
      this.isChangePassword = true;
      this.addNewPasswordValidators();
    }
    else {
      this.isChangePassword = false;
      this.newPassword.clearValidators();
      this.confirmPassword.clearValidators();
    }

    this.currentPassword.clearValidators();

    this.userProfileForm.reset({
      jobTitle: this.user.jobTitle || '',
      userName: this.user.userName || '',
      companyGroupName: this.user.companyGroupName || '',
      email: this.user.email || '',
      password: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      roles: this.user.roles || [],
      fullName: this.user.fullName || '',
      phoneNumber: this.user.phoneNumber || '',
      isEnabled: this.user.isEnabled
    });
  }

  private setRoles() {
    if (this.user.roles) {
      for (const role of this.user.roles) {
        if (!this.roles.some(r => r.name === role)) {
          this.roles.unshift(new Role(role));
        }
      }
    }
  }

  public beginEdit() {
    this.isEditMode = true;
    this.isChangePassword = false;
  }

  public save() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.userProfileForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const editedUser = this.getEditedUser();

    if (this.isNewUser) {
      this.accountService.newUser(editedUser).subscribe(
        user => this.saveCompleted(user),
        error => this.saveFailed(error));
    }
    else {
      this.accountService.updateUser(editedUser).subscribe(
        response => this.saveCompleted(editedUser),
        error => this.saveFailed(error));
    }
  }

  private cancel() {
    this.resetForm();

    this.alertService.resetStickyMessage();
  }

  lookUpCompanyGroup() {
    const setting = {
      columnType: 'id',
      itemTitle: this.translator.get(NavTranslates.Company.groupList),
      dataService: this.companyGroupService,
      maxSelectItems: 1,
      itemType: CompanyGroup
    } as LookupListerSetting;

    const dialogRef = this.dialog.open(
      OliveLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe(items => {
      if (items && items.length > 0) {
        this.userProfileForm.patchValue({companyGroupName: items[0].name});
        this.savedCompanyGroupId = items[0].id;
      }
    });
  }

  private getEditedUser(): UserEdit {
    const formModel = this.userProfileForm.value;

    return {
      id: this.user.id,
      jobTitle: formModel.jobTitle,
      userName: formModel.userName,
      fullName: formModel.fullName,
      friendlyName: formModel.friendlyName,
      email: formModel.email,
      phoneNumber: formModel.phoneNumber,
      roles: formModel.roles,
      currentPassword: formModel.password.currentPassword,
      newPassword: this.isChangePassword ? formModel.password.newPassword : null,
      confirmPassword: this.isChangePassword ? formModel.password.confirmPassword : null,
      isEnabled: formModel.isEnabled,
      isLockedOut: this.user.isLockedOut,
      companyMasterCode: this.user.companyMasterCode,
      companyGroupId: this.savedCompanyGroupId ? this.savedCompanyGroupId : this.user.companyGroupId,
      companyGroupName: formModel.companyGroupName
    };
  }

  private saveCompleted(user?: User) {
    if (user) {
      this.raiseEventIfRolesModified(this.user, user);
      this.user = user;
    }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    this.resetForm(true);

    this.onUserSaved.next(this.user);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'One or more errors occurred whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  private raiseEventIfRolesModified(currentUser: User, editedUser: User) {
    const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) === -1);
    const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) === -1);

    const modifiedRoles = rolesAdded.concat(rolesRemoved);

    if (modifiedRoles.length) {
      setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
    }
  }

  private changePassword() {
    this.isChangePassword = true;
    this.addCurrentPasswordValidators();
    this.addNewPasswordValidators();
  }

  private addCurrentPasswordValidators() {
    this.currentPassword.setValidators(requiredValidator());
  }

  private addNewPasswordValidators() {
    this.newPassword.setValidators([requiredValidator(), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]);
    this.confirmPassword.setValidators([requiredValidator(), equalValidator('newPassword')]);
  }

  private unlockUser() {
    this.isSaving = true;
    this.alertService.startLoadingMessage('Unblocking user...');

    this.accountService.unblockUser(this.user.id)
      .subscribe(response => {
        this.isSaving = false;
        this.user.isLockedOut = false;
        this.userProfileForm.patchValue({
          isLockedOut: this.user.isLockedOut
        });
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('Success', 'User has been successfully unlocked', MessageSeverity.success);
      },
        error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Unblock Error', 'The below errors occurred whilst unlocking the user:', MessageSeverity.error, error);
          this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        });
  }
}
