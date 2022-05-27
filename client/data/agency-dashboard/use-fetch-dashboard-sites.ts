import { useTranslate } from 'i18n-calypso';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { wpcomJetpackLicensing as wpcomJpl } from 'calypso/lib/wp';
import { errorNotice } from 'calypso/state/notices/actions';
import type { AgencyDashboardFilter } from 'calypso/state/jetpack-agency-dashboard/reducer';

const useFetchDashboardSites = ( filter?: AgencyDashboardFilter ) => {
	const translate = useTranslate();
	const dispatch = useDispatch();
	return useQuery(
		[ 'jetpack-cloud', 'agency-dashboard', 'sites', filter ],
		() =>
			wpcomJpl.req.get(
				{
					path: '/jetpack-agency/sites',
					apiNamespace: 'wpcom/v2',
				},
				filter
			),
		{
			select: ( data ) => ( data.sites ? Object.values( data.sites ) : [] ),
			refetchOnWindowFocus: false,
			onError: () =>
				dispatch(
					errorNotice( translate( 'Failed to retrieve your sites. Please try again later.' ) )
				),
		}
	);
};

export default useFetchDashboardSites;
