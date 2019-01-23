import { Injectable } from '@angular/core';

@Injectable()
export abstract class OliveDataService {
  abstract getItem(id: number): any;

  abstract getItems(dataTablesParameters: any): any;

  abstract newItem(item: any): any;

  abstract uploadItems(items: any): any;

  abstract updateItem(item: any, id: number): any;

  abstract deleteItem(id: number | any): any;
}
