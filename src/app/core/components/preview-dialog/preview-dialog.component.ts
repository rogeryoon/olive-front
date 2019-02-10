import { Component, OnInit, Inject, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
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

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<OliveSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog: OliveDialogSetting,
    private translater: FuseTranslationLoaderService
  ) { 
    this.translater.loadTranslations(english);
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
    (<OliveOnPreview>this.componentRef.instance).data = this.dialog.data;
  }

  print() {

  }

  cancel() {
    
  }
}
