const progress = require("./activate-rule.cjs")

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

module.exports = eslintPlugin;
