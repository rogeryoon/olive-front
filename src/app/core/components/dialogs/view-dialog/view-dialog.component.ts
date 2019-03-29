import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ComponentFactoryResolver, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountService } from '@quick/services/account.service';

import { OliveBaseComponent } from '../../extends/base/base.component';
import { OlivePlaceHolderDirective } from 'app/core/directives/place-holder.directive';
import { OliveOnRefer } from 'app/core/interfaces/on-refer';
import { locale as english } from '../../../i18n/en';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';

@Component({
  selector: 'olive-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss']
})
export class OliveViewDialogComponent extends OliveBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(OlivePlaceHolderDirective) placeHolder: OlivePlaceHolderDirective;
  componentRef: any;

  createdComponent: OliveOnRefer;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private translater: FuseTranslationLoaderService,
    public dialogRef: MatDialogRef<OliveViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: OliveDialogSetting,
    private accountService: AccountService
  ) {
    super();
    this.translater.loadTranslations(english);
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.componentRef.destroy(); 
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.setting.component);

    const viewContainerRef = this.placeHolder.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    this.createdComponent = (<OliveOnRefer>this.componentRef.instance);

    this.createdComponent.title = this.setting.data.title;
  }

  get title() {
    return this.createdComponent.title;
  }

  ok(): void {
    this.dialogRef.close(null);
  }
}
