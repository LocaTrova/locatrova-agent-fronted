import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "eslint.config.js", "postcss.config.js", "tailwind.config.ts", "vite.config.ts"],
    },
    {
        files: ["client/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}"],
        plugins: { 
            '@typescript-eslint': tseslint.plugin,
            react,
            'jsx-a11y': jsxA11y
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "error",
                { "argsIgnorePattern": "^_", "varsIgnorePattern": "actionTypes" }
            ],
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/no-unknown-property": ["error", { "ignore": ["cmdk-input-wrapper"] }],
        }
    }
);
