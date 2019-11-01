import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { String } from 'typescript-string-operations';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { OliveTaskCountSetting } from 'app/core/interfaces/dialog-setting/task-count-setting';
import { numberFormat } from 'app/core/utils/number-helper';
import { NameValue } from 'app/core/models/name-value';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-task-count-dialog',
  templateUrl: './task-count-dialog.component.html',
  styleUrls: ['./task-count-dialog.component.scss']
})
export class OliveTaskCountDialogComponent implements OnInit {

  onTask: Subject<any> = new Subject;
  setting: OliveTaskCountSetting;

  constructor(
    private dialogRef: MatDialogRef<OliveTaskCountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.setting = this.data;
  }

  get dialogTitle() {
    return this.setting.title;
  }

  get taskCount(): string {
    return numberFormat(this.setting.count, 0);
  }

  get hasCountValue(): boolean {
    return !OliveUtilities.testIsUndefined(this.setting.count);
  }

  get buttonColor() {
    return this.setting.buttonColor ? this.setting.buttonColor : 'accent';
  }

  ngOnInit() {
  }

  subCountText(subCount: NameValue) {
    return String.Format(subCount.name, numberFormat(subCount.value, 0));
  }

  click(): void {
    this.onTask.next();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
