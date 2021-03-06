import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { TEAMS_RECEIVE } from 'calypso/state/teams/action-types';
import { handleTeamsRequest, teamRequestFailure, teamRequestReceived } from '../';

const action = { type: 'DUMMY_ACTION' };

test( 'should return an action for an HTTP request to teams endpoint', () => {
	const result = handleTeamsRequest( action );

	expect( result ).toEqual(
		http(
			{
				method: 'GET',
				path: '/read/teams',
				apiVersion: '1.2',
			},
			action
		)
	);
} );

test( 'should return a TEAMS_RECEIVE action with error when request errors', () => {
	const result = teamRequestFailure( action );

	expect( result ).toEqual( {
		type: TEAMS_RECEIVE,
		payload: action,
		error: true,
	} );
} );

test( 'should return a TEAMS_RECEIVE action without error when request succeeds', () => {
	const apiResponse = {
		teams: [
			{
				slug: 'a8c',
				title: 'Automattic',
			},
		],
	};
	const result = teamRequestReceived( action, apiResponse );

	expect( result ).toEqual( {
		type: TEAMS_RECEIVE,
		payload: apiResponse,
	} );
} );
