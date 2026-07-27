# Landing « le relevé du mois » — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le gabarit générique (puce ✦ / titre centré / paragraphe centré × 12) par une grammaire de relevé bancaire annoté, séquencée sur un mois.

**Architecture :** Deux actes. L'acte I est un relevé : une grille à trois colonnes (gouttière mono, colonne principale fer à gauche, marge Stella) traversée par un filet vertical continu, avec sept entrées datées du 1er au 31. L'acte II abandonne la gouttière et redevient des sections classiques pour la conversion. Les primitives visuelles existantes (`.luxa-hairline`, `.luxa-card`, `.luxa-meter`, `.luxa-cta`) et la palette alignée sur l'app sont conservées telles quelles.

**Tech Stack :** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 (pas de fichier de config — tout est dans `@theme inline` de `globals.css`), GSAP + ScrollTrigger, framer-motion, i18n maison (`src/lib/i18n`).

## Global Constraints

- **Spec de référence :** `docs/superpowers/specs/2026-07-26-landing-releve-du-mois-design.md`. En cas de contradiction, la spec gagne.
- **Palette :** aucune couleur nouvelle. Uniquement les tokens de `globals.css`, eux-mêmes copiés de `luxa/src/core/theme/colors.ts`. Ne jamais écrire un hex en dur dans un composant.
- **Rayons :** uniquement `rounded-tag` (8), `rounded-tile` (16), `rounded-card` (24), `rounded-button` (24), `rounded-full`. Toute autre valeur est un bug.
- **Aucun titre, paragraphe ou puce centré dans l'acte I.** Tout est fer à gauche contre le filet. C'est le cœur de la refonte.
- **La gouttière ne porte que de l'information vraie.** Un montant qui signifie quelque chose pour le bloc. Jamais de numérotation 01/02/03 décorative.
- **i18n :** toute chaîne visible passe par `useTranslation()` et existe dans `fr.json` **et** `en.json`. Aucun texte en dur dans le JSX.
- **Pas de framework de test dans ce projet.** La barrière de qualité est `npx tsc --noEmit` + `npm run lint` + `npm run build` + une assertion visuelle mesurée (voir Tâche 0).
- **Mouvement :** tout effet respecte `prefers-reduced-motion` via `prefersReducedMotion()` de `@/lib/motion`.
- **Jamais `font-family: var(--font-mono)` en CSS brut.** Tailwind v4 n'émet pas cette custom property (elle est inlinée dans les utilitaires). Utiliser la classe `font-mono`. Toute règle CSS qui la référence tombe silencieusement en sans-serif.
- **Un seul vocabulaire de points de rupture : celui de Tailwind.** `md` (768px) et `xl` (1280px), rien d'autre. Écrire une media query à une valeur intermédiaire (1100px, 760px…) pendant qu'un composant utilise `md:`/`xl:` crée une bande de largeurs où CSS et JSX se contredisent — c'est exactement le bug trouvé en relecture de la tâche 2, qui laissait une colonne vide entre 1100 et 1279px.
- **Le serveur de dev tourne déjà** sur `http://localhost:3000`. S'il est arrêté : `npm run dev`.

---

### Task 0: Harnais de vérification visuelle

Sans ce harnais, aucune tâche suivante n'est vérifiable. Il vit dans le scratchpad, hors du dépôt — on n'ajoute pas d'outillage au projet.

**Files:**
- Create: `<scratchpad>/probe.mjs` (hors dépôt)

**Interfaces:**
- Produces: `node probe.mjs <largeur> <selecteur-json>` imprime un JSON des mesures. Utilisé par toutes les tâches suivantes.

- [ ] **Step 1: Vérifier que puppeteer est disponible**

```bash
cd "$SCRATCHPAD" && node -e "import('puppeteer').then(()=>console.log('ok'))"
```

Attendu : `ok`. Sinon : `npm i puppeteer && npx puppeteer browsers install chrome`.

- [ ] **Step 2: Écrire la sonde**

```js
// probe.mjs — mesure le DOM rendu et imprime un JSON.
// Usage: node probe.mjs 1440 '[".luxa-statement",".stmt-entry"]'
import puppeteer from 'puppeteer'

const width = Number(process.argv[2] ?? 1440)
const selectors = JSON.parse(process.argv[3] ?? '[]')

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width, height: 900 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 5000)) // laisse passer le loader + GSAP

const out = await page.evaluate((sels) => {
  const res = {}
  for (const sel of sels) {
    res[sel] = Array.from(document.querySelectorAll(sel)).map((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height),
        textAlign: cs.textAlign,
        gridTemplateColumns: cs.gridTemplateColumns,
        fontFamily: cs.fontFamily.split(',')[0],
      }
    })
  }
  // vocabulaire de rayons, pour surveiller la dérive
  const radii = {}
  document.querySelectorAll('*').forEach((el) => {
    const n = parseFloat(getComputedStyle(el).borderTopLeftRadius)
    if (!n || n > 400) return
    if (el.getBoundingClientRect().width < 24) return
    radii[Math.round(n)] = (radii[Math.round(n)] ?? 0) + 1
  })
  res._radii = radii
  res._centered = document.querySelectorAll('main [style*="center"], main .text-center').length
  return res
}, selectors)

console.log(JSON.stringify(out, null, 1))
await browser.close()
```

- [ ] **Step 3: Vérifier la sonde sur la page actuelle**

```bash
cd "$SCRATCHPAD" && node probe.mjs 1440 '["main section"]'
```

Attendu : un JSON listant 12 sections de largeur 1440. C'est la ligne de base d'avant refonte.

- [ ] **Step 4: Commit — rien à committer**

Le harnais est hors dépôt. Aucun commit pour cette tâche.

---

### Task 1: La copie française et anglaise des sept jours

**Gate utilisateur :** Minhaj a demandé à valider la copie française avant tout code. Ne pas enchaîner sur la Tâche 2 sans son accord explicite.

**Files:**
- Modify: `src/locales/fr.json`
- Modify: `src/locales/en.json`

**Interfaces:**
- Produces: la clé racine `month` (7 entrées `d01, d03, d08, d12, d17, d28, d31`), la clé `close`, et la clé `trust`. Chaque jour a la forme `{ stamp, amount, tag, title, body, note? }`. Toutes les tâches suivantes lisent ces clés.

- [ ] **Step 1: Ajouter la clé `month` dans `fr.json`**

À la racine de l'objet, à côté de `hero` :

```json
"month": {
  "d01": {
    "stamp": "01 juil.", "amount": "3 305,00", "tag": "entrée",
    "title": "Le 1er, ton salaire arrive. Il a déjà sa place.",
    "body": "Luxa le découpe en trois : ce que tu dois payer, ce qui te fait plaisir, ce que tu gardes. C'est la méthode 50/30/20 — et tu changes les proportions quand tu veux.",
    "note": "Ton loyer tombe le 5. J'ai gardé 980 € dans Besoins."
  },
  "d03": {
    "stamp": "03 juil.", "amount": "4 pages", "tag": "relevé lu",
    "title": "Tu déposes ton relevé PDF. Luxa le lit.",
    "body": "Pas de connexion bancaire, aucun identifiant à donner. Tu exportes ton relevé depuis ta banque, tu le déposes ici, et chaque ligne est classée en quelques secondes.",
    "note": "128 opérations lues. J'en ai classé 124 toute seule."
  },
  "d08": {
    "stamp": "08 juil.", "amount": "−1 276,00", "tag": "prélèvements",
    "title": "Le 8, six prélèvements tombent. Tu en avais oublié la moitié.",
    "body": "Netflix, la salle, la box, l'assurance, le cloud, l'appli de sport de janvier. Chacun est petit. Ensemble, ils pèsent plus que tes courses.",
    "note": "3 se renouvellent avant vendredi. Environ 49 € à prévoir."
  },
  "d12": {
    "stamp": "12 juil.", "amount": "64,20", "tag": "traduit",
    "title": "Ta banque écrit CB CARREFOUR 64,20. Luxa écrit ce que ça veut dire.",
    "body": "Une ligne de relevé ne t'apprend rien. Luxa la range dans un pocket, la compare à ton mois, et te dit si tu es dans les clous.",
    "note": "Courses : 87 % du budget tenu. Tu peux souffler."
  },
  "d17": {
    "stamp": "17 juil.", "amount": "+18 %", "tag": "restos",
    "title": "Les restos montent de 18 % cette semaine.",
    "body": "Ce n'est pas une alerte. C'est une phrase, au moment où tu peux encore décider — le 17, pas le 30. Stella regarde ton mois et te dit ce qui change, sans jargon et sans te faire la morale."
  },
  "d28": {
    "stamp": "28 juil.", "amount": "62,96", "tag": "reste à dépenser",
    "title": "Le 28, la question n'est plus où est parti l'argent. C'est ce qu'il te reste.",
    "body": "62,96 € dans Envies, 255 € dans Besoins. Tu sais si tu peux dire oui au resto de vendredi.",
    "note": "À ce rythme, tu finis le mois à +471 €."
  },
  "d31": {
    "stamp": "31 juil.", "amount": "+471,89", "tag": "lisible",
    "title": "Fin du mois. Pour la première fois, tu sais où il est passé.",
    "body": "Pas de tableur, pas de rappel à noter, pas de culpabilité. Juste un mois que tu peux lire."
  }
},
"close": { "label": "Fin du mois." },
"trust": {
  "title": "Luxa ne touche jamais à ton argent.",
  "body": "Aucune connexion à ta banque, aucun identifiant, aucune revente de données. Tu importes ce que tu veux, quand tu veux, et tout reste chiffré sur une infrastructure européenne."
},
```

- [ ] **Step 2: Réécrire le hero dans `fr.json` autour de l'accroche abonnements**

Remplacer les valeurs de `hero.title`, `hero.titleHighlight` et `hero.subtitle` :

```json
"title": "Tu paies 1 276 € d'abonnements par mois.",
"titleHighlight": "Tu en connais trois.",
"subtitle": "Luxa lit ton relevé, retrouve tout ce qui se prélève en silence, et range le reste de ton budget. Sans connexion bancaire.",
```

- [ ] **Step 3: Ajouter les mêmes clés dans `en.json`**

```json
"month": {
  "d01": {
    "stamp": "Jul 01", "amount": "3,305.00", "tag": "income",
    "title": "On the 1st your pay lands. It already has a place.",
    "body": "Luxa splits it three ways: what you owe, what you enjoy, what you keep. That's the 50/30/20 method — and you can move the proportions whenever you like.",
    "note": "Rent goes out on the 5th. I've held 980 € in Needs."
  },
  "d03": {
    "stamp": "Jul 03", "amount": "4 pages", "tag": "statement read",
    "title": "You drop in your PDF statement. Luxa reads it.",
    "body": "No bank connection, no credentials to hand over. Export your statement from your bank, drop it here, and every line is sorted in seconds.",
    "note": "128 transactions read. I sorted 124 on my own."
  },
  "d08": {
    "stamp": "Jul 08", "amount": "−1,276.00", "tag": "direct debits",
    "title": "On the 8th six debits land. You'd forgotten half of them.",
    "body": "Netflix, the gym, broadband, insurance, cloud storage, that fitness app from January. Each one is small. Together they cost more than your groceries.",
    "note": "3 renew before Friday. Around 49 € to plan for."
  },
  "d12": {
    "stamp": "Jul 12", "amount": "64.20", "tag": "translated",
    "title": "Your bank writes CB CARREFOUR 64.20. Luxa writes what it means.",
    "body": "A statement line teaches you nothing. Luxa files it in a pocket, weighs it against your month, and tells you whether you're on track.",
    "note": "Groceries: 87 % of budget held. You can breathe."
  },
  "d17": {
    "stamp": "Jul 17", "amount": "+18 %", "tag": "eating out",
    "title": "Eating out is up 18 % this week.",
    "body": "It isn't an alert. It's one sentence, at the moment you can still decide — the 17th, not the 30th. Stella watches your month and tells you what changed, without jargon and without lecturing you."
  },
  "d28": {
    "stamp": "Jul 28", "amount": "62.96", "tag": "left to spend",
    "title": "By the 28th the question isn't where the money went. It's what's left.",
    "body": "62.96 € in Wants, 255 € in Needs. You know whether you can say yes to dinner on Friday.",
    "note": "At this pace you finish the month at +471 €."
  },
  "d31": {
    "stamp": "Jul 31", "amount": "+471.89", "tag": "readable",
    "title": "End of the month. For once, you know where it went.",
    "body": "No spreadsheet, no reminder to set, no guilt. Just a month you can read."
  }
},
"close": { "label": "End of the month." },
"trust": {
  "title": "Luxa never touches your money.",
  "body": "No bank connection, no credentials, no data resold. You import what you want, when you want, and everything stays encrypted on European infrastructure."
},
```

Et le hero :

```json
"title": "You pay 1,276 € a month in subscriptions.",
"titleHighlight": "You can name three.",
"subtitle": "Luxa reads your statement, finds everything that quietly bills you, and files the rest of your budget. No bank connection.",
```

- [ ] **Step 4: Vérifier que les deux locales ont exactement les mêmes clés**

```bash
cd /Users/minhaj/Developer/personal/luxa-landingpage && node -e "
const a=require('./src/locales/fr.json'), b=require('./src/locales/en.json');
const keys=(o,p='')=>Object.entries(o).flatMap(([k,v])=>
  v&&typeof v==='object'&&!Array.isArray(v)?keys(v,p+k+'.'):[p+k]);
const A=new Set(keys(a)), B=new Set(keys(b));
const only=(x,y)=>[...x].filter(k=>!y.has(k));
console.log('fr seulement:',only(A,B));
console.log('en seulement:',only(B,A));
"
```

Attendu : deux tableaux vides.

- [ ] **Step 5: Vérifier le typage i18n**

```bash
npx tsc --noEmit
```

Attendu : aucune sortie.

- [ ] **Step 6: STOP — faire valider la copie française par Minhaj**

Lui montrer les sept titres et les six notes de Stella. Ne pas committer ni continuer avant son accord. S'il demande des retouches, les appliquer et refaire l'étape 4.

- [ ] **Step 7: Commit**

```bash
git add src/locales/fr.json src/locales/en.json
git commit -m "feat(copy): add month narrative copy for statement layout"
```

---

### Task 2: Les primitives du relevé

Le cœur de la refonte. Tout le reste en dépend.

**Files:**
- Create: `src/components/statement/Statement.tsx`
- Create: `src/components/statement/StatementEntry.tsx`
- Create: `src/components/statement/StellaNote.tsx`
- Modify: `src/app/globals.css` (ajout d'un bloc `Relevé`)

**Interfaces:**
- Produces:
  - `<Statement>{children}</Statement>` — conteneur de l'acte I, porte le filet vertical continu.
  - `<StatementEntry stamp amount tag title body tone? note? children?>` — une entrée datée. `tone` ∈ `'out' | 'in' | 'neutral'` colore le montant (danger / épargne / lilas). `note` rend une `<StellaNote>` dans la marge. `children` est le contenu riche sous le corps de texte.
  - `<StellaNote>{text}</StellaNote>` — annotation corail.

- [ ] **Step 1: Ajouter le CSS du relevé dans `globals.css`**

À la fin du fichier, après le bloc des barres de pocket :

```css
/* ------------------------------------------------------------
   Le relevé — la grammaire de l'acte I
   Trois colonnes : gouttière mono / colonne principale / marge Stella.
   Un seul filet vertical traverse toute la pile d'entrées : c'est lui
   qui fait un document plutôt que des blocs empilés.
   ------------------------------------------------------------ */
.luxa-statement {
  position: relative;
}

/* Le filet. Il vit sur le conteneur, pas sur les entrées, pour rester
   continu d'un bout à l'autre de l'acte I. */
@media (min-width: 768px) {
  .luxa-statement::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--stmt-gutter);
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      hsl(var(--foreground) / 0.16) 4%,
      hsl(var(--foreground) / 0.16) 96%,
      transparent
    );
    pointer-events: none;
  }
}

.luxa-statement {
  --stmt-gutter: 132px;
  --stmt-margin: 260px;
}

.stmt-entry {
  display: grid;
  gap: 24px;
  padding: 56px 0;
  grid-template-columns: 1fr;
}
.stmt-entry + .stmt-entry {
  border-top: 1px solid hsl(var(--foreground) / 0.07);
}

@media (min-width: 768px) {
  .stmt-entry {
    grid-template-columns: var(--stmt-gutter) minmax(0, 1fr);
    column-gap: 40px;
  }
}
@media (min-width: 1280px) {
  .stmt-entry {
    grid-template-columns: var(--stmt-gutter) minmax(0, 1fr) var(--stmt-margin);
  }
}

/* Le nœud sur le filet, en face de chaque entrée. */
.stmt-node {
  display: none;
}
@media (min-width: 768px) {
  .stmt-node {
    display: block;
    position: absolute;
    left: var(--stmt-gutter);
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: hsl(var(--primary));
    transform: translate(-50%, 0);
    margin-top: 62px;
    box-shadow: 0 0 0 4px hsl(var(--background)), 0 0 14px hsl(var(--primary) / 0.8);
  }
}

/* --- Gouttière ------------------------------------------------- */
/* NOTE POLICE : ne pas écrire `font-family: var(--font-mono)` ici. Tailwind v4
   déclare `--font-mono` dans `@theme inline`, qui inline la valeur dans les
   utilitaires SANS émettre la custom property sur :root — la règle tomberait
   silencieusement en fallback sans-serif. Le monospace s'applique via la
   classe utilitaire `font-mono` dans les composants. */
.stmt-gutter {
  line-height: 1.6;
}
@media (min-width: 768px) {
  .stmt-gutter {
    text-align: right;
    padding-right: 18px;
  }
}
/* Sous 768px (md) la gouttière devient un tampon horizontal au-dessus du bloc. */
@media (max-width: 767px) {
  .stmt-gutter {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
  }
  .stmt-gutter::after {
    content: '';
    height: 1px;
    background: hsl(var(--foreground) / 0.14);
    order: 2;
  }
  .stmt-gutter .stmt-amount { order: 3; }
  .stmt-gutter .stmt-tag { display: none; }
}

.stmt-stamp {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground) / 0.75);
}
.stmt-amount {
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  margin-top: 6px;
}
@media (max-width: 767px) {
  .stmt-amount { margin-top: 0; }
}
.stmt-amount[data-tone='out'] { color: hsl(var(--destructive)); }
.stmt-amount[data-tone='in'] { color: hsl(var(--epargne)); }
.stmt-amount[data-tone='neutral'] { color: hsl(var(--primary)); }
.stmt-tag {
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground) / 0.55);
  margin-top: 10px;
}

/* --- Marge Stella ---------------------------------------------- */
.stmt-note {
  border-left: 2px solid hsl(var(--stella));
  padding-left: 14px;
}
.stmt-note-who {
  display: block;
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: hsl(var(--stella));
  margin-bottom: 6px;
}

/* --- La césure -------------------------------------------------- */
.stmt-close {
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
}
```

- [ ] **Step 2: Créer `StellaNote.tsx`**

```tsx
import { cn } from '@/lib/utils'

interface StellaNoteProps {
  children: React.ReactNode
  /** Libellé de la voix. Par défaut « Stella ». */
  who?: string
  className?: string
}

/**
 * L'annotation dans la marge. C'est le contrepoids humain du relevé : sans
 * elle la page devient un document comptable (voir la spec, « Risque assumé »).
 */
export function StellaNote({ children, who = 'Stella', className }: StellaNoteProps) {
  return (
    <aside className={cn('stmt-note', className)}>
      <span className="stmt-note-who font-mono">{who}</span>
      <p className="text-[13.5px] leading-relaxed text-muted-foreground">{children}</p>
    </aside>
  )
}
```

- [ ] **Step 3: Créer `Statement.tsx`**

```tsx
import { Container } from '@/components/design-system/Container'
import { cn } from '@/lib/utils'

interface StatementProps {
  children: React.ReactNode
  className?: string
}

/**
 * Le conteneur de l'acte I. Il possède le filet vertical continu — une seule
 * ligne du haut au bas du relevé, pas une bordure par entrée. C'est ce qui
 * fait lire la page comme un document plutôt que comme des blocs empilés.
 */
export function Statement({ children, className }: StatementProps) {
  return (
    <div className={cn('relative isolate overflow-x-clip', className)}>
      <Container>
        <div className="luxa-statement">{children}</div>
      </Container>
    </div>
  )
}
```

- [ ] **Step 4: Créer `StatementEntry.tsx`**

```tsx
import { StellaNote } from '@/components/statement/StellaNote'
import { cn } from '@/lib/utils'

export type EntryTone = 'out' | 'in' | 'neutral'

interface StatementEntryProps {
  /** Date affichée dans la gouttière, ex. « 08 juil. ». */
  stamp: string
  /** Montant de la gouttière. Doit être vrai pour ce bloc. */
  amount: string
  /** Micro-libellé sous le montant, ex. « prélèvements ». */
  tag: string
  title: string
  body: string
  tone?: EntryTone
  /** Annotation de Stella pour la marge. */
  note?: string
  /** Contenu riche sous le corps de texte. */
  children?: React.ReactNode
  id?: string
  className?: string
}

/**
 * Une entrée du relevé. La gouttière porte de l'information vraie — jamais un
 * numéro d'ordre décoratif. Rien n'est centré : tout est fer à gauche contre
 * le filet, ce qui rend le gabarit générique impossible par construction.
 */
export function StatementEntry({
  stamp,
  amount,
  tag,
  title,
  body,
  tone = 'neutral',
  note,
  children,
  id,
  className,
}: StatementEntryProps) {
  return (
    <section id={id} className={cn('stmt-entry relative', className)}>
      <span aria-hidden="true" className="stmt-node" />

      <div className="stmt-gutter font-mono">
        <div className="stmt-stamp">{stamp}</div>
        <div className="stmt-amount" data-tone={tone}>
          {amount}
        </div>
        <div className="stmt-tag">{tag}</div>
      </div>

      <div className="min-w-0">
        <h2 className="max-w-[19ch] font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance md:max-w-[24ch]">
          {title}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
          {body}
        </p>
        {children}

        {/* Sous 1280px (xl) la marge n'existe plus : la note revient dans le flux. */}
        {note && <StellaNote className="mt-7 max-w-[46ch] xl:hidden">{note}</StellaNote>}
      </div>

      {note && <StellaNote className="hidden xl:block">{note}</StellaNote>}
    </section>
  )
}
```

- [ ] **Step 5: Typecheck et lint**

```bash
npx tsc --noEmit && npm run lint
```

Attendu : aucune erreur. Les composants ne sont pas encore montés, c'est normal.

- [ ] **Step 6: Commit**

```bash
git add src/components/statement src/app/globals.css
git commit -m "feat(statement): add ledger grammar primitives"
```

---

### Task 3: Le hero réécrit autour de l'accroche abonnements

**Files:**
- Modify: `src/components/landing/Hero.tsx`

**Interfaces:**
- Consumes: `hero.title`, `hero.titleHighlight`, `hero.subtitle` réécrits en Tâche 1.
- Produces: rien — le hero reste hors du relevé, sans gouttière.

- [ ] **Step 1: Remplacer le titre par un affichage cadré sur le montant**

Dans le `<h1>` existant, remplacer le rendu mot-à-mot par un bloc où le montant domine. Garder les `span.word` : la chorégraphie d'entrée GSAP les cible.

```tsx
<h1
  ref={titleRef}
  className="mx-auto max-w-[16ch] font-display text-[clamp(2.6rem,7.2vw,5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground"
>
  {titleWords.map((word, index) => (
    <span key={`title-${index}`}>
      <span className="word inline-block">{word}</span>{' '}
    </span>
  ))}
  <span className="block">
    {highlightWords.map((word, index) => (
      <span key={`highlight-${index}`}>
        <span className="word inline-block">
          <GradientText>{word}</GradientText>
        </span>
        {index < highlightWords.length - 1 && ' '}
      </span>
    ))}
  </span>
</h1>
```

- [ ] **Step 2: Retirer le filet de bas de hero ajouté précédemment**

Supprimer cette ligne — c'est le `Statement` qui portera désormais le filet :

```tsx
<div aria-hidden="true" className="luxa-rule absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1200px] px-4 opacity-70 sm:px-6 lg:px-8" />
```

- [ ] **Step 3: Vérifier visuellement**

```bash
cd "$SCRATCHPAD" && node probe.mjs 1440 '["main h1"]'
```

Attendu : un seul `h1`, largeur < 900px, et le texte contient « 1 276 € ».

- [ ] **Step 4: Typecheck, lint, build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "feat(hero): lead with the subscriptions hook"
```

---

### Task 4: Jour 01 — la grille 50/30/20 et le vol des dépenses

Le seul emplacement de la grille ratio, et le seul moment chorégraphié de l'acte I. Les dépenses éparpillées volent dans les trois colonnes — qui font littéralement 50 %, 30 % et 20 % de large.

**Décision : pas d'épinglage.** L'ancienne version de cette chorégraphie vivait dans une section de 100vh et devait être épinglée pour que la charge utile se joue à l'écran. Une entrée de relevé est compacte : tout le bloc tient dans le viewport, donc une timeline jouée une fois au bon déclenchement suffit. Épingler ici insérerait un pin-spacer entre `.luxa-statement` et `.stmt-entry`, ce qui casserait à la fois le sélecteur `.stmt-entry + .stmt-entry` (les bordures entre entrées) et la géométrie du filet continu.

**Files:**
- Create: `src/components/statement/RatioGrid.tsx`
- Create: `src/components/landing/DayIncome.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `StatementEntry` (Tâche 2), `AmountChip` (existant), clés `month.d01.*` et `disperse.chips` (Tâche 1).
- Produces: `<DayIncome />`, monté par la page en Tâche 8. `RatioGrid` rend les classes `.ratio-cell`, `.ratio-fill` et `.ratio-knob` que la timeline cible par `gsap.utils.toArray`.

- [ ] **Step 1: Ajouter le CSS de la grille ratio**

```css
/* La grille 50/30/20 — un seul emplacement sur toute la page (jour 01).
   Les colonnes font littéralement 50 %, 30 % et 20 % : la page enseigne la
   méthode avant qu'on en ait lu un mot. */
.ratio-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 28px;
}
@media (min-width: 700px) {
  .ratio-grid {
    grid-template-columns: 50fr 30fr 20fr;
    gap: 0;
  }
  .ratio-cell + .ratio-cell { padding-left: 20px; }
}
.ratio-cell {
  border-top: 2px solid;
  padding-top: 16px;
  padding-right: 20px;
}
.ratio-pct {
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: 1;
}

/* Le ciel : la zone d'où les dépenses partent. */
.ratio-sky {
  position: relative;
  height: 168px;
  margin-top: 30px;
  overflow: hidden;
}
@media (min-width: 700px) {
  .ratio-sky { height: 190px; }
}
```

- [ ] **Step 2: Créer `RatioGrid.tsx`**

```tsx
import { cn } from '@/lib/utils'

export type RatioSlice = {
  pct: string
  name: string
  detail: string
  /** Classe de couleur du pocket : text-besoins | text-envies | text-epargne */
  tone: string
  /** Remplissage cible de la barre, entre 0 et 1. */
  fill: number
}

interface RatioGridProps {
  slices: [RatioSlice, RatioSlice, RatioSlice]
  className?: string
}

/**
 * Les trois colonnes font 50 %, 30 % et 20 % de la largeur — la proportion
 * n'est pas illustrée, elle est la grille. Seul endroit de la page où ce
 * système apparaît ; imposé partout il deviendrait un carcan.
 *
 * Les classes `.ratio-cell`, `.ratio-fill` et `.ratio-knob` sont les cibles
 * de la chorégraphie de DayIncome — ne pas les renommer sans mettre la
 * timeline à jour.
 */
export function RatioGrid({ slices, className }: RatioGridProps) {
  return (
    <div className={cn('ratio-grid', className)}>
      {slices.map((slice) => (
        <div
          key={slice.name}
          className={cn('ratio-cell', slice.tone)}
          style={{ borderColor: 'currentColor' }}
        >
          <div className={cn('ratio-pct font-mono', slice.tone)}>{slice.pct}</div>
          <p className="mt-2 text-[15px] font-semibold text-foreground">{slice.name}</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{slice.detail}</p>
          <div className={cn('luxa-meter mt-4', slice.tone)}>
            <div className="ratio-fill luxa-meter-fill" style={{ width: 0 }} />
            <span aria-hidden="true" className="ratio-knob luxa-meter-knob" style={{ left: 0, opacity: 0 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Créer `DayIncome.tsx` avec la chorégraphie**

```tsx
'use client'

import { useRef } from 'react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { RatioGrid, type RatioSlice } from '@/components/statement/RatioGrid'
import { AmountChip } from '@/components/design-system/AmountChip'
import { gsap, ScrollTrigger, EASE, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = {
  stamp: string
  amount: string
  tag: string
  title: string
  body: string
  note: string
  slices: Array<{ name: string; detail: string }>
}
type Chip = { label: string; amount: string }

/** Position de départ de chaque dépense, et la colonne où elle atterrit.
 *  colonne 0 = besoins, 1 = envies, 2 = épargne. */
const chipLayout = [
  { className: 'left-[2%] top-[6%] md:left-[6%]', rotate: -8, column: 1 },
  { className: 'left-[52%] top-[2%] md:left-[62%]', rotate: 7, column: 1 },
  { className: 'left-[14%] top-[34%] md:left-[28%]', rotate: -4, column: 1 },
  { className: 'left-[56%] top-[38%] md:left-[80%]', rotate: 9, column: 0 },
  { className: 'left-[0%] top-[64%] md:left-[10%]', rotate: 5, column: 1 },
  { className: 'left-[50%] top-[68%] md:left-[54%]', rotate: -7, column: 0 },
  { className: 'left-[18%] top-[90%] md:left-[36%]', rotate: 4, column: 1 },
  { className: 'left-[58%] top-[92%] md:left-[72%]', rotate: -5, column: 0 },
]

const FILLS = [0.72, 0.55, 0.4] as const

export function DayIncome() {
  const rootRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const d = t('month.d01') as unknown as Day
  const chips = t('disperse.chips') as unknown as Chip[]

  // Le tri, joué une fois quand le bloc est réellement à l'écran. Pas de
  // scrub et pas de pin : l'entrée tient dans le viewport, donc la charge
  // utile se voit sans avoir à immobiliser la page.
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chipEls = gsap.utils.toArray<HTMLElement>('.income-chip')
      const cellEls = gsap.utils.toArray<HTMLElement>('.ratio-cell')
      const fillEls = gsap.utils.toArray<HTMLElement>('.ratio-fill')
      const knobEls = gsap.utils.toArray<HTMLElement>('.ratio-knob')
      if (!chipEls.length || !cellEls.length) return

      const fillPercent = (i: number) => `${(FILLS[i] ?? 0.5) * 100}%`

      if (prefersReducedMotion()) {
        gsap.set(chipEls, { opacity: 0.5 })
        gsap.set(fillEls, { width: (i: number) => fillPercent(i) })
        gsap.set(knobEls, { left: (i: number) => fillPercent(i), opacity: 1 })
        return
      }

      gsap.set(chipEls, { opacity: 0, scale: 0.75, y: 14 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: skyRef.current, start: 'top 72%', once: true },
        defaults: { ease: EASE.out },
      })

      // 1 — le mois arrive, une dépense à la fois.
      tl.to(chipEls, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.06 })
        .addLabel('flock', '+=0.45')

      // 2 — chaque dépense rejoint sa colonne.
      chipEls.forEach((chip, i) => {
        const target = cellEls[chipLayout[i]?.column ?? 0]
        if (!target) return
        tl.to(
          chip,
          {
            x: () => {
              const c = chip.getBoundingClientRect()
              const t = target.getBoundingClientRect()
              return t.left + t.width / 2 - (c.left + c.width / 2)
            },
            y: () => {
              const c = chip.getBoundingClientRect()
              const t = target.getBoundingClientRect()
              return t.top + 12 - c.top
            },
            rotate: 0,
            scale: 0.4,
            opacity: 0,
            duration: 0.55,
            ease: EASE.inOut,
          },
          `flock+=${i * 0.07}`
        )
      })

      // 3 — les barres se remplissent, le ciel vidé se referme.
      tl.to(fillEls, { width: (i: number) => fillPercent(i), duration: 0.6, stagger: 0.1 }, 'flock+=0.5')
        .to(knobEls, { left: (i: number) => fillPercent(i), opacity: 1, duration: 0.6, stagger: 0.1 }, 'flock+=0.5')
        .to(
          skyRef.current,
          {
            height: 0,
            marginTop: 0,
            duration: 0.5,
            ease: EASE.inOut,
            // La page vient de raccourcir : remesurer tout ce qui suit.
            onComplete: () => ScrollTrigger.refresh(),
          },
          'flock+=1.05'
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const slices: [RatioSlice, RatioSlice, RatioSlice] = [
    { pct: '50 %', name: d.slices?.[0]?.name ?? '', detail: d.slices?.[0]?.detail ?? '', tone: 'text-besoins', fill: FILLS[0] },
    { pct: '30 %', name: d.slices?.[1]?.name ?? '', detail: d.slices?.[1]?.detail ?? '', tone: 'text-envies', fill: FILLS[1] },
    { pct: '20 %', name: d.slices?.[2]?.name ?? '', detail: d.slices?.[2]?.detail ?? '', tone: 'text-epargne', fill: FILLS[2] },
  ]

  return (
    <div ref={rootRef}>
      <StatementEntry
        stamp={d.stamp}
        amount={d.amount}
        tag={d.tag}
        title={d.title}
        body={d.body}
        note={d.note}
        tone="neutral"
      >
        <div ref={skyRef} className="ratio-sky" aria-hidden="true">
          {Array.isArray(chips) &&
            chips.map((chip, index) => {
              const layout = chipLayout[index]
              if (!layout) return null
              return (
                <div
                  key={index}
                  className={cn('income-chip absolute will-change-transform', layout.className)}
                  style={{ transform: `rotate(${layout.rotate}deg)` }}
                >
                  <AmountChip label={chip.label} amount={chip.amount} muted />
                </div>
              )
            })}
        </div>

        <RatioGrid slices={slices} />
      </StatementEntry>
    </div>
  )
}
```

> `disperse.chips` compte 8 entrées et `chipLayout` en compte 8 : les deux doivent rester alignés. Si la locale change de longueur, les chips en trop ne sont pas rendues (`if (!layout) return null`), ce qui est le comportement voulu.

> `StatementEntry` est enveloppé dans un `<div ref>` parce que `gsap.context` a besoin d'un élément racine pour cadrer ses sélecteurs, et que `StatementEntry` ne transmet pas de ref. Ne pas transformer ce div en `<section>` : `StatementEntry` en rend déjà une.

- [ ] **Step 4: Vérifier que les colonnes font vraiment 50/30/20**

```bash
cd "$SCRATCHPAD" && node probe.mjs 1440 '[".ratio-grid",".ratio-cell"]'
```

Attendu : `gridTemplateColumns` de `.ratio-grid` avec trois valeurs dans un rapport 50/30/20 (±2 px après soustraction du padding).

- [ ] **Step 5: Vérifier que la chorégraphie se joue et se termine**

```bash
cd "$SCRATCHPAD" && node -e "
import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: 'new' })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 5000))
await p.evaluate(() => document.querySelector('.ratio-sky')?.scrollIntoView({ block: 'center' }))
await new Promise(r => setTimeout(r, 4000))
console.log(JSON.stringify(await p.evaluate(() => ({
  chipsInvisibles: [...document.querySelectorAll('.income-chip')].every(c => +getComputedStyle(c).opacity < 0.1),
  barres: [...document.querySelectorAll('.ratio-fill')].map(f => getComputedStyle(f).width),
  cielReferme: Math.round(document.querySelector('.ratio-sky')?.getBoundingClientRect().height ?? -1),
}))))
await b.close()
" --input-type=module
```

Attendu : `chipsInvisibles: true`, trois largeurs de barre non nulles et décroissantes, `cielReferme: 0`.

- [ ] **Step 6: Typecheck et lint**

```bash
npx tsc --noEmit && npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/components/statement/RatioGrid.tsx src/components/landing/DayIncome.tsx src/app/globals.css
git commit -m "feat(day-01): ratio grid where the columns are the method, and the sort choreography"
```


---

### Task 5: Jours 03 et 08

**Files:**
- Create: `src/components/landing/DayImport.tsx`
- Create: `src/components/landing/DaySubscriptions.tsx`
- Delete: `src/components/landing/Subscriptions.tsx`

**Interfaces:**
- Consumes: `StatementEntry`, clés `month.d03.*` et `month.d08.*`.
- Produces: `<DayImport />`, `<DaySubscriptions />`.

- [ ] **Step 1: Créer `DayImport.tsx`**

```tsx
'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string }

/** Le plus court des sept blocs : il porte la crédibilité du « sans connexion
 *  bancaire », pas une fonctionnalité très utilisée. */
export function DayImport() {
  const { t } = useTranslation()
  const d = t('month.d03') as unknown as Day

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      note={d.note}
      tone="neutral"
    >
      <div className="mt-7 flex items-center gap-4">
        <StellaMascot mood="reading" size="sm" floating />
        <div className="luxa-card luxa-hairline flex-1 rounded-tile px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            releve-juillet.pdf
          </p>
          <div className="luxa-meter mt-3 text-epargne">
            <div className="luxa-meter-fill" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </StatementEntry>
  )
}
```

- [ ] **Step 2: Créer `DaySubscriptions.tsx` en reprenant le compteur animé de l'ancienne section**

```tsx
'use client'

import { useRef } from 'react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string }

export function DaySubscriptions() {
  const totalRef = useRef<HTMLSpanElement>(null)
  const { t, language } = useTranslation()
  const d = t('month.d08') as unknown as Day
  const finalTotal = t('subs.total') as string

  // Le total grimpe depuis zéro à l'entrée dans le viewport — le même petit
  // choc que l'app te donne la première fois.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const el = totalRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const counter = { value: 0 }
      const formatter = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US')
      gsap.to(counter, {
        value: 1276,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `−${formatter.format(Math.round(counter.value))} €`
        },
        onComplete: () => {
          el.textContent = finalTotal
        },
      })
    })
    return () => ctx.revert()
  }, [finalTotal, language])

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      note={d.note}
      tone="out"
    >
      <div className="mt-8 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {t('subs.totalLabel') as string}
          </p>
          <p className="mt-3 flex items-baseline gap-2">
            <span
              ref={totalRef}
              className="font-display tabular text-[clamp(2.4rem,6vw,3.6rem)] font-bold tracking-[-0.03em] text-destructive [text-shadow:0_0_36px_hsl(var(--destructive)/0.5)]"
            >
              {finalTotal}
            </span>
            <span className="text-sm text-muted-foreground">{t('subs.perMonth') as string}</span>
          </p>
        </div>
        <div className="w-[190px] justify-self-start sm:justify-self-end">
          <PhoneFrame
            src="/subscriptions.png"
            alt="Luxa — dépenses récurrentes regroupées avec leur total mensuel"
            sizes="190px"
          />
        </div>
      </div>
    </StatementEntry>
  )
}
```

- [ ] **Step 3: Supprimer l'ancienne section**

```bash
git rm src/components/landing/Subscriptions.tsx
```

- [ ] **Step 4: Typecheck, lint**

```bash
npx tsc --noEmit && npm run lint
```

Attendu : une erreur dans `src/app/page.tsx` sur l'import de `Subscriptions` supprimé. C'est attendu — la page est recâblée en Tâche 8. Commenter temporairement l'import et l'usage pour que le typecheck passe.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/landing src/app/page.tsx
git commit -m "feat(day-03,day-08): statement import and the subscriptions reveal"
```

---

### Task 6: Jours 12 et 17

Le jour 17 est la seule inversion structurelle de la page : la marge devient la colonne principale.

**Files:**
- Create: `src/components/landing/DayTranslate.tsx`
- Create: `src/components/landing/DayStella.tsx`
- Delete: `src/components/landing/Difference.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `StatementEntry`, `difference.rows`, clés `month.d12.*` et `month.d17.*`.
- Produces: `<DayTranslate />`, `<DayStella />`.

- [ ] **Step 1: Ajouter le CSS de l'inversion**

```css
/* Jour 17 — l'inversion. La marge prend toute la page : la voix de Stella
   devient le contenu au lieu de le commenter. Seule fois où la structure se
   retourne, donc elle porte du sens. */
.stmt-entry--voice .stmt-gutter { opacity: 0.55; }
.stmt-entry--voice blockquote {
  border-left: 2px solid hsl(var(--stella));
  padding-left: clamp(18px, 3vw, 34px);
}
```

- [ ] **Step 2: Créer `DayTranslate.tsx`**

```tsx
'use client'

import { ArrowRight } from 'lucide-react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string }
type Row = { bank: string; luxa: string; tone: 'primary' | 'success' | 'warning' }

const toneText: Record<Row['tone'], string> = {
  primary: 'text-primary',
  success: 'text-epargne',
  warning: 'text-envies',
}

export function DayTranslate() {
  const { t } = useTranslation()
  const d = t('month.d12') as unknown as Day
  const rows = t('difference.rows') as unknown as Row[]

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      note={d.note}
      tone="out"
    >
      <div className="mt-8 space-y-2">
        {Array.isArray(rows) &&
          rows.map((row, index) => (
            <div
              key={index}
              className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4"
            >
              <div className="rounded-tile border border-border/70 bg-[repeating-linear-gradient(135deg,hsl(var(--foreground)/0.02)_0_6px,transparent_6px_12px)] px-4 py-3">
                <p className="truncate font-mono tabular text-xs text-muted-foreground">{row.bank}</p>
              </div>
              <ArrowRight aria-hidden="true" className="hidden h-4 w-4 text-muted-foreground/50 sm:block" />
              <div className="luxa-card luxa-hairline rounded-tile px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  <span className={cn('font-semibold', toneText[row.tone] ?? 'text-primary')}>
                    {row.luxa.split('·')[0]}
                  </span>
                  {row.luxa.includes('·') && (
                    <span className="text-muted-foreground">
                      {' ·'}
                      {row.luxa.split('·').slice(1).join('·')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>
    </StatementEntry>
  )
}
```

- [ ] **Step 3: Créer `DayStella.tsx`**

```tsx
'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string }

/**
 * L'inversion : partout ailleurs Stella écrit dans la marge, ici elle est le
 * bloc. Le titre est sa phrase, citée telle quelle.
 */
export function DayStella() {
  const { t } = useTranslation()
  const d = t('month.d17') as unknown as Day

  return (
    <StatementEntry
      className="stmt-entry--voice"
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title=""
      body=""
      tone="in"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <StellaMascot mood="thinking" size="md" floating className="shrink-0" />
        <blockquote>
          <p className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
            {d.title}
          </p>
          <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
            {d.body}
          </p>
        </blockquote>
      </div>
    </StatementEntry>
  )
}
```

> `title=""` et `body=""` laissent `StatementEntry` rendre un `h2` et un `p` vides. **Corriger `StatementEntry`** : rendre `title` et `body` optionnels et n'émettre les balises que si la valeur est non vide. Modifier la signature en `title?: string` / `body?: string` et entourer chaque bloc de `{title && (…)}` / `{body && (…)}`.

- [ ] **Step 4: Supprimer l'ancienne section**

```bash
git rm src/components/landing/Difference.tsx
```

- [ ] **Step 5: Vérifier qu'aucun `h2` vide n'est émis**

```bash
cd "$SCRATCHPAD" && node -e "
const p=await (await fetch('http://localhost:3000')).text();
console.log('h2 vides:', (p.match(/<h2[^>]*><\/h2>/g)||[]).length);
" --input-type=module
```

Attendu : `h2 vides: 0`.

- [ ] **Step 6: Typecheck, lint**

```bash
npx tsc --noEmit && npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add -A src/components src/app/globals.css
git commit -m "feat(day-12,day-17): translation rows and the voice inversion"
```

---

### Task 7: Jours 28 et 31, puis la césure

**Files:**
- Create: `src/components/landing/DayRemaining.tsx`
- Create: `src/components/landing/DayClose.tsx`
- Create: `src/components/statement/StatementClose.tsx`
- Delete: `src/components/landing/AppTour.tsx`
- Delete: `src/components/landing/Benefits.tsx`

**Interfaces:**
- Consumes: `StatementEntry`, clés `month.d28.*`, `month.d31.*`, `close.label`.
- Produces: `<DayRemaining />`, `<DayClose />`, `<StatementClose />`.

- [ ] **Step 1: Créer `DayRemaining.tsx`**

```tsx
'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string }

export function DayRemaining() {
  const { t } = useTranslation()
  const d = t('month.d28') as unknown as Day

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      note={d.note}
      tone="neutral"
    >
      <div className="mt-8 w-[220px]">
        <PhoneFrame
          src="/stats.png"
          alt="Luxa — statistiques : santé du budget, dépenses de la semaine, moyenne journalière"
          sizes="220px"
        />
      </div>
    </StatementEntry>
  )
}
```

- [ ] **Step 2: Créer `DayClose.tsx`**

```tsx
'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { AppStoreButtons } from '@/components/design-system/AppStoreButtons'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string }

/** Le soulagement, et le premier CTA naturel de la page. */
export function DayClose() {
  const { t } = useTranslation()
  const d = t('month.d31') as unknown as Day

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      tone="in"
    >
      <div className="mt-8">
        <AppStoreButtons
          downloadLabel={t('hero.ctaDownload') as string}
          androidLabel={t('hero.ctaAndroidBeta') as string}
          className="!justify-start"
        />
      </div>
    </StatementEntry>
  )
}
```

- [ ] **Step 3: Créer `StatementClose.tsx`**

```tsx
import { Container } from '@/components/design-system/Container'

/**
 * La césure. Le filet s'arrête net : le mois est fini, ce qui suit relève de
 * la décision, pas de la démonstration.
 */
export function StatementClose({ label }: { label: string }) {
  return (
    <div className="relative py-16 md:py-24">
      <Container>
        <div className="flex items-center gap-5">
          <span className="stmt-close font-mono">{label}</span>
          <span aria-hidden="true" className="luxa-rule h-px flex-1" />
        </div>
      </Container>
    </div>
  )
}
```

- [ ] **Step 4: Supprimer les sections dissoutes**

```bash
git rm src/components/landing/AppTour.tsx src/components/landing/Benefits.tsx
```

- [ ] **Step 5: Typecheck, lint**

```bash
npx tsc --noEmit && npm run lint
```

Les erreurs d'import dans `page.tsx` sont attendues — recâblage en Tâche 8.

- [ ] **Step 6: Commit**

```bash
git add -A src/components
git commit -m "feat(day-28,day-31): remaining budget, month close and the caesura"
```

---

### Task 8: Recâbler la page et bâtir l'acte II

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/landing/Trust.tsx`
- Delete: `src/components/landing/ProductProof.tsx`
- Delete: `src/components/landing/Privacy.tsx`
- Delete: `src/components/landing/Stella.tsx`
- Delete: `src/components/landing/Disperse.tsx`
- Delete: `src/components/design-system/SectionHeading.tsx`
- Modify: `src/components/landing/Pricing.tsx`, `src/components/landing/FAQ.tsx`, `src/components/landing/FinalCTA.tsx`

**Interfaces:**
- Consumes: tous les composants `Day*`, `Statement`, `StatementClose`.
- Produces: la page complète.

- [ ] **Step 1: Créer `Trust.tsx` (fusion de Privacy et des arguments de confiance)**

```tsx
'use client'

import { ShieldCheck, Server, EyeOff, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/design-system/Section'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

const icons: LucideIcon[] = [ShieldCheck, Server, EyeOff]

/** Acte II : lève l'objection principale, donc convertit. Pas de gouttière. */
export function Trust() {
  const { t } = useTranslation()
  const bullets = t('privacy.bullets') as unknown as Array<{ title: string; description: string }>

  return (
    <Section tone="epargne" divider>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
            {t('trust.title') as string}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
            {t('trust.body') as string}
          </p>
          <StellaMascot mood="love" size="md" floating className="mt-10" />
        </div>

        <div className="grid gap-3 self-center">
          {Array.isArray(bullets) &&
            bullets.map((bullet, index) => {
              const Icon = icons[index] ?? ShieldCheck
              return (
                <div
                  key={index}
                  data-animate="card"
                  className="luxa-card luxa-hairline luxa-card-hover flex gap-4 rounded-card p-5"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-epargne/12 text-epargne shadow-[0_0_22px_-6px_hsl(var(--epargne))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{bullet.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {bullet.description}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 1b: Réattribuer les ancres de navigation orphelines**

Le header et le pied de page pointent vers quatre ancres : `/#pockets`,
`/#stella`, `/#pricing`, `/#faq`. Les composants qui portaient les deux
premières ont été supprimés (`AppTour` en tâche 7, `Stella` dans cette tâche),
donc ces deux liens ne mènent plus nulle part. `#pricing` et `#faq` survivent.

`StatementEntry` accepte déjà une prop `id`. Réattribuer :

- `id="pockets"` → l'entrée du **jour 01** (`DayIncome`), qui porte la méthode
  50/30/20. C'est la destination la plus fidèle au libellé du lien.
- `id="stella"` → l'entrée du **jour 17** (`DayStella`), où elle prend la parole.

Passer la prop depuis chaque composant `Day*` concerné, pas depuis `page.tsx` —
c'est `StatementEntry` qui rend la `<section>`.

Vérifier après le recâblage que les quatre ancres existent dans le DOM :

```bash
node -e "
const h = await (await fetch('http://localhost:3000')).text();
for (const id of ['pockets','stella','pricing','faq'])
  console.log(id, h.includes('id=\"'+id+'\"'));
" --input-type=module
```

Attendu : les quatre à `true`.

- [ ] **Step 2: Réécrire `page.tsx`**

```tsx
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Hero } from "@/components/landing/Hero"
import { Statement } from "@/components/statement/Statement"
import { StatementClose } from "@/components/statement/StatementClose"
import { DayIncome } from "@/components/landing/DayIncome"
import { DayImport } from "@/components/landing/DayImport"
import { DaySubscriptions } from "@/components/landing/DaySubscriptions"
import { DayTranslate } from "@/components/landing/DayTranslate"
import { DayStella } from "@/components/landing/DayStella"
import { DayRemaining } from "@/components/landing/DayRemaining"
import { DayClose } from "@/components/landing/DayClose"
import { Trust } from "@/components/landing/Trust"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { ScrollAnimations } from "@/components/motion/ScrollAnimations"

/**
 * Deux actes. L'acte I est un relevé qu'on lit du 1er au 31, annoté par Stella
 * dans la marge — il démontre le produit. La césure arrête le filet. L'acte II
 * traite la décision : confiance, prix, objections, téléchargement.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollAnimations />
      <Header />
      <main className="flex-1">
        <Hero />

        <Statement>
          <DayIncome />
          <DayImport />
          <DaySubscriptions />
          <DayTranslate />
          <DayStella />
          <DayRemaining />
          <DayClose />
        </Statement>

        <StatementCloseSlot />

        <Trust />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
```

`StatementClose` a besoin de `useTranslation`, donc d'un composant client. Créer `src/components/statement/StatementCloseSlot.tsx` :

```tsx
'use client'

import { StatementClose } from '@/components/statement/StatementClose'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function StatementCloseSlot() {
  const { t } = useTranslation()
  return <StatementClose label={t('close.label') as string} />
}
```

et l'importer dans `page.tsx` à la place de `StatementClose`.

- [ ] **Step 3: Retirer `SectionHeading` de Pricing, FAQ et FinalCTA**

Dans chacun des trois, remplacer `<SectionHeading eyebrow=… title=… lead=… />` par un titre fer à gauche :

```tsx
<h2 className="max-w-[18ch] font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
  {t('pricing.title') as string}{' '}
  <span className="text-primary">{t('pricing.titleHighlight') as string}</span>
</h2>
<p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
  {t('pricing.subtitle') as string}
</p>
```

Adapter les clés pour FAQ (`faq.title`, pas de highlight ni de lead) et FinalCTA (`final.title`, `final.subtitle`). Retirer aussi `text-center` et `mx-auto` des conteneurs de ces trois sections.

- [ ] **Step 4: Supprimer les composants dissous**

```bash
git rm src/components/landing/ProductProof.tsx \
       src/components/landing/Privacy.tsx \
       src/components/landing/Stella.tsx \
       src/components/landing/Disperse.tsx \
       src/components/design-system/SectionHeading.tsx
```

- [ ] **Step 5: Vérifier qu'aucun import mort ne subsiste**

```bash
grep -rn "SectionHeading\|ProductProof\|AppTour\|Benefits\|Disperse\|Subscriptions\|Difference\|from '@/components/landing/Privacy'\|from '@/components/landing/Stella'" src/ || echo "aucun import mort"
```

Attendu : `aucun import mort`.

- [ ] **Step 6: Typecheck, lint, build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

- [ ] **Step 7: Vérifier qu'il n'y a plus de titre centré**

```bash
cd "$SCRATCHPAD" && node probe.mjs 1440 '["main h2"]'
```

Attendu : tous les `h2` avec `textAlign: "start"` ou `"left"`, aucun `"center"`.

- [ ] **Step 8: Commit**

```bash
git add -A src
git commit -m "feat(page): two-act structure, drop the generic section template"
```

---

### Task 9: Responsive, mouvement réduit et accessibilité

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/statement/StatementEntry.tsx` si besoin

- [ ] **Step 1: Vérifier le repli mobile de la gouttière**

```bash
cd "$SCRATCHPAD" && node probe.mjs 390 '[".stmt-gutter",".stmt-entry"]'
```

Attendu : `.stmt-entry` en une seule colonne (`gridTemplateColumns` = une valeur), `.stmt-gutter` en trois colonnes (tampon horizontal).

- [ ] **Step 2: Vérifier le palier intermédiaire**

```bash
cd "$SCRATCHPAD" && node probe.mjs 900 '[".stmt-entry",".stmt-note"]'
```

Attendu : `.stmt-entry` en deux colonnes ; les `.stmt-note` visibles dans le flux (celles en `xl:hidden`), pas dans une troisième colonne.

- [ ] **Step 3: Vérifier que le filet ne dépasse pas la césure**

```bash
cd "$SCRATCHPAD" && node probe.mjs 1440 '[".luxa-statement",".stmt-close"]'
```

Attendu : le bas de `.luxa-statement` est au-dessus du haut de `.stmt-close`.

- [ ] **Step 3b: Corriger le commentaire périmé de StatementEntry**

`src/components/statement/StatementEntry.tsx` porte encore le commentaire
« Sous 1100px la marge n'existe plus ». Le point de rupture est 1280px (`xl`)
depuis la correction de la tâche 2. Un commentaire faux sur un point de rupture
est précisément ce qui a produit le bug de cette tâche — le remplacer par
« Sous 1280px (xl) la marge n'existe plus : la note revient dans le flux. »

- [ ] **Step 3c: Sortir les textes alternatifs des composants**

Les `alt` des `PhoneFrame` des composants `Day*` sont écrits en dur, en français,
dans le JSX. Un `alt` est du contenu — il est lu à voix haute par les lecteurs
d'écran — donc il tombe sous la contrainte i18n globale au même titre qu'un titre.

Ajouter une clé `alt` à chaque jour concerné dans `month.d*` des deux locales, et
remplacer chaque chaîne en dur par `t('month.dNN.alt')`. Vérifier ensuite :
`grep -rn 'alt="Luxa' src/components/landing/` ne doit plus rien renvoyer.

- [ ] **Step 3d: Uniformiser la portée des contextes GSAP**

`DayIncome` appelle `gsap.context(fn, rootRef)` ; `DaySubscriptions` appelle
`gsap.context(fn)` sans racine. Sans portée, un futur sélecteur dans ce contexte
balaierait tout le document. Donner une racine à chaque contexte des composants
`Day*`, sur le modèle de `DayIncome`.

- [ ] **Step 3e: Rendre le jour 17 navigable au clavier et au lecteur d'écran**

`DayStella` rend sa phrase dans un `<p>` à l'intérieur d'un `<blockquote>`, donc
l'entrée ne produit aucun titre : un lecteur d'écran qui navigue par la liste des
titres saute le bloc entier. Le contenu reste dans l'ordre de lecture, mais il
devient impossible à atteindre directement.

Corriger en promouvant la phrase en `<h2>` **à l'intérieur** du `<blockquote>` —
c'est du HTML valide, l'aspect citation est conservé, et l'entrée retrouve sa
place dans la structure du document. Reprendre exactement les classes
typographiques du `<p>` actuel pour que le rendu ne bouge pas.

Vérifier ensuite que le compte de `<h2>` de la page a augmenté de un.

- [ ] **Step 3f: Rendre les trois arguments de confiance navigables**

Dans `src/components/landing/Trust.tsx`, le titre de chaque argument est un
`<p class="font-semibold">`. L'ancien `Privacy.tsx` utilisait un `<h3>`, et
Pricing comme la FAQ utilisent `<h3>` pour leurs sous-éléments. Résultat : les
trois arguments qui lèvent l'objection principale — donc les blocs qui font
convertir — sont absents de la structure de titres.

Les passer en `<h3>` avec exactement les mêmes classes typographiques, pour que
le rendu ne bouge pas. Vérifier ensuite que le nombre de `<h3>` de la page a
augmenté de trois.

- [ ] **Step 3g: Uniformiser la révélation au scroll de la section Confiance**

Toujours dans `Trust.tsx` : les cartes portent `data-animate="card"` mais le
titre, le paragraphe et la mascotte n'ont rien. Le titre apparaît donc
instantanément pendant que ses cartes montent en fondu dessous — ce qui se voit.
Ajouter `data-animate="lead"` au titre et au paragraphe, et `data-animate="stella"`
à la mascotte, comme dans les autres blocs de l'acte II.

- [ ] **Step 4: Ajouter la prise en charge du mouvement réduit**

Le bloc `@media (prefers-reduced-motion: reduce)` existant de `globals.css` neutralise déjà les animations globales. Vérifier qu'aucune nouvelle animation n'a été ajoutée hors de ce filet ; le compteur du jour 08 est déjà gardé par `prefersReducedMotion()`.

- [ ] **Step 5: Vérifier la hiérarchie des titres**

```bash
cd "$SCRATCHPAD" && node -e "
const html = await (await fetch('http://localhost:3000')).text();
console.log('h1:', (html.match(/<h1/g)||[]).length);
console.log('h2:', (html.match(/<h2/g)||[]).length);
" --input-type=module
```

Attendu : `h1: 1`, `h2` ≥ 10.

- [ ] **Step 6: Commit**

```bash
git add -A src
git commit -m "fix(statement): responsive fold-down and heading hierarchy"
```

---

### Task 10: Vérification finale

- [ ] **Step 1: Barrière complète**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Attendu : aucune erreur, build réussi.

- [ ] **Step 2: Vocabulaire de rayons**

```bash
cd "$SCRATCHPAD" && node probe.mjs 1440 '[]'
```

Attendu dans `_radii` : uniquement les clés `8`, `16`, `24` (les pills sont filtrées).

- [ ] **Step 3: Captures desktop et mobile**

Utiliser le script de capture pleine page en 1440 et 390. Relire chaque écran et vérifier :
- aucune section n'a la forme puce/titre centré/paragraphe centré ;
- la gouttière seule raconte l'histoire ;
- le filet est continu et s'arrête à la césure ;
- Stella est présente dans la marge sur l'acte I.

- [ ] **Step 4: Test d'interaction**

Vérifier que l'accordéon FAQ s'ouvre et que la modale bêta Android s'affiche centrée, sans erreur console.

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat(landing): statement-of-the-month layout"
```

---

## Self-Review

**Couverture de la spec :**

| Exigence | Tâche |
|---|---|
| Grammaire trois colonnes + filet continu | 2 |
| Gouttière porteuse d'information vraie | 2 (règle), 4–7 (données) |
| Aucun centrage dans l'acte I | 2 (primitive), 8 (vérif.) |
| Parcours de survol par la gouttière | 2, 10 |
| Repli responsive (3 paliers) | 2 (CSS), 9 (vérif.) |
| Marge Stella non optionnelle | 2, 4–7 |
| Marge limitée à l'acte I | 8 |
| Hero hors du mois, accroche abonnements | 1, 3 |
| Les 7 jours | 4, 5, 6, 7 |
| Grille 50/30/20 sur le seul jour 01 | 4 |
| Inversion du jour 17 | 6 |
| Césure | 7 |
| Acte II sans gouttière | 8 |
| Sections dissoutes | 5, 6, 7, 8 |
| `SectionHeading` supprimé | 8 |
| Copie neuve validée avant code | 1 (gate) |
| Hiérarchie SEO | 9 |
| Barrière tsc/lint/build | toutes |

Aucun trou.

**Placeholders :** deux notes correctives sont intégrées dans le corps des tâches plutôt que laissées en dette — l'i18n des `slices` du jour 01 (Tâche 4, étape 3) et les props `title`/`body` optionnelles de `StatementEntry` (Tâche 6, étape 3). Les deux indiquent exactement quoi changer.

**Cohérence des types :** `StatementEntry` est déclaré en Tâche 2 avec `title: string` / `body: string`, puis assoupli en `title?: string` / `body?: string` en Tâche 6. Un implémenteur qui lit les tâches dans le désordre pourrait rater l'assouplissement — c'est pour ça que la correction est écrite explicitement à l'étape où elle est nécessaire. `EntryTone` (`'out' | 'in' | 'neutral'`) est utilisé de façon cohérente dans les tâches 4 à 7.
