import { PLAN_PREMIUM, PLAN_BUSINESS } from '@automattic/calypso-products';
import { getSitePlan } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

// NOTE: selector moved here because tour is no longer active and serves as example only
// to use in a tour, move back to 'state/guided-tours/contexts' (see commented out import above)
/**
 * Returns true if the selected site is on the Premium or Business plan
 *
 * @param {object} state Global state tree
 * @returns {boolean} True if selected site is on the Premium or Business plan, false otherwise.
 */

export const hasSelectedSitePremiumOrBusinessPlan = ( state ) => {
	const siteId = getSelectedSiteId( state );
	const sitePlan = getSitePlan( state, siteId );
	if ( ! sitePlan ) {
		return false;
	}
	return [ PLAN_PREMIUM, PLAN_BUSINESS ].includes( sitePlan.product_slug );
};
