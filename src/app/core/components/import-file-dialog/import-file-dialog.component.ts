import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AlertService } from '@quick/services/alert.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../../../core/i18n/en';
import { OliveDocumentService } from '../../services/document.service';

@Component({
  selector: 'olive-import-dialog',
  templateUrl: './import-file-dialog.component.html',
  styleUrls: ['./import-file-dialog.component.scss']
})
export class OliveImportFileDialogComponent implements OnInit {

  onSave: Subject<any> = new Subject;
  showLoadingBar = false;
  exceljson: any;

  constructor(
    private translater: FuseTranslationLoaderService,
    private documentService: OliveDocumentService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<OliveImportFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {importType: string}
  ) { 
    this.translater.loadTranslations(english);
  }

  ngOnInit() {
  }

  translate(key: string) {
    return this.translater.get(key);
  }

  // Problem : Javascript가 Single Thread라서 mat-progress-bar가 움직이지 않음
  onUpload(event: any) {
    this.exceljson = null;
    this.showLoadingBar = true;

    this.documentService.onImportTableRendered.subscribe ((exceljson) => {
      this.showLoadingBar = false;
      this.exceljson = exceljson;
    });

    this.documentService.uploadExcel(event, 'import-table');
  }

  save(): void {
    this.showLoadingBar = true;
    this.onSave.next(this.exceljson);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showError(message: string) {
    this.alertService.showMessageBox(
      this.translater.get('common.title.saveError'),
      message
    );
  }
}
