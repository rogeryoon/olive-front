import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { FuseNavigation } from '@fuse/types';

import { AuthService } from '@quick/services/auth.service';

import { defaultNavigation } from '../navigations/default-navigation';
import { reserveNavigation } from '../navigations/reserve-navigation';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Injectable({
  providedIn: 'root'
})
export class OliveNavigationSelectorService implements OnInit, OnDestroy {
    onNavigationChanged: Subject<any> = new Subject;
    loginStatusSubscription: any;
    protected navigation: any;
    protected isAuthenticNavigation?: boolean;
    protected navigationMap: { [name: string]: FuseNavigation[]; } = {};

    constructor(private authService: AuthService, private translator: FuseTranslationLoaderService) {
        this.navigationMap['default'] = defaultNavigation;
        this.navigationMap['reserve'] = reserveNavigation;
    }

    ngOnInit(): void {
        this.loginStatusSubscription = this.authService.getLoginStatusEvent()
            .subscribe(() => {
                this.refresh();
                this.onNavigationChanged.next(this.navigation);
            });
    }

    ngOnDestroy(): void {
        if (this.loginStatusSubscription) {
            this.loginStatusSubscription.unsubscribe();
        }
    }

    getNavigation(): any {
        if (!this.navigation) {
            this.refresh();
        }

        return this.navigation;
    }

    private refresh(name: string = 'default') {
        console.log('refresh', name);
        const navis = this.navigationMap[name];
        this.navigation = this.load(navis);
    }

    private load(navis: FuseNavigation[] = null): FuseNavigation[] {
        let returnNavis: FuseNavigation[] = null;
        let returnNavi: FuseNavigation = null;

        navis.forEach(navi => {
            if (!this.needToShowMenu(navi)) {
                return;
            }

            if (!returnNavis) {
                returnNavis = [];
            }

            // Deep Copy
            returnNavi = jQuery.extend(true, {}, navi);
            // if (returnNavi.translate) {
            //     const returnValue = this.translator.get(returnNavi.translate);
            //     if (returnNavi.translate !== returnValue) {
            //         returnNavi.title = this.translator.get(returnNavi.translate);
            //     }
            // }

            if (navi.children != null) {
                returnNavi.children = this.load(navi.children);
            }
            else {
                returnNavi.children = null;
            }

            if (returnNavi.children != null || returnNavi.type === 'item') {
                returnNavis.push(returnNavi);
            }
        });

        return returnNavis;
    }

    private needToShowMenu(navi: FuseNavigation) {
        let show = false;
        const userPermissions = this.authService.userPermissions;
        const userMaster = this.authService.companyMaster;
        const userGroupSetting = this.authService.companyGroupSetting;

        if (navi.permissions && userPermissions) {
            if (navi.permissions.length === 0 && !this.authService.isLoggedIn) {
                return show = true;
            }

            for (let i = 0; i < navi.permissions.length; i++) {
                for (let j = 0; j < userPermissions.length; j++) {
                    if (navi.permissions[i] === userPermissions[j]) {
                        return show = true;
                    }
                }
            }
        } // Group 정책먼저 적용 후 Master를 적용해야 문제가 없음 (Detail -> Global : 자세한것 부터)
        else if (navi.groupEnables) {
            for (let i = 0; i < navi.groupEnables.length; i++) {
                const groupPropertyName = navi.groupEnables[i];
                if (userGroupSetting[groupPropertyName]) {
                    if (userMaster.hasOwnProperty(groupPropertyName)) {
                        if (userMaster[groupPropertyName]) {
                            return show = true;
                        }
                    }
                    else {
                        return show = true;
                    }
                }
            }
        }
        else if (navi.masterEnables) {
            for (let i = 0; i < navi.masterEnables.length; i++) {
                if (userMaster[navi.masterEnables[i]]) {
                    return show = true;
                }
            }
        }        
        else if (!navi.permissions && !navi.masterEnables && !navi.groupEnables) {
            show = true;
        }

        return show;
    }
}
