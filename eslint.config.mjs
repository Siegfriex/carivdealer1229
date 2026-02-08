import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    { ignores: ["dist/**", "node_modules/**", "**/*.config.js", "**/*.config.mjs", "**/*.config.ts", "tests/e2e/**", "build/**", "functions/**", "index.tsx"] },
    {
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    )),

    plugins: {
        react: fixupPluginRules(react),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "no-restricted-imports": ["error", {
            paths: [{
                name: "@/components",
                message: "FSD 위반: 레거시 폴더 참조 금지. shared/ui, entities/*/ui, widgets/*/ui 사용",
            }, {
                name: "@/config",
                message: "FSD 위반: 레거시 폴더 참조 금지. shared/config 사용",
            }, {
                name: "@/services",
                message: "FSD 위반: 레거시 폴더 참조 금지. shared/api, features/*/api 사용",
            }, {
                name: "@/utils",
                message: "FSD 위반: 레거시 폴더 참조 금지. shared/lib 사용",
            }],

            patterns: [{
                group: ["@/components/*", "@/components/**/*"],
                message: "FSD 위반: @/components 참조 금지. shared/ui, entities/*/ui, widgets/*/ui 사용",
            }, {
                group: ["@/config/*"],
                message: "FSD 위반: @/config 참조 금지. shared/config 사용",
            }, {
                group: ["@/services/*"],
                message: "FSD 위반: @/services 참조 금지. shared/api 사용",
            }, {
                group: ["@/utils/*"],
                message: "FSD 위반: @/utils 참조 금지. shared/lib 사용",
            }],
        }],
    },
}, {
    files: ["src/shared/**/*"],

    rules: {
        "no-restricted-imports": ["error", {
            patterns: [{
                group: ["@/app", "@/app/*"],
                message: "FSD 위반: shared는 app 참조 불가",
            }, {
                group: ["@/pages", "@/pages/*"],
                message: "FSD 위반: shared는 pages 참조 불가",
            }, {
                group: ["@/widgets", "@/widgets/*"],
                message: "FSD 위반: shared는 widgets 참조 불가",
            }, {
                group: ["@/features", "@/features/*"],
                message: "FSD 위반: shared는 features 참조 불가",
            }, {
                group: ["@/entities", "@/entities/*"],
                message: "FSD 위반: shared는 entities 참조 불가",
            }],
        }],
    },
}, {
    files: ["src/entities/**/*"],

    rules: {
        "no-restricted-imports": ["error", {
            patterns: [{
                group: ["@/features", "@/features/*"],
                message: "FSD 위반: entities는 features 참조 불가",
            }, {
                group: ["@/widgets", "@/widgets/*"],
                message: "FSD 위반: entities는 widgets 참조 불가",
            }, {
                group: ["@/pages", "@/pages/*"],
                message: "FSD 위반: entities는 pages 참조 불가",
            }, {
                group: ["@/app", "@/app/*"],
                message: "FSD 위반: entities는 app 참조 불가",
            }],
        }],
    },
}, {
    files: ["src/features/**/*"],

    rules: {
        "no-restricted-imports": ["error", {
            patterns: [{
                group: ["@/widgets", "@/widgets/*"],
                message: "FSD 위반: features는 widgets 참조 불가",
            }, {
                group: ["@/pages", "@/pages/*"],
                message: "FSD 위반: features는 pages 참조 불가",
            }, {
                group: ["@/app", "@/app/*"],
                message: "FSD 위반: features는 app 참조 불가",
            }],
        }],
    },
}, {
    files: ["src/widgets/**/*"],

    rules: {
        "no-restricted-imports": ["error", {
            patterns: [{
                group: ["@/pages", "@/pages/*"],
                message: "FSD 위반: widgets는 pages 참조 불가",
            }, {
                group: ["@/app", "@/app/*"],
                message: "FSD 위반: widgets는 app 참조 불가",
            }],
        }],
    },
}]);