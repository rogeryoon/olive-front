import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveUtilities } from 'app/core/classes/utilities';
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
  
  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) { 
    super(formBuilder, translater);
  }

  get createdDatesExists() {
    return this.item != null && !this.isNull(this.item.createdUtc);
  }

  get updatedDatesExists() {
    return this.item != null && !this.isNull(this.item.updatedUtc);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      updatedUser: '',
      updatedUtc: '',
      createdUser: '',
      createdUtc: ''
    });
  }

  resetForm() {
    const userNameKeys: string[] = [];

    if (this.createdDatesExists) {
      this.oForm.patchValue({
        createdUtc: OliveUtilities.getMomentDate(this.item.createdUtc)
      });

      if (!this.isNull(this.item.createdUser)) {
        userNameKeys.push(this.item.createdUser);
      }
    }

    if (this.updatedDatesExists) {
      this.oForm.patchValue({
        updatedUtc: OliveUtilities.getMomentDate(this.item.updatedUtc)
      });

      if (!this.isNull(this.item.updatedUser)) {
        userNameKeys.push(this.item.updatedUser);
      }
    }

    if (userNameKeys.length === 0) { return; }

    this.cacheService.getUserNames(userNameKeys)
    .then(userNames => {
      let user: UserName;

      if (!this.isNull(this.item.createdUser)) {
        user = userNames.find(item => item.userAuditKey === this.item.createdUser);
        if (!this.isNull(user)) {
          this.oForm.patchValue({
            createdUser: user.fullName
          });  
        }
      }

      if (!this.isNull(this.item.updatedUser)) {
        user = userNames.find(item => item.userAuditKey === this.item.updatedUser);
        if (!this.isNull(user)) {
          this.oForm.patchValue({
            updatedUser: user.fullName
          });  
        }
      }
    });
  }
}
