"use module"
import Deferrant from "deferrant"

export async function *whichAny( promises, { signal}){
	let d= Deferrant({ signal})
	d.errors= []
	d.referenceCount= 0
	function resolve( resolved){
		if( !d){
			return
		}
		// we're the first any, resolve!
		d.resolve({
			value: resolved,
			promise,
			index
		})
		// cleanup
		d.errors= null
		d= null
	}
	function reject( rejected){
		if( !d){
			return
		}
		// add ourselves to errors
		d.errors[ this.valueOf()]= rejected
		// mark another error as handled
		if( --d.referenceCount=== 0){
			// all errors collected
			d.reject( d.errors)
			d.errors= null
			d= null
		}
	}
	for( const promise of promises){
		const index= d.referenceCount++
		promise.then( resolve.bind( index), reject.bind( index))
	}
	return d
}
export {
	whichAny as WhichAny
}
export default whichAny

