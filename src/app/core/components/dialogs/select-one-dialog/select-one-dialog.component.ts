import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IdName } from 'app/core/models/id-name';
import { OliveSelectOneSetting } from 'app/core/interfaces/dialog-setting/select-one-setting';

@Component({
  selector: 'olive-select-one-dialog',
  templateUrl: './select-one-dialog.component.html',
  styleUrls: ['./select-one-dialog.component.scss']
})
export class OliveSelectOneDialogComponent implements OnInit {
  selectedItem: any;
  items: IdName[] = [];

  setting: OliveSelectOneSetting;

  constructor(
    private dialogRef: MatDialogRef<OliveSelectOneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.setting = this.data;
    this.items = this.setting.items;
  }

  get dialogTitle() {
    return this.setting.title;
  }

  get dialogDescription() {
    return this.setting.description;
  }  

  ngOnInit() {
  }

  select(): void {
    if (!this.selectedItem) { return; }
    this.dialogRef.close(this.selectedItem.id);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
