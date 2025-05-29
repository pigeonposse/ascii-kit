import { Tree } from './core'

import type {
	TreeConfig,
	TreeContent,
} from './core'

export type {
	TreeConfig,
	TreeContent,
}
export { Tree } from './core'

/**
 * Returns a string representing the content of an object as a directory structure.
 *
 * @param   {TreeContent} content - The content object representing the directory structure.
 * @param   {TreeConfig}  opts    - An object with options for generating the directory structure string.
 * @returns {string}              A string representing the content of `structure` as a directory structure.
 * @example
 *
 * const result = tree({
 *   src: {
 *     components: {
 *       "Button.js": null,
 *       "Header.js": null
 *     },
 *     utils: {
 *       "helpers.js": null
 *     },
 *     "index.js": null
 *   },
 *   "package.json": null
 *   name: "my-project",
 * });
 *
 * console.log(result);
 */
export const tree = ( content: TreeContent, opts?: TreeConfig ): string => {

	const treeGenerator = new Tree( content, opts )
	return treeGenerator.generate()

}
