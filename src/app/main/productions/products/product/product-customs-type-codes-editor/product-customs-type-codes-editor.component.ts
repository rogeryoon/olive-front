import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, AbstractControl } from '@angular/forms';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveProductCustomsTypeCodeDataSource } from './product-customs-type-code-data-source';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';

import { OliveProductService } from 'app/main/productions/services/product.service';
import { ProductCustomsTypeCode } from 'app/main/productions/models/product-customs-type-code.model';
import { addCustomsTypeErrorByControl, addCustomsTypeErrorMessageByControl } from 'app/core/classes/customs-validators';

@Component({
  selector: 'olive-product-customs-type-codes-editor',
  templateUrl: './product-customs-type-codes-editor.component.html',
  styleUrls: ['./product-customs-type-codes-editor.component.scss']
})
export class OliveProductCustomsTypeCodesEditorComponent extends OliveEntityEditComponent {
  displayedColumns = ['id', 'name', 'customsTypeCode'];
  dataSource: OliveProductCustomsTypeCodeDataSource = new OliveProductCustomsTypeCodeDataSource(this.cacheService);
  customsRules: Map<string, any>;

  value: any = null;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveProductService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  getEditedItem(): ProductCustomsTypeCode[] {
    return this.dataSource.items;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formArray: this.oFormArray });
    this.dataSource.formGroup = this.oForm;
  }

  resetForm() {
    this.dataSource.customsRules = this.extraParameter;

    if (this.item) {
      this.dataSource.loadItems(this.item);
    }
  }

  createEmptyObject() {
    return new ProductCustomsTypeCode();
  }

  sendToEndPoint(items: ProductCustomsTypeCode[]) {
    this.isSaving = false;

    this.dataService.post('updateCustomsTypeCodes/', items).subscribe(
      response => this.onSaveSuccess(response.model),
      error => this.onSaveFail(error)
    );
  }

  notifyItemSaved(_updateCount: number) {
    this.onItemSaved.next(this.dataSource.items);
  }

  hasEntryErrorByControl(control: any): boolean {
    let hasError = super.hasEntryErrorByControl(control);

    if (hasError) { return hasError; }

    hasError = addCustomsTypeErrorByControl(control);

    return control.touched && hasError;
  }

  errorMessageByControl(control: AbstractControl): string {
    let message = super.errorMessageByControl(control);

    if (message) { return message; }

    message = addCustomsTypeErrorMessageByControl(control, this.translator);       

    return message;
  }
}
