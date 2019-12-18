import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Carrier } from 'app/main/supports/models/carrier.model';
import { CarrierTrackingEntry } from 'app/main/shippings/models/carrier-tracking-entry.model';
import { trackingNumberValidator } from 'app/core/validators/shipping-validators';
import { requiredAllOrNoneValidator } from 'app/core/validators/general-validators';
import { OliveCarrierService } from 'app/main/supports/services/carrier.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { CarrierTrackingNumbersGroup } from 'app/main/shippings/models/carrier-tracking-numbers-group.model';
import { OliveCarrierTrackingNumberRangeService } from 'app/main/shippings/services/carrier-tracking-number-range.service';
import { OliveOrderShipOutHelperService } from 'app/main/sales/services/order-ship-out-helper.service';
import { ThrowStmt } from '@angular/compiler';
import { AlertService, DialogType } from '@quick/services/alert.service';
import { createDefaultSearchOption } from 'app/core/utils/search-helpers';
import { addActivatedCacheKey } from 'app/core/utils/olive-helpers';

@Component({
  selector: 'olive-order-ship-out-tracking-editor',
  templateUrl: './order-ship-out-tracking-editor.component.html',
  styleUrls: ['./order-ship-out-tracking-editor.component.scss']
})
export class OliveOrderShipOutTrackingEditorComponent extends OliveEntityFormComponent {
  @Input()
  readonly = true;
  carriers: Carrier[];

  carrierTrackingNumbersGroups: CarrierTrackingNumbersGroup[];

  subscription: Subscription;

  issued = false;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService, private carrierService: OliveCarrierService,
    private messageHelper: OliveMessageHelperService, private carrierTrackingNumberRangeService: OliveCarrierTrackingNumberRangeService,
    private orderShipOutHelperService: OliveOrderShipOutHelperService, private alertService: AlertService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): CarrierTrackingEntry {
    const formModel = this.oForm.value;

    const carrier = this.carriers.find(item => item.id === formModel.carrier);

    return {
      trackingNumber: formModel.trackingNumber,
      carrierId: carrier ? carrier.id : null,
      oldTrackingNumber: formModel.oldTrackingNumber,
      carrierBranchId: this.item.carrierBranchId
    };
  }

  buildForm() {
    if (this.readonly) {
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

  get hasOldTrackingNumber(): boolean {
    return this.item.oldTrackingNumber;
  }

  get hasTrackingNumber(): boolean {
    return this.item.trackingNumber;
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
    // Tracking 번호 트랙잭션이 종료되면
    this.subscription = this.orderShipOutHelperService.trackingAssignTrigger.subscribe(param => {
      const item = this.item as CarrierTrackingEntry;
      this.oForm.patchValue({
        trackingNumber: item.trackingNumber || '',
        carrier: item.carrierId || '',
        oldTrackingNumber: item.oldTrackingNumber || '',
      });
      this.issued = true;
      this.oForm.markAsDirty();
    });

    this.getCarriers();
  }

  cleanUpChildComponent() {
    this.subscription.unsubscribe();
  }

  private getCarriers() {
    this.cacheService.getItems(this.carrierService, addActivatedCacheKey(OliveCacheService.cacheKeys.getItemsKey.carrier), createDefaultSearchOption())
    .then((items: Carrier[]) => {
      this.carriers = items;
    });    
  }

  buttonIssueTrackingNumber(carrierTrackingsNumbersGroupsId: number = null) {
    if (!carrierTrackingsNumbersGroupsId) {
      this.alertService.showDialog(
        this.translator.get('common.title.confirm'),
        this.translator.get('common.message.areYouSure'),
        DialogType.confirm,
        () => {
          this.issueTrackingNumber(carrierTrackingsNumbersGroupsId);
        },
        () => null,
        this.translator.get('common.button.yes'),
        this.translator.get('common.button.no')
      );
      return;
    }

    this.issueTrackingNumber(carrierTrackingsNumbersGroupsId);
  }

  issueTrackingNumber(carrierTrackingsNumbersGroupsId: number) {
    if (!this.carrierTrackingNumbersGroups) {
      this.carrierTrackingNumberRangeService.get('numbersGroup')
      .subscribe(res => {
        this.carrierTrackingNumbersGroups = res.model;
        // ID를 임의로 만들어준다.
        let id = 1;
        for (const group of this.carrierTrackingNumbersGroups) {
          group.id = id++;
        }

        // 선발급 송장번호대가 없을 경우
        if (this.carrierTrackingNumbersGroups.length === 0) {
          this.orderShipOutHelperService.notifyNotEnoughCarrierTrackingsNumbersGroups(
            this.translator.get('sales.pendingOrderShipOutList.confirmNoCarrierTrackingNumbersGroupsMessage')
            );
          return;
        }
  
        // 선발급 송장대역대가 멀티인 경우 선택하게 한다
        if (this.carrierTrackingNumbersGroups.length > 1) {
          this.popUpSelectCarrierTrackingsNumbersGroupsDialog();
          return;
        }

        this.orderShipOutHelperService.preAssignTrackingNumbers(this.carrierTrackingNumbersGroups[0], [this.item]);
      }, error => {
        this.messageHelper.showLoadFailedSticky(error);
      });

      return;
    }

    if (carrierTrackingsNumbersGroupsId) {
      const carrierTrackingsNumbersGroup = this.carrierTrackingNumbersGroups.find(x => x.id === carrierTrackingsNumbersGroupsId);
      this.orderShipOutHelperService.preAssignTrackingNumbers(carrierTrackingsNumbersGroup, [this.item]);
    }
  }

  /**
   * 선택 다이알로그를 팝업
   */
  popUpSelectCarrierTrackingsNumbersGroupsDialog() {
    const dialogRef = this.orderShipOutHelperService.popUpSelectCarrierTrackingsNumbersGroupsDialog(this.carrierTrackingNumbersGroups);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.issueTrackingNumber(result);
      }
    });
  }
}
