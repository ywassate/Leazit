import React from 'react';
import { Car, Shield, Wrench, CreditCard, CheckCircle, MapPin, Users, Clock, Settings, FileText, Phone, AlertTriangle } from 'lucide-react';
import FancyButton from '../components/FancyButton';

interface BenefitsPageProps {
  onPageChange: (page: string) => void;
}

const HowItWorksPage: React.FC<BenefitsPageProps> = ({ onPageChange }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}

      <section className="py-16 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-50">
              Comment ça marche ?
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-50">
              La nouvelle manière de disposer d'une voiture tout compris. Vous trouverez ici tout ce que vous devez savoir sur nos abonnements.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tout inclus dans votre abonnement mensuel
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Votre abonnement mensuel représentera votre seul et unique paiement. Pas de surprises ni de dépenses imprévues. 
              Tout est inclus, vous n'aurez qu'à vous occuper de l'essence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Shield className="h-12 w-12 text-gray-600" />, 
                title: 'Assurance tous risques', 
                desc: 'Couverture complète avec franchise réduite pour rouler en toute sérénité.' 
              },
              { 
                icon: <Phone className="h-12 w-12 text-gray-600" />, 
                title: 'Assistance dépannage', 
                desc: 'Service d\'assistance 24h/24 et 7j/7 partout en France.' 
              },
              { 
                icon: <Wrench className="h-12 w-12 text-gray-600" />, 
                title: 'Entretien et SAV', 
                desc: 'Maintenance préventive et réparations incluses dans votre mensualité.' 
              },
              { 
                icon: <CreditCard className="h-12 w-12 text-gray-600" />, 
                title: 'Sans apport', 
                desc: 'Aucun versement initial requis, commencez immédiatement.' 
              },
              { 
                icon: <CheckCircle className="h-12 w-12 text-gray-600" />, 
                title: 'Contrôle technique', 
                desc: 'Tous les contrôles obligatoires pris en charge automatiquement.' 
              },
              { 
                icon: <Car className="h-12 w-12 text-gray-600" />, 
                title: 'Véhicule de remplacement', 
                desc: 'En cas de panne ou d\'entretien, véhicule de courtoisie fourni.' 
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 ">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{benefit.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Subscription Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Créez votre abonnement sur mesure
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Choisissez la flexibilité</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Avec Flease, vous pouvez choisir la durée d'utilisation de votre voiture: de 3 à 36 mois. 
                  Plus l'abonnement est long, moins le paiement mensuel est élevé.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  À la fin de votre abonnement, le renouvellement se fera automatiquement chaque mois 
                  jusqu'à ce que vous nous contactiez pour l'annuler.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Changez de catégorie ou de modèle de voiture en fonction de vos besoins.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Personnalisez le kilométrage</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  L'abonnement inclut 800km par mois. Si vous pensez que ce n'est pas suffisant, 
                  vous pouvez toujours rajouter des kilomètres.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Adaptez le kilométrage à vos besoins
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Changez-le si ceux-ci évoluent
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Exemple d'abonnement</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Véhicule</span>
                    <span className="text-gray-600">Volkswagen Polo</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Durée</span>
                    <span className="text-gray-600">12 mois</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Kilométrage</span>
                    <span className="text-gray-600">1200 km/mois</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total mensuel</span>
                    <span className="font-bold text-green-600 text-2xl">690€</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Tout inclus : assurance, entretien, assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Subscribe Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comment vous abonner ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                icon: <Car className="h-8 w-8 text-white" />,
                title: 'Choisissez votre voiture',
                desc: 'Trouvez la voiture qui correspond le mieux à vos besoins du moment parmi tous nos modèles: personnalisez le kilométrage et la durée de l\'abonnement.'
              },
              {
                step: '2',
                icon: <FileText className="h-8 w-8 text-white" />,
                title: 'Inscrivez-vous, abonnez-vous',
                desc: 'Inscrivez-vous, téléchargez vos documents et suivez l\'état de votre demande en temps réel.'
              },
              {
                step: '3',
                icon: <MapPin className="h-8 w-8 text-white" />,
                title: 'Livraison de votre voiture',
                desc: 'Après validation de votre abonnement, vous pourrez venir récupérer votre voiture dans un de nos points de livraison ou nous indiquer où vous souhaitez la recevoir.'
              },
              {
                step: '4',
                icon: <Users className="h-8 w-8 text-white" />,
                title: 'Évoluons ensemble',
                desc: 'Changez de catégorie ou de modèle en fonction de vos nécessités. Flease vous offrira toujours la voiture la plus adaptée à vos besoins.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Subscription Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Une fois votre abonnement actif
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Assurance</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Chaque abonnement à Flease comprend, dans chaque paiement mensuel, une assurance tous risques 
                  avec franchise qui vous couvre à 100% en cas de dommages ou d'accident. Vous pouvez réduire 
                  la franchise si vous le souhaitez.
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Entretien et SAV</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Si votre voiture nécessite une révision, nous vous demanderons de l'emmener à l'un de nos 
                  centres de service présents partout en France. L'entretien est inclus dans votre abonnement 
                  mensuel, sans frais supplémentaires.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Contraventions</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Si nous recevons une contravention ou une infraction au code de la route, vous en serez 
                  informé par e-mail. Flease traitera la contravention en votre nom afin d'éviter des retards 
                  de paiements entraînant des frais supplémentaires.
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Changement de voiture</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Si vos besoins évoluent et que vous devez changer de modèle ou de catégorie, aucun problème: 
                  appelez-nous et nous vous aiderons à trouver la voiture parfaitement adaptée à vos besoins du moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trouvez votre voiture
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Découvrez notre gamme complète et configurez votre abonnement
          </p>

          <div className="flex justify-center">
            <FancyButton
              label="Voir nos véhicules"
              onClick={() => onPageChange('vehicles')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;