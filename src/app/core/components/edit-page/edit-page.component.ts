import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy, AfterViewInit, Type, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AccountService } from '@quick/services/account.service';
import { AlertService, DialogType } from '@quick/services/alert.service';

import { locale as english } from '../../../core/i18n/en';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OlivePlaceHolderDirective } from 'app/core/directives/place-holder.directive';
import { OliveBaseComponent } from '../base/base.component';

// https://angular.io/guide/dynamic-component-loader

export class EditPageSetting {
  component: Type<any>;
  item?: any;
  itemType: Type<any>;
  managePermission: any;
  iconName: string;
  translateTitleId?: string;
  customTitle?: string;
  itemListPath: string;
}

@Component({
  selector: 'olive-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class OliveEditPageComponent extends OliveBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(OlivePlaceHolderDirective) placeHolder: OlivePlaceHolderDirective;
  componentRef: any;

  setting: EditPageSetting;
  createdComponent: OliveOnEdit;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver, private translater: FuseTranslationLoaderService,
    private accountService: AccountService, private alertService: AlertService,
    private router: Router
  ) {
    super();
    this.translater.loadTranslations(english);
  }

  ngOnInit() {
    this.initializeChildComponent();
    this.loadComponent();
  }

  ngAfterViewInit() {
    this.createdComponent.itemSaved$.subscribe(item => this.showEditCompleted());
    this.createdComponent.itemDeleted$.subscribe(item => this.showEditCompleted());
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }

  showEditCompleted() {
    this.alertService.showDialog(
      this.translater.get('common.title.success'),
      this.translater.get('common.message.requestFinished'),
      DialogType.alert,
      () => this.router.navigate([this.setting.itemListPath])
    );
  }

  get name(): any {
    let idString = '';

    if (this.setting.item) {
      if (this.setting.item.code) {
        idString = this.setting.item.code;
      }
      else {
        idString = this.id36(this.setting.item.id);
      }
    }

    return this.setting.item ? { name: `[${idString}] ${this.setting.item.name}` } : null;
  }

  get title(): any {
    return { title: this.translater.get(this.setting.translateTitleId) };
  }

  get pageIcon() {
    return this.setting.iconName;
  }

  get pageTitleId() {
    return this.setting.translateTitleId;
  }

  initializeChildComponent() { }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.setting.component);

    const viewContainerRef = this.placeHolder.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    this.createdComponent = (<OliveOnEdit>this.componentRef.instance);

    this.createdComponent.item = this.setting.item;
    this.createdComponent.managePermission = this.setting.managePermission;
    this.createdComponent.itemType = this.setting.itemType;
    this.createdComponent.customTitle = this.setting.customTitle;
  }

  get customTitle() {
    return this.createdComponent.customTitle;
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
    return this.accountService.userHasPermission(this.setting.managePermission);
  }
}
