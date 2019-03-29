import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Product } from '../../models/product.model';
import { OliveChipInputComponent } from 'app/core/components/entries/chip-input/chip-input.component';

@Component({
  selector: 'olive-product-class-editor',
  templateUrl: './product-class-editor.component.html',
  styleUrls: ['./product-class-editor.component.scss']
})
export class OliveProductClassEditorComponent extends OliveEntityFormComponent {
  @ViewChild('brands') 
  brands: OliveChipInputComponent;

  @ViewChild('categories') 
  categories: OliveChipInputComponent;

  @ViewChild('tags') 
  tags: OliveChipInputComponent;

  constructor(formBuilder: FormBuilder, translater: FuseTranslationLoaderService) {
    super(
      formBuilder, translater
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;
    
    return {
      brands: this.brands.value,
      categories: this.categories.value,
      tags: this.tags.value
    };
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      brands: null,
      categories: null,
      tags: null
    });
  }

  resetForm() {
    this.oForm.reset({
      brands: this.item.brands,
      categories: this.item.categories,
      tags: this.item.tags
    });
  }

  createEmptyObject() {
    return new Product();
  }

  markCustomControlsTouched() {
    this.brands.markAsTouched();
    this.categories.markAsTouched();
    this.tags.markAsTouched();
  }
}
