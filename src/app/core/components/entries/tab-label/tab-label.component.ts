import { Component, Input } from '@angular/core';

@Component({
  selector: 'olive-tab-label',
  templateUrl: './tab-label.component.html',
  styleUrls: ['./tab-label.component.scss']
})
export class OliveTabLabelComponent {
  @Input() 
  hasError: boolean;

  @Input()
  tabTitleId: string;
}
