module.exports = {
	parserOptions: {
		sourceType: 'module',
	},
	rules: {
		// Test fixtures import fake modules a lot just for testing the behaviour of this plugin
		'import/no-extraneous-dependencies': 'off',
		'import/default': 'off',
		'no-unused-vars': 0,
		'no-empty': 0,
		'no-shadow': 0,
	},
};
