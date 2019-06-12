import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveDocumentService } from '../../../services/document.service';
import { OliveEntityFormComponent } from '../../extends/entity-form/entity-form.component';

@Component({
  selector: 'olive-import-dialog',
  templateUrl: './import-file-dialog.component.html',
  styleUrls: ['./import-file-dialog.component.scss']
})
export class OliveImportFileDialogComponent extends OliveEntityFormComponent implements OnInit {

  onSave: Subject<any> = new Subject;
  showLoadingBar = false;
  uploadData: any;
  columnNames = [];

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService, 
    protected documentService: OliveDocumentService, protected alertService: AlertService, 
    protected dialogRef: MatDialogRef<OliveImportFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {importType: string}
  ) 
  {
    super(formBuilder, translater);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  translate(key: string) {
    return this.translater.get(key);
  }

  // Problem : Javascript가 Single Thread라서 mat-progress-bar가 움직이지 않음
  onUpload(event: any) {
    this.uploadData = null;
    this.showLoadingBar = true;

    this.documentService.onImportTableRendered.subscribe ((data) => {
      this.showLoadingBar = false;

      if (typeof data === 'string') {
        this.alertService.showMessageBox(
          this.translater.get('common.title.errorOccurred'),
          data
        );
      }
      else {
        this.uploadData = data;
      }
    });

    this.documentService.uploadExcel(event, 'import-table', true);
  }

  save(): void {
    this.showLoadingBar = true;
    this.onSave.next(this.uploadData);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showError(message: string) {
    this.alertService.showDialog
    (
      this.translater.get('common.title.saveError'),
      message,
      DialogType.alert,
      () => this.cancel()
    );
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
    });
  }

  resetForm() {
    this.oForm.reset({
    });
  }
}
