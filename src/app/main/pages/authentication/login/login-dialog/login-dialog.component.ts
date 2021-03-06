import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { OliveLoginControlComponent } from '../login-control/login-control.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'olive-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class OliveLoginDialogComponent implements AfterViewInit {
  @ViewChild(OliveLoginControlComponent)
  loginControl: OliveLoginControlComponent;

  constructor(
    public dialogRef: MatDialogRef<OliveLoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngAfterViewInit(): void {
    this.loginControl.modalClosedCallback = () => this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
