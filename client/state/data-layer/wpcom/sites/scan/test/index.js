import { createReduxStore } from 'calypso/state';
import { JETPACK_SCAN_REQUEST } from 'calypso/state/action-types';
import * as wpcomHttpActions from 'calypso/state/data-layer/wpcom-http/actions';
import * as jetpackScanActions from 'calypso/state/jetpack-scan/actions';

jest.mock( 'calypso/state/data-layer/wpcom-http/actions', () => ( {
	http: jest.fn(),
} ) );

function setup( siteId ) {
	// Set spy on action creator to verify it gets called when the component renders.
	const requestScanStatusActionSpy = jest.spyOn( jetpackScanActions, 'requestScanStatus' );

	const store = createReduxStore(
		{
			jetpackScan: { requestStatus: siteId },
		},
		( state ) => {
			return state;
		}
	);

	const dispatchSpy = jest.spyOn( store, 'dispatch' );

	return { store, dispatchSpy, requestScanStatusActionSpy };
}

describe( 'Jetpack Scan data-layer', () => {
	beforeAll( () => {
		wpcomHttpActions.http.mockImplementation( () => ( {
			type: JETPACK_SCAN_REQUEST,
			meta: { dataLayer: { data: 'Fake data!' } },
		} ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'should reach the fetch handler middleware', () => {
		const siteId = 9999;
		const { store, dispatchSpy, requestScanStatusActionSpy } = setup( siteId );

		// Dispatch action to fetch Jetpack Scan status
		store.dispatch( jetpackScanActions.requestScanStatus( siteId ) );
		expect( requestScanStatusActionSpy ).toHaveBeenCalled();

		// Verify the dispatch function was called with the right argument
		expect( dispatchSpy ).toHaveBeenCalled();

		const expectedAction = {
			type: JETPACK_SCAN_REQUEST,
			siteId: siteId,
		};

		expect( dispatchSpy ).toHaveBeenCalledWith( expect.objectContaining( expectedAction ) );

		// Check the http util method was called from the fetch handler
		expect( wpcomHttpActions.http ).toHaveBeenCalled();

		// Check the http was called with the right arguments (target, action)
		expect( wpcomHttpActions.http ).toHaveBeenCalledWith(
			expect.objectContaining( {
				apiNamespace: 'wpcom/v2',
				method: 'GET',
				path: `/sites/${ siteId }/scan`,
			} ),
			expect.objectContaining( expectedAction )
		);
	} );
} );
