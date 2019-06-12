import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OliveHelpArticleComponent } from '../help-article/help-article.component';
import { ActivatedRoute } from '@angular/router';
import { CategoryHelps } from '../../models/CategoryHelps';
import { OliveHelpService } from '../../services/help.service';

@Component({
  selector: 'olive-help-by-category',
  templateUrl: './help-by-category.component.html',
  styleUrls: ['./help-by-category.component.scss']
})
export class OliveHelpByCategoryComponent implements OnInit {
  
  categoryHelps: CategoryHelps[];
  maxShortenLength = 35;

  constructor
  (
    private matDialog: MatDialog, 
    private route: ActivatedRoute,
    private helpService: OliveHelpService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ helps }) => {
      this.categoryHelps = helps.model;
    });
  }

  readArticle(helpId: number)
  {
    this.helpService.getHelp(helpId).subscribe(help => {
      this.matDialog.open(OliveHelpArticleComponent, {
        panelClass: 'help-article-dialog',
        data : {help: help.model}
      });
    });
  }

}
