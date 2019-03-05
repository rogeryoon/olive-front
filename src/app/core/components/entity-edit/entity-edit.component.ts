import { Component, OnInit, OnChanges, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { String } from 'typescript-string-operations';
import { Subject } from 'rxjs';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { PermissionValues } from '@quick/models/permission.model';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDataService } from 'app/core/interfaces/data-service';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { locale as english } from 'app/core/i18n/en';
import { Creator } from 'app/core/classes/dynamic-type';
import { OliveEntityDateComponent } from '../entity-date/entity-date.component';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-entity-edit',
  template: ''
})
export class OliveEntityEditComponent implements OnChanges, AfterViewInit, OnInit, OliveOnEdit {
  @ViewChild('form')
  private form: NgForm;

  @ViewChild(OliveEntityDateComponent)
  private dateComponent: OliveEntityDateComponent;

  isNewItem = false;
  private onItemSaved = new Subject<any>();
  private onItemDeleted = new Subject<any>();
  subControls: any = [];

  item: any = null;
  itemType: any;
  managePermission: PermissionValues;
  customTitle: string;
  itemSaved$ = this.onItemSaved.asObservable();
  itemDeleted$ = this.onItemDeleted.asObservable();

  @Input()
  private inputItem: any = null;

  oForm: FormGroup;

  constructor(
    protected translater: FuseTranslationLoaderService, protected alertService: AlertService,
    protected accountService: AccountService, protected messageHelper: OliveMessageHelperService,
    protected snackBar: MatSnackBar, protected formBuilder: FormBuilder,
    protected dataService: OliveDataService 
  ) {
    this.initializeComponent();
    this.initializeChildComponent();
  }

  private initializeComponent() {
    this.translater.loadTranslations(english);
  }

  initializeChildComponent() { }
  buildForm() { }
  getEditedItem(): any { }
  resetForm() { }
  registerSubControl() { }

  ngOnInit() {
    this.buildForm();

    if (!this.inputItem) {
      this.setBindData();
    }

    this.registerSubControl();

    if (this.dateComponent) {
      this.dateComponent.item = this.item;
    }
  }

  ngOnChanges() {
    this.setBindData();
  }

  ngAfterViewInit(): void {
  }

  setBindData() {
    if (this.inputItem) {
      this.item = this.inputItem;
    }

    if (this.item) {
      this.isNewItem = false;
    }
    else {
      this.isNewItem = true;
      this.item = new Creator(this.itemType);
    }

    this.resetForm();
  }

  public canSave(): boolean {
    if (this.isNewItem) {
      return true;
    }
    else {
      return this.subControls.some(control => {
        return control.oForm.dirty;
      });
    }
  }

  get isSubFormsValid(): boolean {
    this.subControls.forEach(control => {
      control.markAsTouched();
    });

    return this.subControls.every(control => {
      return !control.hasError;
    });
  }

  public save() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.oForm.valid || !this.isSubFormsValid) {
      return;
    }

    this.alertService.startLoadingMessage(this.translater.get('common.message.savingChanges'));

    const editedItem = this.getEditedItem();

    if (this.isNewItem) {
      this.dataService.newItem(editedItem).subscribe(
        response => {
          const result = response.model;

          this.messageHelper.showSavedSuccess(
            this.isNewItem,
            result.name
          );

          this.onItemSaved.next(result);
        },
        error => this.messageHelper.showSaveFailed(error, false));
    }
    else {
      this.dataService.updateItem(editedItem, editedItem.id).subscribe(
        response => {
          const result = response.model;

          this.messageHelper.showSavedSuccess(
            this.isNewItem,
            result.name
          );

          this.onItemSaved.next(result);
        },
        error => this.messageHelper.showSaveFailed(error, false));
    }
  }

  public delete() {
    const itemToDelete = this.getEditedItem();

    this.snackBar.open(
      String.Format(this.translater.get('common.message.confirmDelete'), itemToDelete.name),
      this.translater.get('common.button.confirmDelete'),
      { duration: 5000 }
    )
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage(this.translater.get('common.message.deleting'));

        this.dataService.deleteItem(itemToDelete)
          .subscribe(results => {
            this.messageHelper.showDeletedSuccess(
              itemToDelete.name
            );
            this.onItemDeleted.next(itemToDelete);
          },
            error => this.messageHelper.showSaveFailed(error, true));
      });
  }

  private cancel() {
    this.resetForm();

    this.alertService.resetStickyMessage();
  }

  get canManageItems() {
    return this.accountService.userHasPermission(this.managePermission);
  }

  itemWithIdNAudit(source: any): any {
    return OliveUtilities.itemWithIdNAudit(source, this.item);
  }

  /**
   * After a form is initialized, we link it to our main form
   */
  formInitialized(name: string, form: FormGroup) {
    this.oForm.setControl(name, form);
  }
}
