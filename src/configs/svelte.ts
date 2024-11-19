import { GLOB_SVELTE } from "../globs";
import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  TypedFlatConfigItem,
} from "../types";
import { ensurePackages, interopDefault } from "../utils";

export async function svelte(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_SVELTE], overrides = {} } = options;

  await ensurePackages(["eslint-plugin-svelte"]);

  const [pluginSvelte, parserSvelte] = await Promise.all([
    interopDefault(import("eslint-plugin-svelte")),
    interopDefault(import("svelte-eslint-parser")),
  ] as const);

  return [
    {
      name: "in5net/svelte/setup",
      plugins: {
        svelte: pluginSvelte,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: [".svelte"],
          parser: options.typescript
            ? ((await interopDefault(
                import("@typescript-eslint/parser"),
              )) as any)
            : null,
        },
      },
      name: "in5net/svelte/rules",
      processor: pluginSvelte.processors[".svelte"],
      rules: {
        "import/no-mutable-exports": "off", // Svelte props are declared as mutable exports
        "no-inner-declarations": "off", // Svelte <script> tags are considered render() functions so being able to declare functions inside them is useful
        "no-nested-ternary": "off", // Often used to define a prop
        "no-undef": "off", // Incompatible with most recent (attribute-form) generic types RFC
        "no-undef-init": "off", // Optional props can have a default value of undefined
        "no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all",
            varsIgnorePattern: "^(\\$\\$Props$|\\$\\$Events$|\\$\\$Slots$)",
          },
        ],
        "svelte/block-lang": [
          "error",
          {
            enforceScriptPresent: true,
            enforceStylePresent: false,
            script: "ts",
            style: ["scss", null],
          },
        ],
        "svelte/comment-directive": [
          "error",
          {
            reportUnusedDisableDirectives: true,
          },
        ],
        "svelte/derived-has-same-inputs-outputs": "error",
        "svelte/html-closing-bracket-spacing": "warn",
        "svelte/html-self-closing": ["warn", "all"],
        "svelte/infinite-reactive-loop": "error",
        "svelte/mustache-spacing": "warn",
        "svelte/no-at-debug-tags": "warn",
        "svelte/no-at-html-tags": "warn",
        "svelte/no-dupe-else-if-blocks": "error",
        "svelte/no-dupe-on-directives": "error",
        "svelte/no-dupe-style-properties": "error",
        "svelte/no-dupe-use-directives": "error",
        "svelte/no-dynamic-slot-name": "error",
        "svelte/no-export-load-in-svelte-module-in-kit-pages": "error",
        "svelte/no-extra-reactive-curlies": "warn",
        "svelte/no-ignored-unsubscribe": "error",
        "svelte/no-immutable-reactive-statements": "error",
        "svelte/no-inner-declarations": "error",
        "svelte/no-not-function-handler": "error",
        "svelte/no-object-in-text-mustaches": "error",
        "svelte/no-reactive-functions": "error",
        "svelte/no-reactive-literals": "error",
        "svelte/no-reactive-reassign": "error",
        "svelte/no-shorthand-style-property-overrides": "error",
        "svelte/no-spaces-around-equal-signs-in-attribute": "warn",
        "svelte/no-store-async": "error",
        "svelte/no-target-blank": "error",
        "svelte/no-trailing-spaces": "warn",
        "svelte/no-unknown-style-directive-property": "error",
        "svelte/no-unused-svelte-ignore": "error",
        "svelte/no-useless-mustaches": "warn",
        "svelte/prefer-class-directive": "error",
        "svelte/prefer-destructured-store-props": "error",
        "svelte/require-event-dispatcher-types": "error",
        "svelte/require-optimized-style-attribute": "warn",
        "svelte/require-store-callbacks-use-set-param": "error",
        "svelte/require-store-reactive-access": "error",
        "svelte/require-stores-init": "error",
        "svelte/shorthand-attribute": "warn",
        "svelte/shorthand-directive": "warn",
        "svelte/sort-attributes": "warn",
        "svelte/spaced-html-comment": "warn",
        "svelte/system": "error",
        "svelte/valid-each-key": "error",
        "svelte/valid-prop-names-in-kit-pages": "error",
        "unicorn/filename-case": "off", // Svelte components are usually PascalCase
        "unicorn/no-useless-undefined": "off", // Optional props can have a default value of undefined
        "unicorn/prefer-top-level-await": "off", // Can't use top-level await in Svelte

        "unused-imports/no-unused-vars": [
          "error",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            vars: "all",
            varsIgnorePattern: "^(_|\\$\\$Props$|\\$\\$Events$|\\$\\$Slots$)",
          },
        ],

        ...overrides,
      },
    },
  ];
}
