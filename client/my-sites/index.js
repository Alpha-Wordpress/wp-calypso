import { get } from 'lodash';
import page from 'page';
import { makeLayout, render as clientRender } from 'calypso/controller';
import { getSiteBySlug, getSiteHomeUrl } from 'calypso/state/sites/selectors';
import { siteSelection, sites } from './controller';

export default function () {
	page( '/sites/:site', ( context ) => {
		const state = context.store.getState();
		const site = getSiteBySlug( state, context.params.site );
		// The site may not be loaded into state yet.
		const siteId = get( site, 'ID' );
		page.redirect( getSiteHomeUrl( state, siteId ) );
	} );
	page( '/sites', siteSelection, sites, makeLayout, clientRender );
}
