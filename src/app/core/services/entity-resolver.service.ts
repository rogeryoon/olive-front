import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { OliveDataService } from '../interfaces/data-service';
import { isValid36Id, convertBase36ToNumber } from '../utils/encode-helpers';

@Injectable({
  providedIn: 'root'
})
export class OliveEntityResolverService implements Resolve<any> {

  constructor(protected dataService: OliveDataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isValid36Id(route.paramMap.get('id').toString())) {
      return null;
    }

    const id36 = parseInt(route.paramMap.get('id'), 36);

    if (isNaN(id36)) { return null; }

    const id = convertBase36ToNumber(id36.toString());

    if (id > 0) {
      return this.dataService.getItem(id);
    }

    return null;
  }
}
