import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMarketItemMappingService } from '../../../services/market-item-mapping.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { MarketItemMapping } from '../../../models/market-item-mapping.model';
import { OliveMarketItemMappingExcelColumnsEditorComponent } from '../market-item-mapping-excel-columns-editor/market-item-mapping-excel-columns-editor.component';
import { OliveMarketItemMappingProductVariantsEditorComponent } from '../market-item-mapping-product-variants-editor/market-item-mapping-product-variants-editor.component';
import { OliveBackEndErrors, OliveBackEndErrorMessages } from 'app/core/classes/back-end-errors';
import { OliveConstants } from 'app/core/classes/constants';

@Component({
  selector: 'olive-market-item-mapping-manager',
  templateUrl: './market-item-mapping-manager.component.html',
  styleUrls: ['./market-item-mapping-manager.component.scss']
})
export class OliveMarketItemMappingManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveMarketItemMappingExcelColumnsEditorComponent) 
  private excelColumnsEditor: OliveMarketItemMappingExcelColumnsEditorComponent;

  @ViewChild(OliveMarketItemMappingProductVariantsEditorComponent) 
  private productVariantsEditor: OliveMarketItemMappingProductVariantsEditorComponent;  

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,  
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveMarketItemMappingService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder,  
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.excelColumnsEditor);
    this.subControls.push(this.productVariantsEditor);
  }

  getEditedItem(): any {
    return this.itemWithIdNAudit({
      interfaceId: this.item.interfaceId,
      interfaceName: this.item.interfaceName,
      excelColumns: this.excelColumnsEditor.items,
      products: this.productVariantsEditor.items
    } as MarketItemMapping);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      excelColumns: null,
      products: null
    });
  }

  resetForm() {
    this.oForm.reset({});

    if (this.item) {
      this.oForm.patchValue({
        excelColumns: this.item.excelColumns,
        products: this.item.products
      });
    }
  }

  onSaveFail(error: any) {
    this.alertService.stopLoadingMessage();

    // 서버쪽 Validation Error 검출시
    // 이경우 User에게 알리고 다시 재입력하게 한다.
    if (error.error && error.error.errorCode === OliveBackEndErrors.ServerValidationError) {
      let errorMessage = this.translator.get('common.validate.serverValidationGeneralMessage');

      const errors = error.error.errorMessage.split(OliveConstants.constant.serverValidationDelimiter) as string[];
      const serverErrorType = errors[0];
      if (serverErrorType === OliveBackEndErrorMessages.NotMatchItem) {
        errorMessage = this.messageHelper.getProductNotMatchedErrorMessage(errors);
      }

      this.alertService.showMessageBox(this.translator.get('common.title.saveError'), errorMessage);
    }
    else {
      this.messageHelper.showStickySaveFailed(error, false);
    }

    this.isSaving = false;
  }
}
