import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OliveHelpService } from '../../supports/helps/services/help.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<any> {

  helps: any;
  helpsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private helpService: OliveHelpService) { }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return this.helpService.getTopHelpsByCategory();
    }

}
