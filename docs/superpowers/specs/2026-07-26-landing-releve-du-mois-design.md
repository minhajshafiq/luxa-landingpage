# Luxa landing — « le relevé du mois »

Date : 2026-07-26
Périmètre : refonte structurelle de la page d'accueil. La palette (alignée sur
`luxa/src/core/theme/colors.ts`) et les primitives visuelles (`.luxa-hairline`,
`.luxa-card`, `.luxa-meter`, `.luxa-cta`) sont conservées. Ce qui change, c'est
la grammaire de mise en page et la séquence des blocs.

## Problème

La page n'a pas un problème de finition, elle a un problème de gabarit. Les
douze sections utilisent toutes la même armature :

```
puce ✦ centrée → titre display centré (un mot en lilas) → paragraphe muted
centré → grille de 3 cartes / 2 colonnes avec téléphone / accordéon
```

Répétée douze fois, cette armature est le squelette de n'importe quelle landing
SaaS. Rien dans la mise en page ne pourrait exister uniquement pour une app de
budget : remplacer « pockets » par « dashboards » laisserait le layout intact.
C'est ce qui la fait lire comme générée.

La copie française, elle, n'est pas en cause — elle est spécifique et a une voix.

## Contraintes retenues

Issues du cadrage avec Minhaj :

1. **Liberté totale sur la structure et la copie.** Fusion, réordonnancement et
   suppression autorisés ; la copie neuve est soumise avant d'entrer dans les
   locales.
2. **Chaque bloc explique une fonctionnalité ou fait convertir.** Aucun bloc
   décoratif. C'est le filtre d'arbitrage principal.
3. **Doit sonner écrit par un humain.**
4. **Trafic mixte, sans dominante.** La page doit se lire à deux vitesses : un
   survol rapide qui raconte toute l'histoire, et une lecture profonde
   disponible sans encombrer ce survol.
5. **App de finances personnelles**, pas une banque — le « sans connexion
   bancaire » reste un argument différenciant, pas une gêne.
6. **Hameçon : les abonnements** (validé par la traction de SubFlow sur X).
   **Colonne vertébrale : les pockets 50/30/20.** **Stella : une voix, pas une
   section.**

## Direction retenue

Croisement de deux des trois directions maquettées : la grammaire du **relevé
annoté** portant la séquence d'**un mois**.

> Un relevé qu'on lit du 1er au 31, annoté par Stella dans la marge.
> Froid à gauche, humain à droite — ce que fait le produit : prendre une ligne
> bancaire brute et la traduire.

La troisième direction (grille 50/30/20 imposée à toute la page) est écartée
comme système global — une colonne à 20 % ne peut rien contenir d'autre qu'une
note, et le dispositif disparaît sur mobile. Elle est **conservée pour une seule
section**, le jour 01, où elle devient un moment spectaculaire au lieu d'un
carcan.

## La grammaire

### Grille (≥ 1100 px)

```
132px            620px max                        260px
┌──────────┐│┌──────────────────────────┐   ┌──────────────┐
│  08 JUIL.│││ Tu paies 1 276 € par mois │   │ STELLA       │
│−1 276,00 │││ sans y penser.            │   │ 3 abos se    │
│prélèvts  │││                           │   │ renouvellent │
└──────────┘││ [contenu de la section]   │   │ avant vendr. │
            ││                           │   └──────────────┘
   gouttière ↑ colonne principale             marge
    (mono)   │  (fer à gauche)                (Stella)
             │
        la ligne continue
```

- **Gouttière** — mono, fer à droite contre le filet. Porte un jour du mois, un
  montant, un micro-libellé.
- **Filet** — une seule ligne verticale continue du bas du hero jusqu'à la
  césure. Pas une bordure par section : un nœud par entrée. C'est ce qui fait un
  document plutôt que des blocs empilés.
- **Colonne principale** — fer à gauche, max ~620 px (≈ 68 caractères).
- **Marge** — annotations de Stella, filet corail à gauche.

### Règle non négociable sur la gouttière

La gouttière porte de l'information vraie. Un montant qui signifie réellement
quelque chose pour la section. **Si aucun montant honnête n'existe pour un bloc,
il n'a pas de gouttière** — pas de numérotation 01/02/03 décorative pour
remplir. La structure encode le contenu, elle ne le décore pas.

### Ce que la grammaire supprime par construction

Puce centrée, titre centré, paragraphe centré. Tout est fer à gauche contre le
filet. Le gabarit générique disparaît structurellement, pas par discipline.

### Parcours de survol

La gouttière seule. `08 JUIL. −1 276,00` → `01 JUIL. 3 305,00` →
`17 JUIL. +18 %` raconte la page sans lire une phrase. C'est la réponse à la
contrainte 4.

### Responsive

| Largeur | Comportement |
|---|---|
| ≥ 1100 px | Trois colonnes complètes. |
| 760–1099 px | Deux colonnes. La marge rentre dans la colonne principale, gardant son filet corail. |
| < 760 px | Une colonne. La gouttière bascule en tampon horizontal au-dessus de chaque bloc ; les annotations passent en ligne sous le bloc concerné. |

Tampon mobile :

```
─── 08 JUIL. ································· −1 276,00 €

Tu paies 1 276 € par mois
sans y penser.

[contenu]

│ STELLA — 3 abonnements se renouvellent avant vendredi.
```

### Risque assumé

La direction est austère. Une page de finances perso qui ressemble à un relevé
est cohérente mais peut devenir froide. **La marge Stella est le contrepoids et
n'est pas optionnelle** : si on la retire, la direction s'effondre.

### Portée de la marge

La marge Stella appartient à l'acte I. L'acte II n'a ni gouttière ni marge : la
mascotte y reste présente mais en illustration ponctuelle (FAQ, CTA final),
comme aujourd'hui. La règle « Stella est une voix, pas une section » vaut pour
toute la page ; c'est le dispositif de marge qui s'arrête à la césure.

## La séquence — deux actes

Le mois ne peut pas tout porter : les tarifs, la confidentialité et la FAQ n'ont
pas de jour. Plutôt que de forcer, la page est coupée franchement.

### Hero — hors du mois

Porte le choc : **−1 276 €**. Pas de gouttière, il précède le relevé. Un seul
`<h1>`.

### Acte I — le mois (démonstration produit)

| Gouttière | Bloc |
|---|---|
| `01 JUIL. · 3 305,00 · entrée` | Le salaire arrive et se répartit en trois pockets. **Seul emplacement de la grille 50/30/20** : les trois colonnes font littéralement 50 %, 30 % et 20 % de large. Récupère la chorégraphie épinglée existante de `Disperse`. |
| `03 JUIL. · 4 pages · relevé lu` | Import du relevé PDF. Rend le « sans connexion bancaire » crédible. Le plus court des sept blocs. |
| `08 JUIL. · −1 276,00 · prélèvements` | Les abonnements tombent. Le chiffre du hero, expliqué. |
| `12 JUIL. · 64,20 · traduit` | `CB CARREFOUR 64,20` → `Courses · budget tenu à 87 %`. Reprend `Difference`. |
| `17 JUIL. · +18 % · restos` | **Stella prend la parole et la marge devient la page.** Seule inversion structurelle de la page, donc elle compte. |
| `28 JUIL. · 62,96 · reste à dépenser` | Reste à dépenser, santé du budget, statistiques. |
| `31 JUIL. · +471,89 · lisible` | Le mois est lu. Premier CTA naturel. |

### La césure

« Fin du mois. » Le filet s'arrête net. Rupture visuelle explicite.

### Acte II — la décision (conversion, sans gouttière ni dates)

1. **Sans connexion bancaire** — fusion de `Privacy` et des arguments de
   confiance. Lève une objection, donc convertit.
2. **Tarifs**
3. **FAQ**
4. **Télécharger**

## Sections supprimées ou fusionnées

| Section actuelle | Devient |
|---|---|
| `ProductProof` (4 badges) | Dissoute. Quatre pastilles génériques n'expliquent rien et convertissent mal. Les arguments partent dans l'acte II. |
| `AppTour` (3 étapes numérotées, téléphone collant) | Dissoute dans les jours 01 et 28. Le tour en étapes numérotées est lui-même un cliché de landing SaaS. |
| `Benefits` (4 capacités) | Dissoute. Les 4 items se redistribuent au jour où ils servent. |
| `Stella` (section dédiée) | Devient la marge sur toute la page + l'inversion du jour 17. |
| `Disperse` | Devient le jour 01. La chorégraphie épinglée est conservée. |
| `Subscriptions` | Devient le jour 08. |
| `Difference` | Devient le jour 12. |
| `Privacy` | Fusionne dans « sans connexion bancaire » (acte II). |
| `Pricing`, `FAQ`, `FinalCTA` | Conservées, acte II, sans gouttière. |

**Bilan : 12 sections → hero + 7 jours + césure + 4 blocs de décision.**

## Décisions prises par défaut (à confirmer en relecture)

Ces deux points ont été posés à Minhaj sans réponse explicite ; voici les choix
retenus, faciles à inverser.

1. **Dates avec mois abrégé (`08 JUIL.`) plutôt que `JOUR 08`.** Un relevé porte
   des dates réelles ; `JOUR 08` sonne tutoriel. Traduction triviale en `08 JUL.`
   pour la locale anglaise.
2. **Le jour 03 (import PDF) est conservé**, en bloc le plus court des sept. Si
   les données d'usage montrent que peu de gens importent un relevé, c'est le
   premier bloc à couper — il porte la crédibilité du « sans connexion
   bancaire », pas une fonctionnalité très utilisée.

## Copie neuve à produire

Soumise à validation avant d'entrer dans `src/locales/{fr,en}.json` :

- 7 libellés de jour (titre + corps).
- Le bloc import PDF (jour 03), aujourd'hui quasi absent de la page.
- 7 annotations Stella pour la marge (4 réutilisables existent dans les locales).
- Le libellé de césure.

Contrainte de ton : écrit par un humain. Montants et marchands concrets, idiome
français, pas de superlatif marketing.

## Référencement

La hiérarchie reste sémantique : un `<h1>` au hero, un `<h2>` par jour et par
bloc de l'acte II. Les mots-clés (« application budget », « méthode 50/30/20 »,
« abonnements », « sans connexion bancaire ») atterrissent dans de vrais titres
plutôt que dans des puces décoratives. Les métadonnées, le JSON-LD
`SoftwareApplication` et l'image OG existants sont conservés.

## Portée technique

**Conservé :** palette et tokens, `.luxa-hairline` / `.luxa-card` / `.luxa-meter`
/ `.luxa-cta` / `.luxa-ghost`, le vocabulaire de rayons (8/16/24/pill), le moteur
de révélation `ScrollAnimations`, la chorégraphie épinglée de `Disperse`, le
loader, l'i18n, `PhoneFrame`, `StellaMascot`.

**Remplacé :** `components/design-system/Section.tsx` cède la place à une
primitive de relevé (gouttière + filet + marge). `SectionHeading` disparaît —
c'est le composant qui portait le gabarit générique.

**Nouveau :** un composant d'entrée de relevé, un composant d'annotation Stella,
et la grille 50/30/20 du jour 01.

## Critères de réussite

1. Aucune section ne partage l'armature puce/titre/paragraphe centrés.
2. La gouttière seule raconte l'histoire de la page.
3. Chaque bloc explique une fonctionnalité ou lève une objection ; aucun bloc
   décoratif.
4. Le dispositif se replie sur mobile sans disparaître.
5. `npx tsc --noEmit`, `npm run lint` et `npm run build` passent.
6. Vérification visuelle par captures en 1440 px et 390 px avant livraison.
