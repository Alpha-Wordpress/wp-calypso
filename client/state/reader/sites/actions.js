import {
	READER_SITE_REQUEST,
	READER_SITE_REQUEST_SUCCESS,
	READER_SITE_REQUEST_FAILURE,
} from 'calypso/state/reader/action-types';

import 'calypso/state/data-layer/wpcom/read/sites';

import 'calypso/state/reader/init';

export function requestSite( blogId ) {
	return {
		type: READER_SITE_REQUEST,
		payload: {
			ID: blogId,
		},
	};
}

export function receiveReaderSiteRequestSuccess( data ) {
	return {
		type: READER_SITE_REQUEST_SUCCESS,
		payload: data,
	};
}

export function receiveReaderSiteRequestFailure( action, error ) {
	return {
		type: READER_SITE_REQUEST_FAILURE,
		payload: action.payload,
		error,
	};
}
