import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Help } from '../models/Help';

@Component({
  selector: 'olive-help-article',
  templateUrl: './help-article.component.html',
  styleUrls: ['./help-article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OliveHelpArticleComponent 
{
  help: any;

  constructor(
    public dialogRef: MatDialogRef<OliveHelpArticleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  {
  }
}
