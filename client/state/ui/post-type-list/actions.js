import {
	POST_TYPE_LIST_SHARE_PANEL_HIDE,
	POST_TYPE_LIST_SHARE_PANEL_TOGGLE,
} from 'calypso/state/action-types';

import 'calypso/state/ui/init';

export function hideActiveSharePanel() {
	return {
		type: POST_TYPE_LIST_SHARE_PANEL_HIDE,
	};
}

export function toggleSharePanel( postGlobalId ) {
	return {
		type: POST_TYPE_LIST_SHARE_PANEL_TOGGLE,
		postGlobalId,
	};
}
