import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveEntityFormBaseComponent } from '../../extends/entity-form-base/entity-form-base.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { UserName } from 'app/core/models/user-name';

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
        let user: UserName;
  
        if (this.createrExists) {
          user = userNames.find(item => item.userAuditKey === this.item.createdUser);

          this.createrTitle = user.fullName;

          if (this.createdDateExists) {
            this.createrTitle += ` - ${this.moment(this.item.createdUtc)}`;
          }
        }

        if (this.updaterExists) {
          user = userNames.find(item => item.userAuditKey === this.item.updatedUser);

          this.updaterTitle = user.fullName;

          if (this.updatedDateExists) {
            this.updaterTitle += ` - ${this.moment(this.item.updatedUtc)}`;
          }
        }

        if (this.mode === 'button') {
          this.createrTitle = this.translater.get('common.title.creater') + ' : ' + this.createrTitle;
          this.updaterTitle = this.translater.get('common.title.lastUpdater') + ' : ' + this.updaterTitle;
        }

        this.setUpdateInfoMode();
      });
    }
    else {
      if (this.mode === 'button') {
        if (this.createdDateExists) {
          this.createrTitle = `${this.translater.get('common.title.creater')} : ${this.moment(this.item.createdUtc)}`;
        }
  
        if (this.updatedDateExists) {
          this.updaterTitle = `${this.translater.get('common.title.lastUpdater')} : ${this.moment(this.item.updatedUtc)}`;
        }
      }
      else {
        if (this.createdDateExists) {
          this.createrTitle = `${this.date(this.item.createdUtc)} (${this.moment(this.item.createdUtc)})`;
        }
  
        if (this.updatedDateExists) {
          this.updaterTitle = `${this.date(this.item.updatedUtc)} (${this.moment(this.item.updatedUtc)})`;
        }
      }

      this.visible = this.createdDateExists || this.updatedDateExists;

      this.setUpdateInfoMode();
    }
  }

  setUpdateInfoMode() {
    if (this.updaterTitle && this.createrTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.updaterTitle) {
      this.isUpdaterInfo = true;
    }
    else if (this.createrTitle) {
      this.isUpdaterInfo = false;
    }  
  }
}

