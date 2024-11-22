import { pluginAntfu, pluginImport } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function imports(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "iz7n/imports/rules",
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

        "import-x/no-useless-path-segments": ["warn", { noUselessIndex: true }],
        "import/default": "error",
        "import/export": "error",
        "import/first": "error",
        "import/namespace": "error",
        "import/newline-after-import": ["warn", { considerComments: true }],
        "import/no-absolute-path": "error",
        "import/no-amd": "error",
        "import/no-anonymous-default-export": "error",
        "import/no-commonjs": "error",
        "import/no-deprecated": "warn",
        "import/no-duplicates": ["error", { "prefer-inline": true }],
        "import/no-empty-named-blocks": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-as-default": "warn",
        "import/no-named-as-default-member": "warn",
        "import/no-named-default": "warn",
        "import/no-self-import": "error",
        "import/no-unused-modules": "warn",
        "no-duplicate-imports": "off",
      },
    },
  ];
}
