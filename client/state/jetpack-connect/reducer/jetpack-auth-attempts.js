import {
	JETPACK_CONNECT_COMPLETE_FLOW,
	JETPACK_CONNECT_RETRY_AUTH,
} from 'calypso/state/jetpack-connect/action-types';
import { keyedReducer, withSchemaValidation, withPersistence } from 'calypso/state/utils';
import { AUTH_ATTEMPS_TTL } from '../constants';
import { isStale } from '../utils';
import { jetpackAuthAttemptsSchema } from './schema';

export function authAttempts( state = undefined, { type, attemptNumber } ) {
	switch ( type ) {
		case JETPACK_CONNECT_RETRY_AUTH:
			if ( ! state || isStale( state.timestamp, AUTH_ATTEMPS_TTL ) ) {
				return {
					attempt: 0,
					timestamp: Date.now(),
				};
			}
			return {
				attempt: attemptNumber,
				timestamp: state.timestamp,
			};

		case JETPACK_CONNECT_COMPLETE_FLOW:
			return undefined;
	}
	return state;
}

export default withSchemaValidation(
	jetpackAuthAttemptsSchema,
	keyedReducer( 'slug', withPersistence( authAttempts ) )
);
