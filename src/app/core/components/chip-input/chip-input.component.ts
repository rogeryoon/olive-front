import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, forwardRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, ValidationErrors } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { OliveCacheService } from 'app/core/services/cache.service';
import { IIDName } from 'app/core/models/id-name';
import { ShortenPipe } from 'app/core/pipes/shorten.pipe';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveChipInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveChipInputComponent),
      multi: true,
    }
  ]
})
export class OliveChipInputComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  @ViewChild('chipInput') 
  private chipInput: ElementRef;

  chipCtrl = new FormControl();

  filteredChips: Observable<any[]>;
  value: IIDName[] = [];
  allChips: IIDName[] = [];

  @Input() id: string;
  @Input() placeholder = '';
  @Input() datakey: string;
  @Input() readonly: boolean;
  @Input() maxNameLength?: number;
  @Input() showId: boolean;
  @Output() chipRemoved = new EventEmitter<IIDName>();

  companyGroup: string;

  constructor(
    private cacheService: OliveCacheService,
    private _renderer: Renderer2
  ) 
  {
  }

  ngOnInit() {
    this.initChiper();
  }

  ngAfterViewInit(): void {
    this.setCacheValues();
  }

  //#region Chip

  initChiper() {
    this.filteredChips = this.chipCtrl.valueChanges
      /*.debounceTime(400)*/
      .pipe(
        startWith(null),
        map((chip: any | null) => chip ? this.filter(chip) : this.allChips.slice())
      );
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

  private setCacheValues() {
    if (!this.datakey) { return; }

    this.cacheService.GetChunkItems(this.datakey)
      .then(items => {
        setTimeout(() => {
          this.initChipHelper(items);  
        }, 10);
      });  
  }

  private initChipHelper(values: any)
  {
    this.allChips = values;
    this.initChiper();
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

  remove(chip: IIDName, callFromExternal: boolean = false): void {
    if (callFromExternal) {
      chip = this.value.find(i => i.id === chip.id);
    }

    const index = this.value.indexOf(chip);

    if (index >= 0) {
      if (!callFromExternal) {
        this.chipRemoved.emit(chip);      
      }
      this.value.splice(index, 1);
      this._onChange(chip);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addChip(event.option.value);
    this.chipInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }

  addChip(chip: IIDName): void {
    let needToAdd = false;
    const lowerChipName = chip.name.toLowerCase();

    if (this.readonly) {
      if (!this.value.find(t => t.id === chip.id)) {
        needToAdd = true;
      }
    }
    else if (!this.value.find(t => t.name.toLowerCase() === lowerChipName)) {
      chip.name = lowerChipName.replace(/^\w/, c => c.toUpperCase());
      needToAdd = true;
    }

    if (needToAdd) {
      this.value.push(chip);
      this._onChange(chip);
    }
  }

  getChipName(chip: IIDName): string {
    let name =  '';
    if (this.showId) {
      name = `${OliveUtilities.convertToBase36(chip.id)} : `;
    }

    name += chip.name;

    if (this.maxNameLength) {
      name = new ShortenPipe().transform(name, this.maxNameLength);
    }

    return name;
  }

  //#endregion Chip
  
  
  markAsTouched() {
    this.chipCtrl.markAsTouched();
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    Object.assign(this.value, obj);
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._renderer.setProperty(this.chipInput.nativeElement, 'disabled', isDisabled);
  }

  onChange(event: any) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
    this.onChange(event);
  }

  validate(c: FormControl): ValidationErrors {
    return this.chipCtrl.errors;
  }
}
