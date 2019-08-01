import { Component, forwardRef, ViewChild, ElementRef, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl, Validator, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ReferHostSetting } from 'app/core/interfaces/lister-setting';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveEditDialogComponent } from '../../dialogs/edit-dialog/edit-dialog.component';

@Component({
  selector: 'olive-refer-host',
  templateUrl: './refer-host.component.html',
  styleUrls: ['./refer-host.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveReferHostComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveReferHostComponent),
      multi: true,
    }
  ]
})
export class OliveReferHostComponent implements ControlValueAccessor, OnInit, Validator {
  @ViewChild('lookupCtrl') private _inputElement: ElementRef;

  value: any = null;  
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() isEditMode = false;

  @Output() changed = new EventEmitter();
  @Output() selected = new EventEmitter();

  lookupName: FormControl;
  loadingIndicator: boolean;

  private _setting: ReferHostSetting;

  private savedObjects = new Map<number, any>();

  constructor(
    private dialog: MatDialog, private _renderer: Renderer2, 
    private translator: FuseTranslationLoaderService, private messageHelper: OliveMessageHelperService
  ) 
  {
  }

  ngOnInit(): void {
    this.lookupName = new FormControl(null, null);
  }

  get setting(): ReferHostSetting {
    return this._setting;
  }
  set setting(value: ReferHostSetting) {
    this._setting = value;
  }

  lookUp() {
    if (!this.isEditMode) { return; }

    this.loadingIndicator = true;

    if (this.savedObjects.has(this.value.id)) {
      this.openDialog(this.savedObjects.get(this.value.id));
    }
    else {
      this.setting.dataService.getItem(this.value.id).subscribe(
        response => {
          this.loadingIndicator = false;
  
          this.openDialog(response.model);
          this.savedObjects.set(this.value.id, response.model);
        },
        error => {
          this.loadingIndicator = false;            
          this.messageHelper.showLoadFailedSticky(error);
        }
      );
    }
  }

  private openDialog(item: any) {
    const dialogSetting = new OliveDialogSetting(
      this.setting.managerComponent, 
      {
        item: item,
        itemType: this.setting.itemType,
        managePermission: this.setting.managePermission,
        customTitle: this.getCustomTitle(item),
        readOnly : this.setting.readonly
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: dialogSetting
      });            
  }

  getCustomTitle(item): string {
    if (this.setting.customTitleCallback) {
      return this.setting.customTitleCallback(item, this.setting.customTitleTemplate);
    }
    return null;
  }

  getValue(): string {
    let returnValue = '';
    if (this.value) {
      if (this.setting.customNameCallback) {
        return this.setting.customNameCallback(this.value);
      }
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

  private _onChange = (item: any) => {};
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.lookupName.setValue(obj.name);
    }

    this.changed.emit(obj);
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
