import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import * as _ from 'lodash';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Utilities } from '@quick/services/utilities';

import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { MatSnackBar } from '@angular/material';
import { OliveCacheService } from 'app/core/services/cache.service';
import { CompanyContact } from 'app/core/models/company-contact.model';
import { OliveCompanyGroupPreferenceService } from 'app/core/services/company-group-preference.service';
import { requiredValidator } from 'app/core/validators/general-validators';
import { showParamMessage } from 'app/core/utils/string-helper';

@Component({
  selector: 'olive-company-contact-editor',
  templateUrl: './company-contact-editor.component.html',
  styleUrls: ['./company-contact-editor.component.scss']
})
export class OliveCompanyContactEditorComponent extends OliveEntityEditComponent {
  contacts: CompanyContact[];
  lastSelectedContactId: number;
  firstCustomValidationSelectedContactId: number;
  customValidationRunCount = 0;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveCompanyGroupPreferenceService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  /**
   * Gets edited item
   * @returns edited item 
   */
  getEditedItem(): CompanyContact {
    const formModel = this.oForm.value;

    return {
      id: this.selectedContactId,
      marketSellerId: this.item.marketSellerId || this.extraParameter.marketSellerId,
      warehouseId: this.item.warehouseId || this.extraParameter.warehouseId,
      companyName: formModel.companyName,
      phone: formModel.phone,
      address1: formModel.address1,
      address2: formModel.address2,
      default: formModel.default
    };
  }

  /**
   * Builds form
   */
  buildForm() {
    this.oForm = this.formBuilder.group({
      companyName: ['', requiredValidator()],
      phone: ['', requiredValidator()],
      address1: ['', requiredValidator()],
      address2: '',
      default: false,
      options: ''
    });
  }

  /**
   * Resets form
   */
  resetForm() {
    this.contacts = this.extraParameter.contacts;
    const newId = +Utilities.uniqueId();

    this.oForm.reset({
      companyName: this.item.companyName || '',
      phone: this.item.phone || '',
      address1: this.item.address1 || '',
      address2: this.item.address2 || '',
      default: this.item.default ? this.item.default : (!this.item.id),
      options: this.item.id || newId
    });

    // 처음 생성인 경우 신규 ID를 대입
    if (!this.item.id) {
      this.item.id = newId;
    }

    // 처음 생성인 경우 item을 contacts에 추가
    if (!this.contacts) {
      this.contacts = [this.item];
    }

    this.lastSelectedContactId = this.item.id;
  }

  /**
   * Patches form
   * @param contact 
   */
  patchForm(contact: CompanyContact) {
    if (this.contacts.length === 1) {
      contact.default = true;
    }

    this.oForm.patchValue({
      companyName: contact.companyName || '',
      phone: contact.phone || '',
      address1: contact.address1 || '',
      address2: contact.address2 || '',
      default: contact.default,
      options: contact.id
    });
  }

  /**
   * 원래는 백앤드에 저장하는 로직이 있어야 하지만 
   * 다이알로그가 끝나고 받는쪽에서 캐쉬공용 Method로 저장해야해서
   * 이곳에선 Dummy 처리한다.
   * onItemSaved 이벤트 인수는 Contacts 전체 배열을 넘겨준다. 
   * @param item 
   */
  sendToEndPoint(item: any) {
    this.isSaving = false;

    // item을 해당 엔티티에 저장한다.
    const targetItem = this.contacts.find(x => x.id === item.id);
    if (targetItem) {
      Object.assign(targetItem, item);
    }

    // Default로 지정된 컨텍이 하나도 없으면 첫번째 엔티티를 Default로 임의 지정
    if (!this.contacts.find(x => x.default)) {
      this.contacts[0].default = true;
    }

    let saveSelectedId = this.firstCustomValidationSelectedContactId;

    const checkItem = this.contacts.find(x => x.id === saveSelectedId);
    if (!checkItem)
    {
      saveSelectedId = this.contacts.find(x => x.default).id;
    }

    this.onItemSaved.next({ selectedId: saveSelectedId, contacts: this.contacts });
  }

  /**
   * Adds contact
   */
  addContact() {
    // item을 복사해서 Extra Contact에 추가한다.
    const copyContact = _.cloneDeep(this.item);
    copyContact.id = +Utilities.uniqueId();
    copyContact.companyName = this.makeCopyCompanyName(copyContact.companyName);

    if (copyContact.default) {
      copyContact.default = false;
    }

    this.contacts.push(copyContact);

    this.patchForm(copyContact);

    this.lastSelectedContactId = copyContact.id;

    this.item = copyContact;

    this.oForm.markAsDirty();
  }

  /**
   * Makes copy company name
   * 똑같은 이름이 없게 끝에 (2)/(3)를 달아준다.
   * @param name 원래 이름
   * @param [index] 끝에 붙이는 숫자 : 기본 = 2
   * @returns company name string
   */
  makeCopyCompanyName(name: string, index: number = 2): string {
    const newName = `${name} (${index})`;
    if (this.contacts.find(x => x.companyName === newName)) {
      index++;
      return this.makeCopyCompanyName(name, index);
    }
    return newName;
  }

  get selectedContactId(): number {
    return (this.contacts && this.contacts.length > 1) ? this.oForm.value.options : this.item.id;
  }

  /**
   * Determines whether custom validation ok is
   * @returns true if custom validation ok 
   */
  isCustomValidationOk(): boolean {
    this.customValidationRunCount++;

    // 사용자가 저장을 원하는 라디오 선택을 저장한다. 
    // 저장 이유 : 커스텀 유효성 검사에서 라디오 선택이 변경될수 있으므로
    if (this.customValidationRunCount === 1) {
      this.firstCustomValidationSelectedContactId = this.selectedContactId;
    }

    const currentContact = this.contacts.find(x => x.id === this.selectedContactId);

    if (currentContact) {
      Object.assign(currentContact, this.getEditedItem());     
    }

    for (const contact of this.contacts) {
      if (!contact.companyName || !contact.phone || !contact.address1) {
        this.patchForm(contact);
        return false;
      }
    }

    return true;
  }

  /**
   * Contacts 라디오 버튼 선택 변경시 처리
   * @param event 
   */
  contactChange(event: any) {
    // 기존 편집모드 컨텍을 저장한다. - 1
    const savedTempItem = this.getEditedItem();
    const saveLastSelectedContactId = this.lastSelectedContactId;
    savedTempItem.id = saveLastSelectedContactId;

    // 변경 컨텍데이터를 편집창에 로딩한다.
    const selectedItem = this.contacts.find(x => x.id === event.value);
    this.item = selectedItem;
    this.patchForm(selectedItem);
    this.lastSelectedContactId = event.value;

    // 기존 편집모드 컨텍을 저장한다. - 2
    const saveItem = this.contacts.find(x => x.id === saveLastSelectedContactId);
    Object.assign(saveItem, savedTempItem);
  }

  /**
   * Deletes contact
   * @param contact 
   */
  deleteContact(contact: CompanyContact) {
    this.snackBar.open(
      showParamMessage(this.translator.get('common.message.confirmDelete')),
      this.translator.get('common.button.delete'),
      { duration: 5000 }
    )
      .onAction().subscribe(() => {
        const index = this.contacts.findIndex(x => x.id === contact.id);
        this.contacts.splice(index, 1);
        const alterContact = this.contacts[this.contacts.length - 1];
        this.patchForm(alterContact);
        this.lastSelectedContactId = alterContact.id;
        this.oForm.markAsDirty();
      });
  }

  /**
   * 기본 체크박스를 클릭했을때 Check가 됬을 경우 다른 엔티티의 디폴트를 모두 UnCheck한다.
   * @param event 
   */
  checkDefault(event: any) {
    if (event.checked) {
      for (const contact of this.contacts) {
        if (contact.default && contact.id !== this.item.id) {
          contact.default = false;
        }
      }
    }
  }
}
