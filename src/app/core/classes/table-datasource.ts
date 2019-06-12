import { DataSource } from '@angular/cdk/collections';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Currency } from 'app/main/supports/models/currency.model';
import { OliveCacheService } from '../services/cache.service';
import { OliveUtilities } from './utilities';

export class DatasourceObject {
    public readonly ObjId: number;
    public Obj: any;
    constructor(m: any) {
        this.Obj = m;
        this.ObjId = Math.floor(Math.random() * 100000);
    }
}

export class TableDatasource extends DataSource<any> {
    private _objectStore: DatasourceObject[] = [];
    private _saveObjectStore: DatasourceObject[] = [];
    private _ObjectsSubject$ = new BehaviorSubject<DatasourceObject[]>([]);
    public formGroup: FormGroup;
    protected standCurrency: Currency;
    protected currencies: Currency[];

    constructor(protected cacheService: OliveCacheService) {
        super();
        this.init();
    }

    init() {
        this.currencies = this.cacheService.currencies;
        this.standCurrency = this.cacheService.standCurrency;
    }

    connect(): Observable<DatasourceObject[]> {
        return this._ObjectsSubject$.asObservable().pipe(
            tap(res => {
                const fa = <FormArray>this.formGroup.get('formarray');
                fa.controls.splice(0);
                res.forEach(r => {
                    fa.push(this.createRowFormGroup(r));
                });
            }),
        );
    }

    disconnect() {
        this._ObjectsSubject$.complete();
    }

    get items(): any[] {
        return this.objects.map(root => root.Obj);
    }

    get objects(): any[] {
        return this._objectStore;
    }

    loadItems(items: any[]) {
        this._objectStore = []; // clear current stored data
        items.forEach(m => this._objectStore.push(new DatasourceObject(m)));
        this.renderItems(false);
    }

    public renderItems(needReInitialize: boolean = true) {
        if (needReInitialize) {
            this.reInitialize();
        }

        this._ObjectsSubject$.next(this._objectStore);
    }

    private reInitialize() {
        Object.assign(this._saveObjectStore, this._objectStore);

        this._objectStore = [];

        this._saveObjectStore.forEach(m => {
            this.addNewItem(m.Obj);
        });

        this._saveObjectStore = [];

        this.onReInitialize();
    }

    public addNewItem(m: any): DatasourceObject {
        if (!m) { m = this.createNewItem(); }
        const o = new DatasourceObject(m);
        this._objectStore.push(o);

        return o;
    }

    public deleteItem(res: DatasourceObject) {
        if (!res || !res.Obj) { return; }

        const d = res.ObjId;
        this._objectStore.forEach((m, i) => {
            if (m.ObjId === d) {
                this._objectStore.splice(i, 1);
            }
        });

        this.renderItems();
        this.formGroup.markAsDirty();
    }

    public deleteAll() {
        this._objectStore = [];
        this.renderItems();
    }

    createNewFormContorl(r: any, propName: string, validators: any[] = null, disabled = false): FormControl {
        const stringValue = OliveUtilities.testIsUndefined(r.Obj[propName]) ? '' : r.Obj[propName].toString();

        let value: any;
        if (stringValue === 'true') {
            value = true;
        }
        else if (stringValue === 'false') {
            value = false;
        }
        else {
            value = stringValue;
        }

        let formControl: FormControl;
        const validatorSetting = validators && validators.length > 0 ? validators : null;

        if (disabled) {
            formControl = new FormControl({ value: value, disabled: disabled }, validatorSetting);
        }
        else {
            formControl = new FormControl(value, validatorSetting);
        }

        formControl.valueChanges.subscribe(val => { r.Obj[propName] = val; });
        return formControl;
    }

    createRowFormGroup(r: DatasourceObject): FormGroup { return null; }
    createNewItem(): any { return null; }
    onReInitialize() { }
}
