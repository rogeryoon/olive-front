import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveEntityDateComponent } from '../entity-date/entity-date.component';
import { OliveEntityFormBaseComponent } from './entity-form-base.component';

@Component({
  selector: 'olive-entity-form',
  template: ''
})
export class OliveEntityFormComponent extends OliveEntityFormBaseComponent {
  @ViewChild(OliveEntityDateComponent)
  private dateComponent: OliveEntityDateComponent;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  get name() {
    return this.oForm.get('name');
  }

  get hasError() {
    return (!this.oForm.valid || this.hasOtherError()) && this.oForm.touched;
  }

  protected hasOtherError(): boolean {
    return false;
  }
}
