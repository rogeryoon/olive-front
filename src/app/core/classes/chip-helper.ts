import { ElementRef } from '@angular/core';
import { MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { IIDName } from '../../core/models/id-name';

export class ChipHelper {
  chipFormControl: FormControl;
  chipInput: ElementRef;
  filteredChips: Observable<any[]>;
  idNames: IIDName[] = [];
  allChips: IIDName[] = [];
  dataKey: string;

  constructor(chipFormContol: FormControl, dataKey: string = null) {
    this.chipFormControl = chipFormContol;
    this.dataKey = dataKey;
  }

  initialize() {
    this.filteredChips = this.chipFormControl.valueChanges
      /*.debounceTime(400)*/
      .pipe(
        startWith(null),
        map((chip: any | null) => chip ? this.filter(chip) : this.allChips.slice())
      );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.addChip({ id: -1, name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(chip: IIDName): void {
    const index = this.idNames.indexOf(chip);

    if (index >= 0) {
      this.idNames.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addChip(event.option.value);
    this.chipInput.nativeElement.value = '';
    this.chipFormControl.setValue(null);
  }

  addChip(chip: IIDName): void {
    const lower = chip.name.toLowerCase();
    if (!(this.idNames.find(t => t.name.toLowerCase() === lower))) {
      chip.name = lower.replace(/^\w/, c => c.toUpperCase());
      this.idNames.push(chip);
    }
  }

  private filter(value: any): IIDName[] {
    let filterValue = '';
    if (typeof value === 'object') {
    }
    else {
      filterValue = value.toLowerCase();
    }

    return this.allChips
      .filter(chip => chip.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
