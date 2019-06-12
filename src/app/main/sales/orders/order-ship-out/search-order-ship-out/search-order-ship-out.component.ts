import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OliveOnSearch } from 'app/core/interfaces/on-search';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-search-order-ship-out',
  templateUrl: './search-order-ship-out.component.html',
  styleUrls: ['./search-order-ship-out.component.scss']
})
export class OliveSearchOrderShipOutComponent implements OnInit, OliveOnSearch {
  data: any;
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  onSearch(): any {
    if (!this.searchForm.valid) {
      return null;
    }

    const formModel = this.searchForm.value;

    return OliveUtilities.filterNotNullNameValues(
      [
        { name: 'id', value: formModel.id },
        { name: 'name', value: formModel.name },
        { name: 'memo', value: formModel.memo },
        { name: 'dateStart', value: formModel.dateStart },
        { name: 'dateEnd', value: formModel.dateEnd }
      ]
    );
  }  

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      id: '',
      name: '',
      memo: '',
      dateStart: '',
      dateEnd: ''
    });
  }
}
