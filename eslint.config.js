import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		plugins: {
			perfectionist: perfectionist
		},
		rules: {
			'perfectionist/sort-variable-declarations': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					locales: 'en-US',
					partitionByNewLine: false,
					partitionByComment: false,
					specialCharacters: 'keep'
				}
			]
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
);
