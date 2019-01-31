import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[oliveOnlyNumber]'
})
export class OliveOnlyNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) 
  onKeyDown(event) {
    const e = <KeyboardEvent> event;

    if (!/[0-9.]/.test(e.key)) {
      e.preventDefault();
    }
  }
}
