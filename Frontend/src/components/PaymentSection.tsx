import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { CardData, ValidationError } from '../types/reservation';
import { validateStep4 } from '../utils/validation';

interface PaymentSectionProps {
  card: CardData;
  setCard: (card: CardData) => void;
  errors: ValidationError[];
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ card, setCard, errors }) => {
  const [cardType, setCardType] = useState<string>('');

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Detect card type
    if (cleanValue.startsWith('4')) setCardType('visa');
    else if (cleanValue.startsWith('5') || cleanValue.startsWith('2')) setCardType('mastercard');
    else if (cleanValue.startsWith('3')) setCardType('amex');
    else setCardType('');
    
    return formattedValue;
  };

  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-gray-700 mb-6">
        <Lock className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium">Paiement sécurisé SSL</span>
      </div>

      {/* Card Number */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Numéro de carte <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
            maxLength={19}
            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              getFieldError('cardNumber') 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {cardType && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                cardType === 'visa' ? 'bg-blue-100 text-blue-700' :
                cardType === 'mastercard' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {cardType.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {getFieldError('cardNumber') && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError('cardNumber')}</span>
          </div>
        )}
      </div>

      {/* Cardholder Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Nom du titulaire <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="JEAN DUPONT"
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            getFieldError('cardName') 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        {getFieldError('cardName') && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError('cardName')}</span>
          </div>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Date d'expiration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="MM/AA"
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
            maxLength={5}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              getFieldError('cardExpiry') 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {getFieldError('cardExpiry') && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError('cardExpiry')}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Code CVC <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="123"
            value={card.cvc}
            onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '') })}
            maxLength={4}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              getFieldError('cardCvc') 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {getFieldError('cardCvc') && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError('cardCvc')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Paiement sécurisé</h4>
            <p className="text-sm text-blue-700">
              Vos informations de paiement sont protégées par un cryptage SSL 256 bits. 
              Nous ne stockons jamais vos données bancaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;