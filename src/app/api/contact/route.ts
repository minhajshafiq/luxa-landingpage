import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Veuillez entrer votre nom' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Veuillez entrer un email valide' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Veuillez entrer un message' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { message: 'Message envoyé avec succès (mode développement)', data: { name, email, subject, message } },
        { status: 200 }
      )
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name: name.trim(), email: email.trim(), subject: subject?.trim() || null, message: message.trim() }])
      .select()

    if (error) {
      if (error.code === '42501') {
        return NextResponse.json(
          {
            error: 'Configuration de sécurité manquante. Veuillez exécuter le script SQL dans Supabase.',
            details: 'Créez la table contact_messages et sa politique RLS dans Supabase',
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          error: 'Une erreur est survenue. Veuillez réessayer.',
          details: error.message || 'Erreur inconnue',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Message envoyé avec succès', data },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
