"use module"
import Deferrant from "deferrant"

export async function whichAll( promises, { signal}){
	let d= Deferrant({ signal})
	d.values= []
	d.referenceCount= 0
	function resolve( value){
		if( !d){
			return
		}
		d.resolves[ this.index]= value
		if( --d.referenceCount=== 0){
			const values= d.values
			d.values= null
			d= null
			d.resolve( values)
		}
	}
	function reject( reason){
		if( !d){
			return
		}
		// cleanup
		const _d= d
		d.values= null
		d= null
		// we're the first to reject, reject:
		_d.reject({
			...this,
			reason
		})
	}
	for( const promise of promises){
		const ctx= {
			promise,
			index: d.referenceCount++
		}
		promise.then( resolve.bind( index), reject.bind( index))
	}
	return d
}
export {
  whichAll as default,
  whichAll as WhichAll
}
