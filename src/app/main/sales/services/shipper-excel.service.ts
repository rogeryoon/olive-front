import { Injectable } from '@angular/core';
import { OrderShipOutPackage } from '../models/order-ship-out-package.model';
import { ExcelColumn } from 'app/core/models/excel-column';
import { ExcelRowExportGps } from '../models/excel-row-export-gps.model';

class ShipItem {
  productVariantId: number;
  name: string;
  customsPrice: number;
  quantity: number;
  weight: number;  
  volume: string;
  hsCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class OliveShipperExcelService {

  constructor
  (

  ) 
  {
  }

  /**
   * Builds ship items : 합배송의 경우 아이템이 중복될수 있으므로 아이템 별로 재정리한다.
   * @param packages 
   * @returns ship items 
   */
  private buildShipItems(packages: OrderShipOutPackage[]): Map<number, ShipItem[]> {
    const packageItems = new Map<number, ShipItem[]>();

    for (const box of packages) {
      const items: ShipItem[] = [];

      for (const order of box.orderShipOuts) {
        for (const item of order.orderShipOutDetails) {
          const foundItem = items.find(x => x.productVariantId === item.productVariantId);
          if (foundItem) {
            foundItem.quantity += item.quantity;
          }
          else {
            items.push({
              productVariantId: item.productVariantId,
              name: item.name,
              quantity: item.quantity,
              customsPrice: item.customsPrice,
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

  saveForGps(packages: OrderShipOutPackage[]) {
    this.buildGpsHeader();    
    this.buildGpsBody(packages, this.buildShipItems(packages));
  }

  private buildGpsHeader() {
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
    columns.push({ headerTitle: 'ConsigneeTypeID', type: 'text' } as ExcelColumn);
    // O
    columns.push({ headerTitle: 'ConsigneeCustomTypeID', type: 'text' } as ExcelColumn);
    // P
    columns.push({ headerTitle: 'Volume1', type: 'text' } as ExcelColumn);
    // Q
    columns.push({ headerTitle: 'Volume2', type: 'text' } as ExcelColumn);
    // R
    columns.push({ headerTitle: 'Volume3', type: 'text' } as ExcelColumn);
    // S
    columns.push({ headerTitle: 'Weight', type: 'text' } as ExcelColumn);
    // T
    columns.push({ headerTitle: 'WeightTypeID', type: 'text' } as ExcelColumn);
    // U
    columns.push({ headerTitle: 'BoxCount', type: 'text' } as ExcelColumn);
    // V
    columns.push({ headerTitle: 'PriceTypeID', type: 'text' } as ExcelColumn);
    // W
    columns.push({ headerTitle: 'ItemDescription', type: 'text' } as ExcelColumn);
    // X
    columns.push({ headerTitle: 'ItemBrand', type: 'text' } as ExcelColumn);
    // Y
    columns.push({ headerTitle: 'ItemPrice', type: 'text' } as ExcelColumn);
    // Z
    columns.push({ headerTitle: 'ItemQuantity', type: 'text' } as ExcelColumn);
    // AA
    columns.push({ headerTitle: 'HSCode', type: 'text' } as ExcelColumn);

    for (const column of columns) {
      column.propertyName = column.headerTitle;
    }
  }

  private buildGpsBody(packages: OrderShipOutPackage[], items: Map<number, ShipItem[]>): ExcelRowExportGps[] {
    const rows: ExcelRowExportGps[] = [];

    for (const box of packages) {
      const row = new ExcelRowExportGps();

      row.boxCount = '1';
      row.weightTypeID = '2';
      row.weight = this.calculateItemsWeight(items.get(box.id));
      
      let seqNo = 0;
      for (const item of items.get(box.id)) {
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

  private calculateItemsWeight(items: ShipItem[]): string {
    return '';
  }
}
