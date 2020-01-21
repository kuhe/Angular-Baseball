import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toIterable'
})
export class ToIterablePipe implements PipeTransform {
    transform(value) {
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            const primitive = window;
            return keys.map(function(key) {
                let val = value[key];
                if (val instanceof Object) {
                } else {
                    const type = (typeof val).toUpperCase()[0] + (typeof val).slice(1);
                    if (primitive[type]) {
                        val = new primitive[type](val);
                    } else {
                        val = {};
                    }
                }
                val.__key = key;
                return val;
            });
        }
    }
}
