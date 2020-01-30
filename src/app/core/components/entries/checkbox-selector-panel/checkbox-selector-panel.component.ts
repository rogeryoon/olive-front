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
  disabledRemarkPattern;

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

  /**
   * Gets whether has remark property
   */
  hasRemarkProperty(index: number): boolean {
    return this.items && this.items.length > 0 && this.items[index].hasOwnProperty('checkRemark');
  }

  readonly disabledClassName = 'disabled';

  remarkClass(index: number): string {
    if (!this.items || this.items.length === 0) {
      return '';
    }

    const remark = this.items[index].checkRemark;
    const disabledRemarkPattern = this.disabledRemarkPattern;

    let returnCssClass = this.disabledClassName;
    if (disabledRemarkPattern) {
      if (remark !== disabledRemarkPattern) {
        returnCssClass = 'remark';
      }
    }

    return returnCssClass;
  }

  /**
   * Get checkbox Disabled Status
   * @param index 
   * @returns true if checkbox is disabled
   */
  disabledCheckbox(index: number): boolean {
    return this.remarkClass(index) === this.disabledClassName;
  }

  get enabledCheckboxCount(): number {
    return this.oFArray.controls.filter(x => !x.disabled).length;
  }

    /**
   * Determines whether checked is
   * @param index 
   * @returns true if checked 
   */
  isChecked(index: number): boolean {
    if (!this.oForm.controls.formArray) { return false; }

    const formArray = this.oForm.controls.formArray as FormArray;

    return formArray.length >= index + 1 && formArray[index].value;
  }

  /**
   * Sets checked
   * @param index 
   * @param value 
   */
  setChecked(index: number, value: boolean) {
    this.oFArray.controls[index].patchValue(value ? { value: true } : null);
  }

  /**
   * Determines whether disabled is
   * @param index 
   * @returns true if disabled 
   */
  isDisabled(index: number): boolean {
    if (!this.oForm.controls.formArray) { return false; }

    const formArray = this.oForm.controls.formArray as FormArray;

    return formArray.length >= index + 1 && formArray[index].disabled;    
  }

  /**
   * 모든 아이템을 반환하되 체크되었다면 selected에 true를 설정
   */
  get allItems(): any[] {
    if (!this.oForm) { return []; }

    const formArray = this.oForm.controls.formArray as FormArray;

    formArray.controls.map((control, index) => {
      const checked = control.value;
      this.items[index].selected = checked;
    });

    return this.items;
  }

  /**
   * Gets selected items
   */
  get selectedItems(): any[] {
    return this.allItems.filter(x => x.selected);
  }

  get selectedIds(): number[] {
    return this.selectedItems.map(x => x.id);
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

      const formArray = this.oForm.controls.formArray as FormArray;

      const patchValues = formArray.controls.map(x => x.disabled ? null : (bool ? {value: true} : null));

      this.oFArray
        .patchValue(patchValues, { emitEvent: false });
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
