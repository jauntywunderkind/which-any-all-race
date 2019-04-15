"use module"
import Deferrant from "deferrant"

export async function *whichAny( promises, { signal}){
	let d= Deferrant({ signal})
	d.rejections= []
	d.referenceCount= 0
	function resolve( resolved){
		if( !d){
			return
		}
		const _d= d
		// cleanup
		d.rejections= null
		d= null
		// we're the first any, resolve!
		_d.resolve({
			...this,
			value: resolved,
		})
	}
	function reject( rejection){
		if( !d){
			return
		}
		// add ourselves to rejections
		d.rejections[ this.index]= reason
		// mark another error as handled
		if( --d.referenceCount=== 0){
			// all rejections collected
			const rejections= d.rejections
			d.rejections= null
			d= null
			d.reject( rejections)
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
	whichAny as WhichAny,
	whichAny as default
}
