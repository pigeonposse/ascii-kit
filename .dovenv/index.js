import { defineConfig }      from '@dovenv/core'
import {
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
} from '@dovenv/theme-pigeonposse'

import { fontsPlugin } from './fonts.js'

export default defineConfig(
	pigeonposseMonorepoTheme( { core : await getWorkspaceConfig( {
		metaURL  : import.meta.url,
		path     : '../',
		corePath : './packages/core',
	} ) } ),
	fontsPlugin,
)

