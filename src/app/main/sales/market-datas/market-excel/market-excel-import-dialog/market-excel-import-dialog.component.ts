import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AlertService } from '@quick/services/alert.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OliveImportFileDialogComponent } from 'app/core/components/dialogs/import-file-dialog/import-file-dialog.component';
import { OliveDocumentService } from 'app/core/services/document.service';
import { MarketSeller } from 'app/main/supports/models/market-seller.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMarketSellerService } from 'app/main/supports/services/market-seller.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveUtilities } from 'app/core/classes/utilities';
import { NameValue } from 'app/core/models/name-value';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-market-excel-import-dialog',
  templateUrl: './market-excel-import-dialog.component.html',
  styleUrls: ['./market-excel-import-dialog.component.scss']
})
export class OliveMarketExcelImportDialogComponent extends OliveImportFileDialogComponent {
  oForm: FormGroup;
  sellers: MarketSeller[];

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService, 
    documentService: OliveDocumentService, alertService: AlertService, 
    dialogRef: MatDialogRef<OliveImportFileDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) data: {importType: string},
    private cacheService: OliveCacheService, private marketSellerService: OliveMarketSellerService,
  ) { 
    super(
      formBuilder, translator, 
      documentService, alertService, 
      dialogRef, data
    );

    this.openFileDialogWhenDialogCreated = false;
  }

  get sellerSelected(): any {
    return this.sellerId;
  }

  get sellerId(): number {
    return this.oForm.value.seller;
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      seller: ['', requiredValidator()]
    });
  }

  resetForm() {
    this.oForm.reset({
    });
  }

  initializeChildComponent() {
    this.getMarketSellers();
  }

  private getMarketSellers() {
    const searchOption = OliveUtilities.searchOption([{name: 'activated', value: true} as NameValue], 'name');
    this.cacheService.getItems(this.marketSellerService, OliveCacheService.cacheKeys.getItemsKey.marketSeller, searchOption)
    .then((items: MarketSeller[]) => {
      this.sellers = items;
    });
  }

  save(): void {
    if (this.uploadData) {
      this.uploadData['sellerId'] = this.sellerId;
    }
    super.save();
  }

  onValueChange(sellerId: number) {
    this.openFileDialog();
  }
}
