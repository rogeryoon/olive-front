// https://github.com/aishiekara/angular2-floatthead/blob/master/floatthead.directive.ts

// 현재 작동되지 않음 - 추가 리서치 필요

import { Directive, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

declare var jQuery: any;
require('floatthead/dist/jquery.floatThead.js');

@Directive({
  selector: '[oliveFloathead]'
})
export class OliveFloatheadDirective implements AfterViewInit, OnDestroy {
  $el: any;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.$el = jQuery(this.elementRef.nativeElement);
    // // I used window scroll event so the floathead will only 
    // // show on window scroll with pageYOffset > 100
    // // because, floathead reflow only on window resize but not on table resize
    // window.addEventListener('scroll', (e) => this.freezeHeader());

    this.$el.floatThead({
      position: 'auto'
    });
  }

  freezeHeader() {
    if (window.pageYOffset > 100) {
      this.$el.floatThead({
        position: 'fixed',
      });
    } else {
      this.$el.floatThead('destroy');
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', (e) => this.freezeHeader());
  }
}
