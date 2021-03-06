import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AlertDialog, DialogType } from '@quick/services/alert.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Component({
  selector: 'olive-app-dialog',
  templateUrl: './app-dialog.component.html',
  styleUrls: ['./app-dialog.component.scss']
})
export class OliveAppDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OliveAppDialogComponent>,
    private translator: FuseTranslationLoaderService,
    @Inject(MAT_DIALOG_DATA) private data: AlertDialog
  ) {
    dialogRef.disableClose = true;
  }

  get showTitle() {
    return this.data.title && this.data.title.length;
  }

  get title() {
    return this.data.title;
  }

  get htmlMessage() {
    return this.data.message.replace(/\n/g, '<br/><br/>');
  }

  get message() {
    return this.data.message;
  }

  get okLabel() {
    return this.data.okLabel || this.translator.get('common.button.ok');
  }

  get cancelLabel() {
    return this.data.cancelLabel || this.translator.get('common.button.cancel');
  }

  get showCancel() {
    return this.data.type !== DialogType.alert;
  }

  get isPrompt() {
    return this.data.type === DialogType.prompt;
  }

  result: string;

  ok() {
    if (this.data.type === DialogType.prompt) {
      this.data.okCallback(this.result || this.data.defaultValue);
    }
    else {
      this.data.okCallback();
    }
    this.dialogRef.close();
  }

  cancel(): void {
    if (this.data.cancelCallback) {
      this.data.cancelCallback();
    }
    this.dialogRef.close();
  }
}
