//import { ComponentFixture, QueryableAnnotation } from '../query/interfaces'
import { 
  KioComponentItem, 
  ItemIterator, ItemFilter, ItemMapper,
  IndexSymbol 
} from './interfaces'

import { assertComponent, matchComponent } from '../query/Query'
import * as _ from 'lodash'

import { KioNode, KioFragment, KioContent } from 'kio-ng2-data'

const indexToProp = {
  "PublicationComponents": "component",
  "PublicationFixtures": "fixture",
  "PublicationCriterias": "criteria"
}

const emptyItem:KioComponentItem = {
  componentName: undefined,
  component: undefined,
  fixture: undefined,
  criteria: undefined
}

const normalizeComponentName = ( name:string ) => {
  return name.replace(/Component$/,'')
}

export class ComponentsStore {

  items:KioComponentItem[]=[]

  /**
   * register kio component for component routing
   * @param {KioComponentItem} item 
   */
  addItem ( item:KioComponentItem ) {
    this.items.push ( item )
  }

  addSymbol ( indexName:string, indexSymbol:IndexSymbol ) {
    const {
      componentName,
      symbol
    } = indexSymbol

    const propKey:string = indexToProp[indexName]

    let componentItem = this.find((item,idx)=> normalizeComponentName(item.componentName) === normalizeComponentName(componentName) )
    if ( !componentItem )
    {
      componentItem = {
        ...emptyItem,
        componentName: normalizeComponentName(componentName)
      }
      this.addItem(componentItem)
    }
    this.updateItem(componentItem,propKey,symbol)
  }

  updateItem ( item:KioComponentItem, key:string, value:any ) {
    const items = this.items.slice()
    this.items = items.map ( ( mapItem, idx ) => {
      if ( item !== mapItem )
        return mapItem
      return {
        ...item ,
        [key]: value
      }
    } )
  }

  filter ( filter:ItemFilter ):KioComponentItem[] {
    return _.filter(this.items,filter)
  }

  find ( filter:ItemFilter ):KioComponentItem {
    return _.find(this.items,filter)
  }

  getAt ( idx:number ):KioComponentItem {
    return this.items[idx]
  }

  eachItem ( iterator:ItemIterator ):void {
    const clonedList = this.items.slice()
    this.items.forEach ( ( item:KioComponentItem, idx:number ) => iterator ( item, idx, clonedList ) )
  }

  mapItems ( mapper:ItemMapper ):any[] {
    const clonedList = this.items.slice()
    return this.items.map ( ( item:KioComponentItem, idx:number ) => mapper ( item, idx, clonedList ) )
  }

  findItemForNode ( node:KioContent ):number {
    return _.findIndex(this.items, ( item:KioComponentItem, idx:number ):boolean => {
      return item.criteria && matchComponent ( item.criteria ) ( node )
    } )
  }

}