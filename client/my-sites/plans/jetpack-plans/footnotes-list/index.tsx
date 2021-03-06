import { useTranslate } from 'i18n-calypso';

import './style.scss';

export const FootnotesList: React.FunctionComponent = () => {
	const translate = useTranslate();

	return (
		<ul className="footnotes-list">
			<li className="footnotes-list__item">
				{ translate(
					'* Discount applies to yearly subscriptions, first year only. All renewals are at full price.',
					{ comment: '* is used to reference clause in other locations on page' }
				) }
			</li>
			<li className="footnotes-list__item">
				{ translate( '** Monthly plans are 7-day money back guarantee.', {
					comment: '** is used to reference clause in other locations on page ',
				} ) }
			</li>
		</ul>
	);
};
