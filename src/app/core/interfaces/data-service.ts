import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class OliveDataService {
  abstract getItem(id: number): any;

  abstract getItems(dataTablesParameters: any): any;

  abstract newItem(item: any): any;

  abstract uploadItems(items: any): any;

  abstract updateItem(item: any, id: number): any;

  abstract deleteItem(id: number | any): any;

  abstract get(subUrl: string): any;

  abstract post(post: string, data: any): any;

  abstract postString(subUrl: string, data: string): any;

  abstract put(subUrl: string, data: any): any;
}
