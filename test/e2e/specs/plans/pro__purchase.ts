/**
 * @group calypso-pr
 */

import {
	DataHelper,
	SidebarComponent,
	PlansPage,
	CartCheckoutPage,
	TestAccount,
} from '@automattic/calypso-e2e';
import { Page, Browser } from 'playwright';

declare const browser: Browser;

describe( DataHelper.createSuiteTitle( 'Plans: Purchases' ), function () {
	let page: Page;
	let plansPage: PlansPage;
	let cartCheckoutPage: CartCheckoutPage;

	beforeAll( async () => {
		page = await browser.newPage();

		const testAccount = new TestAccount( 'myTestUser' );
		await testAccount.authenticate( page );
	} );

	describe( 'Initial navigation', function () {
		it( 'Navigate to Upgrades > Plans', async function () {
			const sidebarComponent = new SidebarComponent( page );
			await sidebarComponent.navigate( 'Upgrades', 'Plans' );
		} );

		it( 'Click on the "New Plans" navigation tab', async function () {
			plansPage = new PlansPage( page );
			await plansPage.clickTab( 'New Plans' );
		} );
	} );

	describe( 'Add and WordPress.com Pro from cart', function () {
		const cartItemForProPlan = 'WordPress.com Pro';

		it( 'Click on "Try Pro" button for WordPress.com Pro plan', async function () {
			await plansPage.clickPlanActionButton( {
				plan: 'WordPress Pro',
				buttonText: 'Try Pro risk-free',
			} );
		} );

		it( 'WordPress.com Pro is added to cart', async function () {
			cartCheckoutPage = new CartCheckoutPage( page );
			await cartCheckoutPage.validateCartItem( cartItemForProPlan );
		} );

		it( 'Remove WordPress.com Pro from cart', async function () {
			await cartCheckoutPage.removeCartItem( cartItemForProPlan );
		} );

		it( 'Automatically return to Plans page', async function () {
			plansPage = new PlansPage( page );
			await plansPage.validateActiveNavigationTab( 'Plans' );
		} );
	} );
} );