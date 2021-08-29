module.exports = {
	env: {
		browser: true,
		mocha: true,
		es6: true,
	},
	globals: {
		globalThis: 'readonly',
		'global': true,
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {},
	},
	rules: {
		'no-undef': "error",
		'no-fallthrough': "error",
		'no-unused-expressions': 0,
		'no-new': 0,
		'no-wrap-func': 0,
		eqeqeq: 0,
		// allow for unused variables defined in function arguments
		'no-unused-vars': [2, { vars: 'all', args: 'none' }],
		'consistent-return': 0,
		'no-constant-condition': 0,
		'no-cond-assign': 0,
		'no-empty': 0,
		'space-infix-ops': 0,
		'eol-last': 0,
		'no-dupe-keys': "error",
		'radix': "error",
		'no-useless-return': "error",
		'no-extra-bind': "error",
		'no-unsafe-negation': "error",
		'no-extra-parens': 0,
		'no-unreachable': "error",
	},
};
