/**
 * Defines the structure for the pattern characters used in the directory tree.
 */
type TreePattern = {
	/** The string used for indentation (e.g., "    " or "│   "). */
	indent   : string
	/** The string used for a regular line connection (e.g., "├── "). */
	line     : string
	/** The string used for the last line connection in a directory (e.g., "└── "). */
	lastLine : string
}

type Options = {
	/** The name of the current file or directory entry. */
	name    : string
	/** The current indentation level of the entry. */
	level   : number
	/** True if the entry is a file, false if it's a directory. */
	isFile  : boolean
	/** True if this is the last entry in its parent directory. */
	isLast  : boolean
	/** True if this is the first entry in its parent directory. */
	isFirst : boolean
	/** The set of pattern characters used for rendering the tree lines. */
	pattern : TreePattern
}
/**
 * Defines the data passed to custom style functions for tree entries.
 */
type TreeHookOptions = Options & { parents?: Options[] }

/**
 * The content object representing the directory structure.
 * A file is represented by `null`, and a folder by a nested `TreeContent` object.
 */
export type TreeContent = { [ key: string ]: null | Tree | TreeContent }

/**
 * Defines the configuration options for generating the directory tree.
 */
export type TreeConfig = {
	/** Custom pattern to use for indentation and line breaks. */
	pattern? : TreePattern
	/** Hook functions to modify the data passed and style the tree. */
	hook?: {
		/** A custom function to modify the data passed to the style functions. */
		onData?    : ( data: TreeHookOptions ) => TreeHookOptions
		/** A custom function to style the tree. */
		transform? : ( data: TreeHookOptions ) => string
	}
}

/**
 * Represents a utility for generating a directory structure string from an object.
 */
export class Tree {

	// Configuration for the tree generation, including custom styles and patterns.
	config  : TreeConfig
	// The content object representing the directory structure.
	content : TreeContent

	// Default pattern characters for indentation and lines.
	#patternDefault = {
		indent   : '│   ',
		line     : '├── ',
		lastLine : '└── ',
	}

	/**
	 * Creates an instance of the Tree generator.
	 *
	 * @param {TreeContent} content - The content object representing the directory structure.
	 * @param {TreeConfig}  config  - An object with options for generating the directory structure string.
	 */
	constructor( content: TreeContent, config?: TreeConfig ) {

		this.content = content
		this.config  = config || {}

	}

	/**
	 * Generates the string representation of the directory structure.
	 *
	 * @returns {string} A string representing the content of `structure` as a directory structure.
	 */
	public generate(): string {

		// Start the recursive process of building the directory tree from the root (indent 0).
		return this.#buildDirectoryTree( this.content, 0 )

	}

	#defaultStyle( data: TreeHookOptions ): string {

		const {
			name, isLast, pattern, parents,
		} = data
		let indent = ''
		parents?.forEach( parent => indent += parent.isLast ? '    ' : pattern.indent )
		// Construct the prefix based on indentation and whether it's the last item in its sibling group.
		const prefix = indent + ( isLast ? pattern.lastLine : pattern.line )

		return prefix + name

	}

	#buildDirectoryTree( dir: TreeContent, level: number, parents?:TreeHookOptions['parents'] ): string {

		const entries     = Object.entries( dir )
		let currentResult = ''

		entries.forEach( ( [ key, value ], index ) => {

			// Determine if the current entry is a folder (an object that is not null).

			const isFile = !( typeof value === 'object' && value !== null )
			// Check if this is the last entry in the current directory's list of entries.
			const isLast = index === entries.length - 1
			// Check if this is the first entry (though not used in default styles, kept for custom flexibility).
			const isFirst = index === 0
			// Select the appropriate style function: custom if provided in config, otherwise the default private method.
			const transformFn = this.config.hook?.transform || this.#defaultStyle
			// Combine the default pattern with any custom pattern provided in the config.
			const pattern = {
				...this.#patternDefault,
				...( this.config.pattern || {} ),
			}

			let data: TreeHookOptions = {
				name : key,
				level,
				isLast,
				isFirst,
				isFile,
				parents,
				pattern, // Pass the combined pattern object to the style function
			}

			const res = this.config.hook?.onData?.( data )
			if ( res ) data = res

			// Append the formatted entry to the current result.
			currentResult += transformFn( data ) + '\n'

			// If the current entry is a folder, recursively call `buildDirectoryTree` for its contents,
			// increasing the indentation level.
			if ( !isFile ) {

				const newParents = ( parents ? [ ...parents, data ] : [ data ] ).map( ( {
					// @ts-ignore
					parents:_, ...p
				} ) => p )
				currentResult   += this.#buildDirectoryTree(
					( value instanceof Tree ? value.content : value ),
					level + 1,
					newParents,
				)

			}

		} )

		return currentResult

	}

}
