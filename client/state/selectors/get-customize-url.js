import getFrontPageEditorUrl from 'calypso/state/selectors/get-front-page-editor-url';
import getSiteEditorUrl from 'calypso/state/selectors/get-site-editor-url';
import isSiteUsingLegacyFSE from 'calypso/state/selectors/is-site-using-legacy-fse';
import { getThemeCustomizeUrl } from 'calypso/state/themes/selectors';
/**
 * Returns the URL for clicking on "Customize". The block editor URL is returned for sites with
 * Full Site Editing or if they are using the Core Site Editor. Otherwise we return the
 * Customizer URL.
 *
 * @param  {object}   state   Global state tree
 * @param  {string}   themeId Theme ID
 * @param  {number}   siteId  Site ID to open the customizer or block editor for
 * @returns {string}           Customizer or Block Editor URL
 */
export default function getCustomizeUrl( state, themeId, siteId, isFSEActive = false ) {
	// Core FSE
	if ( isFSEActive ) {
		return getSiteEditorUrl( state, siteId );
	}

	// Legacy dotcom FSE
	if ( isSiteUsingLegacyFSE( state, siteId ) ) {
		return getFrontPageEditorUrl( state, siteId );
	}

	return getThemeCustomizeUrl( state, themeId, siteId );
}
