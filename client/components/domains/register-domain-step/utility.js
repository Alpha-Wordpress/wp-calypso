import { domainAvailability } from 'calypso/lib/domains/constants';

function moveArrayElement( array, from, to ) {
	if ( from !== to && from < array.length && to < array.length ) {
		array.splice( to, 0, array.splice( from, 1 )[ 0 ] );
	}
}

export function markFeaturedSuggestions(
	suggestions,
	exactMatchDomain,
	strippedDomainBase,
	featuredSuggestionsAtTop = false,
	avoidTlds = [],
	markOnlyRecommended = false
) {
	function isExactMatchBeforeTld( suggestion ) {
		return (
			suggestion.domain_name === exactMatchDomain ||
			suggestion.domain_name?.startsWith( `${ strippedDomainBase }.` )
		);
	}

	function isBestAlternative( suggestion ) {
		return ! isExactMatchBeforeTld( suggestion ) && suggestion.isRecommended !== true;
	}

	const output = [ ...suggestions ];
	let outputWithoutTlds = filterOutDomainsWithTlds( output, avoidTlds );

	const recommendedSuggestion =
		( featuredSuggestionsAtTop ? null : outputWithoutTlds.find( isExactMatchBeforeTld ) ) ||
		outputWithoutTlds[ 0 ];

	if ( recommendedSuggestion ) {
		recommendedSuggestion.isRecommended = true;
		moveArrayElement( output, output.indexOf( recommendedSuggestion ), 0 );
		outputWithoutTlds = filterOutDomainsWithTlds( output, avoidTlds );
	}

	const bestAlternativeSuggestion =
		! markOnlyRecommended &&
		( ( featuredSuggestionsAtTop ? null : outputWithoutTlds.find( isBestAlternative ) ) ||
			outputWithoutTlds[ 1 ] );

	if ( bestAlternativeSuggestion ) {
		bestAlternativeSuggestion.isBestAlternative = true;
		moveArrayElement( output, output.indexOf( bestAlternativeSuggestion ), 1 );
	}

	return output;
}

export function filterOutDomainsWithTlds( suggestions, disallowedTlds ) {
	return suggestions.filter( ( suggestion ) => {
		const tld = suggestion.domain_name.split( '.' ).pop();
		return disallowedTlds.indexOf( tld ) === -1;
	} );
}

export function isUnknownSuggestion( suggestion ) {
	return suggestion.status === domainAvailability.UNKNOWN;
}

export function isUnsupportedPremiumSuggestion( suggestion ) {
	return (
		domainAvailability.AVAILABLE_PREMIUM === suggestion.status &&
		suggestion.hasOwnProperty( 'is_supported_premium_domain' ) &&
		suggestion?.is_supported_premium_domain === false
	);
}

export function isMissingVendor( suggestion ) {
	return ! ( 'vendor' in suggestion );
}

export function isFreeSuggestion( suggestion ) {
	return suggestion.is_free === true;
}

export function getStrippedDomainBase( domain ) {
	let strippedDomainBase = domain;
	const lastIndexOfDot = strippedDomainBase.lastIndexOf( '.' );

	if ( lastIndexOfDot !== -1 ) {
		strippedDomainBase = strippedDomainBase.substring( 0, lastIndexOfDot );
	}
	return strippedDomainBase.replace( /[ .]/g, '' );
}

export function isNumberString( string ) {
	return /^[0-9_]+$/.test( string );
}

export function getTldWeightOverrides( designType ) {
	return designType && designType === 'blog' ? 'design_type_blog' : null;
}
