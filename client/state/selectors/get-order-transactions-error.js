import { get } from 'lodash';

import 'calypso/state/order-transactions/init';

export const getOrderTransactionError = ( state, orderId ) =>
	get( state, [ 'orderTransactions', 'error', orderId ], null );

export default getOrderTransactionError;
