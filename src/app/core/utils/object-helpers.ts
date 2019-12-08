import { FormGroup } from '@angular/forms';

/**
 * Tests is undefined
 * @param value 
 * @returns true if is undefined 
 */
export function testIsUndefined(value: any): boolean {
    return typeof value === 'undefined' || value == null;
}

/**
 * 공용으로 사용되는 id, updatedUser, updatedUtc, createdUser, createdUtc를 가져옴
 */
export function itemWithIdNAudit(source: any, referItem): any {
    source.id = referItem.id;
    source.updatedUser = referItem.updatedUser;
    source.updatedUtc = referItem.updatedUtc;
    source.createdUser = referItem.createdUser;
    source.createdUtc = referItem.createdUtc;
    return source;
}

/**
 * Marks form group touched
 * @param formGroup 
 */
export function markFormGroupTouched(formGroup: FormGroup): void {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();

        if (control.controls) {
            markFormGroupTouched(control);
        }
    });
}
