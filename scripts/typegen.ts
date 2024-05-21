import {
	combine,
	comments,
	imports,
	javascript,
	jsdoc,
	jsonc,
	node,
	perfectionist,
	sortPackageJson,
	svelte,
	typescript,
	unicorn,
} from "../src";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import fs from "node:fs/promises";

const configs = await combine(
	{
		plugins: {
			"": {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	comments(),
	imports(),
	javascript(),
	jsdoc(),
	jsonc(),
	node(),
	perfectionist(),
	sortPackageJson(),
	svelte(),
	typescript(),
	unicorn(),
);

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
