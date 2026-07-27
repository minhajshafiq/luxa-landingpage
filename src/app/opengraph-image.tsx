import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Luxa : des pockets pour chaque euro, tes abonnements sous contrôle'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The share card, generated rather than kept as a binary asset so it can never
 * drift from the brand tokens. Colours are the literal values behind
 * --background / --primary / --stella / --epargne in globals.css (ImageResponse
 * has no access to CSS custom properties).
 *
 * Written in French. The product is French-first — every locale key is authored
 * in fr.json and translated outward — and this card is what a shared link shows
 * on X, which is the channel this hook was chosen for. An English card on a
 * French page was the previous state and made the share look like someone
 * else's product.
 */
export default async function OpengraphImage() {
  const icon = await readFile(join(process.cwd(), 'public', 'icon.png'))
  const iconSrc = `data:image/png;base64,${icon.toString('base64')}`

  const claims = ['Gratuit pour commencer', 'Sans connexion bancaire', 'Tes données restent à toi']

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          // #000000 = DarkColors.background, #6B5FF7 = the lilas wash,
          // #EF8B7C = Stella. Same values the page paints with.
          background: '#000000',
          backgroundImage:
            'radial-gradient(900px 500px at 50% -10%, rgba(107,95,247,0.40), transparent 70%), radial-gradient(500px 400px at 92% 78%, rgba(239,139,124,0.16), transparent 70%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img src={iconSrc} width={84} height={84} alt="" style={{ borderRadius: '20px' }} />
          <span style={{ fontSize: 60, fontWeight: 700, letterSpacing: '-0.03em' }}>Luxa</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            marginTop: '44px',
            maxWidth: '900px',
          }}
        >
          {`Tu paies 1 276 € d'abonnements par mois.`}
        </div>

        <div style={{ display: 'flex', gap: '18px', marginTop: '52px' }}>
          {claims.map((claim) => (
            <div
              key={claim}
              style={{
                display: 'flex',
                fontSize: 26,
                fontWeight: 600,
                color: '#AAAAAA',
                padding: '16px 28px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              {claim}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
