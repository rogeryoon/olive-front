import { Injectable } from '@angular/core';
import { OrderShipOutPackage } from '../models/order-ship-out-package.model';
import { ExcelColumn } from 'app/core/models/excel-column';
import { ExcelRowExportGps } from '../models/excel-row-export-gps.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveConstants } from 'app/core/classes/constants';
import { CompanyContact } from 'app/core/models/company-contact.model';
import { OliveDocumentService } from 'app/core/services/document.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Address } from 'app/core/models/address.model';
import { OlivePendingOrderShipOutListComponent } from '../orders/order-ship-out-package-lister/pending-order-ship-out-list/pending-order-ship-out-list.component';
import { applyPrecision, numberFormat } from 'app/core/utils/number-helper';
import { isoDateString } from 'app/core/utils/date-helper';
import { camelize, getDelimiterSet } from 'app/core/utils/string-helper';
import { CustomsRule } from 'app/main/shippings/models/customs/customs-rule.model';

class ShipItem {
  productVariantId: number;
  name: string;
  customsPrice: number;
  quantity: number;
  kiloGramWeight: number;  
  volume: string;
  hsCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class OliveShipperExcelService {

  constructor
  (
    private documentService: OliveDocumentService, private translator: FuseTranslationLoaderService
  ) 
  {
  }

  /**
   * Calculates items weight
   * @param items ShipItem[]
   * @returns weight number
   */
  private getTotalPoundWeight(items: ShipItem[]): string {
    const totalKiloWeight = items.map(x => x.kiloGramWeight * x.quantity).reduce((a, b) => a + (b || 0), 0);

    const poundWeight = totalKiloWeight * OliveConstants.unitConversionRate.kiloToPound;

    return numberFormat(poundWeight, 2);
  }

  /**
   * Builds ship items : 합배송의 경우 아이템이 중복될수 있으므로 아이템 별로 재정리한다.
   * @param packages OrderShipOutPackage[]
   * @returns void
   */
  private buildShipItems(packages: OrderShipOutPackage[]): Map<number, ShipItem[]> {
    const packageItems = new Map<number, ShipItem[]>();

    for (const box of packages) {
      const items: ShipItem[] = [];

      for (const order of box.orderShipOuts) {
        for (const item of order.orderShipOutDetails) {
          const foundItem = items.find(x => x.productVariantId === item.productVariantId);
          const customsPrice = (item.extra && item.extra.customsPrice || item.customsPrice);
          const customsWeight = OlivePendingOrderShipOutListComponent.getItemKiloWeight(item);
          if (foundItem) {
            // 평균값 작성
            const totalAmount = (foundItem.customsPrice * foundItem.quantity) + (customsPrice * item.quantity);
            foundItem.customsPrice = applyPrecision(totalAmount / (foundItem.quantity + item.quantity), 2);

            const totalWeight = (foundItem.kiloGramWeight * foundItem.quantity) + (customsWeight * item.quantity);
            foundItem.kiloGramWeight = applyPrecision(totalWeight / (foundItem.quantity + item.quantity), 2);

            foundItem.quantity += item.quantity;
          }
          else {
            items.push({
              productVariantId: item.productVariantId,
              name: item.name,
              quantity: item.quantity,
              customsPrice: customsPrice,
              kiloGramWeight:  customsWeight,
              volume: item.volume,
              hsCode: item.hsCode
            } as ShipItem);
          }
        }

        packageItems.set(box.id, items);
      }
    }

    return packageItems;
  }

  /**
   * GPS 택배 엑셀 파일 만들기
   * @param packages 
   * @param senders 
   */
  saveForGps(packages: OrderShipOutPackage[], senders: Map<number, CompanyContact>, customsConfigs: Map<string, any>) {
    const columns = this.buildGpsHeader();

    // 한국 국가코드 통관규칙
    const key = (OliveConstants.customsRule.ruleCountryCode + 'KR').toUpperCase();
    const customsRule = customsConfigs.get(key) as CustomsRule;

    const rows = this.buildGpsBody(packages, this.buildShipItems(packages), senders, customsRule);
    let fileName = this.translator.get('sales.pendingOrderShipOutPackageList.shipperExcelFileName');
    fileName = fileName + '-' + isoDateString(new Date(Date.now()), false);
    this.documentService.exportExcel(fileName, columns, rows);
  }

  /**
   * Builds GPS header
   */
  private buildGpsHeader(): ExcelColumn[] {
    const columns: ExcelColumn[] = [];
    // A
    columns.push({ headerTitle: 'SerialNumber', type: 'text' } as ExcelColumn);
    // B
    columns.push({ headerTitle: 'ShipperName', type: 'text' } as ExcelColumn);
    // C
    columns.push({ headerTitle: 'ShipperPhone', type: 'text' } as ExcelColumn);
    // D
    columns.push({ headerTitle: 'ShipperAddress', type: 'text' } as ExcelColumn);
    // E
    columns.push({ headerTitle: 'OrderID', type: 'text' } as ExcelColumn);
    // F
    columns.push({ headerTitle: 'ConsigneeName', type: 'text' } as ExcelColumn);
    // G
    columns.push({ headerTitle: 'ConsigneePhone', type: 'text' } as ExcelColumn);
    // H
    columns.push({ headerTitle: 'ConsigneeCell', type: 'text' } as ExcelColumn);
    // I
    columns.push({ headerTitle: 'ConsigneePostalCode', type: 'text' } as ExcelColumn);
    // J
    columns.push({ headerTitle: 'ConsigneeAddress1', type: 'text' } as ExcelColumn);
    // K
    columns.push({ headerTitle: 'ConsigneeAddress2', type: 'text' } as ExcelColumn);
    // L
    columns.push({ headerTitle: 'CustomSID', type: 'text' } as ExcelColumn);
    // M
    columns.push({ headerTitle: 'ConsigneeMemo', type: 'text' } as ExcelColumn);
    // N
    columns.push({ headerTitle: 'ConsigneeTypeID', type: 'number' } as ExcelColumn);
    // O
    columns.push({ headerTitle: 'ConsigneeCustomTypeID', type: 'number' } as ExcelColumn);
    // P
    columns.push({ headerTitle: 'Volume1', type: 'number' } as ExcelColumn);
    // Q
    columns.push({ headerTitle: 'Volume2', type: 'number' } as ExcelColumn);
    // R
    columns.push({ headerTitle: 'Volume3', type: 'number' } as ExcelColumn);
    // S
    columns.push({ headerTitle: 'Weight', type: 'number' } as ExcelColumn);
    // T
    columns.push({ headerTitle: 'WeightTypeID', type: 'number' } as ExcelColumn);
    // U
    columns.push({ headerTitle: 'BoxCount', type: 'number' } as ExcelColumn);
    // V
    columns.push({ headerTitle: 'PriceTypeID', type: 'number' } as ExcelColumn);
    // W
    columns.push({ headerTitle: 'ItemDescription', type: 'text' } as ExcelColumn);
    // X
    columns.push({ headerTitle: 'ItemBrand', type: 'text' } as ExcelColumn);
    // Y
    columns.push({ headerTitle: 'ItemPrice', type: 'number' } as ExcelColumn);
    // Z
    columns.push({ headerTitle: 'ItemQuantity', type: 'number' } as ExcelColumn);
    // AA
    columns.push({ headerTitle: 'HSCode', type: 'text' } as ExcelColumn);

    for (const column of columns) {
      column.propertyName = camelize(column.headerTitle);
    }

    return columns;
  }

  /**
   * Builds GPS body
   * @param packages 
   * @param shipItems 
   * @param senders 
   * @returns GPS body Rows
   */
  private buildGpsBody(packages: OrderShipOutPackage[], shipItems: Map<number, ShipItem[]>, 
    senders: Map<number, CompanyContact>, customsRule: CustomsRule): ExcelRowExportGps[] {
    const rows: ExcelRowExportGps[] = [];

    for (const box of packages) {
      const row = new ExcelRowExportGps();
      const items = shipItems.get(box.id);

      row.serialNumber = box.trackingNumber;

      const sender = senders.get(box.id);

      row.shipperName = sender.companyName;
      row.shipperPhone = sender.phone;
      row.shipperAddress = (sender.address1 + ' ' + sender.address2).trim();

      // 고정변수
      row.boxCount = '1';
      // 중량단위(1:Kg, 2:Lbs)
      row.weightTypeID = '2';
      // 일반신청(0:목록,1:일반)
      row.priceTypeID = this.getGpsCustomsTypeCode(box, customsRule);
      // 전자상거래(1:전자상거래 구매대행, 2:일반, 3:전자상거래 개인직접수입형)
      row.consigneeCustomTypeID = '3';
      // 받는이 구분(1:개인,2:사업자)
      row.consigneeTypeID = '1';

      row.consigneeName = box.deliveryTagFk.consigneeName;
      row.consigneePhone = box.deliveryTagFk.consigneePhoneNumber2;
      row.consigneeCell = box.deliveryTagFk.consigneeCellPhoneNumber;

      row.consigneePostalCode = box.deliveryAddressFk.postalCode;
      row.consigneeAddress1 = Address.joinedAddressNoCountry({
        stateProvince: box.deliveryAddressFk.stateProvince,
        city: box.deliveryAddressFk.city,
        address1: box.deliveryAddressFk.address1
      });
      row.consigneeAddress2 = box.deliveryAddressFk.address2;

      row.customSID = box.deliveryTagFk.customsId;
      row.consigneeMemo = box.deliveryTagFk.deliveryMemo;
      
      row.orderID = 'X-' + OliveUtilities.convertToBase36(box.id);

      row.weight = this.getTotalPoundWeight(items);
      this.calculateGpsVolumeWeight(items, row);
      
      let seqNo = 0;
      for (const item of items) {
        seqNo++;

        let newRow = row;
        if (seqNo > 1) {
          newRow = new ExcelRowExportGps();
        }

        newRow.itemDescription = item.name;
        newRow.itemPrice = item.customsPrice.toString();
        newRow.itemQuantity = item.quantity.toString();
        newRow.hSCode = item.hsCode;

        rows.push(newRow);
      }
    }

    return rows;
  }


  private getGpsCustomsTypeCode(box: OrderShipOutPackage, customsRule: CustomsRule): string {
    // 기본값 : 목록통관 : 0 
    let customsTypeCode = '0';
    const generalCustomsTypeName = '일반';
    const easyCustomsTypeName = '목록';

    // 상품 통관타입 수집
    const customsTypes = new Set<string>();
    for (const order of box.orderShipOuts) {
      for (const item of order.orderShipOutDetails) {
        const customsTypeCodes = getDelimiterSet(item.customsTypeCode);
        // 일반 ?
        if (customsTypeCodes.has(generalCustomsTypeName)) {
          customsTypes.add(generalCustomsTypeName);
        }
        // 목록 ? 
        else if (customsTypeCodes.has(easyCustomsTypeName)) {
          customsTypes.add(easyCustomsTypeName);
        }
        // 일반/목록 외의 사항은 무시
      }
    }

    // 통관타입이 섞이면 일반통관
    if (customsTypes.size > 1) {
      customsTypeCode = '1';
    }

    return customsTypeCode;
  }

  /**
   * GPS 엑셀 부피 열 설정 :
   * 단품인 경우 볼륨을 계산하고 단품이 아니거나 
   * 단품이더라도 볼륨이 없을 경우 기본 볼륨 2 X 2 X 2로 설정
   * @param items ShipItem[]
   * @param row ExcelRowExportGps
   * @returns void
   */
  private calculateGpsVolumeWeight(items: ShipItem[], row: ExcelRowExportGps): void {
    let defaultVolume = true;

    if (items.length === 1 && items[0].volume) {
      const volumes = items[0].volume.split(' ');

      if (volumes.length === 3) {
        let volume1 = +volumes[0];
        const volume2 = +volumes[1];
        const volume3 = +volumes[2];

        volume1 = volume1 * items[0].quantity;

        if (volume1 > 0 && volume2 > 0 && volume3 > 0) {
          defaultVolume = false;          
          row.volume1 = volume1.toString();
          row.volume2 = volume2.toString();
          row.volume3 = volume3.toString();
        }
      }
    }

    if (defaultVolume) {
      row.volume1 = '2';
      row.volume2 = '2';
      row.volume3 = '2';
    }

    return null;
  }
}
