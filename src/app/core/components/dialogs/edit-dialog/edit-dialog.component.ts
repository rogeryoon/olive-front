import { Component, OnInit, Inject, ViewChild, ComponentFactoryResolver, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountService } from '@quick/services/account.service';

import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OlivePlaceHolderDirective } from 'app/core/directives/place-holder.directive';
import { OliveBaseComponent } from '../../extends/base/base.component';

// https://angular.io/guide/dynamic-component-loader

@Component({
  selector: 'olive-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class OliveEditDialogComponent extends OliveBaseComponent implements OnInit, OnDestroy, AfterViewInit {
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
        idString = this.id36(this.setting.data.item.id);
      }
    }

    return this.setting.data.item ? { name : `[${idString}] ${this.setting.data.item.name}` } : null;
  }

  get title(): any {
    return { title : this.setting.data.translateTitleId ? this.translator.get(this.setting.data.translateTitleId) : '' } ;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    translator: FuseTranslationLoaderService,
    public dialogRef: MatDialogRef<OliveEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: OliveDialogSetting,
    private accountService: AccountService
  ) {
    super(translator);
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngAfterViewInit() {
    this.createdComponent.itemSaved$.subscribe(item => this.dialogRef.close(item));
    this.createdComponent.itemDeleted$.subscribe(item => this.dialogRef.close(item.id));
    this.createdComponent.customButtonActionEnded$.subscribe(param => {
      this.dialogRef.close(param.item);
    });
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
    this.createdComponent.startTabIndex = this.setting.data.startTabIndex;
    this.createdComponent.readOnly = this.setting.data.readOnly;
    this.createdComponent.hideDelete = this.setting.data.hideDelete;
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

  customButtonAction(buttonId: string): void {
    this.createdComponent.customButtonAction(buttonId);
  }

  customButtonVisible(buttonId: string): boolean {
    return this.createdComponent.customButtonVisible(buttonId);
  }

  customButtonEnable(buttonId: string): boolean {
    return this.createdComponent.customButtonEnable(buttonId);
  }

  get canSave(): boolean {
    return this.createdComponent.canSave();
  }

  get canDelete(): boolean {
    return this.createdComponent.canDelete();
  }

  get canManageItems() {
    return !this.createdComponent.readOnly && this.accountService.userHasPermission(this.setting.data.managePermission);
  }
}
