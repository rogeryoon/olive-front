import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveEntityDateComponent } from '../../entries/entity-date/entity-date.component';
import { OliveEntityFormBaseComponent } from '../entity-form-base/entity-form-base.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Component({
  selector: 'olive-entity-form',
  template: ''
})
export class OliveEntityFormComponent extends OliveEntityFormBaseComponent {
  @ViewChild(OliveEntityDateComponent)
  private dateComponent: OliveEntityDateComponent;

  constructor(formBuilder: FormBuilder, translater: FuseTranslationLoaderService) {
    super(formBuilder, translater);
  }

  get hasError() {
    return (!this.oForm.valid || this.hasOtherError()) && this.oForm.touched;
  }

  protected hasOtherError(): boolean {
    return false;
  }
}
