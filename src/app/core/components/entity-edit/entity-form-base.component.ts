import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-entity-form-base',
  template: ''
})
export class OliveEntityFormBaseComponent implements OnInit, OnChanges, OnDestroy {
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
  
  constructor(protected formBuilder: FormBuilder) 
  { 
    this.initializeComponent();
  }

  get isIdVisible(): boolean {
    return this.idVisible && !this.isNewItem;
  }

  private initializeComponent() {
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

  boolValue(value?: boolean): boolean {
    return value == null ? true : value;
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

  Id36(id: number): string {
    return OliveUtilities.convertToBase36(id);
  }
}
