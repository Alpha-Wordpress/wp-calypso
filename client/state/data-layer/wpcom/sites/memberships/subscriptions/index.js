import {
	MEMBERSHIPS_SUBSCRIPTIONS_LIST_REQUEST,
	MEMBERSHIPS_SUBSCRIPTIONS_RECEIVE,
} from 'calypso/state/action-types';
import { registerHandlers } from 'calypso/state/data-layer/handler-registry';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';

const noop = () => {};

export const handleSubscribedMembershipsList = dispatchRequest( {
	fetch: ( action ) =>
		http(
			{
				method: 'GET',
				path: '/me/memberships/subscriptions',
			},
			action
		),
	onSuccess: ( action, { subscriptions, total } ) => ( {
		type: MEMBERSHIPS_SUBSCRIPTIONS_RECEIVE,
		subscriptions,
		total,
	} ),
	onError: noop,
} );

registerHandlers( 'state/data-layer/wpcom/sites/memberships/subscriptions/index.js', {
	[ MEMBERSHIPS_SUBSCRIPTIONS_LIST_REQUEST ]: [ handleSubscribedMembershipsList ],
} );
