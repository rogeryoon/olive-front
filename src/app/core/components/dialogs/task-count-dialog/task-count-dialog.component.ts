import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AlertService } from '@quick/services/alert.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveTaskCountSetting } from 'app/core/interfaces/dialog-setting/task-count-setting';
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
    private translater: FuseTranslationLoaderService, private alertService: AlertService,
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
    return OliveUtilities.numberFormat(this.setting.count, 0);
  }

  get buttonColor() {
    return this.setting.buttonColor ? this.setting.buttonColor : 'accent';
  }

  ngOnInit() {
  }

  translate(key: string) {
    return this.translater.get(key);
  }

  click(): void {
    this.onTask.next();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
