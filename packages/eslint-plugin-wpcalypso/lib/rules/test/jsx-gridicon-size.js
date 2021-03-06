/**
 * @file Enforce recommended Gridicon size attributes
 * @author Automattic
 * @copyright 2016 Automattic. All rights reserved.
 * See LICENSE.md file in root directory for full license.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const RuleTester = require( 'eslint' ).RuleTester;
const rule = require( '../../../lib/rules/jsx-gridicon-size' );

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new RuleTester( {
	parser: require.resolve( '@babel/eslint-parser' ),
	parserOptions: {
		ecmaFeatures: { jsx: true },
	},
} ).run( 'jsx-gridicon-size', rule, {
	valid: [
		{
			code: '<Gridicon size={ 18 } />',
		},
	],

	invalid: [
		{
			code: '<Gridicon size={ 20 } />',
			errors: [
				{
					message: rule.ERROR_MESSAGE,
				},
			],
		},
	],
} );
