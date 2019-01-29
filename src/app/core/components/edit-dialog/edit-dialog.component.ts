import { Component, OnInit, Inject, ViewChild, ComponentFactoryResolver, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountService } from '@quick/services/account.service';

import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { locale as english } from '../../../core/i18n/en';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OlivePlaceHolderDirective } from 'app/core/directives/place-holder.directive';

// https://angular.io/guide/dynamic-component-loader

@Component({
  selector: 'olive-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class OliveEditDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(OlivePlaceHolderDirective) placeHolder: OlivePlaceHolderDirective;
  componentRef: any;

  createdComponent: OliveOnEdit;

  readonly maxDialogTitleLength = 60;

  get name(): any {
    let idString = '';

    if (this.setting.data.item) {
      if (this.setting.data.item.code) {
        idString = this.setting.data.item.code;
      }
      else
      {
        idString = OliveUtilities.convertToBase36(this.setting.data.item.id);
      }
    }

    return this.setting.data.item ? { name : `[${idString}] ${this.setting.data.item.name}` } : null;
  }

  get title(): any {
    return { title : this.translater.get(this.setting.data.translateTitleId) } ;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private translater: FuseTranslationLoaderService,
    public dialogRef: MatDialogRef<OliveEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: OliveDialogSetting,
    private accountService: AccountService
  ) {
    this.translater.loadTranslations(english);
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngAfterViewInit() {
    this.createdComponent.itemSaved$.subscribe(item => this.dialogRef.close(item));
    this.createdComponent.itemDeleted$.subscribe(item => this.dialogRef.close(item.id));
  }

  ngOnDestroy() {
    this.componentRef.destroy(); 
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.setting.component);

    const viewContainerRef = this.placeHolder.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    this.createdComponent = (<OliveOnEdit>this.componentRef.instance);

    this.createdComponent.item = this.setting.data.item;
    this.createdComponent.managePermission = this.setting.data.managePermission;
    this.createdComponent.itemType = this.setting.data.itemType;
    this.createdComponent.customTitle = this.setting.data.customTitle;
  }

  get customTitle() {
    return this.createdComponent.customTitle;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.createdComponent.save();
  }

  delete(): void {
    this.createdComponent.delete();
  }

  get canSave(): boolean {
    return this.createdComponent.canSave();
  }

  get canManageItems() {
    return this.accountService.userHasPermission(this.setting.data.managePermission);
  }
}
