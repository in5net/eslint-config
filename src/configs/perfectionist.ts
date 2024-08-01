import { pluginPerfectionist } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Optional perfectionist plugin for props and items sorting.
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
					"error",
					{
						type: "natural",
					},
				],
				"perfectionist/sort-imports": [
					"error",
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
								"builtin-type",
								"external-type",
								"internal",
								"parent",
								"siblings",
								"side-effect",
								"side-effect-style",
								"index",
								"object",
								"style",
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
