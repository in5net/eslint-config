import {
	command,
	comments,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	node,
	perfectionist,
	sortPackageJson,
	sortTsconfig,
	svelte,
	typescript,
	unicorn,
} from "./configs";
import type {
	Awaitable,
	ConfigNames,
	OptionsConfig,
	TypedFlatConfigItem,
} from "./types";
import { interopDefault } from "./utils";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import fs from "node:fs";

const flatConfigProps: Array<keyof TypedFlatConfigItem> = [
	"name",
	"files",
	"ignores",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings",
];

export const defaultPluginRenaming = {
	"@typescript-eslint": "ts",
	"import-x": "import",
	"n": "node",
};

/**
 * Construct an array of ESLint flat config items.
 * @param options - The options for generating the ESLint configurations.
 * @param userConfigs - The user configurations to be merged with the generated configurations.
 * @returns
 * The merged ESLint configurations.
 */
export function iz7n(
	options: OptionsConfig & TypedFlatConfigItem = {},
	...userConfigs: Array<
		Awaitable<
			| TypedFlatConfigItem
			| TypedFlatConfigItem[]
			| FlatConfigComposer<any, any>
			| Linter.FlatConfig[]
		>
	>
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const {
		autoRenamePlugins = true,
		componentExts = [],
		gitignore: enableGitignore = true,
		svelte: enableSvelte = isPackageExists("svelte"),
		typescript: enableTypeScript = isPackageExists("typescript"),
	} = options;

	const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];

	if (enableGitignore) {
		if (typeof enableGitignore === "boolean") {
			if (fs.existsSync(".gitignore"))
				configs.push(
					interopDefault(import("eslint-config-flat-gitignore")).then(r => [
						r(),
					]),
				);
		} else {
			configs.push(
				interopDefault(import("eslint-config-flat-gitignore")).then(r => [
					r(enableGitignore),
				]),
			);
		}
	}

	// Base configs
	configs.push(
		ignores(),
		javascript({
			overrides: getOverrides(options, "javascript"),
		}),
		comments(),
		node(),
		jsdoc(),
		imports(),
		unicorn(),
		command(),
		perfectionist(),
	);

	if (enableTypeScript) {
		configs.push(
			typescript({
				...resolveSubOptions(options, "typescript"),
				componentExts,
				overrides: getOverrides(options, "typescript"),
			}),
		);
	}

	if (enableSvelte) {
		configs.push(
			svelte({
				overrides: getOverrides(options, "svelte"),
				typescript: !!enableTypeScript,
			}),
		);
	}

	if (options.jsonc ?? true) {
		configs.push(
			jsonc({
				overrides: getOverrides(options, "jsonc"),
			}),
			sortPackageJson(),
			sortTsconfig(),
		);
	}

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig = {} as TypedFlatConfigItem;
	for (const key of flatConfigProps) {
		if (key in options) fusedConfig[key] = options[key] as any;
	}
	if (Object.keys(fusedConfig).length) configs.push([fusedConfig]);

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

	composer = composer.append(...configs, ...(userConfigs as any));

	if (autoRenamePlugins) {
		composer = composer.renamePlugins(defaultPluginRenaming);
	}

	return composer;
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolvedOptions<OptionsConfig[K]> {
	return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
) {
	const sub = resolveSubOptions(options, key);
	return {
		...(options.overrides as any)?.[key],
		...("overrides" in sub ? sub.overrides : {}),
	};
}
