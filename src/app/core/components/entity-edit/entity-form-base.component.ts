import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

import { String } from 'typescript-string-operations';

import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveBaseComponent } from '../base/base.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

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

  oForm: FormGroup; 
  
  isNewItem: boolean;

  oFormArray: FormArray;
  
  constructor(
    protected formBuilder: FormBuilder, 
    protected translater: FuseTranslationLoaderService
  ) 
  { 
    super();
  }

  get isIdVisible(): boolean {
    return this.idVisible && !this.isNewItem;
  }

  initializeChildComponent() {}
  buildForm() {}
  resetForm() {}
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
  }

  ngOnDestroy() {
    this.cleanUpChildComponent();
  }

  checkItemExists() {
    if (OliveUtilities.TestIsUndefined(this.item) || OliveUtilities.TestIsUndefined(this.item.id)) {
      this.isNewItem = true;
      this.item = this.createEmptyObject();
    }
    else {
      this.isNewItem = false;
    }
  }

  markAsTouched() {
    OliveUtilities.markFormGroupTouched(this.oForm);
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
    return OliveUtilities.itemWithIdNAudit(source, this.item);
  }

  // Invalid Cotrol를 찾아 낸다.
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

  getControl(name) {
    return this.oForm.get(name);
  }

  get oFArray(): FormArray {
    return <FormArray>this.getControl('formarray');
  }

  protected arrayErrorMessage(name: string, index: number): string {
    const formGroup = this.oFArray.controls[index] as FormGroup;
    return this.controlErrorMessage(formGroup.get(name));
  }
  
  protected errorMessage(name: string): string {
    return this.controlErrorMessage(this.getControl(name));
  }

  private controlErrorMessage(control: AbstractControl): string {
    let message = '';

    if (OliveUtilities.TestIsUndefined(control.errors) || !control.touched) {
      return '';
    }

    if (control.errors.hasOwnProperty('required')) {
      message = this.translater.get('common.validate.required');
    }
    else
    if (control.errors.hasOwnProperty('pattern')) {
      message = this.translater.get('common.validate.pattern');
    }    
    else
    if (control.errors.hasOwnProperty('number')) {
      let decimal = '';
      decimal = String.Format(this.translater.get('common.validate.decimal'), control.errors.number);
      message = String.Format(this.translater.get('common.validate.number'), decimal);
    }
    else
    if (control.errors.hasOwnProperty('min')) {
      message = String.Format(this.translater.get('common.validate.minNumber'), control.errors.min);
    }
    else
    if (control.errors.hasOwnProperty('max') ) {
      message = String.Format(this.translater.get('common.validate.maxNumber'), control.errors.max);
    }

    return message;
  }

  hasArrayEntryError(name: string, index: number): boolean {
    const formGroup = (<FormArray>this.getControl('formarray')).controls[index] as FormGroup;
    return this.controlHasEntryError(formGroup.get(name));
  }

  hasEntryError(name: string): boolean {
    return this.controlHasEntryError(this.getControl(name));
  }

  private controlHasEntryError(control: any): boolean {
    let hasError = false;

    if (OliveUtilities.TestIsUndefined(control.errors)) {
      return hasError = false;
    }
    else 
    if (control.errors.hasOwnProperty('required')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('pattern')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('number')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('min')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('max')) {
      hasError = true;
    }

    return control.touched && hasError;
  }

  getMoney(value: any) {
    let amount = 0;
    if (OliveUtilities.isMoneyPattern(value)) {
      amount = +value;
    }
    return amount;
  }

  getNumber(value: any) {
    let amount = 0;
    if (OliveUtilities.isNumberPattern(value)) {
      amount = +value;
    }
    return amount;
  }
}
