import { pluginPerfectionist } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "iz7n/perfectionist/setup",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        "perfectionist/sort-exports": [
          "warn",
          {
            type: "natural",
          },
        ],
        "perfectionist/sort-imports": [
          "warn",
          {
            customGroups: {
              value: {
                svelte: [
                  "**/*.svelte",
                  "./*.svelte",
                  "../*.svelte",
                  "../**/*.svelte",
                ],
              },
            },
            groups: [
              "svelte",
              [
                "builtin",
                "external",
                "internal",
                "parent",
                "sibling",
                "side-effect",
                "side-effect-style",
                "index",
                "object",
                "style",
                "external-type",
                "builtin-type",
                "internal-type",
                "parent-type",
                "sibling-type",
                "index-type",
                "unknown",
              ],
            ],
            type: "natural",
          },
        ],
      },
    },
  ];
}
