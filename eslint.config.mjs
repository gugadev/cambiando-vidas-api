import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        plugins: {
            prettier,
        },
        rules: {
            "prettier/prettier": [
                "error",
                { endOfLine: "auto", singleQuote: false, trailingComma: "es5" },
            ],
            quotes: ["warn", "double"],
            "eol-last": ["warn", "always"],
        },
    },
];
