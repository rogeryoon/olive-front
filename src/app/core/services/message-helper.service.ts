import { Injectable } from '@angular/core';

import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService, MessageSeverity, DialogType } from '@quick/services/alert.service';

import { UserMessage } from '../models/user-message';
import { OliveBackEndErrors } from '../classes/back-end-errors';
import { OliveConstants } from '../classes/constants';
import { trimStringByMaxLength } from '../utils/string-helper';
import { testIsUndefined } from '../utils/object-helpers';

@Injectable({
  providedIn: 'root'
})
export class OliveMessageHelperService {

  constructor(
    private translator: FuseTranslationLoaderService,
    private alertService: AlertService
  ) 
  { 
  }

  showError(message: string, title: string = null) {
    if (!title) { title = this.translator.get('common.title.saveError'); }
    this.alertService.showDialog
    (
      title,
      message,
      DialogType.alert,
      () => null
    );
  }

  showDeletedSuccess(itemName: string) {
    this.alertService.stopLoadingMessage();

    this.alertService.showMessage(
      this.translator.get('common.title.success'),
      testIsUndefined(itemName) ?
        this.translator.get('common.message.deletedGeneral') :
        String.Format(this.translator.get('common.message.deleted'), itemName), 
      MessageSeverity.success
    );
  }

  showSavedSuccess(isNewItem: boolean, itemName: string) {
    this.alertService.stopLoadingMessage();

    if (isNewItem) {
      this.alertService.showMessage(
        this.translator.get('common.title.success'),
        testIsUndefined(itemName) || itemName.length === 0 ? 
          this.translator.get('common.message.newItemCreatedGeneral') :
          String.Format(this.translator.get('common.message.newItemCreated'), itemName), 
        MessageSeverity.success
      );
    }
    else {
      this.alertService.showMessage(
        this.translator.get('common.title.success'),
        testIsUndefined(itemName) || itemName.length === 0 ? 
          this.translator.get('common.message.updatedGeneral') :
          String.Format(this.translator.get('common.message.updated'), itemName), 
          MessageSeverity.success
      );
    }
  }

  showSavedUploadSuccess() {
    this.alertService.stopLoadingMessage();

    this.alertService.showMessage(this.translator.get('common.title.success'),
      this.translator.get('common.message.uploadSaved'), MessageSeverity.success);
  }

  translateError(error: any, isDelete: boolean = false) {
    const errorMessage = new UserMessage();

    if (typeof error === 'string' && error.indexOf('session expired') !== -1)
    {
      errorMessage.title = this.translator.get('common.title.sessionExpired');
      errorMessage.message = this.translator.get('common.message.sessionExpired');
      errorMessage.messageSeverity = MessageSeverity.info;
    }
    else 
    if (error.error && error.error.errorCode) {
      const concurrencyError = OliveBackEndErrors.concurrencyError;
      switch (error.error.errorCode) {
        case concurrencyError:
          errorMessage.message = this.translator.get(isDelete ? 'common.entryError.deleteByConcurrency' : 'common.entryError.concurrency');
          errorMessage.messageSeverity = MessageSeverity.error;        
          break;

        default:
          if (error.error.errorCode.includes(concurrencyError)) {
            const duplicatedKeysString = error.error.errorCode.replace(concurrencyError + '-', '');
            errorMessage.message = String.Format(this.translator.get('common.entryError.concurrencyKeyName'), duplicatedKeysString);
            errorMessage.message = trimStringByMaxLength(errorMessage.message, OliveConstants.uiConfig.maxErrorMessageLength);
          }
          errorMessage.messageSeverity = MessageSeverity.error;        
          break;
      }
    }

    return errorMessage;
  }

  showLoadFailedSticky(error: any) {
    const errorMessage = this.translateError(error);

    if (errorMessage.title == null) {
      errorMessage.title = this.translator.get('common.title.loadError');
    }

    if (errorMessage.messageSeverity == null) {
      errorMessage.message = this.translator.get('common.message.errorLoading');
      errorMessage.messageSeverity = MessageSeverity.error;
    }

    this.alertService.showStickyMessage(
      errorMessage.title, 
      errorMessage.message,
      errorMessage.messageSeverity, 
      error
    );
  }

  showStickySaveFailed(error: any, isDelete: boolean, errorMessage: UserMessage = null) {
    this.alertService.stopLoadingMessage();

    if (!errorMessage) {
      errorMessage = this.translateError(error, isDelete);
    }

    if (errorMessage.title == null) {
      errorMessage.title = this.translator.get(isDelete ? 'common.title.deleteError' : 'common.title.saveError');
    }    

    if (errorMessage.messageSeverity == null) {
      errorMessage.message = this.translator.get(isDelete ? 'common.message.errorDeleting' : 'common.message.saveError');
      errorMessage.messageSeverity = MessageSeverity.error;
    }

    this.alertService.showStickyMessage(
      errorMessage.title, 
      errorMessage.message,
      errorMessage.messageSeverity, 
      error
    );
  }

  showDuplicatedItems(itemStrings: string[]) {
    if (itemStrings.length === 0) { return; }

    this.alertService.showMessage(
      this.translator.get('common.title.duplicated'),
      String.Format(this.translator.get('common.message.duplicated'), itemStrings.join()),
      MessageSeverity.warn
    );
  }

  /**
   * Gets product not matched error message
   * @param errorMessages 
   * @returns product not matched error message 
   */
  getProductNotMatchedErrorMessage(errorMessages: string[]): string {
    if (errorMessages.length !== 4) {
      console.error('server validation error', errorMessages);
      return;
    }

    return String.Format(this.translator.get('common.entryError.productNotMatched'), errorMessages[1], errorMessages[2], errorMessages[3]);
  }
}
