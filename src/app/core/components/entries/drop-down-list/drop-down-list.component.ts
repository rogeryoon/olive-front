import { Component, forwardRef, ViewChild, ElementRef, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl, Validator, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { DropDownSetting } from 'app/core/interfaces/lister-setting';


@Component({
  selector: 'olive-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveDropDownListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveDropDownListComponent),
      multi: true,
    }
  ]
})
export class OliveDropDownListComponent implements ControlValueAccessor, OnInit, Validator {
  @ViewChild('dropDownCtrl') private _inputElement: ElementRef;

  value: any = null;
  items: any[] = [];  
  @Input() placeholder = '';
  @Input() isEditMode = false;
  @Output() changed = new EventEmitter();
  
  dropDown: FormControl;

  private _setting: DropDownSetting;

  constructor(
    private _renderer: Renderer2,
    private translator: FuseTranslationLoaderService
  ) 
  {
  }

  ngOnInit(): void {
    this.dropDown = new FormControl(null, this.setting.required ? Validators.required : null);
  }

  get setting(): DropDownSetting {
    return this._setting;
  }
  set setting(value: DropDownSetting) {
    this._setting = value;
  }

  getValue(): string {
    let returnValue = '';
    if (this.value) {
      returnValue = this.value.name;
    }

    return returnValue;
  }

  markAsTouched() {
    this.dropDown.markAsTouched();
  }
  
  get inputElement(): ElementRef {
    return this._inputElement;
  }

  private _onChange = (item: any) => {};
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.dropDown.setValue(obj.name);
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._renderer.setProperty(this._inputElement.nativeElement, 'disabled', isDisabled);
  }

  onChange(event: any) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }

  validate(c: FormControl): ValidationErrors {
    return this.dropDown.errors;
  }
}
