import { localize } from 'i18n-calypso';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';
import wpcom from 'calypso/lib/wp';
import { updateFilter } from 'calypso/state/activity-log/actions';
import { filterStateToApiQuery } from 'calypso/state/activity-log/utils';
import { recordTracksEvent, withAnalytics } from 'calypso/state/analytics/actions';
import fromActivityTypeApi from 'calypso/state/data-layer/wpcom/sites/activity-types/from-api';
import { TypeSelector } from './type-selector';

const ActivityTypeSelector = ( props ) => {
	const { translate } = props;

	return <TypeSelector { ...props } title={ translate( 'Activity type' ) } />;
};

const activityCountsQueryKey = ( siteId, filter ) => [
	'activity-log-counts',
	siteId,
	filter.before ?? '',
	filter.after ?? '',
	filter.on ?? '',
];
const withActivityTypes = ( WrappedComponent ) => ( props ) => {
	const { siteId, filter } = props;
	const { data } = useQuery(
		activityCountsQueryKey( siteId, filter ),
		() =>
			wpcom.req
				.get(
					{ path: `/sites/${ siteId }/activity/count/group`, apiNamespace: 'wpcom/v2' },
					filterStateToApiQuery( filter, false )
				)
				.then( fromActivityTypeApi ),
		{
			enabled: !! siteId,
			staleTime: 10 * 1000,
		}
	);
	return <WrappedComponent { ...props } types={ data ?? [] } />;
};

const selectActionType = ( siteId, group, allTypes ) => ( dispatch ) => {
	console.log( 'selectActionType' );

	if ( 0 === group.length ) {
		return dispatch(
			withAnalytics(
				recordTracksEvent( 'calypso_activitylog_filterbar_reset_type' ),
				updateFilter( siteId, { group: null, page: 1 } )
			)
		);
	}
	const eventProps = { num_groups_selected: group.length };
	allTypes.forEach(
		( type ) => ( eventProps[ 'group_' + type.key ] = group.includes( type.key ) )
	);
	eventProps.num_total_activities_selected = allTypes.reduce( ( accumulator, type ) => {
		return group.includes( type.key ) ? accumulator + type.count : accumulator;
	}, 0 );

	return dispatch(
		withAnalytics(
			// TODO
			recordTracksEvent( 'calypso_activitylog_filterbar_select_type', eventProps ),
			updateFilter( siteId, { group: group, page: 1 } )
		)
	);
};

export default withActivityTypes(
	connect( null, { selectType: selectActionType } )( localize( ActivityTypeSelector ) )
);
