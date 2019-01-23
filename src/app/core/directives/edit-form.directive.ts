import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[oliveEditForm]'
})
export class OliveEditFormDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
