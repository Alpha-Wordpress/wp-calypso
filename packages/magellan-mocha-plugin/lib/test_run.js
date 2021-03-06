//
// Provide Mocha support for:
//   - Non-browser testing, or regular node.js mocha tests
//

const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );
const mochaSettings = require( './settings' );

const MochaTestRun = function ( options ) {
	// Share assets directory with mocha tests
	const testName = options.locator.name;
	const sanitizedName = testName
		//non-alpha to `-`
		.replace( /[^a-z0-9]/gi, '-' )
		//many `-` in a row to a single `-`
		.replace( /-+/g, '-' )
		//drop initial or trailing `-`
		.replace( /^-|-$/, '' )
		.toLowerCase();

	const pathWithCounter = ( function incrementCandidatePathCounter( { basePath, counter } ) {
		const candidatePath = counter === 0 ? basePath : basePath + '-' + counter;
		try {
			fs.accessSync( candidatePath );
			// If it exists, increment counter and try again
			return incrementCandidatePathCounter( { basePath, counter: counter + 1 } );
		} catch {
			// An error means it doesn't exists, we can use it!
			return candidatePath;
		}
	} )( {
		basePath: path.join( options.tempAssetPath, '..', sanitizedName ),
		counter: 0,
	} );
	this.pathWithCounter = pathWithCounter;
	fs.mkdirSync( pathWithCounter, { recursive: true } );
	_.extend( this, options );
};

// return the command line path to the test framework binary
MochaTestRun.prototype.getCommand = function () {
	const mochaPath = path.dirname( require.resolve( 'mocha/package.json' ) );
	const json = require( path.join( mochaPath, './package.json' ) );
	const relativePathToBin = json.bin.mocha;
	const absolutePathToBin = require.resolve( path.join( mochaPath, relativePathToBin ) );
	return absolutePathToBin;
};

// return the environment
MochaTestRun.prototype.getEnvironment = function ( env ) {
	return _.extend(
		{
			TEMP_ASSET_PATH: this.pathWithCounter,
		},
		env
	);
};

MochaTestRun.prototype.getArguments = function () {
	let grepString = this.locator.name;

	const escapees = '\\^$[]+*.()"';
	escapees.split( '' ).forEach( function ( ch ) {
		grepString = grepString.split( ch ).join( '\\' + ch );
	} );

	let args = [ '--bail', '--mocking_port=' + this.mockingPort, '--worker=1', '-g', grepString ];

	if ( mochaSettings.mochaConfig ) {
		args.push( '--config', mochaSettings.mochaConfig );
	}

	if ( mochaSettings.mochaArgs !== undefined ) {
		args = args.concat( mochaSettings.mochaArgs.split( ' ' ) );
	}

	args = args.concat( mochaSettings.mochaTestFolders );

	return args;
};

module.exports = MochaTestRun;
