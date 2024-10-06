import { in5net } from "./src";

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
