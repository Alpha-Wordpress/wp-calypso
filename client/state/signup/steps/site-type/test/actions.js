import { SIGNUP_STEPS_SITE_TYPE_SET } from 'calypso/state/action-types';
import { setSiteType } from '../actions';

describe( 'setSiteType()', () => {
	test( 'should return the expected action object', () => {
		const siteType = 'Blog';

		expect( setSiteType( siteType ) ).toEqual( {
			type: SIGNUP_STEPS_SITE_TYPE_SET,
			siteType,
		} );
	} );
} );
