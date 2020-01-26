import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OliveOrderShipOutService } from './order-ship-out.service';

@Injectable({
  providedIn: 'root'
})
export class OliveOrderShipOutPackageListerResolverService implements Resolve<any> {

  constructor(
    private orderShipOutService: OliveOrderShipOutService
  ) {
  }

  resolve() {
    return this.orderShipOutService.summary();
  }
}
