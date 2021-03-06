import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveDataService } from '../interfaces/data-service';
import { OliveEntityEndpointService } from './entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OliveEntityService implements OliveDataService {
    private apiUrl: string;

    get endpointUrl() { return this.configurations.baseUrl + this.apiUrl; }

    constructor(protected endpoint: OliveEntityEndpointService, protected configurations: ConfigurationService) {}

    setApiUrl(urlPostfix: string) {
        this.apiUrl = '/api/' + urlPostfix;
    }

    getItem(id: number) {
        const errorCount = {unAuth: 0};
        return this.endpoint.getItemEndpoint<any>(id, this.endpointUrl, errorCount);
    }

    getItems(dataTablesParameters: any = null) {
        const errorCount = {unAuth: 0};
        return this.endpoint.getItemsEndpoint<any>(dataTablesParameters, this.endpointUrl, errorCount);
    }

    newItem(item: any) {
        const errorCount = {unAuth: 0};
        return this.endpoint.newItemEndpoint<any>(item, this.endpointUrl, errorCount);
    }

    uploadItems(items: any) {
        const errorCount = {unAuth: 0};
        return this.endpoint.uploadItemsEndpoint<any>(items, this.endpointUrl, errorCount);
    }

    updateItem(item: any, id: number) {
        const errorCount = {unAuth: 0};
        return this.endpoint.updateItemEndpoint(item, id, this.endpointUrl, errorCount);
    }

    deleteItem(id: number | any) {
        const errorCount = {unAuth: 0};
        if (typeof id === 'number' || id instanceof Number) {
            return this.endpoint.deleteItemGroupEndpoint<any>(<number>id, this.endpointUrl, errorCount);
        }
        else {
            return this.deleteItem(id.id);
        }
    }

    get(subUrl: string) {
        const errorCount = {unAuth: 0};
        return this.endpoint.getEndpoint<any>(subUrl, this.endpointUrl, errorCount);
    }

    post(subUrl: string, data: any) {
        const errorCount = {unAuth: 0};
        return this.endpoint.postEndpoint<any>(subUrl, this.endpointUrl, data, errorCount);
    }

    postString(subUrl: string, data: string) {
        const errorCount = {unAuth: 0};
        return this.endpoint.postStringEndpoint<any>(subUrl, this.endpointUrl, data, errorCount);
    }

    put(subUrl: string, data: any) {
        const errorCount = {unAuth: 0};
        return this.endpoint.putEndpoint<any>(subUrl, this.endpointUrl, data, errorCount);
    }    
}
