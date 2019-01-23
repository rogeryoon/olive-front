import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OliveUserNameService } from 'app/core/services/user-name.service';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveEntityFormBaseComponent } from '../entity-edit/entity-form-base.component';

@Component({
  selector: 'olive-entity-date',
  templateUrl: './entity-date.component.html',
  styleUrls: ['./entity-date.component.scss']
})
export class OliveEntityDateComponent extends OliveEntityFormBaseComponent {
  
  constructor(
    formBuilder: FormBuilder,
    private userNameService: OliveUserNameService
  ) { 
    super(formBuilder);
  }

  get createdDatesExists() {
    return this.item != null && !OliveUtilities.TestIsUndefined(this.item.createdUtc);
  }

  get updatedDatesExists() {
    return this.item != null && !OliveUtilities.TestIsUndefined(this.item.updatedUtc);
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
    if ( this.createdDatesExists ) {
      this.oForm.reset({
        updatedUser: this.userNameService.get(this.item.updatedUser),
        updatedUtc: OliveUtilities.getMomentDate(this.item.updatedUtc),
        createdUser: this.userNameService.get(this.item.createdUser),
        createdUtc: OliveUtilities.getMomentDate(this.item.createdUtc)
      });
    }
  }
}
