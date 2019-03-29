import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { defaultNavigation } from '../navigations/defaut-navigation';
import { adminNavigation } from '../navigations/admin-navigation';
import { AuthService } from '@quick/services/auth.service';

@Injectable()
export class OliveNavigationSelectorService {

    onNavigationChanged: Subject<any> = new Subject;
    navigation: any;
    navigationMap: { [name: string]: any; } = {};

    constructor(private authService: AuthService) { 
        this.navigationMap['default'] = defaultNavigation;
        this.navigationMap['admin'] = adminNavigation;
    }

    getNavigation() {
        if (!this.navigation) {
            this.navigation = this.navigationMap['default'];
        }

        if (this.authService.isLoggedIn) {
            console.log(this.navigation);
        }

        return this.navigation;
    }

    setAdminNavigation() {
        this.navigation = this.navigationMap['admin'];
    }
}
