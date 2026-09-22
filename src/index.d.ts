declare global {
	interface String {
		startsWith(searchString: string | string[], position?: number): boolean

		endsWith(searchString: string | string[], endPosition?: number): boolean

		includes(searchString: string | string[], position?: number): boolean

		STRABO_CONF: {
			_hasAlteredSW?: boolean
			_hasAlteredEW?: boolean
			_hasAlteredIN?: boolean
		}

		origStartsWith?(this: string, searchString: string, position?: number): boolean

		origEndsWith?(this: string, searchString: string, endPosition?: number): boolean

		origIncludes?(this: string, searchString: string, position?: number): boolean
	}

}

export {}