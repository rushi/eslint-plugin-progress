import progress from "./activate-rule.cjs";

const eslintPlugin = {
    meta: {
        name: "eslint-plugin-progress",
        version: "0.5.0",
    },
    configs: {},
    rules: {
        activate: progress,
    },
};

export default eslintPlugin;
