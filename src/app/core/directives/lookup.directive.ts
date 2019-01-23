import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[oliveLookUp]'
})
export class OliveLookUpDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
