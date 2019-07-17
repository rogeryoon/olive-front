import { Component, OnInit, OnChanges, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { PermissionValues } from '@quick/models/permission.model';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDataService } from 'app/core/interfaces/data-service';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { Creator } from 'app/core/classes/dynamic-type';
import { OliveEntityDateComponent } from '../../entries/entity-date/entity-date.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveBaseComponent } from '../../extends/base/base.component';

@Component({
  selector: 'olive-entity-edit',
  template: ''
})
export class OliveEntityEditComponent extends OliveBaseComponent implements OnChanges, AfterViewInit, OnInit, OliveOnEdit {
  @ViewChild('form')
  private form: NgForm;

  @ViewChild(OliveEntityDateComponent)
  private dateComponent: OliveEntityDateComponent;

  private onItemSaved = new Subject<any>();
  private onItemDeleted = new Subject<any>();
  private onCustomButtonActionEnded = new Subject<any>();
  subControls: any = [];

  item: any = null;
  itemType: any;
  managePermission: PermissionValues;
  customTitle: string;
  startTabIndex = 0;
  readonly = false;
  isSaving = false;
  isDeleting = false;
  saveConfirmTitle: string;
  saveConfirmMessage: string;
  itemSaved$ = this.onItemSaved.asObservable();
  itemDeleted$ = this.onItemDeleted.asObservable();
  customButtonActionEnded$ = this.onCustomButtonActionEnded.asObservable();

  @Input()
  private inputItem: any = null;

  constructor(
    translater: FuseTranslationLoaderService, protected alertService: AlertService,
    protected accountService: AccountService, protected messageHelper: OliveMessageHelperService,
    protected snackBar: MatSnackBar, protected formBuilder: FormBuilder,
    protected dataService: OliveDataService
  ) {
    super(translater);
    this.initializeComponent();
    this.initializeChildComponent();
  }

  private initializeComponent() {
  }

  initializeChildComponent() { }
  buildForm() { }
  getEditedItem(): any { }
  resetForm() { }
  registerSubControl() { }
  onAfterViewInit() {}

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
    this.onAfterViewInit();
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

  public customButtonAction(buttonId: string): void { 
    this.onCustomButtonActionEnded.next({id: buttonId, item: this.item});
  }

  customButtonVisible(buttonId: string): boolean { return true; }

  customButtonEnable(buttonId: string): boolean { return true; }

  public canSave(): boolean {
    if (this.isSaving || this.isDeleting) {
      return false;
    }
    else if (this.isNewItem) {
      return true;
    }
    else {
      return this.subControls.some(control => {
        return control.oForm.dirty;
      });
    }
  }

  public canDelete(): boolean {
    return !this.isDeleting && !this.isSaving;
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

    if (this.isNull(this.saveConfirmTitle)) {
      this.saveData();
    }
    else {
      this.alertService.showDialog(
        this.saveConfirmTitle,
        this.saveConfirmMessage,
        DialogType.confirm,
        () => this.saveData(),
        () => null,
        this.translater.get('common.button.save'),
        this.translater.get('common.button.cancel')
      );
    }
  }

  saveData() {
    this.alertService.startLoadingMessage(this.translater.get('common.message.savingChanges'));

    const editedItem = this.getEditedItem();

    this.isSaving = true;
    if (this.isNewItem) {
      this.dataService.newItem(editedItem).subscribe(
        response => this.onSaveSuccess(response.model),
        error => this.onSaveFail(error)
      );
    }
    else {
      this.dataService.updateItem(editedItem, editedItem.id).subscribe(
        response => this.onSaveSuccess(response.model),
        error => this.onSaveFail(error)
      );
    }
  }

  onSaveSuccess(data: any) {
    const result = data;

    this.messageHelper.showSavedSuccess(
      this.isNewItem,
      result.name
    );

    this.onItemSaved.next(result);
    this.isSaving = false;    
  }

  onSaveFail(error: any) {
    this.messageHelper.showStickySaveFailed(error, false);
    this.isSaving = false;   
  }

  public delete() {
    const itemToDelete = this.getEditedItem();

    this.snackBar.open(
      OliveUtilities.showParamMessage(this.translater.get('common.message.confirmDelete'), itemToDelete.name),
      this.translater.get('common.button.delete'),
      { duration: 5000 }
    )
      .onAction().subscribe(() => {
        this.isDeleting = true;
        this.alertService.startLoadingMessage(this.translater.get('common.message.deleting'));

        this.dataService.deleteItem(itemToDelete)
          .subscribe(results => {
            this.messageHelper.showDeletedSuccess(
              itemToDelete.name
            );
            this.onItemDeleted.next(itemToDelete);
            this.isDeleting = false;
          },
            error => {
              this.messageHelper.showStickySaveFailed(error, true);
              this.isDeleting = false;
            });
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
