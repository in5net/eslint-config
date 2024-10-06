import { pluginUnicorn } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function unicorn(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "in5net/unicorn/rules",
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs["flat/recommended"].rules,

        "unicorn/consistent-destructuring": "warn",
        "unicorn/custom-error-definition": "error",
        "unicorn/prefer-json-parse-buffer": "error",
        "unicorn/require-post-message-target-origin": "error",
      },
    },
  ];
}
