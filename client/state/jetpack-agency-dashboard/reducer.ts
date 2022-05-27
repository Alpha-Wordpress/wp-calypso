import { JETPACK_AGENCY_DASHBOARD_FILTER_SET } from 'calypso/state/action-types';
import { combineReducers } from 'calypso/state/utils';
import type { Reducer, Action } from 'redux';

type AgencyDashboardFilterActionTypes = typeof JETPACK_AGENCY_DASHBOARD_FILTER_SET;

export interface AgencyDashboardFilter {
	backup_failed?: boolean;
	backup_warning?: boolean;
	threats_found?: boolean;
}

interface AgencyDashboardFilterAction extends Action< AgencyDashboardFilterActionTypes > {
	type: AgencyDashboardFilterActionTypes;
	payload?: AgencyDashboardFilter;
}

const filter: Reducer< AgencyDashboardFilter, AgencyDashboardFilterAction > = (
	state: AgencyDashboardFilter = {},
	{ type, payload }: AgencyDashboardFilterAction
) => {
	switch ( type ) {
		case JETPACK_AGENCY_DASHBOARD_FILTER_SET:
			return payload ?? {};
		default:
			return state;
	}
};

export default combineReducers( { filter } );
