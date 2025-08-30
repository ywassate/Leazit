import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC<{ onPageChange: (page: string, data?: any) => void }> = ({
  onPageChange
}) => {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Leaz'it</h3>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour la location de voitures par Abonnement.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => onPageChange('service-detail', 'longue')} className="hover:text-white">Location longue durée</button></li>
              <li><button onClick={() => onPageChange('service-detail', 'moyenne')} className="hover:text-white">Location moyenne durée</button></li>
              <li><button onClick={() => onPageChange('service-detail', 'sans')} className="hover:text-white">Sans engagement</button></li>
              <li><button onClick={() => onPageChange('vehicles')} className="hover:text-white">Voir tous les véhicules</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-400">
             
              <li><button onClick={() => onPageChange('comment')} className="hover:text-white">Comment ça marche? </button></li>
              <li><button onClick={() => onPageChange('contact')} className="hover:text-white">Contact</button></li>
              <li><button onClick={() => onPageChange('home')} className="hover:text-white">Retour à l'accueil</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+212 5 22 12 34 56</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@leazit.ma</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Boulevard Hassan II<br />
                    20000 Casablanca, Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Leazit. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
