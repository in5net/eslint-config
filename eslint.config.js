import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { iz7n } = await jiti.import("./src");

export default iz7n(
  {
    type: "lib",
    typescript: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
