/**
 * Language resolution, shared by the server layout and the client provider so
 * the two can never disagree.
 *
 * The provider used to start on 'en' and correct itself after mount, which
 * meant French visitors saw an English flash and — worse — the server sent
 * English markup under a hardcoded lang="fr". Resolving on the server from the
 * cookie (or Accept-Language on a first visit) means the very first byte is
 * already in the right language, with a matching lang attribute.
 */

export type Language = 'en' | 'fr'

export const LANGUAGE_COOKIE = 'luxa-language'

/** One year — this is a preference, not a session. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const FRENCH_PREFIXES = [
  'fr', 'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr-LU',
  'fr-MC', 'fr-CI', 'fr-CM', 'fr-SN', 'fr-ML', 'fr-MG',
]

export function isLanguage(value: string | undefined | null): value is Language {
  return value === 'en' || value === 'fr'
}

/** True for any tag in the French family ('fr', 'fr-BE', 'FR-ca'…). */
export function isFrenchTag(tag: string): boolean {
  const normalized = tag.trim().toLowerCase()
  return FRENCH_PREFIXES.some((prefix) => normalized.startsWith(prefix.toLowerCase()))
}

/**
 * Pick a language from an Accept-Language header, honouring quality values so
 * `en;q=0.9,fr;q=1.0` resolves to French. Defaults to English.
 */
export function languageFromAcceptHeader(header: string | null | undefined): Language {
  if (!header) return 'en'

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2)
      const quality = q === undefined ? 1 : Number.parseFloat(q)
      return { tag: tag.trim(), quality: Number.isNaN(quality) ? 0 : quality }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of preferred) {
    if (isFrenchTag(tag)) return 'fr'
    if (tag.trim().toLowerCase().startsWith('en')) return 'en'
  }

  return 'en'
}

/** The cookie wins when present; otherwise fall back to the browser's header. */
export function resolveLanguage(
  cookieValue: string | undefined | null,
  acceptLanguage: string | null | undefined
): Language {
  if (isLanguage(cookieValue)) return cookieValue
  return languageFromAcceptHeader(acceptLanguage)
}
