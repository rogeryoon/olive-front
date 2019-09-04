import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Carrier } from 'app/main/supports/models/carrier.model';
import { CarrierTrackingEntry } from 'app/main/shippings/models/carrier-tracking-entry.model';
import { trackingNumberValidator } from 'app/core/validators/shipping-validators';
import { requiredAllOrNoneValidator, requiredValidator } from 'app/core/validators/general-validators';
import { NameValue } from 'app/core/models/name-value';
import { OliveCarrierService } from 'app/main/supports/services/carrier.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';

@Component({
  selector: 'olive-order-ship-out-tracking-editor',
  templateUrl: './order-ship-out-tracking-editor.component.html',
  styleUrls: ['./order-ship-out-tracking-editor.component.scss']
})
export class OliveOrderShipOutTrackingEditorComponent extends OliveEntityFormComponent {
  @Input()
  readonly = true;
  carriers: Carrier[];

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService, private carrierService: OliveCarrierService,
    private messageHelper: OliveMessageHelperService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): CarrierTrackingEntry {
    const formModel = this.oForm.value;

    return {
      trackingNumber: formModel.trackingNumber,
      carrierId: this.carriers.find(item => item.id === formModel.carrier).id,
      oldTrackingNumber: formModel.oldTrackingNumber
    };
  }

  buildForm() {
    if (!this.readonly) {
      this.oForm = this.formBuilder.group({
        trackingNumber: '',
        carrier: '',
        oldTrackingNumber: ''
      });
      return;
    }

    // 수정 허용일 경우,
    this.oForm = this.formBuilder.group({
      trackingNumber: ['', trackingNumberValidator()],
      carrier: '',
      oldTrackingNumber: '' // 읽기전용이라서 유효성 검사 불필요
    }, { validators: [requiredAllOrNoneValidator(['trackingNumber', 'carrier'])] });
  }

  get hasRequiredAllOrNoneError(): boolean {
    return this.hasFormError('requiredAllOrNone');
  }

  get inputRequiredAllOrNoneNames(): string[] {
    return [
      this.translator.get('common.word.trackingNumber'), 
      this.translator.get('common.word.carrier')
    ];
  }

  resetForm() {
    const item = this.item as CarrierTrackingEntry;

    this.oForm.reset({
      trackingNumber: item.trackingNumber || '',
      carrier: item.carrierId || '',
      oldTrackingNumber: item.oldTrackingNumber || '',
    });
  }

  createEmptyObject() {
    return new CarrierTrackingEntry();
  }

  initializeChildComponent() {
    this.getCarriers();
  }

  private getCarriers() {
    const itemKey = OliveCacheService.cacheKeys.getItemsKey.carrier;
    const searchOption = OliveUtilities.searchOption([{name: 'activated', value: true} as NameValue], 'name');

    if (!this.cacheService.exist(itemKey)) {
      this.carrierService.getItems(searchOption)
        .subscribe(res => {
          this.cacheService.set(itemKey, res.model);
          this.carriers = res.model;
        },
          error => {
            this.messageHelper.showLoadFailedSticky(error);
          });
    }
    else {
      this.carriers = this.cacheService.get(itemKey);
    }
  }

  issueTrackingNumber() {
  }
}
