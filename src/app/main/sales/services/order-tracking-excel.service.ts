import { Injectable } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveDocumentService } from 'app/core/services/document.service';
import { OliveOrderHelperService } from './order-helper.service';
import { OrderShipOut } from '../models/order-ship-out.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMarketExcelInterfaceService } from 'app/main/supports/services/market-excel-interface.service';
import { MarketExcelInterface } from 'app/main/supports/models/market-excel-interface';
import { Market } from 'app/main/supports/models/market.model';
import { OliveMarketService } from 'app/main/supports/services/market.service';
import { createMapFrom, groupBy } from 'app/core/utils/array-helpers';
import { MarketExcelInterfaceRule } from 'app/main/supports/models/market-excel-interface-rule';
import { ExcelColumn } from 'app/core/models/excel-column';
import { isoDateString } from 'app/core/utils/date-helper';
import { MarketExcelCellTypes } from 'app/main/supports/models/market-excel-cell';
import { NameValue } from 'app/core/models/name-value';
import { OliveCarrierService } from 'app/main/supports/services/carrier.service';
import { Carrier } from 'app/main/supports/models/carrier.model';
import { camelizeKeys } from 'app/core/utils/helpers';

class EmptyExcelRow { }

@Injectable({
  providedIn: 'root'
})
export class OliveOrderTrackingExcelService {

  constructor
    (
      private documentService: OliveDocumentService, private translator: FuseTranslationLoaderService,
      private orderHelperService: OliveOrderHelperService, private cacheService: OliveCacheService,
      private marketExcelInterfaceService: OliveMarketExcelInterfaceService, private marketService: OliveMarketService,
      private carrierService: OliveCarrierService
    ) {
  }

  saveTrackingNumberExcels(allOrders: OrderShipOut[]) {
    if (allOrders.some(x => OliveUtilities.testIsUndefined(x.trackingNumber))) {
      return;
    }

    // 마켓 엑셀 인터페이스 로드
    this.cacheService.getItems(this.marketExcelInterfaceService, OliveCacheService.cacheKeys.getItemsKey.marketExcelInterface, null)
      .then((interfaces: MarketExcelInterface[]) => {

        // 마켓 로드
        this.cacheService.getItems(this.marketService, OliveCacheService.cacheKeys.getItemsKey.market, null)
          .then((markets: Market[]) => {

            // 캐리어 로드
            this.cacheService.getItems(
              this.carrierService,
              OliveCacheService.cacheKeys.getItemsKey.carrier,
              OliveUtilities.searchOption([{ name: 'activated', value: true } as NameValue], 'name')
            )
              .then((carriers: Carrier[]) => {
                // 자료 타입화 로딩
                for (const face of interfaces) {
                  if (!face.rule) {
                    face.rule = JSON.parse(face.data);
                  }
                }

                this.buildTrackingNumberExcelsStep1(
                  allOrders,
                  createMapFrom(interfaces),
                  createMapFrom(markets),
                  createMapFrom(carriers)
                );
              });
          });
      });
  }

  private buildTrackingNumberExcelsStep1(allOrders: OrderShipOut[], interfaces: Map<number, MarketExcelInterface>, 
    markets: Map<number, Market>, carriers: Map<number, Carrier>) {
    // 판매자별로 그룹
    const marketSellers = <Map<number, OrderShipOut[]>>groupBy(allOrders, (order: OrderShipOut) => order.orderFk.marketSellerFk.id);

    for (const sellerId of Array.from(marketSellers.keys())) {
      const orders = marketSellers.get(sellerId);
      const excelRule = interfaces.get(markets.get(orders[0].orderFk.marketSellerFk.marketId).marketExcelInterfaceId).rule;

      this.buildTrackingNumberExcelsStep2(
        // tracking number descending sort
        orders.sort((a, b) => a.trackingNumber > b.trackingNumber ? -1 : 1),
        excelRule,
        carriers
      );
    }
  }

  private buildTrackingNumberExcelsStep2(orders: OrderShipOut[], excelRule: MarketExcelInterfaceRule, carriers: Map<number, Carrier>) {
    // 헤더 제작
    const columns = this.buildHeader(excelRule);

    // 바디 만들기
    const rows = this.buildBody(orders, excelRule, carriers);

    const fileName = orders[0].orderFk.marketSellerFk.code + '-' + isoDateString(new Date(Date.now()), false);
    this.documentService.exportExcel(fileName, columns, rows);
  }

  private buildHeader(excelRule: MarketExcelInterfaceRule): ExcelColumn[] {
    const columns: ExcelColumn[] = [];

    for (const columnName of excelRule.TrackingUploadColumnNames) {
      columns.push({ headerTitle: columnName, propertyName: columnName, type: 'text',  } as ExcelColumn);
    }

    return columns;
  }

  private buildBody(orders: OrderShipOut[], excelRule: MarketExcelInterfaceRule, carriers: Map<number, Carrier>): EmptyExcelRow[] {
    const rows: EmptyExcelRow[] = [];

    const columnNames = excelRule.TrackingUploadColumnNames;
    const cells = excelRule.TrackingUploadCells;
    const carrierValues = excelRule.TrackingUploadCarrierValues;

    for (const order of orders) {
      // 빈값을 생성
      const row = new EmptyExcelRow();
      for (const columnName of columnNames) {

        row[columnName] = '';
      }

      // TODO : MarketExcelCellTypes.LoginId / MarketExcelCellTypes.AccountNumber
      for (const cell of cells) {
        let value: any;
        switch (cell.CellType) {
          case MarketExcelCellTypes.LoginId:
            value = '';
            break;

          case MarketExcelCellTypes.AccountNumber:
            value = '';
            break;

          case MarketExcelCellTypes.OrderNumber:
            value = order.orderFk.marketOrderNumber;
            break;

          case MarketExcelCellTypes.CarrierName:
            const carrierCode = carriers.get(order.carrierId).standCarrierFk.code;
            if (carrierValues[carrierCode]) {
              value = carrierValues[carrierCode];
            }
            break;

          case MarketExcelCellTypes.TrackingNumber:
            value = order.trackingNumber;
            break;

          case MarketExcelCellTypes.Misc:
            value = cell.DummyValue;
            break;
        }
        row[columnNames[cell.Index]] = value;
      }

      rows.push(row);
    }

    return rows;
  }
}
