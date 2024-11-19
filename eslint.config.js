import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { in5net } = await jiti.import("./src");

export default in5net(
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
