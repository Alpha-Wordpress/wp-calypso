const { dialog } = require( 'electron' );
const { getUpdater } = require( '../../app-handlers/updater' );
const AppQuit = require( '../../lib/app-quit' );
const ipc = require( '../../lib/calypso-commands' );
const Config = require( '../../lib/config' );
const isCalypso = require( '../../lib/is-calypso' );
const log = require( '../../lib/logger' )( 'desktop:menu' );
const platform = require( '../../lib/platform' );
const Settings = require( '../../lib/settings' );
const WindowManager = require( '../../lib/window-manager' );
const debugMenu = require( './debug-menu' );

/**
 * Module variables
 */
const debugEnabled = Settings.getSettingGroup( Config.debug.enabled_by_default, 'debug' );

module.exports = function ( app, { view, window } ) {
	const menuItems = [
		{
			label: 'Preferences...',
			accelerator: 'CmdOrCtrl+,',
			click: function () {
				WindowManager.openPreferences();
			},
		},
		{
			type: 'separator',
		},
		{
			label: 'Sign Out',
			requiresUser: true,
			enabled: false,
			id: 'loggedin',
			click: async function () {
				window.show();
				if ( isCalypso( view ) ) {
					ipc.signOut( view );
				} else {
					await view.webContents.session.clearStorageData();
					view.webContents.loadURL( Config.loginURL() );
				}
			},
		},
		{
			type: 'separator',
		},
		{
			label: 'Quit',
			accelerator: 'CmdOrCtrl+Q',
			click: function () {
				AppQuit.allowQuit();
				app.quit();
			},
		},
	];

	if ( Config.debug ) {
		menuItems.splice( 1, 0, {
			label: 'Debug Mode',
			type: 'checkbox',
			checked: debugEnabled,
			click: function ( menu ) {
				Settings.saveSetting( 'debug', menu.checked );

				dialog.showMessageBox( {
					buttons: [ 'OK' ],
					title: 'Restart',
					message: 'Please restart the app for the change to have effect',
					detail: "Sorry, we're unable to restart it for you right now",
				} );
			},
		} );

		if ( platform.isOSX() === false ) {
			menuItems.splice( 1, 0, debugMenu[ 0 ], debugMenu[ 1 ] );
		}
	}

	if ( platform.isOSX() ) {
		// Add an 'about' item to the start of the menu, as per OS X standards
		menuItems.splice(
			0,
			0,
			{
				label: 'About WordPress.com',
				click: function () {
					WindowManager.openAbout();
				},
			},
			{
				type: 'separator',
			}
		);

		// Add the standard OS X app items just before the quit
		menuItems.splice(
			menuItems.length - 1,
			0,
			{
				label: 'Services',
				role: 'services',
				submenu: [],
			},
			{
				type: 'separator',
			},
			{
				label: 'Hide WordPress.com',
				accelerator: 'Command+H',
				role: 'hide',
			},
			{
				label: 'Hide Others',
				accelerator: 'Command+Shift+H',
				role: 'hideothers',
			},
			{
				label: 'Show All',
				role: 'unhide',
			},
			{
				type: 'separator',
			},
			{
				label: 'Check For Updates',
				click: function () {
					checkForUpdates();
				},
			},
			{
				type: 'separator',
			}
		);
	}

	return menuItems;
};

function checkForUpdates() {
	log.info( `User clicked 'Check For Updates'` );
	const updater = getUpdater();
	if ( updater ) {
		updater.ping( true );
	} else {
		log.error( 'Updater not set' );
	}
}
