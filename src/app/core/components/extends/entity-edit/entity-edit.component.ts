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

  protected onItemSaved = new Subject<any>();
  protected onItemDeleted = new Subject<any>();
  protected onCustomButtonActionEnded = new Subject<any>();
  subControls: any = [];

  item: any = null;
  itemType: any;
  managePermission: PermissionValues;
  customTitle: string;
  startTabIndex = 0;
  readonly = false;
  isSaving = false;
  isDeleting = false;
  hideDelete = false;
  saveConfirmTitle: string;
  saveConfirmMessage: string;
  itemSaved$ = this.onItemSaved.asObservable();
  itemDeleted$ = this.onItemDeleted.asObservable();
  customButtonActionEnded$ = this.onCustomButtonActionEnded.asObservable();
  extraParameter: any = null;
  enableSaveButton = false;

  @Input()
  private inputItem: any = null;

  constructor(
    translator: FuseTranslationLoaderService, protected alertService: AlertService,
    protected accountService: AccountService, protected messageHelper: OliveMessageHelperService,
    protected snackBar: MatSnackBar, protected formBuilder: FormBuilder,
    protected dataService: OliveDataService
  ) {
    super(translator);
    this.initializeComponent();
    this.initializeChildComponent();
  }

  private initializeComponent() {
  }

  /**
   * Initializes child component 
   * : virtual - ngOnInit()에서 Call됨
   */
  initializeChildComponent() { }
  
  buildForm() { }
  getEditedItem(): any { }
  resetForm() { }
  registerSubControl() { }
  onAfterViewInit() { }
  isCustomValidationOk(): boolean { return true; }

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
    this.onCustomButtonActionEnded.next({ id: buttonId, item: this.item });
  }

  customButtonVisible(buttonId: string): boolean { return true; }

  customButtonEnable(buttonId: string): boolean { return true; }

  /**
   * Determines whether save can
   * @returns true if save 
   */
  public canSave(): boolean {
    if (this.isSaving || this.isDeleting) {
      return false;
    }
    else if (this.enableSaveButton) {
      return true;
    }
    else if (this.isNewItem) {
      return true;
    }
    else {
      return this.oForm.dirty || this.subControls.some(control => {
        return control && control.oForm && control.oForm.dirty;
      });
    }
  }

  /**
   * Determines whether delete can
   * @returns true if delete 
   */
  public canDelete(): boolean {
    return !this.isDeleting && !this.isSaving;
  }

  /**
   * Gets whether is sub forms valid
   */
  get isSubFormsValid(): boolean {
    this.subControls.forEach(control => {
      control.markAsTouched();
    });

    return this.subControls.every(control => {
      return !control.hasError;
    });
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  public save() {
    if (this.form && !this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    this.markFormGroupTouched(this.oForm);

    if (!this.oForm.valid || !this.isSubFormsValid) {
      return;
    }

    if (!this.isCustomValidationOk()) {
      return;
    }

    if (this.isNull(this.saveConfirmTitle)) {
      this.saveData();
    }
    else {
      this.popUpConfirmSaveDialog();
    }
  }

  /**
   * Pops up confirm save dialog
   */
  popUpConfirmSaveDialog() {
    this.alertService.showDialog(
      this.saveConfirmTitle,
      this.saveConfirmMessage,
      DialogType.confirm,
      () => this.saveData(),
      () => null,
      this.translator.get('common.button.save'),
      this.translator.get('common.button.cancel')
    );    
  }

  /**
   * Saves data
   */
  saveData() {
    const editedItem = this.getEditedItem();

    this.isSaving = true;

    this.sendToEndPoint(editedItem);
  }

  /**
   * Sends to end point service
   * @param item : 엔티티
   */
  sendToEndPoint(item: any) {
    this.alertService.startLoadingMessage(this.translator.get('common.message.savingChanges'));

    if (this.isNewItem) {
      this.dataService.newItem(item).subscribe(
        response => this.onSaveSuccess(response.model),
        error => this.onSaveFail(error)
      );
    }
    else {
      this.dataService.updateItem(item, item.id).subscribe(
        response => this.onSaveSuccess(response.model),
        error => this.onSaveFail(error)
      );
    }
  }

  onSaveSuccess(data: any, showStickyResult = true) {
    if (showStickyResult) {
      this.messageHelper.showSavedSuccess(
        this.isNewItem,
        data.name
      );
    }

    this.notifyItemSaved(data);
    
    this.isSaving = false;
  }

  onSaveFail(error: any) {
    this.messageHelper.showStickySaveFailed(error, false);
    this.isSaving = false;
  }

  notifyItemSaved(data) {
    this.onItemSaved.next(data);
  }

  public delete() {
    const itemToDelete = this.getEditedItem();

    this.snackBar.open(
      OliveUtilities.showParamMessage(this.translator.get('common.message.confirmDelete'), itemToDelete.name),
      this.translator.get('common.button.delete'),
      { duration: 5000 }
    )
      .onAction().subscribe(() => {
        this.isDeleting = true;
        this.alertService.startLoadingMessage(this.translator.get('common.message.deleting'));

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

  /**
   * 공용으로 사용되는 id, updatedUser, updatedUtc, createdUser, createdUtc를 가져옴
   */
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
