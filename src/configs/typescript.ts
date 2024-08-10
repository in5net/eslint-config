import { GLOB_TS, GLOB_TSX } from "../globs";
import { pluginAntfu } from "../plugins";
import type {
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";
import { interopDefault, renameRules } from "../utils";
import process from "node:process";

export async function typescript(
	options: OptionsFiles &
		OptionsComponentExts &
		OptionsOverrides &
		OptionsTypeScriptWithTypes &
		OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
	const { componentExts = [], overrides = {}, parserOptions = {} } = options;

	const files = options.files ?? [
		GLOB_TS,
		GLOB_TSX,
		...componentExts.map(ext => `**/*.${ext}`),
	];

	const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
	const ignoresTypeAware = options.ignoresTypeAware ?? [];
	const tsconfigPath = options?.tsconfigPath;
	const isTypeAware = !!tsconfigPath;

	const typeAwareRules: TypedFlatConfigItem["rules"] = {
		"dot-notation": "off",
		"no-implied-eval": "off",
		"ts/await-thenable": "error",
		"ts/dot-notation": ["error", { allowKeywords: true }],
		"ts/no-floating-promises": "error",
		"ts/no-for-in-array": "error",
		"ts/no-implied-eval": "error",
		"ts/no-misused-promises": "error",
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
					extraFileExtensions: componentExts.map(ext => `.${ext}`),
					sourceType: "module",
					...(typeAware ?
						{
							projectService: {
								allowDefaultProject: ["./*.js"],
								defaultProject: tsconfigPath,
							},
							tsconfigRootDir: process.cwd(),
						}
					:	{}),
					...(parserOptions as any),
				},
			},
			name: `iz7n/typescript/${typeAware ? "type-aware-parser" : "parser"}`,
		};
	}

	return [
		{
			// Install the plugins without globs, so they can be configured separately.
			name: "iz7n/typescript/setup",
			plugins: {
				antfu: pluginAntfu,
				ts: pluginTs as any,
			},
		},
		// Assign type-aware parser for type-aware files and type-unaware parser for the rest
		...(isTypeAware ?
			[
				makeParser(true, filesTypeAware, ignoresTypeAware),
				makeParser(false, files, filesTypeAware),
			]
		:	[makeParser(false, files)]),
		{
			files,
			name: "iz7n/typescript/rules",
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
				"no-redeclare": "off",
				"no-unused-expressions": "off",
				"no-use-before-define": "off",
				"no-useless-constructor": "off",
				"ts/array-type": ["error", { default: "array-simple" }],
				"ts/ban-ts-comment": [
					"error",
					{ "ts-expect-error": "allow-with-description" },
				],
				"ts/consistent-type-definitions": ["error", "interface"],
				"ts/default-param-last": "error",
				"ts/member-ordering": "warn",
				"ts/method-signature-style": ["error", "property"], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
				"ts/no-dupe-class-members": "error",
				"ts/no-explicit-any": "off",
				"ts/no-invalid-void-type": "off",
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
				"ts/unified-signatures": [
					"error",
					{ ignoreDifferentlyNamedParameters: true },
				],

				...overrides,
			},
		},
		...(isTypeAware ?
			[
				{
					files: filesTypeAware,
					ignores: ignoresTypeAware,
					name: "iz7n/typescript/rules-type-aware",
					rules: typeAwareRules,
				},
			]
		:	[]),
		{
			files: ["**/*.d.?([cm])ts"],
			name: "iz7n/typescript/disables/dts",
			rules: {
				"eslint-comments/no-unlimited-disable": "off",
				"import/no-duplicates": "off",
				"no-restricted-syntax": "off",
				"unused-imports/no-unused-vars": "off",
			},
		},
		{
			files: ["**/*.{test,spec}.ts?(x)"],
			name: "iz7n/typescript/disables/test",
			rules: {
				"no-unused-expressions": "off",
			},
		},
		{
			files: ["**/*.js", "**/*.cjs"],
			name: "iz7n/typescript/disables/cjs",
			rules: {
				"ts/no-require-imports": "off",
			},
		},
	];
}
