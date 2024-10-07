import { pluginComments } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "in5net/eslint-comments/rules",
      plugins: {
        "eslint-comments": pluginComments,
      },
      rules: {
        "eslint-comments/no-aggregating-enable": "error",
        "eslint-comments/no-duplicate-disable": "error",
        "eslint-comments/no-unlimited-disable": "error",
        "eslint-comments/no-unused-disable": "error",
        "eslint-comments/no-unused-enable": "error",
      },
    },
  ];
}
