import { withStorageKey } from '@automattic/state-utils';
import {
	ORDER_TRANSACTION_FETCH,
	ORDER_TRANSACTION_FETCH_ERROR,
	ORDER_TRANSACTION_SET,
} from 'calypso/state/action-types';
import { combineReducers, keyedReducer } from 'calypso/state/utils';

export const items = keyedReducer( 'orderId', ( state = null, action ) => {
	switch ( action.type ) {
		case ORDER_TRANSACTION_FETCH:
			return null;
		case ORDER_TRANSACTION_FETCH_ERROR:
			return null;
		case ORDER_TRANSACTION_SET: {
			const { transaction } = action;
			return transaction;
		}
	}

	return state;
} );

export const isFetching = keyedReducer( 'orderId', ( state = false, action ) => {
	switch ( action.type ) {
		case ORDER_TRANSACTION_FETCH:
			return true;
		case ORDER_TRANSACTION_FETCH_ERROR:
			return false;
		case ORDER_TRANSACTION_SET:
			return false;
	}

	return state;
} );

export const errors = keyedReducer( 'orderId', ( state = null, action ) => {
	switch ( action.type ) {
		case ORDER_TRANSACTION_FETCH:
			return null;
		case ORDER_TRANSACTION_FETCH_ERROR:
			return action.error;
		case ORDER_TRANSACTION_SET:
			return null;
	}

	return state;
} );

const combinedReducer = combineReducers( {
	items,
	isFetching,
	errors,
} );

export default withStorageKey( 'orderTransactions', combinedReducer );
