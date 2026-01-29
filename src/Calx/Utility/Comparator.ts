export const Comparator = {
    equal(a : any, b : any) : boolean {
        /** ignore case as excel does */
        if (typeof a == 'string') {
            return a.toLowerCase() == ('' + b).toLowerCase();
        }

        return a == b;
    },

    notEqual(a : any, b : any) : boolean {
        /** ignore case as excel does */
        if (typeof a == 'string') {
            return a.toLowerCase() != ('' + b).toLowerCase();
        }

        return a != b;
    },

    lessThan(a : any, b : any) : boolean {
        return a < b;
    },

    greaterThan(a : any, b : any) : boolean {
        return a > b;
    },

    lessEqualThan(a : any, b : any) : boolean {
        return a <= b;
    },

    greaterEqualThan(a : any, b : any) : boolean {
        return a >= b;
    }
}