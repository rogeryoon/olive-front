import { Injectable } from '@angular/core';

import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService, MessageSeverity } from '@quick/services/alert.service';

import { UserMessage } from '../models/user-message';
import { Utilities } from '@quick/services/utilities';

@Injectable({
  providedIn: 'root'
})
export class OliveMessageHelperService {

  constructor(
    private translater: FuseTranslationLoaderService,
    private alertService: AlertService
  ) 
  { 
  }

  showDeletedSuccess(itemName: string) {
    this.alertService.stopLoadingMessage();

    this.alertService.showMessage(
      this.translater.get('common.title.success'),
      Utilities.TestIsUndefined(itemName) ?
        this.translater.get('common.message.deletedGeneral') :
        String.Format(this.translater.get('common.message.deleted'), itemName), 
      MessageSeverity.success
    );
  }

  showSavedSuccess(isNewItem: boolean, itemName: string) {
    this.alertService.stopLoadingMessage();

    if (isNewItem) {
      this.alertService.showMessage(
        this.translater.get('common.title.success'),
        Utilities.TestIsUndefined(itemName) ? 
          this.translater.get('common.message.newItemCreatedGeneral') :
          String.Format(this.translater.get('common.message.newItemCreated'), itemName), 
        MessageSeverity.success
      );
    }
    else {
      this.alertService.showMessage(
        this.translater.get('common.title.success'),
        Utilities.TestIsUndefined(itemName) ? 
          this.translater.get('common.message.updatedGeneral') :
          String.Format(this.translater.get('common.message.updated'), itemName), 
          MessageSeverity.success
      );
    }
  }

  showSavedUploadSuccess() {
    this.alertService.stopLoadingMessage();

    this.alertService.showMessage(this.translater.get('common.title.success'),
      this.translater.get('common.message.uploadSaved'), MessageSeverity.success);
  }

  translateError(error: any, isDelete: boolean = false) {
    const errorMessage = new UserMessage();

    if (typeof error === 'string' && error.indexOf('session expired') !== -1)
    {
      errorMessage.title = this.translater.get('common.title.sessionExpired');
      errorMessage.message = this.translater.get('common.message.sessionExpired');
      errorMessage.messageSeverity = MessageSeverity.info;
    }
    else 
    if (error.error !== null && error.error.errorCode !== null) {
      switch (error.error.errorCode) {
        case 'CONCURRENCY_ERROR':
          errorMessage.message = this.translater.get(isDelete ? 'common.entryError.deleteByConcurrency' : 'common.entryError.concurrency');
          errorMessage.messageSeverity = MessageSeverity.error;        
          break;
      }
    }

    return errorMessage;
  }

  showLoadFaild(error: any) {
    const errorMessage = this.translateError(error);

    if (errorMessage.title == null) {
      errorMessage.title = this.translater.get('common.title.loadError');
    }

    if (errorMessage.messageSeverity == null) {
      errorMessage.message = this.translater.get('common.message.errorLoading');
      errorMessage.messageSeverity = MessageSeverity.error;
    }

    this.alertService.showStickyMessage(
      errorMessage.title, 
      errorMessage.message,
      errorMessage.messageSeverity, 
      error
    );
  }

  showSaveFailed(error: any, isDelete: boolean) {
    this.alertService.stopLoadingMessage();

    const errorMessage = this.translateError(error, isDelete);

    if (errorMessage.title == null) {
      errorMessage.title = this.translater.get(isDelete ? 'common.title.deleteError' : 'common.title.saveError');
    }    

    if (errorMessage.messageSeverity == null) {
      errorMessage.message = this.translater.get(isDelete ? 'common.message.errorDeleteting' : 'common.message.saveError');
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
      this.translater.get('common.title.duplicated'),
      String.Format(this.translater.get('common.message.duplicated'), itemStrings.join()),
      MessageSeverity.warn
    );
  }
}
