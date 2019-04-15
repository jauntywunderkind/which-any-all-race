"use module"
import Deferrant from "deferrant"

export async function whichRace( promises, { signal}){
	let d= Deferrant({ signal})
	function resolve( resolved){
		if( !d){
			return
		}
		//
		const _d= d
		d= null
		// resolve
		d.resolve({
			...this,
			resolved
		})
	}
	function reject( rejection){
		if( !d){
			return
		}
		// cleanup
		const _d= d
		d= null
		// reject
		_d.reject({
			...this,
			rejection
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
