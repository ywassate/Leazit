import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ArrowLeft, CheckCircle, AlertCircle, X } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

interface ContactPageProps {
  onPageChange: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onPageChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Auto-masquer l'alerte après 5 secondes
  useEffect(() => {
    if (submitStatus !== 'idle') {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        // Reset le statut après l'animation de fermeture
        setTimeout(() => setSubmitStatus('idle'), 300);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [submitStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setShowAlert(false);

    try {
      // Validation côté client
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      // Validation email simple
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }


      // Préparer les données à envoyer
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        subject: formData.subject,
        message: formData.message.trim(),
        source: 'contact_messages',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      console.log('Envoi des données de contact vers:', `${API_BASE_URL}/contact`);
      console.log('Données:', contactData);

      // Appel à votre API Firebase
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      // Vérifier si la réponse est OK
      console.log('Statut de la réponse:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        throw new Error(errorData.message || `Erreur ${response.status}: Une erreur est survenue lors de l'envoi`);
      }

      const result = await response.json();
      console.log('Message envoyé avec succès:', result);

      // Vérifier que l'API a bien retourné un succès
      if (!result.success) {
        throw new Error('Le message n\'a pas pu être envoyé. Veuillez réessayer.');
      }

      setSubmitStatus('success');
      console.log('✅ Message envoyé avec succès - Statut:', 'success');
      
      // Réinitialiser le formulaire en cas de succès
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      setSubmitStatus('error');
      console.log('❌ Statut défini sur:', 'error');
      
      // Gestion des différents types d'erreurs
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validation en temps réel pour certains champs
    if (name === 'phone') {
      // Permettre seulement les chiffres, espaces, tirets, parenthèses, points et le signe +
      const cleanedValue = value.replace(/[^0-9\s\-\+\(\)\.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const closeAlert = () => {
    console.log('🔄 Fermeture de l\'alerte');
    setShowAlert(false);
    setTimeout(() => setSubmitStatus('idle'), 300);
  };

  // Coordonnées pour Casablanca, Maroc
  const location = {
    lat: 33.5731,
    lng: -7.5898,
    address: "123 Boulevard Hassan II, Casablanca, Maroc"
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Alerte flottante */}
        {showAlert && submitStatus !== 'idle' && (
        <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out ${
          showAlert  ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`rounded-lg shadow-lg border-l-4 p-4 ${
            submitStatus === 'success' 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {submitStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-medium ${
                  submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {submitStatus === 'success' ? 'Message envoyé !' : 'Erreur d\'envoi'}
                </h3>
                <p className={`mt-1 text-sm ${
                  submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {submitStatus === 'success' 
                    ? 'Votre message a été envoyé avec succès. Nous vous répondrons rapidement.' 
                    : errorMessage || 'Une erreur est survenue lors de l\'envoi de votre message.'
                  }
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={closeAlert}
                  className={`rounded-md inline-flex text-sm ${
                    submitStatus === 'success' 
                      ? 'text-green-500 hover:text-green-600' 
                      : 'text-red-500 hover:text-red-600'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    submitStatus === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="py-24 px-4 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Bouton de retour */}
          <div className="text-left mb-4">
            <button
              onClick={() => onPageChange('home')}
              className="flex items-center space-x-2 text-white hover:text-gray-400 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-50 bg-clip-text text-transparent">
            Contactez-nous
          </h1>
          <p className="text-2xl md:text-3xl text-blue-50 font-light mb-4">
            Nous sommes là pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Nos coordonnées
            </h2>

            <div className="space-y-6">
              {/* Adresse */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                  <p className="text-gray-600">
                    123 Boulevard Hassan II<br />
                    20000 Casablanca, Maroc
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                  <p className="text-gray-600">+212 5 22 12 34 56</p>
                  <p className="text-sm text-gray-500">Assistance 24h/24, 7j/7</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">contact@leazit.ma</p>
                  <p className="text-sm text-gray-500">Réponse sous 24h</p>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Horaires d'ouverture</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Lundi - Vendredi : 8h00 - 19h00</p>
                    <p>Samedi : 9h00 - 17h00</p>
                    <p>Dimanche : 10h00 - 16h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Google Maps */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Notre localisation</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNScyMy4yIlc!5e0!3m2!1sfr!2sma!4v1635789012345!5m2!1sfr!2sma&q=${encodeURIComponent(location.address)}`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Notre localisation"
                  className="w-full h-64 lg:h-80"
                ></iframe>
              </div>
              
              {/* Lien pour ouvrir dans Google Maps */}
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Ouvrir dans Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                  disabled={isSubmitting}
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                </div>
              

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <PhoneInput
                  country={'ma'}
                  value={formData.phone}
                  onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                  inputProps={{
                    name: 'phone',
                    required: false,
                    disabled: isSubmitting,
                  }}
                  inputStyle={{
                    width: '100%',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    height: '40px',
                    paddingLeft: '48px',
                  }}
                  containerStyle={{ width: '100%' }}
                />
              </div>
             </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="reservation">Question sur une réservation</option>
                  <option value="vehicle">Information sur un véhicule</option>
                  <option value="pricing">Question sur les tarifs</option>
                  <option value="assistance">Assistance technique</option>
                  <option value="complaint">Réclamation</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-200"
                  placeholder="Décrivez votre demande en détail..."
                  required
                  disabled={isSubmitting}
                  maxLength={1000}
                ></textarea>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/1000 caractères
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-black text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;