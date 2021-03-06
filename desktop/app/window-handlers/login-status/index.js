const { app } = require( 'electron' );
const Config = require( '../../lib/config' );
const menu = require( '../../lib/menu' );
const WPNotificationsAPI = require( '../../lib/notifications/api' );
const platform = require( '../../lib/platform' );
const SessionManager = require( '../../lib/session' );

module.exports = function ( appWindow ) {
	menu.set( app, appWindow );

	SessionManager.on( 'logged-in', () => {
		handleLogin();
	} );
	SessionManager.on( 'logged-out', () => {
		handleLogout( appWindow );
	} );

	SessionManager.on( 'api:connect', () => {
		WPNotificationsAPI.connect();
	} );
	SessionManager.on( 'api:disconnect', () => {
		WPNotificationsAPI.disconnect();
	} );
};

function handleLogin() {
	menu.enableLoggedInItems();
	platform.setDockMenu( true );
}

function handleLogout( { view } ) {
	platform.setDockMenu( false );
	menu.disableLoggedInItems();
	view.webContents.loadURL( Config.loginURL() );
}
