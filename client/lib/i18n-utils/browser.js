import i18n from 'i18n-calypso';

export {
	addLocaleToPath,
	getLanguage,
	getLanguageRouteParam,
	getLanguageSlugs,
	getLocaleFromPath,
	isDefaultLocale,
	isLocaleVariant,
	isLocaleRtl,
	localizeUrl,
	canBeTranslated,
	removeLocaleFromPath,
	getPathParts,
	filterLanguageRevisions,
	translationExists,
	isMagnificentLocale,
	isTranslatedIncompletely,
} from './utils';

export const getLocaleSlug = () => i18n.getLocaleSlug();
