const { app } = require( 'electron' );
const { autoUpdater } = require( 'electron-updater' );
const semver = require( 'semver' );
const AppQuit = require( '../../../lib/app-quit' );
const Config = require( '../../../lib/config' );
const debugTools = require( '../../../lib/debug-tools' );
const { bumpStat, sanitizeVersion, getPlatform } = require( '../../../lib/desktop-analytics' );
const log = require( '../../../lib/logger' )( 'desktop:updater:auto' );
const Updater = require( '../../../lib/updater' );

const statsPlatform = getPlatform( process.platform );
const sanitizedVersion = sanitizeVersion( app.getVersion() );

const getStatsString = ( isBeta ) =>
	`${ statsPlatform }${ isBeta ? '-b' : '' }-${ sanitizedVersion }`;

function dialogDebug( message ) {
	log.info( message );

	if ( Config.build === 'updater' ) {
		debugTools.dialog( message );
	}
}

class AutoUpdater extends Updater {
	constructor( options = {} ) {
		super( options );

		autoUpdater.on( 'error', this.onError.bind( this ) );
		autoUpdater.on( 'update-available', this.onAvailable.bind( this ) );
		autoUpdater.on( 'update-not-available', this.onNotAvailable.bind( this ) );
		autoUpdater.on( 'update-downloaded', this.onDownloaded.bind( this ) );

		autoUpdater.autoInstallOnAppQuit = false;
		autoUpdater.allowDowngrade = true;
		autoUpdater.channel = 'stable';
		autoUpdater.allowPrerelease = false;
		autoUpdater.autoDownload = false;

		if ( this.beta ) {
			autoUpdater.channel = 'beta';
			autoUpdater.allowPrerelease = true;
			autoUpdater.allowDowngrade = false;
		}

		// Tracks whether an auto-update check was initiated via menu selection.
		this.isUserRequested = false;
	}

	ping( isUserRequested ) {
		if ( process.env.DEBUG ) {
			dialogDebug( 'DEBUG is set: skipping auto-update check' );
			return;
		}
		dialogDebug( 'Checking for update' );
		autoUpdater.checkForUpdates();
		this.isUserRequested = isUserRequested;
	}

	// ignore (available), confirm (available), cancel (available)
	// not available ( do nothing ) - user initiated
	onAvailable( info ) {
		if ( semver.lt( app.getVersion(), info.version ) ) {
			log.info( 'New update is available: ', info.version );
			bumpStat( 'wpcom-desktop-update-check', `${ getStatsString( this.beta ) }-needs-update` );
			autoUpdater.downloadUpdate();
		} else {
			log.info(
				`Latest upstream version ${
					info.version
				} is older than current app version ${ app.getVersion() }, autoDownload set to ${
					autoUpdater.autoDownload
				}, skipping auto-update ...`
			);
			this.onNotAvailable();
		}
	}

	onNotAvailable() {
		log.info( 'No update is available' );
		bumpStat( 'wpcom-desktop-update-check', `${ getStatsString( this.beta ) }-no-update` );
		if ( this.isUserRequested ) {
			this.notifyNotAvailable();
		}
		this.isUserRequested = false;
	}

	onDownloaded( info ) {
		log.info( 'Update downloaded: ', info.version );

		this.setVersion( info.version );
		this.notify();

		const stats = {
			'wpcom-desktop-download': `${ statsPlatform }-app`,
			'wpcom-desktop-download-by-ver': `${ statsPlatform }-app-${ sanitizedVersion }`,
			'wpcom-desktop-download-ref': `update-${ statsPlatform }-app`,
			'wpcom-desktop-download-ref-only': 'update',
		};
		bumpStat( stats );
	}

	onConfirm() {
		log.info( `User selected 'Update & Restart'...` );

		AppQuit.allowQuit();
		autoUpdater.quitAndInstall();

		bumpStat( 'wpcom-desktop-update', `${ getStatsString( this.beta ) }-confirm` );
	}

	onCancel() {
		this.isUserRequested = false;
		bumpStat( 'wpcom-desktop-update', `${ getStatsString( this.beta ) }-update-cancel` );
	}

	onError( event ) {
		log.error( 'Update error: ', event );

		bumpStat( 'wpcom-desktop-update', `${ getStatsString( this.beta ) }-update-error` );
	}
}

module.exports = AutoUpdater;
