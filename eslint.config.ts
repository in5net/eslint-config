import { iz7n } from "./src";

export default iz7n(
  {
    svelte: true,
    typescript: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
