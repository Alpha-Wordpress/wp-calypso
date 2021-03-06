import deepFreeze from 'deep-freeze';
import { REWIND_BACKUPS_SET } from 'calypso/state/action-types';
import { useSandbox } from 'calypso/test-helpers/use-sinon';
import reducer from '../reducer';

describe( 'reducer', () => {
	useSandbox( ( sandbox ) => {
		sandbox.stub( console, 'warn' );
	} );

	test( 'should default to an empty object', () => {
		const state = reducer( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	test( 'should set given backups', () => {
		const state = reducer( undefined, {
			type: REWIND_BACKUPS_SET,
			backups: [ 1, 2, 3 ],
		} );

		expect( state ).toEqual( [ 1, 2, 3 ] );
	} );

	test( 'should override previous backups', () => {
		const previousState = deepFreeze( [ 1, 2, 3 ] );
		const state = reducer( previousState, {
			type: REWIND_BACKUPS_SET,
			backups: [ 4, 5, 6 ],
		} );

		expect( state ).toEqual( [ 4, 5, 6 ] );
	} );
} );
