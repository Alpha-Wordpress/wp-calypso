import { isStarter, isGSuiteOrExtraLicenseOrGoogleWorkspace } from '@automattic/calypso-products';
import { localize } from 'i18n-calypso';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import earnImage from 'calypso/assets/images/customer-home/illustration--task-earn.svg';
import PurchaseDetail from 'calypso/components/purchase-detail';
import CustomDomainPurchaseDetail from './custom-domain-purchase-detail';
import GoogleAppsDetails from './google-apps-details';

const StarterPlanDetails = ( { translate, selectedSite, sitePlans, purchases } ) => {
	const plan = find( sitePlans.data, isStarter );
	const googleAppsWasPurchased = purchases.some( isGSuiteOrExtraLicenseOrGoogleWorkspace );

	return (
		<div>
			{ googleAppsWasPurchased && <GoogleAppsDetails purchases={ purchases } /> }

			<CustomDomainPurchaseDetail
				selectedSite={ selectedSite }
				hasDomainCredit={ plan && plan.hasDomainCredit }
			/>

			<PurchaseDetail
				icon={ <img alt={ translate( 'Earn Illustration' ) } src={ earnImage } /> }
				title={ translate( 'Make money with your website' ) }
				description={ translate(
					'Accept credit card payments today for just about anything – physical and digital goods, services, ' +
						'donations and tips, or access to your exclusive content.'
				) }
				buttonText={ translate( 'Start Earning' ) }
				href={ '/earn/' + selectedSite.slug }
			/>
		</div>
	);
};

StarterPlanDetails.propTypes = {
	selectedSite: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ).isRequired,
	sitePlans: PropTypes.object.isRequired,
};

export default localize( StarterPlanDetails );