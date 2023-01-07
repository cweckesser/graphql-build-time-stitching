module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
		ecmaFeatures: {
			modules: true,
		},
	},
	env: {
		es6: true,
		node: true,
	},
	plugins: ['prettier', 'import'],
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'prettier/prettier': [1],
		'eol-last': [0],
		strict: [2, 'never'],
		'no-mixed-requires': [0],
		'no-underscore-dangle': [0],
		'new-cap': [0],
		camelcase: [0],
		'no-console': [0],
		'no-useless-escape': [1],
		'no-unused-vars': [0],
		'@typescript-eslint/no-unused-vars': ['error'],
		'import/first': [1],
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
					'object',
				],
				alphabetize: { order: 'asc' },
				'newlines-between': 'always',
			},
		],
		'sort-imports': [
			'error',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
			},
		],
		'consistent-return': 'error',
		'no-else-return': ['error', { allowElseIf: false }],
		'no-unreachable': 'error',
	},
	ignorePatterns: ['.eslintrc.js', '.prettierrc.js'],
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
			},
		},
	},
};
