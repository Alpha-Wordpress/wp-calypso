import debugFactory from 'debug';
import validatorFactory from 'is-my-json-valid';
import { isEmpty, reduce, update } from 'lodash';
import validationSchema from './fr-schema';

const validate = validatorFactory( validationSchema, { greedy: true } );
const debug = debugFactory( 'calypso:components:domains:registrant-extra-info:validation' );

// is-my-json-valid uses customized messages, but the actual rule name seems
// more intuitive
// See http://json-schema.org/latest/json-schema-validation.html#rfc.section.6
// Notes:
// - Looks like is-my-json-valid does not handle contains
// - `items` doesn't get it's own message, it just adds an index to the path
//   e.g. If you validate `{ even: [ 0, 1, 2, 3 ] }`` using the schema
//   `{ properties: { even: { items: { multipleOf: 2 } } } }` you get errors
//   with field 'data.even.1' and `data.even.2`.
// - patternProperties is similar to items, but less readable.
const reverseMessageMap = {
	'is required': 'required',
	'is the wrong type': 'type',
	'has additional items': 'additionalItems',
	'must be unique': 'uniqueItems',
	'must be an enum value': 'enum',
	'dependencies not set': 'dependencies',
	'has additional properties': 'additionalProperties',
	'referenced schema does not match': '$ref',
	'negative schema matches': 'not',
	'pattern mismatch': 'pattern',
	'no schemas match': 'anyOf',
	'no (or more than one) schemas match': 'oneOf',
	'has a remainder': 'multipleOf',
	'has more properties than allowed': 'maxProperties',
	'has less properties than allowed': 'minProperties',
	'has more items than allowed': 'maxItems',
	'has less items than allowed': 'minItems',
	'has longer length than allowed': 'maxLength',
	'has less length than allowed': 'minLength',
	'is less than minimum': 'minimum', // also might be exclusiveMaximum
	'is more than maximum': 'maximum', // also might be exclusiveMinimum
};

function ruleNameFromMessage( message ) {
	return (
		reverseMessageMap[ message ] ||
		( typeof message === 'string' && message.match( /^must be (.*) format$/ ) && 'format' ) ||
		message
	);
}

function validateWithSirenSiretChecksum( contactDetails ) {
	// populate validate.errors
	validate( contactDetails );

	const sirenSiret = contactDetails?.extra?.fr?.sirenSiret ?? '';

	if ( sirenSiret && ( sirenSiret.match( /^\d{9}$/ ) || sirenSiret.match( /^\d{14}$/ ) ) ) {
		let double = false;
		let sum = 0;

		for ( let i = sirenSiret.length - 1; i >= 0; i-- ) {
			const digit = parseInt( sirenSiret[ i ], 10 ) * ( double ? 2 : 1 );
			sum += digit;

			if ( digit > 9 ) {
				sum -= 9;
			}

			double = ! double;
		}

		if ( sum % 10 !== 0 ) {
			const error = { field: 'data.extra.fr.sirenSiret', message: 'checksum' };
			if ( validate.errors ) {
				validate.errors.push( error );
			} else {
				validate.errors = [ error ];
			}
		}
	}

	return validate.errors;
}

/*
 * @returns errors by field, like: { 'extra.fr.field: name, errors: [ string ] }
 */
export default function validateContactDetails( contactDetails ) {
	const errors = validateWithSirenSiretChecksum( contactDetails );
	errors && debug( errors );

	return reduce(
		errors,
		( accumulatedErrors, { field, message } ) => {
			// Drop 'data.' prefix
			const path = String( field ).split( '.' ).slice( 1 );

			// In order to capture the relationship between the organization
			// and extra.fr.individualType fields, the rule ends up in the root
			// path.
			// We've only got one such case at the moment, so we can insert this
			// hack, but if we need to tell multiple such rules apart, we're
			// going to need to add a some magic to map schemas to fields
			const correctedPath = isEmpty( path ) ? [ 'organization' ] : path;

			const appendThisMessage = ( before ) => [
				...( before || [] ),
				ruleNameFromMessage( message ),
			];

			return update( accumulatedErrors, correctedPath, appendThisMessage );
		},
		{}
	);
}
