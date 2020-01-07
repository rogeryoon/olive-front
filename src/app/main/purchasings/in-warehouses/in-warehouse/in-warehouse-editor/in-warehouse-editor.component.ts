import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { InWarehouse } from '../../../models/in-warehouse.model';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { requiredValidator } from 'app/core/validators/general-validators';
import { addActivatedCacheKey } from 'app/core/utils/olive-helpers';
import { createDefaultSearchOption } from 'app/core/utils/search-helpers';

@Component({
  selector: 'olive-in-warehouse-editor',
  templateUrl: './in-warehouse-editor.component.html',
  styleUrls: ['./in-warehouse-editor.component.scss']
})
export class OliveInWarehouseEditorComponent extends OliveEntityFormComponent {
  disableWarehouseChangedEvent = false;

  @Output() warehouseChanged = new EventEmitter();

  warehouses: Warehouse[];

  readonly warehouseComboSelectedCacheKey = OliveCacheService.cacheKeys.userPreference.dropDownBox + 
    OliveCacheService.cacheKeys.getItemKey.warehouse + this.queryParams.CompanyGroupId;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private warehouseService: OliveWarehouseService, private cacheService: OliveCacheService,
    private queryParams: OliveQueryParameterService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): InWarehouse {
    const formModel = this.oFormValue;

    const selectedWarehouse = this.warehouses.find(item => item.id === formModel.warehouse);

    // Item 저장시 마지막 선택한 창고를 저장
    this.cacheService.setUserPreference(this.warehouseComboSelectedCacheKey, selectedWarehouse);

    return this.itemWithIdNAudit({
      warehouseId: selectedWarehouse.id,
      memo: formModel.memo
    } as InWarehouse);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      warehouse: ['', requiredValidator()],
      memo: ''
    });
  }

  resetForm() {
    if (!this.isNull(this.item.warehouseFk)) {
      this.disableWarehouseChangedEvent = true;
    }

    this.oForm.reset({
      warehouse: this.item.warehouseId,
      memo: this.item.memo || ''
    });

    if (this.item.warehouseFk) {
      this.warehouseChanged.emit({item: this.item.warehouseFk, loading: true});
    }

    this.getWarehouses();
  }

  createEmptyObject() {
    return new InWarehouse();
  }

  onWarehouseChanged(warehouseId: number) {
    const warehouse = this.warehouses.find(item => item.id === warehouseId);

    if (!this.disableWarehouseChangedEvent) {
      this.warehouseChanged.emit({item: warehouse, loading: false});
    }
    else {
      this.disableWarehouseChangedEvent = false;
    }
  }

  /**
   * 창고 콤보상자 데이터 로드 & 사용자 편의 창고 로드
   */
  private getWarehouses() {
    this.cacheService.getItems(this.warehouseService, addActivatedCacheKey(OliveCacheService.cacheKeys.getItemsKey.warehouse), createDefaultSearchOption())
      .then((items: Warehouse[]) => {
        this.warehouses = items;
        this.setLastSelectedWarehouse();
      });
  }

  /**
   * 사용자 편의 데이터에서 저장된 창고로 설정
   */
  private setLastSelectedWarehouse() {
    // Cache Value Loading
    this.cacheService.getUserPreference(this.warehouseComboSelectedCacheKey)
      .then(obj => {
        if (obj && !this.item.warehouseId) {
          this.oForm.patchValue({warehouse: obj.id});
          this.onWarehouseChanged(obj.id);
        }
      });    
  }
}
