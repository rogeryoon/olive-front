import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';

import { OliveUtilities } from '../classes/utilities';


@Injectable()
export class OliveQueryParameterService {
  constructor(
    protected route: ActivatedRoute,
    private accountService: AccountService
  ) 
  {
  }

  get CompanyGroupId(): number {
    let queryParamGroupIdBase36 = '';

    this.route.queryParams.pipe(
        filter(params => params.cgroup)
      )
      .subscribe(params => {
        queryParamGroupIdBase36 = params.cgroup;
      });

    let returnCompanyGroupID = this.accountService.currentUser.companyGroupId;

    if (queryParamGroupIdBase36) {
      const queryCompanyGroupId = OliveUtilities.convertBase36ToNumber(queryParamGroupIdBase36);
      
      if 
      (
        queryCompanyGroupId > 0 && 
        queryCompanyGroupId !== returnCompanyGroupID &&
        this.accountService.userHasPermission(Permission.manageOtherCompanies)
      ) {
        returnCompanyGroupID = queryCompanyGroupId;
      }
    }

    return returnCompanyGroupID;
  }
}
