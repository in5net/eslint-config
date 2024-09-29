import { interopDefault } from "../utils";
import type { TypedFlatConfigItem } from "../types";

export async function jsdoc(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "in5net/jsdoc/rules",
      plugins: {
        jsdoc: await interopDefault(import("eslint-plugin-jsdoc")),
      },
      rules: {
        "jsdoc/check-access": "warn",
        "jsdoc/check-alignment": "warn",
        "jsdoc/check-indentation": "warn",
        "jsdoc/check-line-alignment": "warn",
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-property-names": "warn",
        "jsdoc/check-syntax": "warn",
        "jsdoc/check-tag-names": [
          "warn",
          {
            typed: true,
          },
        ],
        "jsdoc/check-types": "warn",
        "jsdoc/check-values": "warn",
        "jsdoc/empty-tags": "warn",
        "jsdoc/implements-on-classes": "warn",
        "jsdoc/imports-as-dependencies": "warn",
        "jsdoc/multiline-blocks": "warn",
        "jsdoc/no-bad-blocks": "warn",
        "jsdoc/no-blank-block-descriptions": "warn",
        "jsdoc/no-blank-blocks": "warn",
        "jsdoc/no-defaults": "warn",
        "jsdoc/no-multi-asterisks": "warn",
        "jsdoc/no-types": "warn",
        "jsdoc/no-undefined-types": "off", // TypeScript handles this
        "jsdoc/require-asterisk-prefix": "warn",
        "jsdoc/require-hyphen-before-param-description": "warn",
        "jsdoc/require-throws": "warn",
        "jsdoc/sort-tags": "warn",
        "jsdoc/tag-lines": "warn",
        "jsdoc/valid-types": "warn",
      },
    },
  ];
}
