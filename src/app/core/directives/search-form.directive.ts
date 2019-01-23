import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[oliveSearchForm]'
})
export class OliveSearchFormDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
