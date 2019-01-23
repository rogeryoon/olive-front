import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { OliveInventoryEndpointService } from './inventory-endpoint.service';
import { InventoryWarehouse } from '../models/inventory-warehouse';

export type InventoryChangedOperation = 'add' | 'delete' | 'modify';
export interface InventoriesChangedEventArg { inventories: InventoryWarehouse[] | string[]; operation: InventoryChangedOperation; }

@Injectable()
export class OliveInventoryService {
  public static readonly inventoryAddedOperation: InventoryChangedOperation = 'add';
  public static readonly inventoryDeletedOperation: InventoryChangedOperation = 'delete';
  public static readonly inventoryModifiedOperation: InventoryChangedOperation = 'modify';

  private _inventoryChanged = new Subject<InventoriesChangedEventArg>();

  constructor(private inventoryEndpoint: OliveInventoryEndpointService) { }

  getInventoryBalance(dataTablesParameters: any) {
    return this.inventoryEndpoint.getInventoryBalanceEndpoint<any>(dataTablesParameters);
  }

  getInventoryWarehouse(dataTablesParameters: any) {
    return this.inventoryEndpoint.getInventoryWarehouseEndpoint<any>(dataTablesParameters);
  }

//   getInventory(inventoryId: number) {
//     return this.inventoryEndpoint.getInventoryEndpoint<any>(inventoryId);
//   }

//   getInventories(dataTablesParameters: any) {
//     return this.inventoryEndpoint.getInventoriesEndpoint<any>(dataTablesParameters);
//   }

//   newInventory(inventory: Inventory) {
//     return this.inventoryEndpoint.getNewInventoryEndpoint<any>(inventory)
//             .do(data => this.onInventoriesChanged([inventory], OliveInventoryService.inventoryAddedOperation));
//   }

//   updateInventory(inventory: Inventory, inventoryId: number) {
//     return this.inventoryEndpoint.getUpdateInventoryEndpoint(inventory, inventoryId)
//             .do(data => this.onInventoriesChanged([inventory], OliveInventoryService.inventoryModifiedOperation));
//   }

//   deleteInventory(inventoryId: number | Inventory): Observable<Inventory>
//   {
//     if (typeof inventoryId === 'number' || inventoryId instanceof Number)
//     {
//       return this.inventoryEndpoint.getDeleteInventoryEndpoint<Inventory>(<number>inventoryId)
//         .do(data => this.onInventoriesChanged([data], OliveInventoryService.inventoryDeletedOperation));
//     }
//     else
//     {
//       return this.deleteInventory(inventoryId.id);
//     }
//   }

//   private onInventoriesChanged(inventories: Inventory[] | string[], op: InventoryChangedOperation) {
//     this._inventoryChanged.next({ inventories: inventories, operation: op });
//   }
}
