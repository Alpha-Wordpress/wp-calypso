import { CONCIERGE_INITIAL_REQUEST } from 'calypso/state/action-types';
import { updateConciergeInitial } from 'calypso/state/concierge/actions';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import {
	conciergeInitialFetchError,
	fetchConciergeInitial,
	storeFetchedConciergeInitial,
	showConciergeInitialFetchError,
} from '../';

// we are mocking uuid.v4 here, so that conciergeInitialFetchError() will contain the expected id in the tests
jest.mock( 'uuid', () => ( {
	v4: () => 'fake-uuid',
} ) );

describe( 'wpcom-api', () => {
	describe( 'concierge', () => {
		test( 'fetchConciergeInitial()', () => {
			const action = {
				type: CONCIERGE_INITIAL_REQUEST,
				siteId: 999,
			};

			expect( fetchConciergeInitial( action ) ).toEqual(
				http(
					{
						method: 'GET',
						path: '/concierge/initial',
						apiNamespace: 'wpcom/v2',
						query: {
							site_id: action.siteId,
						},
					},
					action
				)
			);
		} );

		test( 'storeFetchedConciergeInitial()', () => {
			const mockInitial = {
				available_times: [
					new Date( '2017-01-01 01:00:00' ),
					new Date( '2017-01-01 02:00:00' ),
					new Date( '2017-01-01 03:00:00' ),
				],
				schedule_id: 18,
			};

			expect( storeFetchedConciergeInitial( {}, mockInitial ) ).toEqual(
				updateConciergeInitial( mockInitial )
			);
		} );

		test( 'showConciergeInitialFetchError()', () => {
			expect( showConciergeInitialFetchError() ).toEqual( conciergeInitialFetchError() );
		} );
	} );
} );
