import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormArray, FormControl, ValidationErrors, 
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OlivePaymentMethodService } from 'app/main/supports/services/payment-method.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMarketItemMappingExcelColumnDatasource } from './market-item-mapping-excel-column.datasource';
import { MarketItemMappingExcelColumn } from '../../../models/market-item-mapping-excel-column.model';

@Component({
  selector: 'olive-market-item-mapping-excel-columns-editor',
  templateUrl: './market-item-mapping-excel-columns-editor.component.html',
  styleUrls: ['./market-item-mapping-excel-columns-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveMarketItemMappingExcelColumnsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveMarketItemMappingExcelColumnsEditorComponent),
      multi: true,
    }
  ]
})
export class OliveMarketItemMappingExcelColumnsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator {
  displayedColumns = ['name', 'matchValue', 'matchSearch', 'actions'];
  dataSource: OliveMarketItemMappingExcelColumnDatasource = new OliveMarketItemMappingExcelColumnDatasource(this.cacheService);

  value: any = null;  

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translater
    );
  }

  initializeChildComponent() {
  }

  get items(): any {
    return this.dataSource.items;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formarray: this.oFormArray });
    this.dataSource.formGroup = this.oForm;
  }

  createEmptyObject() {
    return new MarketItemMappingExcelColumn();
  }

  private resetItemValue(index: number) {
    this.getArrayFormGroup(index).patchValue({matchValue: this.items[index].originalValue});
    this.oForm.markAsDirty();
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.dataSource.loadItems(obj);
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  onSelectionChange(event: any) {
    this._onChange(event.value);
  }
  onChange(event: any) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }

  validate(c: FormControl): ValidationErrors {
    return this.oForm.errors;
  }
}
