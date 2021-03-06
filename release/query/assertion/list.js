"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var value_1 = require("./value");
/**
 * requires {filter} to match each element of {otherValues}
 * all ( 'txt' ) ( [ 'txt' , 'txt' , 'txt' ] ) -> true
 * all ( 'txt' ) ( [ 'txt' , 'txt' , 'txt', 'txt' ] ) -> true
 * all ( 'txt' ) ( [ 'txt' , 'txt' , 'txt', 'src' ] ) -> true
 */
exports.all = function (filter) { return function (otherValues) {
    if (otherValues.length === 0)
        return false;
    return otherValues.filter(value_1.getFilter(filter)).length === otherValues.length;
}; };
exports.either = function (filterValues) { return function (values) {
    return filterValues.findIndex(function (filterValue) { return values.indexOf(filterValue) > -1; }) > -1;
}; };
/**
 * requires all values of {value} to be in {listValue}
 * @type {listMatcher<any>}
 * [ a, b ]  eq  [ b, a ]
 * [ a, b ]  eq  [ c, b, a ]
 * [ a, d ]  ne  [ c, b, a ]  => d missing
 */
exports.contains = function (value, invert) {
    if (invert === void 0) { invert = false; }
    if (Array.isArray(value)) {
        return function (listValue) {
            var matchingValues = value.filter(function (valueItem) {
                return exports.contains(valueItem, invert)(listValue);
            });
            return matchingValues.length === value.length;
        };
    }
    return function (listValue) {
        var idx = listValue.indexOf(value);
        return idx > -1 !== invert;
    };
};
/**
 * requires all values of {value} to be missing(!) in {listValue}
 * @type {listMatcher<any>}
 * [ a, b ]  ne  [ b, a ]
 * [ a, b ]  ne  [ c, b, a ]
 * [ a, b ]  eq  [ c, d ]
 */
exports.containsNot = function (value) { return exports.contains(value, true); };
/**
 * requires all values of {value} to be in {listValue} in the same order
 * [ a, b ] eq [ a, b ]
 * [ a, b ] ne [ a, b, c ]
 * [ a, b ] ne [ b, a ]
 * @type {listMatcher<any>}
 */
exports.deepEqual = function (values) { return function (otherValues) {
    if (values.length !== otherValues.length)
        return false;
    var left = values.slice();
    var right = otherValues.slice();
    while (value_1.eq(left.pop())(right.pop())) {
        if (left.length === 0)
            return true;
    }
    return false;
    //return !values.find ( ( value , idx ) => idx !== otherValues.indexOf(value)  )
}; };
function isLongish(other) {
    return ('length' in other);
}
exports.isLongish = isLongish;
/**
 * @param {[type]} otherValues.length [description]
 */
exports.hasLength = function (length) {
    if ('number' === typeof length) {
        return function (other) {
            return other.length === length;
        };
    }
    return function (other) { return length(other.length); };
};
exports.query = function (listQuery) {
    if (Array.isArray(listQuery)) {
        return exports.query({ deepEqual: listQuery });
    }
    var assertions = [];
    if (isLongish(listQuery)) {
        if ('function' === typeof listQuery.length) {
            assertions.push(exports.hasLength(listQuery.length));
        }
        assertions.push(exports.hasLength(listQuery.length));
    }
    if (listQuery.either)
        assertions.push(exports.either(listQuery.either));
    if (listQuery.contains)
        assertions.push(exports.contains(listQuery.contains));
    if (listQuery.containsNot)
        assertions.push(exports.containsNot(listQuery.containsNot));
    if (listQuery.all)
        assertions.push(exports.all(listQuery.all));
    if (listQuery.deepEqual)
        assertions.push(exports.deepEqual(listQuery.deepEqual));
    return function (list) {
        return assertions.length === assertions.filter(function (assertion) { return assertion(list) === true; }).length;
    };
};
//# sourceMappingURL=list.js.map