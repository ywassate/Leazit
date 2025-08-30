import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5050';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "8 caractères minimum";
  if (!/[a-z]/.test(password)) return "Une minuscule requise";
  if (!/[A-Z]/.test(password)) return "Une majuscule requise";
  if (!/\d/.test(password)) return "Un chiffre requis";
  if (!/[^a-zA-Z0-9]/.test(password)) return "Un caractère spécial requis";
  return null;
}

// Service API pour gérer les profils utilisateurs
const profileService = {
  async checkProfileExists(userId: string): Promise<boolean> {
    try {
      console.log(`🔍 Vérification de l'existence du profil pour userId: ${userId}`);
      // Utiliser HEAD pour une vérification plus efficace
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
        method: 'HEAD'
      });
      
      if (response.status === 404) {
        console.log(`❌ Profil non trouvé pour userId: ${userId}`);
        return false;
      }
      
      if (!response.ok) {
        console.log(`⚠️ Erreur lors de la vérification HEAD, fallback sur GET`);
        // Fallback sur GET si HEAD échoue
        const getResponse = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`);
        if (getResponse.status === 404) {
          console.log(`❌ Profil non trouvé (GET fallback) pour userId: ${userId}`);
          return false;
        }
        return getResponse.ok;
      }
      
      console.log(`✅ Profil existe pour userId: ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du profil:', error);
      // En cas d'erreur réseau, on assume que le profil n'existe pas
      return false;
    }
  },

  async createProfile(userId: string, profileData: any): Promise<boolean> {
    try {
      console.log(`🆕 Création du profil pour userId: ${userId}`, profileData);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du profil');
      }
      
      console.log(`✅ Profil créé avec succès pour userId: ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la création du profil:', error);
      throw error;
    }
  }
};

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ Fonction corrigée pour créer un profil SEULEMENT s'il n'existe pas
  const createUserProfileIfNotExists = async (user: any, displayName?: string) => {
    try {
      console.log(`🔍 Vérification du profil pour l'utilisateur: ${user.uid}`);
      
      // Vérifier si le profil existe déjà
      const profileExists = await profileService.checkProfileExists(user.uid);
      
      if (profileExists) {
        console.log(`✅ Profil existe déjà pour userId: ${user.uid}, aucune action nécessaire`);
        return;
      }
      
      // Créer le profil seulement s'il n'existe pas
      const profileData = {
        displayName: displayName || user.displayName || '',
        email: user.email || '',
        birthDate: '',
        phone: '',
        address: '',
        address_complement: '',
        postal_code: '',
        etage: '',
        porte: '',
      };
      
      console.log('📝 Création du nouveau profil avec:', profileData);
      await profileService.createProfile(user.uid, profileData);
      
    } catch (error) {
      console.error('❌ Erreur lors de la gestion du profil:', error);
      // Ne pas faire échouer l'authentification si la création du profil échoue
      console.log('⚠️ Échec de création du profil, mais authentification réussie');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (loadingGoogle) return;
      setLoadingGoogle(true);
      setErrorMsg(null);
      
      console.log('🔑 Tentative de connexion Google...');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ Authentification Google réussie pour:', result.user.email);
      
      // ✅ Créer un profil SEULEMENT s'il n'existe pas
      await createUserProfileIfNotExists(result.user);
      
      console.log('🎉 Processus de connexion Google terminé avec succès');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('❌ Erreur lors de la connexion Google:', err);
      setErrorMsg(err.message || "Erreur lors de la connexion Google.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoadingForm(true);

    if (isRegistering) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setErrorMsg(passwordError);
        setLoadingForm(false);
        return;
      }
    }

    try {
      console.log(`🔑 Tentative ${isRegistering ? 'inscription' : 'connexion'} avec email:`, email);
      
      if (isRegistering) {
        console.log('📝 Création du compte utilisateur...');
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        
        console.log('🏷️ Mise à jour du profil Firebase Auth...');
        await updateProfile(userCred.user, { displayName: fullName });
        
        console.log('✅ Compte créé avec succès pour:', userCred.user.email);
        
        // ✅ Créer un profil complet avec le nom saisi
        await createUserProfileIfNotExists(userCred.user, fullName);
        
      } else {
        console.log('🔐 Connexion avec email/password...');
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        
        console.log('✅ Connexion réussie pour:', userCred.user.email);
        
        // ✅ Vérifier et créer le profil si nécessaire (pour les anciens comptes)
        await createUserProfileIfNotExists(userCred.user);
      }

      console.log('🎉 Processus d\'authentification terminé avec succès');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(`❌ Erreur lors de l'${isRegistering ? 'inscription' : 'connexion'}:`, err);
      
      switch (err.code) {
        case "auth/email-already-in-use":
          setErrorMsg("Cet e-mail est déjà utilisé.");
          break;
        case "auth/invalid-email":
          setErrorMsg("L'adresse e-mail n'est pas valide.");
          break;
        case "auth/weak-password":
          setErrorMsg("Le mot de passe est trop faible.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          setErrorMsg("E-mail ou mot de passe incorrect.");
          break;
        case "auth/invalid-credential":
          setErrorMsg("Identifiants invalides. Vérifiez votre email et mot de passe.");
          break;
        case "auth/too-many-requests":
          setErrorMsg("Trop de tentatives. Veuillez réessayer plus tard.");
          break;
        default:
          setErrorMsg(err.message || "Une erreur est survenue.");
      }
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-xl flex flex-col md:flex-row">
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/authpic.jpeg')" }}
        ></div>

        <div className="w-full md:w-1/2 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors duration-200"
            aria-label="Fermer"
            disabled={loadingGoogle || loadingForm}
          >
            <X className="w-5 h-5" />
          </button>

          <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />

          <h2 className="text-black text-center text-xl font-bold mb-4">
            {isRegistering ? "Créer un compte" : "Connexion à votre compte"}
          </h2>

          {errorMsg && (
            <div className="mb-4 text-sm text-center text-red-600 bg-red-100 px-4 py-2 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle || loadingForm}
            className={`w-full border border-gray-300 py-3 rounded-lg mb-6 flex items-center justify-center text-black transition-all duration-200 ${
              loadingGoogle || loadingForm 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            {loadingGoogle ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2" />
            ) : (
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
            )}
            {loadingGoogle 
              ? "Connexion..." 
              : (isRegistering ? "S'inscrire avec Google" : "Se connecter avec Google")
            }
          </button>

          <div className="flex items-center mb-6">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">ou</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
                  placeholder="Votre nom complet"
                  autoComplete="name"
                  disabled={loadingGoogle || loadingForm}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
                placeholder="votre@email.com"
                autoComplete="email"
                disabled={loadingGoogle || loadingForm}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200"
                  placeholder="Mot de passe"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                  disabled={loadingGoogle || loadingForm}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={loadingGoogle || loadingForm}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-2">Exigences du mot de passe :</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    8 caractères minimum
                  </li>
                  <li className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial
                  </li>
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingGoogle || loadingForm}
              className={`w-full py-3 rounded-lg font-semibold text-center transition-all duration-200 border border-black ${
                loadingGoogle || loadingForm
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'text-black hover:bg-black hover:text-white'
              }`}
            >
              {loadingForm ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                  {isRegistering ? "Création..." : "Connexion..."}
                </div>
              ) : (
                isRegistering ? "S'inscrire" : "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-black">
            {isRegistering ? (
              <span>
                Vous avez déjà un compte ?{' '}
                <button 
                  type="button" 
                  onClick={() => { 
                    setIsRegistering(false); 
                    setErrorMsg(null); 
                    setEmail('');
                    setPassword('');
                    setFullName('');
                  }} 
                  className="text-blue-600 hover:underline font-medium transition-colors duration-200"
                  disabled={loadingGoogle || loadingForm}
                >
                  Se connecter
                </button>
              </span>
            ) : (
              <span>
                Pas encore de compte ?{' '}
                <button 
                  type="button" 
                  onClick={() => { 
                    setIsRegistering(true); 
                    setErrorMsg(null); 
                    setEmail('');
                    setPassword('');
                  }} 
                  className="text-blue-600 hover:underline font-medium transition-colors duration-200"
                  disabled={loadingGoogle || loadingForm}
                >
                  S'inscrire
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;