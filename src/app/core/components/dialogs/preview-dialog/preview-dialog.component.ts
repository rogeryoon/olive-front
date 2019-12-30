import { Component, OnInit, Inject, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveSearchDialogComponent } from '../search-dialog/search-dialog.component';
import { OlivePlaceHolderDirective } from 'app/core/directives/place-holder.directive';
import { OliveOnPreview } from 'app/core/interfaces/on-preview';

@Component({
  selector: 'olive-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class OlivePreviewDialogComponent implements OnInit, OnDestroy {
  @ViewChild(OlivePlaceHolderDirective) placeHolder: OlivePlaceHolderDirective;
  componentRef: any;

  createdComponent: OliveOnPreview;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<OliveSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog: OliveDialogSetting
  ) { 
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.componentRef.destroy(); 
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dialog.component);

    const viewContainerRef = this.placeHolder.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    this.createdComponent = (<OliveOnPreview>this.componentRef.instance);
    this.createdComponent.data = this.dialog.data;
  }

  print() {
    this.createdComponent.onPrint();
    this.dialogRef.close('print');
  }

  excel() {
    this.createdComponent.onExcel();
  }  

  cancel() {
    this.dialogRef.close(null);
  }
}
