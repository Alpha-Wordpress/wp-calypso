import { IMMEDIATE_LOGIN_SAVE_INFO } from 'calypso/state/action-types';
import reducer from '../reducer';

describe( 'immediate-login/reducer', () => {
	describe( 'reducer', () => {
		test( 'should return correctly updated state [1]', () => {
			const updatedState = reducer( null, { type: IMMEDIATE_LOGIN_SAVE_INFO } );
			expect( updatedState.attempt ).toEqual( true );
			expect( updatedState.success ).toEqual( false );
			expect( updatedState.reason ).toEqual( null );
			expect( updatedState.email ).toEqual( null );
			expect( updatedState.locale ).toEqual( null );
		} );

		test( 'should return correctly updated state [2]', () => {
			const updatedState = reducer( null, {
				type: IMMEDIATE_LOGIN_SAVE_INFO,
				success: 1,
				reason: 'test reason',
				email: 'test@example.com',
				locale: 'fr',
			} );
			expect( updatedState.attempt ).toEqual( true );
			expect( updatedState.success ).toEqual( true );
			expect( updatedState.reason ).toEqual( 'test reason' );
			expect( updatedState.email ).toEqual( 'test@example.com' );
			expect( updatedState.locale ).toEqual( 'fr' );
		} );
	} );
} );
