import { Component, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveProductHsCodeDataSource } from './product-hs-code-data-source';
import { ProductHsCode } from 'app/main/productions/models/product-hs-code.model';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';

import { OliveProductService } from 'app/main/productions/services/product.service';
import { toTrimString } from 'app/core/utils/string-helper';

@Component({
  selector: 'olive-product-hs-codes-editor',
  templateUrl: './product-hs-codes-editor.component.html',
  styleUrls: ['./product-hs-codes-editor.component.scss']
})
export class OliveProductHsCodesEditorComponent extends OliveEntityEditComponent implements AfterContentChecked {
  readonly hsCodeName = 'hsCode';
  displayedColumns = ['id', 'name', 'hsCode'];
  dataSource: 
  OliveProductHsCodeDataSource = new OliveProductHsCodeDataSource(this.cacheService);

  value: any = null;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveProductService, private cacheService: OliveCacheService,
    private cdRef: ChangeDetectorRef
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  getEditedItem(): ProductHsCode[] {
    return this.dataSource.items;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formArray: this.oFormArray });
    this.dataSource.formGroup = this.oForm;
  }

  resetForm() {
    if (this.item) {
      this.dataSource.loadItems(this.item);
    }
  }

  createEmptyObject() {
    return new ProductHsCode();
  }

  /**
   * 유효검사후 정상이면 Empty셀에 복사한다.
   * @param index 
   */
  copyToEmptyCell(index: number) {
    const thisFormGroup = this.getArrayFormGroup(index);
    const thisHsCodeName = toTrimString(thisFormGroup.get(this.hsCodeName).value);

    if (thisHsCodeName.length > 0) {
      for (const formGroup of this.oFArray.controls) {
        const hsCode = toTrimString(formGroup.get(this.hsCodeName).value);

        if (hsCode.length === 0) {
          formGroup.patchValue( {hsCode : thisHsCodeName});
        }
      }
    }
  }

  sendToEndPoint(items: ProductHsCode[]) {
    this.isSaving = false;

    this.dataService.post('updateHsCodes/', items).subscribe(
      response => this.onSaveSuccess(response.model),
      error => this.onSaveFail(error)
    );
  }

  notifyItemSaved(_updateCount: number) {
    this.onItemSaved.next(this.dataSource.items);
  }
}
