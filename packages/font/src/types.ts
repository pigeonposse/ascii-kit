/**
 * Types for the `figlet` module
 *
 * @see https://www.npmjs.com/package/@types/figlet?activeTab=code
 */

type KerningMethods = 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing'
type PrintDirection = number
export type Options = {
	// font?             : Fonts | undefined
	horizontalLayout? : KerningMethods | undefined
	verticalLayout?   : KerningMethods | undefined
	printDirection?   : PrintDirection | undefined
	showHardBlanks?   : boolean | undefined
	/**
	 * This option allows you to limit the width of the output.
	 * For example, if you want your output to be a max of 80 characters wide, you would set this option to 80.
	 *
	 * @default undefined
	 */
	width?            : number | undefined
	/**
	 * This option works in conjunction with "width".
	 * If this option is set to true, then the library will attempt to break text up on whitespace when limiting the width.
	 *
	 * @default false
	 */
	whitespaceBreak?  : boolean | undefined
}

type FittingRules = {
	vLayout : number
	vRule5  : boolean
	vRule4  : boolean
	vRule3  : boolean
	vRule2  : boolean
	vRule1  : boolean
	hLayout : number
	hRule6  : boolean
	hRule5  : boolean
	hRule4  : boolean
	hRule3  : boolean
	hRule2  : boolean
	hRule1  : boolean
}
type FontOptions = {
	hardBlank       : string
	height          : number
	baseline        : number
	maxLength       : number
	oldLayout       : number
	numCommentLines : number
	printDirection  : PrintDirection
	fullLayout      : number | null
	codeTagCount    : number | null
	fittingRules    : FittingRules
}

export type FontMeta = {
	options  : FontOptions
	numChars : number
	comment? : string
	fig      : Record<string, string[]>
}
