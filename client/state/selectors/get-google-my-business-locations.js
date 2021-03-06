import { filter, last } from 'lodash';
import { getAvailableExternalAccounts } from 'calypso/state/sharing/selectors';
import { getSiteKeyringsForService } from 'calypso/state/site-keyrings/selectors';

export default function getGoogleMyBusinessLocations( state, siteId ) {
	const googleMyBusinessSiteKeyring = last(
		getSiteKeyringsForService( state, siteId, 'google_my_business' )
	);

	if ( ! googleMyBusinessSiteKeyring ) {
		return [];
	}

	const externalUsers = filter( getAvailableExternalAccounts( state, 'google_my_business' ), {
		keyringConnectionId: googleMyBusinessSiteKeyring.keyring_id,
	} );

	externalUsers.forEach( ( externalUser ) => {
		externalUser.isConnected = externalUser.ID === googleMyBusinessSiteKeyring.external_user_id;
	} );

	return externalUsers;
}
