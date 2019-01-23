import { Component, Input } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'fuse-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations : fuseAnimations
})
export class OliveHomeComponent
{
  constructor() { }
}
