export default function cssSafeUrl( url ) {
	return url && url.replace( /([()])/g, '\\$1' );
}
