import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { OliveTaskCountSetting } from 'app/core/interfaces/dialog-setting/task-count-setting';
import { numberFormat } from 'app/core/utils/helpers';

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

  get taskCount() {
    return numberFormat(this.setting.count, 0);
  }

  get buttonColor() {
    return this.setting.buttonColor ? this.setting.buttonColor : 'accent';
  }

  ngOnInit() {
  }

  click(): void {
    this.onTask.next();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
