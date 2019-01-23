import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { Role } from '@quick/models/role.model';
import { AlertService, MessageSeverity } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { Utilities } from '@quick/services/utilities';
import { fadeInOut } from '@quick/services/animations';

import { OliveEditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';

import { locale as english } from 'app/core/i18n/en'; // './i18n/en';

@Component({
  selector: 'olive-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  animations: [fadeInOut]
})
export class OliveRolesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['roleName', 'description', 'users', 'actions'];
  dataSource: MatTableDataSource<Role>;
  allPermissions: Permission[] = [];
  sourceRole: Role;
  editingRoleName: { name: string };
  loadingIndicator: boolean;

  constructor(
    private translater: FuseTranslationLoaderService,
    private alertService: AlertService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();

    this.translater.loadTranslations(english);
  }

  get canManageRoles() {
    return this.accountService.userHasPermission(Permission.manageRolesPermission);
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.accountService.getRolesAndPermissions()
      .subscribe(results => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.dataSource.data = results[0];
        this.allPermissions = results[1];
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Load Error', `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
        });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }

  private updateRoles(role: Role) {
    if (this.sourceRole) {
      Object.assign(this.sourceRole, role);
      this.sourceRole = null;
    }
    else {
      this.dataSource.data.push(role);
    }

    this.refresh();
  }

  private editRole(role?: Role) {
    this.sourceRole = role;

    const dialogRef = this.dialog.open(OliveEditRoleDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { role: role, allPermissions: this.allPermissions }
      });
    dialogRef.afterClosed().subscribe(item => {
      if (item && this.canManageRoles) {
        this.updateRoles(item);
      }
    });
  }

  private confirmDelete(role: Role) {
    this.snackBar.open(`Delete ${role.name} role?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.accountService.deleteRole(role)
          .subscribe(results => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.dataSource.data = this.dataSource.data.filter(item => item !== role);
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
                MessageSeverity.error, error);
            });
      });
  }
}
