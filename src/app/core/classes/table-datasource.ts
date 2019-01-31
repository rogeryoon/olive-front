import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

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
    private _ObjectsSubject$ = new BehaviorSubject<DatasourceObject[]>([]);
    public formGroup: FormGroup;

    constructor() { super(); }

    connect(): Observable<DatasourceObject[]> {
        return this._ObjectsSubject$.asObservable().pipe(
            tap(res => {
                const fa = <FormArray>this.formGroup.get('formarray');
                fa.controls.splice(0);
                res.forEach(r => fa.push(this.createRowFormGroup(r)));
            }),
        );
    }

    disconnect() {
        this._ObjectsSubject$.complete();
    }

    get items(): any[] {
        const array: any[] = [];
        this._objectStore.forEach(r => array.push(r.Obj));
        return array;
    }

    loadItems(payments: any[]) {
        this._objectStore = []; // clear current stored data
        payments.forEach(m => this._objectStore.push(new DatasourceObject(m)));
        this._ObjectsSubject$.next(this._objectStore);
    }

    public addNewItem(m: any): DatasourceObject {
        if (!m) { m = this.createNewItem(); }
        const o = new DatasourceObject(m);
        this._objectStore.push(o);
        this._ObjectsSubject$.next(this._objectStore);
        return o;
    }

    public deleteItem(res: DatasourceObject) {
        if (!res || !res.Obj) { return; }
        const d = res.ObjId;
        this._objectStore.forEach((m, i) => {
            if (m.ObjId === d) { this._objectStore.splice(i, 1); }
        });
        this._ObjectsSubject$.next(this._objectStore);
    }

    createNewFormContorl(r: any, propName: string, validators: any[]): FormControl {
        const m = new FormControl(r.Obj[propName], validators.length ? validators : null);
        m.valueChanges.subscribe(val => { r.Obj[propName] = val; });
        return m;
    }

    createRowFormGroup(r: DatasourceObject): FormGroup { return null; }
    public createNewItem(): any { return null; }
}
