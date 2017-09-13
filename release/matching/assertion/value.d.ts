import { ValueTest, valueMatcher, numberMatcher, stringMatcher, valueFilter } from '../../interfaces';
export declare const eq: <T>(value: T) => ValueTest<T>;
export declare const gt: numberMatcher;
export declare const gte: numberMatcher;
export declare const lt: numberMatcher;
export declare const lte: numberMatcher;
export declare const match: stringMatcher;
export declare const isValueFilter: <T>(other: any) => other is valueFilter<T>;
export declare const isValueMatcher: <T>(other: any) => other is valueMatcher<T>;
export declare function getFilter<T>(filter: T): valueFilter<T>;