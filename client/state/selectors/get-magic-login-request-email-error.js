import { get } from 'lodash';

import 'calypso/state/login/init';

export default function getMagicLoginRequestEmailError( state ) {
	return get( state, 'login.magicLogin.requestEmailError', null );
}
