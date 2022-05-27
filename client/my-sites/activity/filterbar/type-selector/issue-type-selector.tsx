import { localize, translate } from 'i18n-calypso';
import { TypeSelector } from './type-selector';

interface Props {
	translate: typeof translate;
}
const IssueTypeSelector: React.FunctionComponent< Props > = ( props ) => {
	const { translate } = props;

	const issueTypes = [
		{
			key: 'backup-failed',
			name: translate( 'Backup failed' ),
		},
		{
			key: 'backup-warning',
			name: translate( 'Backup warning' ),
		},
		{
			key: 'threats-found',
			name: translate( 'Threats found' ),
		},
	];
	return <TypeSelector types={ issueTypes } title={ translate( 'Issue Type' ) } { ...props } />;
};

export default localize( IssueTypeSelector );
