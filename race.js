"use module"
import Deferrant from "deferrant"

export async function whichRace( promises, { signal}){
	let d= Deferrant({ signal})
	function resolve( value){
		if( !d){
			return
		}
		//
		const _d= d
		d= null
		// resolve
		d.resolve({
			...this,
			value
		})
	}
	function reject( reason){
		if( !d){
			return
		}
		// cleanup
		const _d= d
		d= null
		// reject
		_d.reject({
			...this,
			reason
		})
	}
	let index= 0
	for( const promise of promises){
		const ctx= {
		  promise,
		  index: index++
		}
		promise.then( resolve.bind( ctx), reject.bind( ctx))
	}
	if( index=== 0){
		d.resolve()
	}
}
export {
  whichRace as default,
  whichRace as WhichRace
}
