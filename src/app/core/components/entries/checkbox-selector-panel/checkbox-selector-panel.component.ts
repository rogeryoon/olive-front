import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveCacheService } from 'app/core/services/cache.service';

@Component({
  selector: 'olive-checkbox-selector-panel',
  templateUrl: './checkbox-selector-panel.component.html',
  styleUrls: ['./checkbox-selector-panel.component.scss']
})
export class OliveCheckboxSelectorPanelComponent extends OliveEntityFormComponent {
  items: any[] = [];

  selectedAnyCheckbox = false;

  loadingIndicator = false;

  @Input()
  titleId = 'common.title.select';

  @Input()
  buttonId = 'common.button.load';

  @Input()
  iconName = 'find_in_page';

  @Input()
  cacheKey: string;

  @Input()
  visibleLoadButton = true;

  @Output() idSelected = new EventEmitter<any[]>();

  visible = true;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
    
  ) {
    super(
      formBuilder, translator
    );
  }

  get selectedItems(): any[] {
    if (!this.oForm) { return []; }

    return this.oForm.value.formArray
    .map((checked, index) => checked ? this.items[index] : null)
    .filter(value => value !== null);
  }

  get selectedIds(): number[] {
    if (!this.oForm) { return []; }
    
    return this.oForm.value.formArray
    .map((checked, index) => checked ? this.items[index].id : null)
    .filter(value => value !== null);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      formArray: this.buildFormArray(),
      selectAll: new FormControl(false)
    });
  }

  buildFormArray() {
    const arr = this.items.map(() => {
      return new FormControl(false);
    });
    return new FormArray(arr);
  }

  resetForm() {
    this.oForm.reset({});

    this.subscribeChanges();

    this.cacheService.getUserPreference(this.cacheKey)
      .then((ids: number[]) => {
        if (ids) {
          ids.forEach((id: number) => {
            for (let idx = 0; idx < this.items.length; idx++) {
              if (this.items[idx].id === id) {
                this.oFArray.controls[idx].patchValue({ value: true });
                return;
              }
            }
          });
        }
      });
  }

  setItems(items: any[]): void {
    this.items = items;
  }

  setUserPreference() {
    this.cacheService.setUserPreference(this.cacheKey, this.selectedIds);
  }

  subscribeChanges() {
    // Subscribe to changes on the selectAll checkbox
    this.oForm.get('selectAll').valueChanges.subscribe(bool => {
      this.selectedAnyCheckbox = bool;
      this.oFArray
        .patchValue(Array(this.items.length).fill(bool), { emitEvent: false });
    });

    // Subscribe to changes on the checkboxes
    this.oFArray.valueChanges.subscribe(val => {
      const allSelected = val.every(bool => bool);
      this.selectedAnyCheckbox = val.some(bool => bool);
      if (this.oForm.get('selectAll').value !== allSelected) {
        this.oForm.get('selectAll').patchValue(allSelected, { emitEvent: false });
      }
    });
  }

  load() {
    this.loadingIndicator = true;

    this.setUserPreference();

    this.idSelected.emit(this.selectedItems);

    this.loadingIndicator = false;
  }
}
