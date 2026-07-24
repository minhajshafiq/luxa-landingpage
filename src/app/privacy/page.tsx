'use client'

import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 sm:px-6 py-20 sm:py-24 md:py-28 lg:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  Politique de confidentialité
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Dernière mise à jour : 15 janvier 2025
                </p>
              </div>

              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. INTRODUCTION</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Luxa (&quot;nous&quot;, &quot;notre&quot;, &quot;nos&quot;) s&apos;engage à protéger votre vie privée et vos données personnelles. 
                    Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons 
                    vos informations lorsque vous utilisez notre application mobile de gestion de budget et finances personnelles.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    En utilisant Luxa, vous acceptez les pratiques décrites dans cette politique de confidentialité.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. INFORMATIONS QUE NOUS COLLECTONS</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium mb-3">2.1 Informations d&apos;identification personnelle</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Nom et prénom</strong> : Pour personnaliser votre expérience</li>
                        <li><strong>Adresse e-mail</strong> : Pour l&apos;authentification et la communication</li>
                        <li><strong>Numéro de téléphone</strong> (optionnel) : Pour la vérification en deux étapes</li>
                        <li><strong>Mot de passe</strong> : Chiffré et stocké de manière sécurisée</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">2.2 Données financières sensibles</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Transactions</strong> : Montants, dates, descriptions, catégories</li>
                        <li><strong>Budgets</strong> : Limites et objectifs financiers</li>
                        <li><strong>Poches d&apos;épargne</strong> : Objectifs d&apos;épargne et montants</li>
                        <li><strong>Statistiques financières</strong> : Analyses et tendances de vos finances</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">2.3 Données d&apos;utilisation</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Préférences utilisateur</strong> : Paramètres de l&apos;application</li>
                        <li><strong>Données de navigation</strong> : Pages visitées, fonctionnalités utilisées</li>
                        <li><strong>Données de performance</strong> : Temps de réponse, erreurs techniques</li>
                        <li><strong>Préférences de notification</strong> : Paramètres de rappels et alertes</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">2.4 Données techniques</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Informations d&apos;appareil</strong> : Modèle, système d&apos;exploitation, version</li>
                        <li><strong>Adresse IP</strong> : Pour la sécurité et l&apos;analyse</li>
                        <li><strong>Identifiants uniques</strong> : Pour la synchronisation des données</li>
                        <li><strong>Données de localisation</strong> (optionnel) : Pour les fonctionnalités géolocalisées</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">2.5 Données de paiement</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Informations d&apos;abonnement</strong> : Statut premium, dates d&apos;expiration</li>
                        <li><strong>Données de transaction IAP</strong> : Identifiants de produits, reçus</li>
                        <li><strong>Informations de facturation</strong> : Historique des paiements</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. UTILISATION DE VOS DONNÉES</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium mb-3">3.1 Fourniture du service</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Authentification et gestion de votre compte</li>
                        <li>Synchronisation de vos données financières</li>
                        <li>Génération de rapports et statistiques</li>
                        <li>Fonctionnalités de budget et d&apos;épargne</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">3.2 Amélioration du service</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Analyse des tendances d&apos;utilisation (anonymisées)</li>
                        <li>Développement de nouvelles fonctionnalités</li>
                        <li>Optimisation des performances</li>
                        <li>Tests de qualité et débogage</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">3.3 Communication</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Notifications importantes concernant votre compte</li>
                        <li>Alertes de sécurité</li>
                        <li>Mises à jour de l&apos;application</li>
                        <li>Support client</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">3.4 Sécurité</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Détection de fraudes</li>
                        <li>Protection contre les accès non autorisés</li>
                        <li>Sauvegarde et récupération de données</li>
                        <li>Conformité réglementaire</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. PARTAGE DE DONNÉES</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-xl font-medium mb-2 text-red-800">4.1 Nous ne vendons JAMAIS vos données personnelles ou financières</h3>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">4.2 Partage limité avec des tiers de confiance</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Supabase</strong> : Hébergement sécurisé des données (conformité GDPR)</li>
                        <li><strong>Google Play Store / Apple App Store</strong> : Pour les achats intégrés</li>
                        <li><strong>Fournisseurs de services</strong> : Uniquement pour le fonctionnement de l&apos;application</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">4.3 Partage obligatoire</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Autorités légales (sur demande légale uniquement)</li>
                        <li>Protection de nos droits légaux</li>
                        <li>Sécurité publique</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. SÉCURITÉ DES DONNÉES</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium mb-3">5.1 Chiffrement</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>En transit</strong> : TLS 1.3 pour toutes les communications</li>
                        <li><strong>Au repos</strong> : AES-256 pour le stockage des données</li>
                        <li><strong>Local</strong> : Chiffrement des données sensibles sur l&apos;appareil</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">5.2 Mesures de sécurité</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Authentification multi-facteurs disponible</li>
                        <li>Surveillance continue des accès</li>
                        <li>Sauvegardes chiffrées et régulières</li>
                        <li>Formation du personnel à la sécurité</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-3">5.3 Stockage</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Serveurs</strong> : Hébergement sécurisé chez Supabase (UE)</li>
                        <li><strong>Local</strong> : Chiffrement avec Flutter Secure Storage</li>
                        <li><strong>Synchronisation</strong> : Chiffrement bout en bout</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. VOS DROITS (RGPD)</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2">6.1 Droit d&apos;accès</h3>
                      <p className="text-muted-foreground">Vous pouvez demander une copie de toutes vos données personnelles.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">6.2 Droit de rectification</h3>
                      <p className="text-muted-foreground">Vous pouvez corriger ou mettre à jour vos informations.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">6.3 Droit à l&apos;effacement</h3>
                      <p className="text-muted-foreground">Vous pouvez demander la suppression de votre compte et de vos données.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">6.4 Droit à la portabilité</h3>
                      <p className="text-muted-foreground">Vous pouvez exporter vos données dans un format lisible.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">6.5 Droit d&apos;opposition</h3>
                      <p className="text-muted-foreground">Vous pouvez vous opposer au traitement de vos données pour certaines finalités.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">6.6 Droit de limitation</h3>
                      <p className="text-muted-foreground">Vous pouvez demander la limitation du traitement de vos données.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. CONSERVATION DES DONNÉES</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2">7.1 Données de compte</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Conservées</strong> : Tant que votre compte est actif</li>
                        <li><strong>Suppression</strong> : 30 jours après la fermeture du compte</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">7.2 Données financières</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Conservées</strong> : Selon vos préférences (minimum 1 an)</li>
                        <li><strong>Suppression</strong> : Immédiate sur demande</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">7.3 Données techniques</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Conservées</strong> : 2 ans maximum</li>
                        <li><strong>Anonymisation</strong> : Après 1 an</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. COOKIES ET TECHNOLOGIES SIMILAIRES</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2">8.1 Cookies essentiels</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Authentification</li>
                        <li>Préférences de sécurité</li>
                        <li>Fonctionnalités de base</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">8.2 Cookies analytiques</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Mesure d&apos;audience (anonymisée)</li>
                        <li>Performance de l&apos;application</li>
                        <li>Amélioration de l&apos;expérience utilisateur</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. TRANSFERT INTERNATIONAL</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Vos données sont principalement stockées dans l&apos;Union Européenne. Tout transfert vers des pays tiers respecte les garanties appropriées du RGPD.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. MINEURS</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Luxa n&apos;est pas destiné aux mineurs de moins de 16 ans. Nous ne collectons pas sciemment de données personnelles de mineurs.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. MODIFICATIONS DE CETTE POLITIQUE</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Nous pouvons modifier cette politique de confidentialité. Les modifications importantes seront notifiées via l&apos;application ou par e-mail.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">12. CONTACT ET RÉCLAMATIONS</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2">12.1 Délégué à la protection des données (DPO)</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>E-mail</strong> : privacy@getluxa.app</li>
                        <li><strong>Adresse</strong> : 123 Rue de la Paix, 75001 Paris, France</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">12.2 Autorité de contrôle</h3>
                      <p className="text-muted-foreground">Vous pouvez déposer une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés).</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">12.3 Support client</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>E-mail</strong> : support@getluxa.app</li>
                        <li><strong>Réponse</strong> : Sous 48h ouvrées</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">13. CONFORMITÉ RÉGLEMENTAIRE</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Cette politique est conforme au :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>RGPD</strong> (Règlement Général sur la Protection des Données)</li>
                    <li><strong>Loi Informatique et Libertés</strong></li>
                    <li><strong>Directive ePrivacy</strong></li>
                    <li><strong>Standards de sécurité ISO 27001</strong></li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">14. GESTION DE VOS DONNÉES DANS L&apos;APPLICATION</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2">14.1 Paramètres de confidentialité</h3>
                      <p className="text-muted-foreground">Vous pouvez gérer vos préférences dans : <strong>Paramètres &gt; Confidentialité</strong></p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">14.2 Export de données</h3>
                      <p className="text-muted-foreground">Fonctionnalité disponible dans : <strong>Paramètres &gt; Données &gt; Exporter</strong></p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">14.3 Suppression de compte</h3>
                      <p className="text-muted-foreground">Processus disponible dans : <strong>Paramètres &gt; Compte &gt; Supprimer le compte</strong></p>
                    </div>
                  </div>
                </section>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <p className="text-blue-800 font-medium text-center">
                    <strong>Luxa s&apos;engage à protéger votre vie privée et à traiter vos données avec le plus grand respect et la plus grande sécurité.</strong>
                  </p>
                  <p className="text-blue-600 text-center mt-2 italic">
                    Cette politique de confidentialité est effective depuis le 15 janvier 2025.
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
