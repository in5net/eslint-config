import { pluginNode } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function node(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: "iz7n/node/rules",
			plugins: {
				node: pluginNode,
			},
			rules: {
				"node/handle-callback-err": ["error", "^(err|error)$"],
				"node/no-deprecated-api": "error",
				"node/no-exports-assign": "error",
				"node/no-path-concat": "error",
				"node/prefer-global/buffer": ["error", "never"],
				"node/prefer-global/console": "error",
				"node/prefer-global/process": ["error", "never"],
				"node/prefer-global/text-decoder": "error",
				"node/prefer-global/text-encoder": "error",
				"node/prefer-global/url": "error",
				"node/prefer-global/url-search-params": "error",
				"node/process-exit-as-throw": "error",
			},
		},
	];
}
