import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { OliveBaseComponent } from '../base/base.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { isMoneyPattern, isNumberPattern } from 'app/core/utils/string-helper';
import { testIsUndefined, itemWithIdNAudit, markFormGroupTouched } from 'app/core/utils/object-helpers';

@Component({
  selector: 'olive-entity-form-base',
  template: ''
})
export class OliveEntityFormBaseComponent extends OliveBaseComponent implements OnInit, OnChanges, OnDestroy {
  private _item: any;
  get item(): any {
    return this._item;
  }
  @Input('item')
  set item(value: any) {
    this._item = value;
  }

  @Input() idVisible = false;

  @Output() formReady = new EventEmitter<FormGroup>();

  readOnly = false;

  constructor(
    protected formBuilder: FormBuilder, 
    translator: FuseTranslationLoaderService
  ) 
  { 
    super(translator);
  }

  get isIdVisible(): boolean {
    return this.idVisible && !this.isNewItem;
  }
  
  /**
   * Initializes child component 
   * : virtual - ngOnInit()에서 Call됨
   */
  initializeChildComponent() {
    $(document).ready(function () {
      ($('input.auto-size') as any).inputfit();
    });   
  }

  buildForm() { this.oForm = this.formBuilder.group({}); }
  resetForm() { this.oForm.reset({}); }
  onChanges() {}
  createEmptyObject(): any {
    return null;
  }
  protected markCustomControlsTouched() {}
  cleanUpChildComponent() {}

  ngOnInit() {
    super.ngOnInit();

    this.initializeChildComponent();

    this.buildForm();

    this.resetForm();

    // Emit the form group to the father to do whatever it wishes
    this.formReady.emit(this.oForm);
  }

  ngOnChanges() {
    this.checkItemExists();
    this.onChanges();
  }

  ngOnDestroy() {
    this.cleanUpChildComponent();
  }

  checkItemExists() {
    if (testIsUndefined(this.item) || testIsUndefined(this.item.id)) {
      this.isNewItem = true;
      this.item = this.createEmptyObject();
    }
    else {
      this.isNewItem = false;
    }
  }

  markAsTouched() {
    markFormGroupTouched(this.oForm);
    this.markCustomControlsTouched();
  }

  /**
   * After a form is initialized, we link it to our main form
   */
  formInitialized(name: string, form: FormGroup) {
    this.oForm.setControl(name, form);
  }

  itemWithIdNAudit(source: any): any
  {
    return itemWithIdNAudit(source, this.item);
  }

  // Invalid Control를 찾아 낸다.
  // How to find the invalid controls in angular 4 reactive form
  // https://stackoverflow.com/questions/45220073/how-to-find-the-invalid-controls-in-angular-4-reactive-form
  findInvalidControls() {
    const invalid = [];
    const controls = this.oForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  getMoney(value: any) {
    let amount = 0;
    if (isMoneyPattern(value)) {
      amount = +value;
    }
    return amount;
  }

  getNumber(value: any) {
    let amount = 0;
    if (isNumberPattern(value)) {
      amount = +value;
    }
    return amount;
  }

  setControlValue(name: string, value: any) {
    this.oForm.controls[name].setValue(value);
  }

  getControlValue(name: string): string {
    return this.getControl(name).value;
  }

  isControlValueEmpty(name: string): boolean {
    return this.getControlValue(name).trim().length === 0;
  }
}
