import process from "node:process";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsProjectType,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem,
} from "../types";
import { pluginAntfu } from "../plugins";
import { interopDefault, renameRules } from "../utils";

export async function typescript(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions &
    OptionsProjectType = {},
): Promise<TypedFlatConfigItem[]> {
  const { componentExts = [], overrides = {}, parserOptions = {} } = options;

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext) => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS,
  ];
  const tsconfigPath = options?.tsconfigPath ? options.tsconfigPath : undefined;
  const isTypeAware = !!tsconfigPath;

  const typeAwareRules: TypedFlatConfigItem["rules"] = {
    "dot-notation": "off",
    "no-implied-eval": "off",
    "no-throw-literal": "off",
    "ts/await-thenable": "error",
    "ts/dot-notation": ["error", { allowKeywords: true }],
    "ts/no-floating-promises": "error",
    "ts/no-for-in-array": "error",
    "ts/no-implied-eval": "error",
    "ts/no-misused-promises": "error",
    "ts/no-throw-literal": "error",
    "ts/no-unnecessary-type-assertion": "error",
    "ts/no-unsafe-argument": "error",
    "ts/no-unsafe-assignment": "error",
    "ts/no-unsafe-call": "error",
    "ts/no-unsafe-member-access": "error",
    "ts/no-unsafe-return": "error",
    "ts/restrict-plus-operands": "error",
    "ts/restrict-template-expressions": "error",
    "ts/unbound-method": "error",
  };

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")),
    interopDefault(import("@typescript-eslint/parser")),
  ] as const);

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[],
  ): TypedFlatConfigItem {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ["./*.js"],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...(parserOptions as any),
        },
      },
      name: `antfu/typescript/${typeAware ? "type-aware-parser" : "parser"}`,
    };
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: "antfu/typescript/setup",
      plugins: {
        antfu: pluginAntfu,
        ts: pluginTs as any,
      },
    },
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...(isTypeAware
      ? [
          makeParser(true, filesTypeAware, ignoresTypeAware),
          makeParser(false, files, filesTypeAware),
        ]
      : [makeParser(false, files)]),
    {
      files,
      name: "antfu/typescript/rules",
      rules: {
        ...renameRules(
          pluginTs.configs["eslint-recommended"].overrides![0].rules!,
          { "@typescript-eslint": "ts" },
        ),
        ...renameRules(pluginTs.configs.strict.rules!, {
          "@typescript-eslint": "ts",
        }),

        "antfu/no-ts-export-equal": "error",
        "default-param-last": "off",
        "import/default": "off", // Doesn't work with TypeScript
        "import/export": "error", // Doesn't work with TypeScript
        "no-dupe-class-members": "off",
        "no-loss-of-precision": "off",
        "no-redeclare": "off",
        "no-unused-expressions": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "ts/array-type": ["error", { default: "array-simple" }],
        "ts/ban-ts-comment": [
          "error",
          { "ts-expect-error": "allow-with-description" },
        ],
        "ts/ban-types": [
          "error",
          {
            extendDefaults: false,
            types: {
              "[[[[[]]]]]": "🦄💥",
              "[[[[]]]]": "ur drunk 🤡",
              "[[[]]]": "Don't use `[[[]]]`. Use `SomeType[][][]` instead.",
              "[[]]":
                "Don't use `[[]]`. It only allows an array with a single element which is an empty array. Use `SomeType[][]` instead.",
              "[]": "Don't use the empty array type `[]`. It only allows empty arrays. Use `SomeType[]` instead.",
              "{}": {
                fixWith: "Record<string, unknown>",
                message:
                  "The `{}` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead.",
              },
              BigInt: {
                fixWith: "bigint",
                message: "Use `bigint` instead.",
              },
              Boolean: {
                fixWith: "boolean",
                message: "Use `boolean` instead.",
              },
              Buffer: {
                message:
                  "Use Uint8Array instead. See: https://sindresorhus.com/blog/goodbye-nodejs-buffer",
                suggest: ["Uint8Array"],
              },
              Function:
                "Use a specific function type instead, like `() => void`.",
              Number: {
                fixWith: "number",
                message: "Use `number` instead.",
              },
              object: {
                fixWith: "Record<string, unknown>",
                message:
                  "The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848",
              },
              Object: {
                fixWith: "Record<string, unknown>",
                message:
                  "The `Object` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead. See https://github.com/typescript-eslint/typescript-eslint/pull/848",
              },
              String: {
                fixWith: "string",
                message: "Use `string` instead.",
              },
              Symbol: {
                fixWith: "symbol",
                message: "Use `symbol` instead.",
              },
            },
          },
        ],
        "ts/consistent-type-definitions": ["error", "interface"],
        "ts/default-param-last": "error",
        "ts/member-ordering": "warn",
        "ts/method-signature-style": ["error", "property"], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        "ts/no-dupe-class-members": "error",
        "ts/no-explicit-any": "off",
        "ts/no-invalid-void-type": "off",
        "ts/no-loss-of-precision": "error",
        "ts/no-non-null-assertion": "off",
        "ts/no-redeclare": "error",
        "ts/no-require-imports": "error",
        "ts/no-unsafe-unary-minus": "error",
        "ts/no-unused-expressions": "error",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": [
          "error",
          { classes: false, functions: false, variables: true },
        ],
        "ts/no-useless-empty-export": "error",
        "ts/prefer-nullish-coalescing": "off",
        "ts/prefer-ts-expect-error": "error",
        "ts/unified-signatures": [
          "error",
          { ignoreDifferentlyNamedParameters: true },
        ],

        ...overrides,
      },
    },
    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: "antfu/typescript/rules-type-aware",
            rules: typeAwareRules,
          },
        ]
      : []),
    {
      files: ["**/*.d.?([cm])ts"],
      name: "antfu/typescript/disables/dts",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.{test,spec}.ts?(x)"],
      name: "antfu/typescript/disables/test",
      rules: {
        "no-unused-expressions": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "antfu/typescript/disables/cjs",
      rules: {
        "ts/no-require-imports": "off",
        "ts/no-var-requires": "off",
      },
    },
  ];
}
