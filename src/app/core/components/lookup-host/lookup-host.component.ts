import { Component, forwardRef, ViewChild, ElementRef, Renderer2, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl, Validator, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveLookupDialogComponent } from '../lookup-dialog/lookup-dialog.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { locale as english } from 'app/core/i18n/en';

@Component({
  selector: 'olive-lookup-host',
  templateUrl: './lookup-host.component.html',
  styleUrls: ['./lookup-host.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveLookupHostComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveLookupHostComponent),
      multi: true,
    }
  ]
})
export class OliveLookupHostComponent implements ControlValueAccessor, OnInit, Validator {
  @ViewChild('lookupCtrl') private _inputElement: ElementRef;

  value: any = null;  
  @Input() id: string;
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() isEditMode = false;
  @Input() classMode = '';

  lookupName: FormControl;

  private _setting: LookupListerSetting;

  constructor(
    private dialog: MatDialog,
    private _renderer: Renderer2,
    private translater: FuseTranslationLoaderService
  ) {
    this.translater.loadTranslations(english);
  }

  ngOnInit(): void {
    this.lookupName = new FormControl(null, Validators.required);
  }

  get setting(): LookupListerSetting {
    return this._setting;
  }
  set setting(value: LookupListerSetting) {
    this._setting = value;
  }

  lookUp() {
    if (!this.isEditMode) { return; }

    const dialogRef = this.dialog.open(
      OliveLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: this.setting
      });

    dialogRef.afterClosed().subscribe(items => {
      if (items && items.length > 0) {
        this.writeValue(items[0]);
        this._onChange(items[0]);
      }
    });
  }

  getValue(): string {
    let returnValue = '';
    if (this.value) {
      returnValue = this.value.name;
    }

    return returnValue;
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  markAsTouched() {
    this.lookupName.markAsTouched();
  }
  
  get inputElement(): ElementRef {
    return this._inputElement;
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.lookupName.setValue(obj.name);  
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
    return this.lookupName.errors;
  }
}
