import type { ConfigNames, RuleOptions } from "./typegen";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";

export type Awaitable<T> = T | Promise<T>;

export type Rules = RuleOptions;

// eslint-disable-next-line unicorn/prefer-export-from
export type { ConfigNames };

export type TypedFlatConfigItem = Omit<
	Linter.Config<Linter.RulesRecord & Rules>,
	"plugins"
> & {
	// Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>;
};

export interface OptionsFiles {
	/**
	 * Override the `files` option to provide custom globs.
	 */
	files?: string[];
}

export type OptionsTypescript =
	| (OptionsTypeScriptWithTypes & OptionsOverrides)
	| (OptionsTypeScriptParserOptions & OptionsOverrides);

export interface OptionsComponentExts {
	/**
	 * Additional extensions for components.
	 * @default []
	 * @example ['svelte']
	 */
	componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
	/**
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>;

	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[];

	/**
	 * Glob patterns for files that should not be type aware.
	 * @default []
	 */
	ignoresTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: string;
}

export interface OptionsHasTypeScript {
	typescript?: boolean;
}

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"];
}

export interface OptionsIsInEditor {
	isInEditor?: boolean;
}

export interface OptionsRegExp {
	/**
	 * Override rulelevels
	 */
	level?: "error" | "warn";
}

export interface OptionsIsInEditor {
	isInEditor?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts {
	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 * @default true
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 */
	gitignore?: boolean | FlatGitignoreOptions;

	/**
	 * Core rules. Can't be disabled.
	 */
	javascript?: OptionsOverrides;

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 * @default auto-detect based on the dependencies
	 */
	typescript?: boolean | OptionsTypescript;

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable JSONC support.
	 * @default true
	 */
	jsonc?: boolean | OptionsOverrides;

	/**
	 * Enable regexp rules.
	 * @default true
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 */
	regexp?: boolean | (OptionsRegExp & OptionsOverrides);

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 * @default false
	 */
	svelte?: boolean;

	/**
	 * Control to disable some rules in editors.
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;

	/**
	 * Automatically rename plugins in the config.
	 * @default true
	 */
	autoRenamePlugins?: boolean;

	/**
	 * Provide overrides for rules for each integration.
	 * @deprecated use `overrides` option in each integration key instead
	 */
	overrides?: {
		javascript?: TypedFlatConfigItem["rules"];
		typescript?: TypedFlatConfigItem["rules"];
		jsonc?: TypedFlatConfigItem["rules"];
		svelte?: TypedFlatConfigItem["rules"];
	};
}
