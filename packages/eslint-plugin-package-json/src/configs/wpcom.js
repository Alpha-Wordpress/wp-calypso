/**
 * This configuration is a port of https://www.npmjs.com/package/@wordpress/npm-package-json-lint-config
 */
module.exports = {
	extends: [ require.resolve( './recommended' ) ],
	rules: {
		'@automattic/json/prefer-alphabetical-bundledDependencies': 'error',
		'@automattic/json/prefer-alphabetical-dependencies': 'error',
		'@automattic/json/prefer-alphabetical-devDependencies': 'error',
		'@automattic/json/prefer-alphabetical-optionalDependencies': 'error',
		'@automattic/json/prefer-alphabetical-peerDependencies': 'error',
		'@automattic/json/prefer-property-order': [
			'error',
			[
				'name',
				'version',
				'description',
				'author',
				'license',
				'keywords',
				'homepage',
				'repository',
				'bugs',
				'engines',
				'directories',
				'files',
				'type',
				'main',
				'module',
				'react-native',
				'types',
				'bin',
				'dependencies',
				'devDependencies',
				'peerDependencies',
				'publishConfig',
				'scripts',
			],
		],
		'@automattic/json/preferGlobal-type': 'error',
		'@automattic/json/private-type': 'error',
		'@automattic/json/repository-type': 'error',
		'@automattic/json/require-author': 'error',
		'@automattic/json/require-bugs': 'error',
		'@automattic/json/require-description': 'error',
		'@automattic/json/require-homepage': 'error',
		'@automattic/json/require-keywords': 'error',
		'@automattic/json/require-license': 'error',
		'@automattic/json/require-name': 'error',
		'@automattic/json/require-repository': 'error',
		'@automattic/json/require-version': 'error',
		'@automattic/json/scripts-type': 'error',
		'@automattic/json/valid-values-license': [ 'error', [ 'GPL-2.0-or-later' ] ],
		'@automattic/json/version-format': 'error',
		'@automattic/json/version-type': 'error',
	},
};