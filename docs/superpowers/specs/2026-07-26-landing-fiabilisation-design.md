# Luxa landing — fiabilisation et crédibilité

Date : 2026-07-26
Périmètre choisi : fiabiliser et polir. La direction artistique (nuit/lavande,
typo Bricolage + Jakarta, narration en chapitres) est conservée.

## Problème

La landing ne souffre pas d'un problème de goût mais de fiabilité et de
crédibilité :

1. `pnpm build` échoue (erreur TypeScript) — le site n'est pas déployable.
2. Le HTML servi contient `<html lang="fr">` avec un `<h1>` en anglais.
3. Aucune image OG — un lien partagé s'affiche vide.
4. ~5 Mo de captures PNG, dont une de 851 Ko en `priority`.
5. Une note « 5.0 · App Store » nue, répétée 3 fois, sur un produit financier.
6. Du contenu mort dans `constants/site.ts` qui contredit le discours de la page.

## Décisions

### Note App Store

Le produit a 2 avis 5 étoiles. Une note sourcée « 5,0 · 2 avis » est honnête
mais contre-productive : elle signale l'absence d'usage plutôt que la qualité.
Une note nue est pire — elle lit comme fabriquée.

**Décision :** retirer le badge de note des trois emplacements. La barre de
preuve porte à la place les arguments déjà vrais et vérifiables — gratuit,
aucune connexion bancaire, données privées — plus un lien explicite vers la
fiche App Store.

`SHOW_RATING` et `APP_STORE_RATING` restent dans `constants/site.ts` pour une
réactivation d'un booléen vers ~20 avis.

### Langue

La cause racine est que `LanguageContext` s'initialise à `'en'` puis corrige
après montage : le HTML sort donc en anglais, sous un `lang` codé en dur à
`"fr"`.

**Décision :** persister la langue en cookie et la lire dans le layout serveur,
pour que le HTML soit servi dans la bonne langue avec le bon `lang` dès la
première réponse. Un refactor complet en routes `[locale]` est hors périmètre.

### Ce qui n'est pas touché

Palette, typographie, structure narrative, et les animations GSAP signature
(`Disperse`, le dive du Hero). Elles fonctionnent.

## Lots

| # | Lot | Contenu |
|---|-----|---------|
| 1 | Build | `luxa-loader.tsx:317` ; `pnpm-workspace.yaml` (`allowBuilds`) ; script `typecheck` |
| 2 | Crédibilité | Retrait de la note ; purge de `site.ts` ; nouvelle barre de preuve |
| 3 | Langue | Cookie + lecture serveur + `lang` correct |
| 4 | SEO | `metadataBase`, image OG, `sitemap.ts`, `robots.ts`, `not-found.tsx`, JSON-LD `SoftwareApplication` |
| 5 | Performance | PNG → WebP ; `AppTour` : `setInterval` → rAF + IntersectionObserver, garde mobile réactive au resize |
| 6 | Rythme | Échelle d'espacement à deux valeurs au lieu de `py-24`/`py-28`/`py-32` mélangés |

## Vérification

`pnpm typecheck`, `pnpm lint` et `pnpm build` passent. Le HTML servi est
contrôlé au `curl` : `lang` cohérent avec le contenu, `og:image` présent.
