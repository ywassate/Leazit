import React from "react";
import {
  Clock,
  Shield,
  Award,
  Users,
  Check,
  Star,
  ChevronRight,
} from "lucide-react";
import FancyButton from "../components/FancyButton";

interface ServiceDetailPageProps {
  serviceType: string;
  onPageChange: (page: string) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceType,
  onPageChange,
}) => {
  const getServiceContent = () => {
    switch (serviceType) {
      case "longue":
        return {
          title: "Abonnement longue durée",
          subtitle: "De 12 à 50 mois à tarif avantageux",
          description:
            "Idéal pour les entreprises souhaitant un véhicule sur plusieurs mois. Inclut entretien, assurance tous risques et assistance 24/7.",
          features: [
            "Durée de 12 à 50 mois : choisissez la durée adaptée à votre entreprise",
            "Outil de gestion de flotte automatisé offert : suivi des kilomètres, alertes entretien et accès à vos documents",
            "Interlocuteur unique et service dédié tout au long du contrat",
            "Aucun apport demandé, une caution restituable peut être sollicitée",
            "Véhicules quasi‑neufs livrés en un mois partout au Maroc",
          ],
          offerOverview: [
            {
              title: "Interlocuteur unique & services inclus",
              description:
                "Un conseiller dédié vous accompagne de la signature à la restitution. En cas de panne, un véhicule de remplacement est mis à disposition pendant toute la durée d’immobilisation.",
            },
            {
              title: "Gestion de flotte automatisée",
              description:
                "Outil gratuit pour suivre en temps réel le kilométrage, recevoir des alertes d’entretien, calculer le coût total de détention et centraliser tous vos documents.",
            },
            {
              title: "Véhicules quasi‑neufs variés",
              description:
                "Choisissez parmi des citadines, berlines, breaks, SUV ou utilitaires quasi‑neufs. Ces véhicules, adaptés aux besoins des salariés, sont livrés en moins d’un mois.",
            },
          ],
          fleetManagementIntro:
            "Simplifiez la gestion de vos véhicules d’entreprise et gagnez un temps précieux.",
          fleetManagementFeatures: [
            {
              title: "Suivi kilométrique en temps réel",
              description:
                "Suivez facilement les kilomètres parcourus par tous vos véhicules en temps réel.",
              image: "/kilometrage.png",
            },
            {
              title: "Gestion des conducteurs",
              description:
                "Attribuez vos véhicules à vos collaborateurs en un seul clic et gardez une visibilité claire.",
              image: "/conducteurs.png",
            },
            {
              title: "Alertes pour les entretiens",
              description:
                "Recevez automatiquement des notifications pour vos prochains entretiens afin de ne manquer aucun rendez-vous.",
              image: "/entretiens.png",
            },
            {
              title: "Suivi des contrats de location",
              description:
                "Visualisez facilement les cycles de location et tous vos contrats en un coup d’œil.",
              image: "/contrats.png",
            },
            {
              title: "Factures & documents centralisés",
              description:
                "Centralisez et gérez vos factures ainsi que l’ensemble de vos documents administratifs au même endroit.",
              image: "/documents.png",
            },
          ],
          pricing: [
            {
              duration: "12 mois",
              price: "Dès 690€/mois",
              savings: "Économisez 200€/mois",
            },
            {
              duration: "24 mois",
              price: "Dès 630€/mois",
              savings: "Économisez 260€/mois",
            },
            {
              duration: "36 mois",
              price: "Dès 590€/mois",
              savings: "Économisez 300€/mois",
            },
          ],
          benefits: [
            {
              title: "Simplicité de gestion",
              description:
                "Un seul interlocuteur pour tous vos besoins automobile.",
              icon: <Shield className="h-8 w-8 text-gray-600" />,
              details:
                "Grâce à notre outil de gestion de flotte automatisé, suivez en temps réel les kilomètres parcourus, recevez des alertes d’entretien et accédez à tous vos contrats, factures et documents.",
            },
            {
              title: "Oubliez les mauvaises surprises",
              description:
                "Aucune marge n’est faite sur vos frais de restitution.",
              icon: <Clock className="h-8 w-8 text-gray-600" />,
              details:
                "Les véhicules sont équipés d’un boîtier télématique permettant d’adapter vos loyers à votre usage:contentReference[oaicite:18]{index=18} ; vous payez le prix réel des réparations et rien de plus.",
            },
            {
              title: "N'attendez plus",
              description:
                "Chez Flease nous livrons nos véhicules quasi neufs en un mois !",
              icon: <Award className="h-8 w-8 text-gray-600" />,
              details:
                "Grâce à notre stock, la livraison s’effectue en moyenne en 1 mois, bien plus rapidement que la concurrence.",
            },
          ],
          testimonials: [
            {
              name: "Marie Dubois",
              company: "Directrice, TechCorp",
              rating: 5,
              comment:
                "Service impeccable, notre flotte de 15 véhicules est parfaitement gérée. Les économies réalisées sont substantielles.",
            },
            {
              name: "Pierre Martin",
              company: "Consultant indépendant",
              rating: 5,
              comment:
                "La flexibilité offerte m'a permis d'adapter mon contrat selon l'évolution de mon activité.",
            },
          ],
          faq: [
            {
              question:
                "Un apport est‑il demandé pour une location longue durée ?",
              answer:
                "Aucun apport n’est exigé pour louer un véhicule. En cas de garantie insuffisante, une caution peut être demandée et vous sera restituée en fin de contrat.",
            },
            {
              question: "Comment est calculé le loyer en LLD ?",
              answer:
                "Le loyer dépend du kilométrage annuel, de la durée de location et des entretiens réguliers. Des options telles que l’assurance ou les pneumatiques peuvent être ajoutées.",
            },
            {
              question: "Quels services sont inclus dans le prix ?",
              answer:
                "Les offres Flease incluent l’assistance et le dépannage 24h/24, un véhicule de remplacement en cas de panne, les réparations et entretiens, la révision, le contrôle technique et une assurance tous risques.",
            },
            {
              question: "Puis‑je modifier la durée de mon contrat ?",
              answer:
                "Oui. Grâce au boîtier télématique, vous suivez votre kilométrage en temps réel et un avenant peut être établi gratuitement pour ajuster votre contrat.",
            },
          ],
        };

      case "moyenne":
        return {
          title: "Abonnement moyenne durée",
          subtitle: "Sans engagement de durée, livraison en 7 jours",
          description:
            "Idéal pour les missions temporaires, les périodes d’essai ou les pics d’activité. Louez à partir de 1 mois pour un besoin ponctuel.",
          features: [
            "Durée flexible de 1 à 24 mois",
            "Catalogue varié : citadine, compacte, break, SUV et utilitaire.",
            "Véhicules équipés business : Apple Car Play, commandes au volant, régulateur de vitesse, kit mains libres, aide au stationnement",
            "Livraison quasi‑immédiate en 7 jours partout au Maroc",
            "Offre période d’essai : convertissez en LLD ou résiliez sans pénalité",
          ],
          offerOverview: [
            {
              title: "Durée sur mesure",
              description:
                "Louez un véhicule pour une durée de 1 à 24 mois sans engagement.",
            },
            {
              title: "Véhicules divers et équipés",
              description:
                "Profitez de citadines, compactes, breaks, SUV et utilitaires dotés d’équipements business (Apple Car Play, régulateur de vitesse, aides au stationnement…).",
            },
            {
              title: "Livraison rapide & période d’essai",
              description:
                "Vos véhicules sont livrés en 7 jours. L’offre période d’essai permet de tester un véhicule et de basculer en LLD ou de résilier sans pénalité.",
            },
          ],
          fleetManagementIntro:
            "Simplifiez la gestion de vos véhicules d’entreprise et gagnez un temps précieux.",
          fleetManagementFeatures: [
            {
              title: "Suivi kilométrique en temps réel",
              description:
                "Suivez facilement les kilomètres parcourus par tous vos véhicules en temps réel.",
              image: "/kilometrage.png",
            },
            {
              title: "Gestion des conducteurs",
              description:
                "Attribuez vos véhicules à vos collaborateurs en un seul clic et gardez une visibilité claire.",
              image: "/conducteurs.png",
            },
            {
              title: "Alertes pour les entretiens",
              description:
                "Recevez automatiquement des notifications pour vos prochains entretiens afin de ne manquer aucun rendez-vous.",
              image: "/entretiens.png",
            },
            {
              title: "Suivi des contrats de location",
              description:
                "Visualisez facilement les cycles de location et tous vos contrats en un coup d’œil.",
              image: "/contrats.png",
            },
            {
              title: "Factures & documents centralisés",
              description:
                "Centralisez et gérez vos factures ainsi que l’ensemble de vos documents administratifs au même endroit.",
              image: "/documents.png",
            },
          ],
          pricing: [
            {
              duration: "1 mois",
              price: "Dès 790€/mois",
              savings: "Disponible immédiatement",
            },
            {
              duration: "3 mois",
              price: "Dès 720€/mois",
              savings: "Économisez 70€/mois",
            },
            {
              duration: "6 mois",
              price: "Dès 660€/mois",
              savings: "Économisez 130€/mois",
            },
          ],
          benefits: [
            {
              title: "Flexibilité maximale",
              description: "Adaptez votre contrat selon vos besoins évolutifs.",
              icon: <Clock className="h-8 w-8 text-gray-600" />,
              details:
                "Durées modulables de 1 à 24 mois : prolongez, réduisez ou changez de véhicule. L’offre période d’essai permet de basculer vers une LLD ou de résilier sans frais.",
            },
            {
              title: "Service tout compris",
              description: "Zéro surprise : entretien et assurance inclus.",
              icon: <Shield className="h-8 w-8 text-gray-600" />,
              details:
                "Une mensualité fixe qui couvre l’entretien régulier, l’assurance tous risques, l’assistance 24/7 et un véhicule de remplacement.",
            },
            {
              title: "Disponibilité quasi‑immédiate",
              description:
                "Tous nos véhicules sont en stock et livrés rapidement.",
              icon: <Award className="h-8 w-8 text-gray-600" />,
              details:
                "Grâce à notre stock important, la livraison se fait en moyenne en 7 jour et un conseiller vous contacte dans les 24 heures pour finaliser votre choix.",
            },
          ],
          testimonials: [
            {
              name: "Sophie Laurent",
              company: "Consultante IT",
              rating: 5,
              comment:
                "Parfait pour ma mission de 4 mois à Lyon. Service réactif et véhicule impeccable.",
            },
            {
              name: "Thomas Rey",
              company: "Étudiant en master",
              rating: 4,
              comment:
                "Solution idéale pour mon stage de fin d'études. Pas d'engagement long terme contraignant.",
            },
          ],
          faq: [
            {
              question: "Quelle est la durée d'une location moyenne durée ?",
              answer:
                "La location moyenne durée s’étend de 1 à 12 mois, voire jusqu’à 24 mois sans engagement.",
            },
            {
              question: "Quel est le délai de livraison ?",
              answer:
                "Pour une location moyenne durée, le délai de livraison est d’environ 7 jours.",
            },
            {
              question: "Que comprend le loyer ?",
              answer:
                "Votre loyer comprend le kilométrage, la durée de location, les entretiens réguliers et une assurance tous risques.",
            },
            {
              question: "Quand choisir une location moyenne durée ?",
              answer:
                "Cette solution est idéale pour les besoins ponctuels, les projets temporaires ou l’attente d’un véhicule neuf.",
            },
          ],
        };

      case "sans":
        return {
          title: "Location sans engagement",
          subtitle: "Location au mois, liberté totale",
          description:
            "Louez un véhicule aussi longtemps que vous le souhaitez et stoppez à tout moment. Parfait pour les besoins ponctuels.",
          features: [
            "Durée flexible à partir de 1 mois",
            "Kilométrage modulable et avenant gratuit en cas de dépassement",
            "Livraison rapide en environ 7 jours grâce à notre stock",
            "Pas d’apport initial ; une caution restituable peut être demandée",
            "Résiliation sans frais : mettez fin au contrat avec un préavis court",
          ],
          offerOverview: [
            {
              title: "Durée et kilométrage flexibles",
              description:
                "Commencez dès 1 mois, prolongez à volonté et ajustez votre kilométrage selon vos usages.",
            },
            {
              title: "Véhicules variés et équipés",
              description:
                "Accédez à un large choix de voitures quasi‑neuves (citadine, berline, SUV, utilitaire) adaptées à vos besoins professionnels.",
            },
            {
              title: "Pas d’engagement & livraison rapide",
              description:
                "Aucun apport exigé (une caution peut être demandée et restituée) et livraison en quelques jour.",
            },
          ],
          fleetManagementIntro:
            "Simplifiez la gestion de vos véhicules d’entreprise et gagnez un temps précieux.",
          fleetManagementFeatures: [
            {
              title: "Suivi kilométrique en temps réel",
              description:
                "Suivez facilement les kilomètres parcourus par tous vos véhicules en temps réel.",
              image: "/kilometrage.png",
            },
            {
              title: "Gestion des conducteurs",
              description:
                "Attribuez vos véhicules à vos collaborateurs en un seul clic et gardez une visibilité claire.",
              image: "/conducteurs.png",
            },
            {
              title: "Alertes pour les entretiens",
              description:
                "Recevez automatiquement des notifications pour vos prochains entretiens afin de ne manquer aucun rendez-vous.",
              image: "/entretiens.png",
            },
            {
              title: "Suivi des contrats de location",
              description:
                "Visualisez facilement les cycles de location et tous vos contrats en un coup d’œil.",
              image: "/contrats.png",
            },
            {
              title: "Factures & documents centralisés",
              description:
                "Centralisez et gérez vos factures ainsi que l’ensemble de vos documents administratifs au même endroit.",
              image: "/documents.png",
            },
          ],
          pricing: [
            {
              duration: "1 mois",
              price: "Dès 850€/mois",
              savings: "Livraison rapide",
            },
            {
              duration: "2 mois",
              price: "Dès 820€/mois",
              savings: "Économisez 30€/mois",
            },
            {
              duration: "3 mois",
              price: "Dès 790€/mois",
              savings: "Économisez 60€/mois",
            },
          ],
          benefits: [
            {
              title: "Liberté totale",
              description: "Arrêtez ou continuez selon vos envies.",
              icon: <Clock className="h-8 w-8 text-gray-600" />,
              details:
                "Modifiez, prolongez ou stoppez votre location sans engagement. Grâce à la télématique, vos loyers s’ajustent à votre usage.",
            },
            {
              title: "Simplicité extrême",
              description: "Réservation et gestion 100 % en ligne.",
              icon: <Shield className="h-8 w-8 text-gray-600" />,
              details:
                "Processus digitalisé de la réservation à la restitution, signature électronique et interlocuteur unique pour vous accompagner.",
            },
            {
              title: "Disponibilité rapide",
              description: "Véhicule livré sous une semaine partout en France.",
              icon: <Users className="h-8 w-8 text-gray-600" />,
              details:
                "Nos véhicules en stock permettent une livraison en quelques jours, généralement en 7 jours.",
            },
          ],
          testimonials: [
            {
              name: "Julie Chen",
              company: "Digital Nomad",
              rating: 5,
              comment:
                "Parfait pour mon mode de vie nomade. Je peux avoir une voiture quand j'en ai besoin, sans contrainte.",
            },
            {
              name: "Marc Rousseau",
              company: "Entrepreneur",
              rating: 5,
              comment:
                "Idéal pour mes déplacements professionnels ponctuels. Service rapide et efficace.",
            },
          ],
          faq: [
            {
              question: "Quelle est la durée minimale ?",
              answer:
                "La location sans engagement commence dès 1 mois et peut être prolongée à volonté.",
            },
            {
              question: "Faut‑il un apport ou une caution ?",
              answer:
                "Aucun apport n’est requis ; selon votre dossier, une caution peut être demandée et elle est restituée en fin de contrat.",
            },
            {
              question: "Quel est le délai de livraison ?",
              answer:
                "Grâce à notre stock, les véhicules sont livrés en quelques jours, généralement en une semaine.",
            },
            {
              question:
                "Que se passe‑t‑il si je dépasse le kilométrage prévu ?",
              answer:
                "Le boîtier télématique vous permet de suivre votre consommation en temps réel ; un avenant est réalisé gratuitement pour ajuster votre contrat.",
            },
          ],
        };

      default:
        return null;
    }
  };

  const serviceContent = getServiceContent();

  if (!serviceContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service non trouvé
          </h2>
          <button
            onClick={() => onPageChange("home")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-40 px-4 bg-gradient-to-r from-black via-gray-900 to-black">
        {/* Blobs de fond (derrière le contenu) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-50">
              {serviceContent.title}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-50">
              {serviceContent.description}
            </p>
          </div>
        </div>

        {/* Bouton centré en bas, avec espace du bord */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 sm:bottom-16">
          <FancyButton
            label="Découvrir nos voitures"
            onClick={() => onPageChange("vehicles")}
            icon={<ChevronRight className="w-5 h-5" />}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Benefits Section */}
        <section className="py-16 -mt-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {serviceContent.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {benefit.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Ce qui est inclus dans votre abonnement
              </h2>
              <div className="space-y-4">
                {serviceContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Processus simplifié
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Choisissez votre véhicule
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Sélectionnez parmi notre large gamme
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Configurez votre contrat
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Durée, kilométrage, options
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Recevez votre véhicule
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Livraison à domicile ou au bureau
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Fleet Management Section */}
        {serviceContent.fleetManagementFeatures && (
          <section className="py-16 bg-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Outil de gestion de flotte automatisé
            </h2>
            {serviceContent.fleetManagementIntro && (
              <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                {serviceContent.fleetManagementIntro}
              </p>
            )}

            <div
              className="slider"
              style={
                {
                  ["--width"]: "360px", // largeur des cards
                  ["--height"]: "360px", // hauteur des cards
                  ["--quantity"]: serviceContent.fleetManagementFeatures.length,
                } as React.CSSProperties
              }
            >
              <div className="list">
                {serviceContent.fleetManagementFeatures.map((feat, index) => (
                  <div
                    key={index}
                    className="item"
                    style={{ ["--position"]: index + 1 } as React.CSSProperties}
                  >
                    <div className="card">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {feat.title}
                      </h4>
                      <p className="text-md text-gray-700 mb-7">
                        {feat.description}
                      </p>
                      {feat.image && (
                        <img
                          src={feat.image}
                          alt={feat.title}
                          className="w-full h-40 object-contain mb-4"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        <section className="py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {serviceContent.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ───────── ENHANCED FAQ SECTION ───────── */}

      <section
        id="faq"
        className="py-24 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-gray-300 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              Questions fréquentes
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">FAQ</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Trouvez rapidement les réponses à vos questions les plus
              courantes.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Quel âge faut-il avoir pour louer une voiture ?",
                answer:
                  "Vous devez avoir au moins 21 ans et posséder un permis de conduire valide depuis au minimum 1 an. Pour certains véhicules premium, l'âge minimum peut être de 25 ans.",
              },
              {
                question: "Puis-je modifier ou annuler ma réservation ?",
                answer:
                  "Oui, vous pouvez modifier votre réservation jusqu'à 48h avant la prise en charge sans frais. L'annulation est possible jusqu'à 24h avant sans pénalité.",
              },
              {
                question: "L'assurance est-elle incluse ?",
                answer:
                  "Absolument ! Tous nos abonnements incluent une assurance tous risques avec franchise réduite, plus une assistance dépannage 24/7 sur tout le territoire marocain.",
              },
              {
                question: "Quelles sont les zones de livraison couvertes ?",
                answer:
                  "Nous livrons dans toutes les grandes villes du Maroc : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir. La livraison en centre-ville est gratuite.",
              },
              {
                question: "Quel est le kilométrage inclus dans l'abonnement ?",
                answer:
                  "Le kilométrage varie selon votre forfait : de 1 500 km/mois à illimité. Vous pouvez ajuster votre forfait à tout moment selon vos besoins réels.",
              },
              {
                question: "Que se passe-t-il en cas de panne ou d'accident ?",
                answer:
                  "Notre service d'assistance 24/7 intervient rapidement. En cas de panne, nous organisons le dépannage. En cas d'accident, nous gérons toutes les démarches avec les assurances.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-4 ">
                  {item.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 mt-16">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Prêt à Réserver Votre Voiture ?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et découvrez une
              nouvelle façon de conduire. Simple, flexible, tout inclus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <FancyButton
              label="Réserver maintenant"
              onClick={() => onPageChange("vehicles")}
              icon={<ChevronRight className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
