/// <reference path="./index.d.ts" />

import "./index.d.ts";
import type {Identifier, MethodName, OrigMethodName} from "./types.ts";



if (!String.prototype.STRABO_CONF) {
	Object.defineProperty(String.prototype, "STRABO_CONF", {
		value: {},
		enumerable: false,
	})
}


const checkNativeImpl = function(methodName: MethodName) {
	const names = ["Jack", "John", "Jim"]
	const testString = "John walks in the park"
	return testString[methodName](names as unknown as string)
}

const alterStringProto = function (name: string, fn: (input: string) => boolean, identifier?: Identifier) {
	const alteredProps = {
		[name]: {enumerable: false, value: fn}
	}
	Object.defineProperties(String.prototype, alteredProps);
	if (identifier) String.prototype.STRABO_CONF[`_hasAltered${identifier}`] = true

}

const registerAlteredMethod = function (
	methodName: MethodName,
	origName: OrigMethodName,
	identifier: Identifier
) {

	if (String.prototype.STRABO_CONF[`_hasAltered${identifier}`] === true || checkNativeImpl(methodName)) return

	const original = String.prototype[methodName]

	function altered(this: string, input: string | string[], position?: number) {
		if (!Array.isArray(input)) return original.call(this, input, position)
		return input.some(elem => original.call(this, elem, position))
	}

	alterStringProto(origName, original, undefined)
	alterStringProto(methodName, altered, identifier)
}

registerAlteredMethod("startsWith", "origStartsWith", "SW")
registerAlteredMethod("endsWith", "origEndsWith", "EW")
registerAlteredMethod("includes", "origIncludes", "IN")

