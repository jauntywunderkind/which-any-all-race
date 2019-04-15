"use module"
import Deferrant from "deferrant"

export async function whichAll( promises, { signal}){
	let d= Deferrant({ signal})
	d.resolveds= []
	d.referenceCount= 0
	function resolve( resolved){
		if( !d){
			return
		}
		d.resolveds[ this.index]= resolved
		if( --d.referenceCount=== 0){
			const resolveds= d.resolveds
			d.resolveds= null
			d= null
			d.resolve( resolveds)
		}
	}
	function reject( reason){
		if( !d){
			return
		}
		// cleanup
		const _d= d
		d.resolveds= null
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
	whichAll as WhichAll,
	whichAll as default
}
