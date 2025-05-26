export type TreeOpts = {
	content      : object
	name?        : string
	folderStyle? : ( opts: {
		name    : string
		indent  : number
		isLast  : boolean
		isFirst : boolean
	} ) => string
	fileStyle?   : ( opts: {
		name    : string
		indent  : number
		isLast  : boolean
		isFirst : boolean
	} ) => string
}
