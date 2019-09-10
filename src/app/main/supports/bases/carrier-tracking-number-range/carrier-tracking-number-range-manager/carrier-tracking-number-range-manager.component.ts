import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveCarrierTrackingNumberRangeEditorComponent } from '../carrier-tracking-number-range-editor/carrier-tracking-number-range-editor.component';
import { OliveCarrierTrackingNumberRangeService } from 'app/main/shippings/services/carrier-tracking-number-range.service';
import { CarrierTrackingNumberRange } from 'app/main/shippings/models/carrier-tracking-number-range.model';
import { OliveBackEndErrors } from 'app/core/classes/back-end-errors';

@Component({
  selector: 'olive-carrier-tracking-number-range-manager',
  templateUrl: './carrier-tracking-number-range-manager.component.html',
  styleUrls: ['./carrier-tracking-number-range-manager.component.scss']
})
export class OliveCarrierTrackingNumberRangeManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveCarrierTrackingNumberRangeEditorComponent)
  private carrierTrackingNumberRangeEditor: OliveCarrierTrackingNumberRangeEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveCarrierTrackingNumberRangeService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.carrierTrackingNumberRangeEditor);
  }

  getEditedItem(): CarrierTrackingNumberRange {
    const carrier = this.carrierTrackingNumberRangeEditor.getEditedItem();

    return this.itemWithIdNAudit({
      name: carrier.name,
      memo: carrier.memo,
      fromTrackingNumber: carrier.fromTrackingNumber,
      toTrackingNumber: carrier.toTrackingNumber,
      lastTrackingNumber: carrier.lastTrackingNumber,
      activated: carrier.activated,
      branchId: carrier.branchId,
      carrierId: carrier.carrierId,
      companyGroupId: carrier.companyGroupId
    } as CarrierTrackingNumberRange);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }

  createEmptyObject() {
    return new CarrierTrackingNumberRange();
  }

  onSaveFail(error: any) {
    this.alertService.stopLoadingMessage();

    // 저장시 백앤드에서 다른 송장번호 범위와 중첩되는지 검사 오류 반환
    // 이경우 User에게 알리고 다시 재입력하게 한다.
    if (error.error && error.error.errorCode === OliveBackEndErrors.ServerValidationError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.saveError'),
        this.translator.get('common.validate.duplicatedCarrierTrackingNumberExists')
      );
    }
    else {
      this.messageHelper.showStickySaveFailed(error, false);
    }

    this.isSaving = false;
  }
}
