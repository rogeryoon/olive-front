import { Injectable } from '@angular/core';

import { OliveHelpEndpointService } from './help-endpoint.service';
import { Help } from '../models/Help';
import { CategoryHelps } from '../models/CategoryHelps';

@Injectable({
  providedIn: 'root'
})
export class OliveHelpService {

    constructor(private helpEndpoint: OliveHelpEndpointService) {} 

    getHelps(helpCategoryCode?: string)
    {
        return this.helpEndpoint.getHelpsEndPoint<Help[]>(helpCategoryCode);
    }

    getHelp(helpId?: number)
    {
        return this.helpEndpoint.getHelpEndPoint<any>(helpId);
    }

    getTopHelpsByCategory()
    {
        return this.helpEndpoint.getTopHelpsByCategoryEndPoint<CategoryHelps[]>();
    }
}

