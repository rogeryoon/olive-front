import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveDataService } from '../interfaces/data-service';
import { OliveEntityEndpointService } from './entity-endpoint.service';

@Injectable()
export class OliveEntityService implements OliveDataService {
    private apiUrl: string;

    get itemUrl() { return this.configurations.baseUrl + this.apiUrl; }

    constructor
    (
        private entityEndpoint: OliveEntityEndpointService,
        private configurations: ConfigurationService
    ) 
    { 
    }

    setApiUrl(urlPostfix: string) {
        this.apiUrl = '/api/' + urlPostfix;
    }

    getItem(id: number) {
        return this.entityEndpoint.getItemEndpoint<any>(id, this.itemUrl);
    }

    getItems(dataTablesParameters: any) {
        return this.entityEndpoint.getItemsEndpoint<any>(dataTablesParameters, this.itemUrl);
    }

    newItem(item: any) {
        return this.entityEndpoint.newItemEndpoint<any>(item, this.itemUrl);
    }

    uploadItems(items: any) {
        return this.entityEndpoint.uploadItemEndpoint<any>(items, this.itemUrl);
    }

    updateItem(item: any, id: number) {
        return this.entityEndpoint.updateItemEndpoint(item, id, this.itemUrl);
    }

    deleteItem(id: number | any) {
        if (typeof id === 'number' || id instanceof Number) {
            return this.entityEndpoint.deleteItemGroupEndpoint<any>(<number>id, this.itemUrl);
        }
        else {
            return this.deleteItem(id.id);
        }
    }
}
