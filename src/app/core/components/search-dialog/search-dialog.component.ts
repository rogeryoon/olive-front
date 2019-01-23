import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveSearchFormDirective } from '../../../core/directives/search-form.directive';
import { OliveDialogSetting } from '../../classes/dialog-setting';
import { OliveOnSearch } from '../../interfaces/on-search';
import { locale as english } from '../../../core/i18n/en';

// https://angular.io/guide/dynamic-component-loader

@Component({
  selector: 'olive-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class OliveSearchDialogComponent implements OnInit, OnDestroy {
  @ViewChild(OliveSearchFormDirective) oliveSearchForm: OliveSearchFormDirective;
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
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dialog.component);

    const viewContainerRef = this.oliveSearchForm.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (<OliveOnSearch>this.componentRef.instance).data = this.dialog.data;
  }

  search(): void {
    const result =
      (<OliveOnSearch>this.componentRef.instance).oliveOnSearch();

    if (result != null) {
      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
