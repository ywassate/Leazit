import { FormData, CardData, ValidationError } from '../types/reservation';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters and check if it's a valid length
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export const validatePostalCode = (code: string): boolean => {
  // Morocco postal code format (5 digits)
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(code);
};

export const validateCardNumber = (number: string): boolean => {
  // Luhn algorithm for credit card validation
  const cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateExpiryDate = (expiry: string): boolean => {
  const cleanExpiry = expiry.replace(/\D/g, '');
  if (cleanExpiry.length !== 4) return false;
  
  const month = parseInt(cleanExpiry.substring(0, 2));
  const year = parseInt(cleanExpiry.substring(2, 4)) + 2000;
  
  if (month < 1 || month > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

export const validateCVC = (cvc: string): boolean => {
  const cleanCVC = cvc.replace(/\D/g, '');
  return cleanCVC.length >= 3 && cleanCVC.length <= 4;
};

export const validateStep1 = (form: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!form.type) errors.push({ field: 'type', message: 'Veuillez sélectionner un type de client' });
  if (!form.nom.trim()) errors.push({ field: 'nom', message: 'Le nom est requis' });
  if (!form.prenom.trim()) errors.push({ field: 'prenom', message: 'Le prénom est requis' });
  if (!form.email.trim()) errors.push({ field: 'email', message: 'L\'email est requis' });
  else if (!validateEmail(form.email)) errors.push({ field: 'email', message: 'Format d\'email invalide' });
  if (!form.tel.trim()) errors.push({ field: 'tel', message: 'Le téléphone est requis' });
  else if (!validatePhone(form.tel)) errors.push({ field: 'tel', message: 'Numéro de téléphone invalide' });
  if (!form.adresse.trim()) errors.push({ field: 'adresse', message: 'L\'adresse est requise' });
  if (!form.codePostal.trim()) errors.push({ field: 'codePostal', message: 'Le code postal est requis' });
  else if (!validatePostalCode(form.codePostal)) errors.push({ field: 'codePostal', message: 'Code postal invalide (5 chiffres requis)' });
  if (form.type === 'entreprise' && !form.entreprise.trim()) {
    errors.push({ field: 'entreprise', message: 'Le nom de l\'entreprise est requis' });
  }
  
  return errors;
};

export const validateStep2 = (files: File[], clientType: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const requiredFiles = clientType === 'entreprise' ? 5 : 3;
  
  if (files.length < requiredFiles) {
    errors.push({ 
      field: 'documents', 
      message: `Veuillez fournir au moins ${requiredFiles} documents requis` 
    });
  }
  
  const maxSize = 500 * 1024 * 1024; // 500MB
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  if (totalSize > maxSize) {
    errors.push({ 
      field: 'documents', 
      message: 'La taille totale des fichiers ne doit pas dépasser 500 Mo' 
    });
  }
  
  return errors;
};

export const validateStep3 = (accepteContrat: boolean): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!accepteContrat) {
    errors.push({ 
      field: 'contract', 
      message: 'Vous devez accepter les conditions générales' 
    });
  }
  
  return errors;
};

export const validateStep4 = (card: CardData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!card.number.trim()) errors.push({ field: 'cardNumber', message: 'Le numéro de carte est requis' });
  else if (!validateCardNumber(card.number)) errors.push({ field: 'cardNumber', message: 'Numéro de carte invalide' });
  
  if (!card.name.trim()) errors.push({ field: 'cardName', message: 'Le nom du titulaire est requis' });
  
  if (!card.expiry.trim()) errors.push({ field: 'cardExpiry', message: 'La date d\'expiration est requise' });
  else if (!validateExpiryDate(card.expiry)) errors.push({ field: 'cardExpiry', message: 'Date d\'expiration invalide' });
  
  if (!card.cvc.trim()) errors.push({ field: 'cardCvc', message: 'Le code CVC est requis' });
  else if (!validateCVC(card.cvc)) errors.push({ field: 'cardCvc', message: 'Code CVC invalide' });
  
  return errors;
};