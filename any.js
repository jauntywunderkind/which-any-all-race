"use module"
import Deferrant from "deferrant"

export async function *whichAny( promises, { signal}){
	let d= Deferrant({ signal})
	d.reasons= []
	d.referenceCount= 0
	function resolve( value){
		if( !d){
			return
		}
		const _d= d
		// cleanup
		d.reasons= null
		d= null
		// we're the first any, resolve!
		_d.resolve({
			...this,
			value
		})
	}
	function reject( reason){
		if( !d){
			return
		}
		// add ourselves to rejections
		d.reasons[ this.index]= reason
		// mark another error as handled
		if( --d.referenceCount=== 0){
			// all rejections collected
			const reasons= d.reasons
			d.reasons= null
			d= null
			d.reject( reasons)
		}
	}
	for( const promise of promises){
		const ctx= {
			promise,
			index: d.referenceCount++
		}
		promise.then( resolve.bind( ctx), reject.bind( ctx))
	}
	return d
}
export {
  whichAny as default,
  whichAny as WhichAny
}
