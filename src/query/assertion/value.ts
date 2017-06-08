import { 
  ListValue , ListQuery ,
  ValueQuery ,
  NumberQuery ,
  ValueTest ,
  valueMatcher ,
  numberMatcher ,
  stringMatcher ,
  listMatcher ,
  valueFilter
} from '../interfaces'

export const eq = <T>( value:T ) => {
  /*if ( value && 'function' === typeof value.test )
    return value.test.bind ( value )*/
  return function matcher <K extends T>( otherValue:K ) {
    if ( typeof value !== typeof otherValue )
      return false
    return value === otherValue
  }
}
export const gt : numberMatcher = ( value:number ) => ( otherValue :number ) => otherValue > value
export const gte : numberMatcher = ( value:number ) => ( otherValue :number ) => otherValue >= value
export const lt : numberMatcher = ( value:number ) => ( otherValue :number ) => otherValue < value
export const lte : numberMatcher = ( value:number ) => ( otherValue :number ) => otherValue <= value

export const match : stringMatcher = ( value:string|RegExp ) => {
  if ( 'string' === typeof value )
  {
    return eq(value)
  }
  return value.test.bind(value)
}

export const isValueFilter = <T>( other:any ):other is valueFilter<T> => {
  return ( 
    'function' === typeof other 
    &&
    other.length === 1
  )
}

export const isValueMatcher = <T>( other:any ):other is valueMatcher<T> => {
  return ( 
    'function' === typeof other 
    &&
    other.length === 1
  )
}

export const getMatcher = <T>( value:T|valueMatcher<T> ):valueMatcher<T> => {
  if ( isValueMatcher(value) )
  {
    return value
  }

  return eq(value)
}

export const getFilter = <T>( filter:valueFilter<T>|T ):valueFilter<T> => {
  if ( isValueFilter ( filter ) )
  {
    return filter 
  }
  return eq ( filter )
}

