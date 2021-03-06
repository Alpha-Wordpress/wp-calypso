import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { requestTeams } from 'calypso/state/teams/actions';

export default function QueryReaderTeams() {
	const dispatch = useDispatch();
	useEffect( () => {
		dispatch( requestTeams() );
	}, [ dispatch ] );

	return null;
}
