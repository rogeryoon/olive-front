import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[olivePlaceHolder]'
})
export class OlivePlaceHolderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
