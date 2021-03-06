import config from '@automattic/calypso-config';
import debugFactory from 'debug';
import { REMOTE_PATH_AUTH } from 'calypso/jetpack-connect/constants';
import { navigate } from 'calypso/lib/navigate';
import { addQueryArgs } from 'calypso/lib/route';
import { urlToSlug } from 'calypso/lib/url';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { JETPACK_CONNECT_RETRY_AUTH } from 'calypso/state/jetpack-connect/action-types';

import 'calypso/state/jetpack-connect/init';

/**
 * Module constants
 */
const calypsoEnv = config( 'env_id' );
const debug = debugFactory( 'calypso:jetpack-connect:actions' );

export function retryAuth( url, attemptNumber, fromParam, redirectAfterAuth ) {
	return ( dispatch ) => {
		debug( 'retrying auth', url, attemptNumber );
		dispatch( {
			type: JETPACK_CONNECT_RETRY_AUTH,
			attemptNumber: attemptNumber,
			slug: urlToSlug( url ),
		} );
		dispatch(
			recordTracksEvent( 'calypso_jpc_retry_auth', {
				url: url,
				attempt: attemptNumber,
			} )
		);
		debug( 'retryAuth', url );
		navigate(
			addQueryArgs(
				{
					jetpack_connect_url: url + REMOTE_PATH_AUTH,
					calypso_env: calypsoEnv,
					auth_type: 'jetpack',
					from: fromParam,
					redirect_after_auth: redirectAfterAuth,
				},
				url + REMOTE_PATH_AUTH
			)
		);
	};
}
