import { GLOB_SRC_EXT } from '../globs'
import { pluginAntfu, pluginImport } from '../plugins'
import type { TypedFlatConfigItem } from '../types'

export async function imports(): Promise<TypedFlatConfigItem[]> {

  return [
    {
      name: 'iz7n/imports/rules',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

				"import/default": "error",
				"import/export": "error",
				"import/first": "error",
				"import/newline-after-import": ["warn", { considerComments: true }],
				"import/no-absolute-path": "error",
				"import/no-amd": "error",
				"import/no-anonymous-default-export": "error",
				"import/no-commonjs": "error",
				"import/no-deprecated": "error",
				"import/no-duplicates": ["error", { "prefer-inline": true }],
				"import/no-empty-named-blocks": "error",
				"import/no-import-module-exports": "error",
				"import/no-mutable-exports": "error",
				"import/no-named-as-default": "error",
				"import/no-named-as-default-member": "error",
				"import/no-named-default": "error",
				"import/no-self-import": "error",
				"import/no-unused-modules": "error",
				"import/no-useless-path-segments": "error",
				"no-duplicate-imports": "off",

      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'iz7n/imports/disables/bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
  ]
}
