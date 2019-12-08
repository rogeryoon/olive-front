import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveEntityFormBaseComponent } from '../../extends/entity-form-base/entity-form-base.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { UserName } from 'app/core/models/user-name';
import { showEventDateAndName } from 'app/core/utils/date-helper';

@Component({
  selector: 'olive-entity-date',
  templateUrl: './entity-date.component.html',
  styleUrls: ['./entity-date.component.scss']
})
export class OliveEntityDateComponent extends OliveEntityFormBaseComponent {
  updaterTitle: string;
  creatorTitle: string;
  isUpdaterInfo = true;
  visible = true;

  @Input() mode = 'textBox';

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) {
    super(formBuilder, translator);
  }

  get createdDateExists(): boolean {
    return this.item != null && !this.isNull(this.item.createdUtc);
  }

  get creatorExists(): boolean {
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
    return this.isUpdaterInfo ? this.updaterTitle : this.creatorTitle;
  }

  get textLabelName(): string {
    return this.translator.get((this.isUpdaterInfo && this.updaterTitle ? 'common.title.lastUpdater' : 'common.title.creator'));
  }

  onClick() {
    if (this.updaterTitle && this.creatorTitle) {
      this.isUpdaterInfo = !this.isUpdaterInfo;
    }
    else if (this.updaterTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.creatorTitle) {
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

    if (this.creatorExists) {
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
          this.creatorTitle =
            this.setUnitTitle(userName, this.item.createdUtc, this.translator.get('common.title.creator'));
      
          userName = userNames.find(item => item.userAuditKey === this.item.updatedUser);
          this.updaterTitle =
            this.setUnitTitle(userName, this.item.updatedUtc, this.translator.get('common.title.lastUpdater'));

          this.setUpdateInfoMode();
        });
    }
    else {
      this.creatorTitle =
            this.setUnitTitle(null, this.item.createdUtc, this.translator.get('common.title.creator'));
      
      this.updaterTitle =
        this.setUnitTitle(null, this.item.updatedUtc, this.translator.get('common.title.lastUpdater'));

      this.setUpdateInfoMode();
    }
  }

  private setUnitTitle(userName: UserName, date: any, personTitle: string): string {
    let title = showEventDateAndName(date, userName);

    if (this.mode === 'button' && title) {
      title = personTitle + ' : ' + title;
    }

    return title;
  }

  private setUpdateInfoMode() {
    if (this.updaterTitle && this.creatorTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.updaterTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.creatorTitle) {
      this.isUpdaterInfo = false;
    }

    this.visible = this.createdDateExists || this.updatedDateExists;
  }
}

