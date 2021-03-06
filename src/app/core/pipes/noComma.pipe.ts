import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'noComma'
})
export class OliveNoCommaPipe implements PipeTransform {

    transform(val: number): string {
        if (val !== undefined && val !== null) {
            // here we just remove the commas from value
            return val.toString().replace(',', '');
        } else {
            return '';
        }
    }
}

