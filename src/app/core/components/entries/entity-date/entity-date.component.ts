import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveEntityFormBaseComponent } from '../../extends/entity-form-base/entity-form-base.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { UserName } from 'app/core/models/user-name';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-entity-date',
  templateUrl: './entity-date.component.html',
  styleUrls: ['./entity-date.component.scss']
})
export class OliveEntityDateComponent extends OliveEntityFormBaseComponent {
  updaterTitle: string;
  createrTitle: string;
  isUpdaterInfo = true;
  visible = true;

  @Input() mode = 'textbox';

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) {
    super(formBuilder, translater);
  }

  get createdDateExists(): boolean {
    return this.item != null && !this.isNull(this.item.createdUtc);
  }

  get createrExists(): boolean {
    return this.item != null && !this.isNull(this.item.createdUser);
  }

  get updatedDateExists(): boolean {
    return this.item != null && !this.isNull(this.item.updatedUtc);
  }

  get updaterExists(): boolean {
    return this.item != null && !this.isNull(this.item.updatedUser);
  }

  get iconName(): string {
    return this.isUpdaterInfo && this.updaterTitle ? 'update' : 'create';
  }

  get infoText(): string {
    return this.isUpdaterInfo ? this.updaterTitle : this.createrTitle;
  }

  get textLableName(): string {
    return this.translater.get((this.isUpdaterInfo && this.updaterTitle ? 'common.title.lastUpdater' : 'common.title.creater'));
  }

  onClick() {
    if (this.updaterTitle && this.createrTitle) {
      this.isUpdaterInfo = !this.isUpdaterInfo;
    }
    else if (this.updaterTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.createrTitle) {
      this.isUpdaterInfo = false;
    }
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      user: '',
    });
  }

  resetForm() {
    if (this.isNewItem) { 
      this.visible = false;
      return; 
    }

    const userNameKeys: string[] = [];

    if (this.createrExists) {
      userNameKeys.push(this.item.createdUser);
    }

    if (this.updaterExists) {
      userNameKeys.push(this.item.updatedUser);
    }

    if (userNameKeys.length > 0) {
      this.cacheService.getUserNames(userNameKeys)
        .then(userNames => {
          let userName: UserName;

          userName = userNames.find(item => item.userAuditKey === this.item.createdUser);
          this.createrTitle =
            this.setUnitTitle(userName, this.item.createdUtc, this.translater.get('common.title.creater'));
      
          userName = userNames.find(item => item.userAuditKey === this.item.updatedUser);
          this.updaterTitle =
            this.setUnitTitle(userName, this.item.updatedUtc, this.translater.get('common.title.lastUpdater'));

          this.setUpdateInfoMode();
        });
    }
    else {
      this.createrTitle =
            this.setUnitTitle(null, this.item.createdUtc, this.translater.get('common.title.creater'));
      
      this.updaterTitle =
        this.setUnitTitle(null, this.item.updatedUtc, this.translater.get('common.title.lastUpdater'));

      this.setUpdateInfoMode();
    }
  }

  private setUnitTitle(userName: UserName, date: any, personTitle: string): string {
    let title = OliveUtilities.showEventDateAndName(date, userName);

    if (this.mode === 'button' && title) {
      title = personTitle + ' : ' + title;
    }

    return title;
  }

  private setUpdateInfoMode() {
    if (this.updaterTitle && this.createrTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.updaterTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.createrTitle) {
      this.isUpdaterInfo = false;
    }

    this.visible = this.createdDateExists || this.updatedDateExists;
  }
}

