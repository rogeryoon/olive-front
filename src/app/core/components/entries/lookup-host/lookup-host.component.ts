import { Component, forwardRef, ViewChild, ElementRef, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validator, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';

import { OliveLookupDialogComponent } from '../../dialogs/lookup-dialog/lookup-dialog.component';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { itemSelectedValidator } from 'app/core/validators/general-validators';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { createKeywordSearchOption } from 'app/core/utils/search-helpers';

@Component({
  selector: 'olive-lookup-host',
  templateUrl: './lookup-host.component.html',
  styleUrls: ['./lookup-host.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveLookupHostComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveLookupHostComponent),
      multi: true,
    }
  ]
})
export class OliveLookupHostComponent implements ControlValueAccessor, OnInit, Validator {
  @ViewChild('lookupCtrl') private _inputElement: ElementRef;

  @Input() id: string;
  @Input() placeholder = '';
  @Input() isEditMode = false;
  @Input() classMode = '';
  @Input() required = true;
  @Input() cacheKey: string;

  @Output() changed = new EventEmitter();
  @Output() selected = new EventEmitter();

  lookupName: FormControl;
  value: any = null;
  isLoading = false;
  searchedItems: any[];
  savedSearchedItems: any[];

  private _setting: LookupListerSetting;

  constructor(
    private dialog: MatDialog, private _renderer: Renderer2,
    private cacheService: OliveCacheService, private queryParams: OliveQueryParameterService
  ) {


  }

  /**
   * on init
   */
  ngOnInit(): void {
    this.lookupName = new FormControl(null, this.required ? itemSelectedValidator(this, 'searchedItems') : null);

    if (this.companyGroupIdCacheKey) {
      // Cache Value Loading
      this.cacheService.getUserPreference(this.companyGroupIdCacheKey)
        .then(obj => {
          if (obj) {
            this.lookupName.setValue(obj.name);
          }
        });
    }

    this.bindAutoCompleteEvent();
  }

  /**
   * Gets setting
   */
  get setting(): LookupListerSetting {
    return this._setting;
  }
  /**
   * Sets setting
   */
  set setting(value: LookupListerSetting) {
    this._setting = value;
  }

  /**
   * Gets input element
   */
  get inputElement(): ElementRef {
    return this._inputElement;
  }

  /**
   * Gets cache key of lookup value
   */
  get companyGroupIdCacheKey(): string {
    if (!this.cacheKey) { return null; }
    return OliveCacheService.cacheKeys.userPreference.lookupHost + this.cacheKey + this.queryParams.CompanyGroupId;
  }

  /**
   * Binds auto complete event
   */
  private bindAutoCompleteEvent() {
    this.lookupName.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isLoading = true),
        switchMap(value => this.setting.dataService.getItems(createKeywordSearchOption(value, this.setting.searchOption))
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe((response: any) => {
        this.searchedItems = response.model;
      });
  }

  /**
   * Clears olive lookup host component
   */
  clear() {
    this.lookupName.setValue('');
    this.searchedItems = null;
    this.value = null;
  }

  /**
   * AutoComplete 선택 이벤트
   * @param event 
   */
  onOptionSelected(event: any) {
    const selectedItem = this.searchedItems.find(item => item.name === event.option.value);
    this.setValue(selectedItem);
  }

  /**
   * Pops up look up dialog
   * @returns  
   */
  popUpLookUpDialog() {
    if (!this.isEditMode) { return; }

    this.savedSearchedItems = _.cloneDeep(this.searchedItems);
    this.searchedItems = null;

    const setting = _.cloneDeep(this.setting);
    setting.currentItem = this.value;

    const dialogRef = this.dialog.open(
      OliveLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe(items => {
      if (items && items.length > 0) {
        const item = items[0];
        this.setValue(item);
        this.savedSearchedItems = null;
      }
    });
  }

  /**
   * Input 값을 변경
   * @param item 
   */
  setValue(item: any) {
    this.writeValue(item);
    this._onChange(item);
    this.selected.emit(item);
    this.cacheService.setUserPreference(this.companyGroupIdCacheKey, item);
  }

  /**
   * Marks as touched
   */
  markAsTouched() {
    this.lookupName.markAsTouched();
  }

  private _onChange = (item: any) => { };
  private _onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.searchedItems = [obj];
      this.lookupName.setValue(obj.name);
    }

    this.changed.emit(obj);
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._renderer.setProperty(this._inputElement.nativeElement, 'disabled', isDisabled);
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
    return this.lookupName.errors;
  }
}
