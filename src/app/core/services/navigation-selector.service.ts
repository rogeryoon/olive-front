import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { defaultNavigation } from '../navigations/defaut-navigation';
import { adminNavigation } from '../navigations/admin-navigation';

@Injectable()
export class OliveNavigationSelectorService {

    onNavigationChanged: Subject<any> = new Subject;
    navigation: any;
    navigationMap: { [name: string]: any; } = {};

    constructor() { 
        this.navigationMap['default'] = defaultNavigation;
        this.navigationMap['admin'] = adminNavigation;
    }

    getNavigation() {
        if (!this.navigation) {
            this.navigation = this.navigationMap['default'];
        }

        return this.navigation;
    }

    setAdminNavigation() {
        this.navigation = this.navigationMap['admin'];
    }
}
