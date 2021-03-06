/* eslint-disable wpcalypso/jsx-classname-namespace */
import { Button } from '@automattic/components';
import { Icon, moreVertical, redo } from '@wordpress/icons';
import { useI18n } from '@wordpress/react-i18n';
import { useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PopoverMenu from 'calypso/components/popover-menu';
import PopoverMenuItem from 'calypso/components/popover-menu/item';
import { updateDns } from 'calypso/state/domains/dns/actions';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';
import RestoreDefaultARecordsDialog from './restore-default-a-records-dialog';
import { DnsMenuOptionsButtonProps, RestoreDialogResult } from './types';

function DnsMenuOptionsButton( {
	domain,
	pointsToWpcom,
	dns,
	dispatchUpdateDns,
	dispatchSuccessNotice,
	dispatchErrorNotice,
}: DnsMenuOptionsButtonProps ): JSX.Element {
	const { __ } = useI18n();

	const [ isMenuVisible, setMenuVisible ] = useState( false );
	const [ isRestoreDialogVisible, setRestoreDialogVisible ] = useState( false );
	const optionsButtonRef = useRef( null );

	const toggleMenu = useCallback( () => {
		setMenuVisible( ! isMenuVisible );
	}, [ isMenuVisible ] );

	const closeMenu = useCallback( () => setMenuVisible( false ), [] );

	const getRecordsToRemove = useCallback( () => {
		const dnsRecords = dns.records ?? [];

		return dnsRecords.filter(
			( record ) =>
				record.domain === record.name.replace( /\.$/, '' ) &&
				[ 'A', 'AAAA' ].includes( record.type )
		);
	}, [ dns ] );

	const restoreDefaultRecords = useCallback( async () => {
		dispatchUpdateDns( domain, [], getRecordsToRemove() )
			.then( () => dispatchSuccessNotice( __( 'Default A records restored' ) ) )
			.catch( () => dispatchErrorNotice( __( 'Failed to restore the default A records' ) ) );
	}, [
		__,
		dispatchErrorNotice,
		dispatchSuccessNotice,
		dispatchUpdateDns,
		domain,
		getRecordsToRemove,
	] );

	const closeRestoreDialog = ( result: RestoreDialogResult ) => {
		setRestoreDialogVisible( false );
		if ( result?.shouldRestoreDefaultRecords ?? false ) {
			restoreDefaultRecords();
		}
	};

	const showRestoreDialog = useCallback( () => setRestoreDialogVisible( true ), [] );

	return (
		<>
			<RestoreDefaultARecordsDialog
				visible={ isRestoreDialogVisible }
				onClose={ closeRestoreDialog }
				defaultRecords={ null }
			/>
			<Button
				className="dns__breadcrumb-button ellipsis"
				onClick={ toggleMenu }
				ref={ optionsButtonRef }
				borderless
			>
				<Icon icon={ moreVertical } className="gridicon" />
			</Button>
			<PopoverMenu
				className="dns__breadcrumb-button popover"
				isVisible={ isMenuVisible }
				onClose={ closeMenu }
				context={ optionsButtonRef.current }
				position="bottom"
			>
				<PopoverMenuItem onClick={ showRestoreDialog } disabled={ pointsToWpcom }>
					<Icon icon={ redo } size={ 14 } className="gridicon" viewBox="2 2 20 20" />
					{ __( 'Restore default A records' ) }
				</PopoverMenuItem>
			</PopoverMenu>
		</>
	);
}

export default connect( null, {
	dispatchUpdateDns: updateDns,
	dispatchSuccessNotice: successNotice,
	dispatchErrorNotice: errorNotice,
} )( DnsMenuOptionsButton );
