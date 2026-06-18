'use client'

import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 sm:px-6 py-20 sm:py-24 md:py-28 lg:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  Conditions Générales d&apos;Utilisation
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Dernière mise à jour : 17 juin 2026
                </p>
              </div>

              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. ACCEPTATION DES CONDITIONS</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    En créant un compte ou en utilisant l&apos;application Luxa (&quot;l&apos;Application&quot;, &quot;le Service&quot;), vous acceptez
                    sans réserve les présentes Conditions Générales d&apos;Utilisation (&quot;CGU&quot;). Si vous n&apos;acceptez pas ces
                    conditions, veuillez ne pas utiliser le Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. DESCRIPTION DU SERVICE</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Luxa est une application mobile de gestion de budget personnel qui permet de suivre ses dépenses et
                    revenus, de répartir son budget selon la méthode 50/30/20, de définir des objectifs d&apos;épargne et de
                    gérer ses finances dans plusieurs devises et langues. Le Service est actuellement en version bêta et
                    proposé gratuitement. Certaines fonctionnalités premium pourront être introduites ultérieurement,
                    sans que cela n&apos;affecte les fonctionnalités essentielles déjà disponibles gratuitement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. ÉLIGIBILITÉ ET COMPTE UTILISATEUR</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2">3.1 Âge minimum</h3>
                      <p className="text-muted-foreground">
                        Le Service est réservé aux personnes âgées de 16 ans ou plus, conformément à notre{' '}
                        <a href="/privacy" className="text-primary hover:underline">politique de confidentialité</a>.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">3.2 Exactitude des informations</h3>
                      <p className="text-muted-foreground">
                        Vous vous engagez à fournir des informations exactes lors de la création de votre compte et à les
                        maintenir à jour.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">3.3 Sécurité du compte</h3>
                      <p className="text-muted-foreground">
                        Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toute activité
                        effectuée depuis votre compte. Signalez-nous immédiatement toute utilisation non autorisée.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. UTILISATION ACCEPTABLE</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    En utilisant Luxa, vous vous engagez à ne pas :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Utiliser le Service à des fins illégales ou frauduleuses</li>
                    <li>Tenter d&apos;accéder de manière non autorisée à nos systèmes ou à des comptes d&apos;autres utilisateurs</li>
                    <li>Décompiler, désassembler ou tenter d&apos;extraire le code source de l&apos;Application</li>
                    <li>Perturber ou surcharger le bon fonctionnement du Service</li>
                    <li>Usurper l&apos;identité d&apos;une autre personne ou entité</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. VOS DONNÉES ET CONTENU</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Vous conservez l&apos;entière propriété des données financières et personnelles que vous saisissez dans
                    l&apos;Application. Luxa ne revendique aucun droit de propriété sur ces données. La manière dont nous
                    collectons, utilisons et protégeons vos données est détaillée dans notre{' '}
                    <a href="/privacy" className="text-primary hover:underline">politique de confidentialité</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. PROPRIÉTÉ INTELLECTUELLE</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    L&apos;Application, son design, son code, sa marque et son contenu (hors données utilisateur) sont la
                    propriété exclusive de Luxa et sont protégés par le droit de la propriété intellectuelle. Aucune
                    licence d&apos;utilisation ne vous est accordée en dehors du droit d&apos;utiliser le Service conformément
                    aux présentes CGU.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. DISPONIBILITÉ DU SERVICE</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Luxa est actuellement en version bêta : des interruptions, bugs ou modifications de fonctionnalités
                    peuvent survenir pendant cette phase. Nous mettons tout en œuvre pour assurer la continuité et la
                    fiabilité du Service, sans pouvoir garantir une disponibilité ininterrompue.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. LIMITATION DE RESPONSABILITÉ</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Luxa est un outil d&apos;aide à la gestion de budget et ne constitue ni un conseil financier, ni un
                    service bancaire ou d&apos;investissement. Les décisions financières prises sur la base des informations
                    fournies par l&apos;Application relèvent de votre seule responsabilité. Dans les limites permises par la
                    loi, Luxa ne saurait être tenu responsable de pertes financières résultant de l&apos;utilisation du
                    Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. RÉSILIATION</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l&apos;Application. Nous nous
                    réservons le droit de suspendre ou résilier l&apos;accès au Service en cas de violation des présentes
                    CGU.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. MODIFICATIONS DES CONDITIONS</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Nous pouvons modifier ces CGU à tout moment. Les modifications substantielles vous seront notifiées
                    via l&apos;Application ou par e-mail avant leur entrée en vigueur. La poursuite de l&apos;utilisation du
                    Service après notification vaut acceptation des nouvelles conditions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. DROIT APPLICABLE</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou
                    leur exécution relève de la compétence exclusive des tribunaux français, sous réserve des
                    dispositions impératives applicables aux consommateurs.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">12. CONTACT</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Pour toute question concernant ces Conditions Générales d&apos;Utilisation, contactez-nous à{' '}
                    <a href="mailto:contact@luxa.app" className="text-primary hover:underline">contact@luxa.app</a>{' '}
                    ou via notre <a href="/contact" className="text-primary hover:underline">page de contact</a>.
                  </p>
                </section>

                <div className="bg-primary-light border border-primary/20 rounded-2xl p-6 mt-8">
                  <p className="text-foreground font-medium text-center">
                    En utilisant Luxa, vous reconnaissez avoir lu, compris et accepté ces Conditions Générales
                    d&apos;Utilisation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
