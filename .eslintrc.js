module.exports = {
    env: { es2021: true, es2022: true, es6: true, node: true },
    parserOptions: {
        ecmaVersion: "latest",
    },
    extends: ["prettier"],
    plugins: ["prettier", "local"],
    rules: {
        "prettier/prettier": "error",
        "local/activate": ["error"],
    },
};
