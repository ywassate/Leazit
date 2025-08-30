export const validateField = (field: string, value: string): { isValid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'Ce champ est requis' };
  }

  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { isValid: false, error: 'Format d\'email invalide' };
      }
      break;
      
    case 'phone':
      // Remove all non-digit characters for validation
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length < 9 || cleanPhone.length > 15) {
        return { isValid: false, error: 'Le numéro de téléphone doit contenir entre 9 et 15 chiffres' };
      }
      break;
      
    case 'birthDate':
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      
      if (isNaN(date.getTime())) {
        return { isValid: false, error: 'Date invalide' };
      }
      
      if (date > today) {
        return { isValid: false, error: 'La date de naissance ne peut pas être dans le futur' };
      }
      
      if (age < 16 || age > 120) {
        return { isValid: false, error: 'Vous devez avoir entre 16 et 120 ans' };
      }
      break;
      
    case 'displayName':
      if (value.trim().length < 2) {
        return { isValid: false, error: 'Le nom doit contenir au moins 2 caractères' };
      }
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
        return { isValid: false, error: 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets' };
      }
      break;
      
    case 'postal_code':
      if (!/^\d{5}$/.test(value)) {
        return { isValid: false, error: 'Le code postal doit contenir exactement 5 chiffres' };
      }
      break;
      
    default:
      if (value.trim().length === 0) {
        return { isValid: false, error: 'Ce champ ne peut pas être vide' };
      }
  }
  
  return { isValid: true };
};

export const validateAddress = (address: any): { isValid: boolean; error?: string } => {
  if (!address.address || address.address.trim() === '') {
    return { isValid: false, error: 'L\'adresse est obligatoire' };
  }
  
  if (!address.postal_code || address.postal_code.trim() === '') {
    return { isValid: false, error: 'Le code postal est obligatoire' };
  }
  
  const postalValidation = validateField('postal_code', address.postal_code);
  if (!postalValidation.isValid) {
    return postalValidation;
  }
  
  return { isValid: true };
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Moroccan numbers
  if (cleaned.startsWith('212')) {
    // International format
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  } else if (cleaned.startsWith('0')) {
    // National format
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  
  if (user.length <= 2) return email;
  
  return user.slice(0, 2) + '*'.repeat(Math.max(user.length - 2, 3)) + '@' + domain;
};

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 6) return phone;
  
  const formatted = formatPhone(phone);
  const parts = formatted.split(' ');
  
  if (parts.length > 2) {
    return parts[0] + ' ' + parts[1] + ' **' + ' **' + ' **' + (parts.length > 5 ? ' **' : '');
  }
  
  return phone.slice(0, 3) + '*'.repeat(Math.max(phone.length - 6, 3)) + phone.slice(-3);
};