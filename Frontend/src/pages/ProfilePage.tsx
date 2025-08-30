import React, { useEffect, useState } from 'react';
import { User as FirebaseUser, updateEmail, updateProfile } from 'firebase/auth';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Check, 
  X, 
  Shield, 
  ArrowLeft,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

type EditableField =
  | 'displayName'
  | 'birthDate'
  | 'phone'
  | 'addressGroup'
  | 'email';

const fieldLabels: Record<EditableField, string> = {
  displayName: "Prénom et nom de famille",
  birthDate: "Date de naissance",
  phone: "Téléphone",
  addressGroup: "Adresse postale",
  email: "Adresse e-mail",
};

const fieldIcons: Record<EditableField, React.ReactNode> = {
  displayName: <User className="h-5 w-5" />,
  birthDate: <Calendar className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
  addressGroup: <MapPin className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
};

const addressFields = [
  { name: "address", label: "Adresse (rue, numéro...)", required: true },
  { name: "address_complement", label: "Complément d'adresse", required: false },
  { name: "postal_code", label: "Code postal", required: true },
  { name: "etage", label: "Étage", required: false },
  { name: "porte", label: "Porte", required: false },
] as const;

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return user.slice(0, 2) + '*'.repeat(user.length - 2) + '@' + domain;
}

function maskPhone(phone: string) {
  if (!phone) return "";
  if (phone.length < 5) return phone;
  return phone.slice(0, 3) + '*****' + phone.slice(-4);
}

const Loader = ({ text = "Chargement..." }: { text?: string }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-500 to-purple-600 mb-4" />
    <p className="text-gray-600 animate-pulse">{text}</p>
  </div>
);

// Validation rapide
const validateField = (field: EditableField, value: string) => {
  switch (field) {
    case "email":
      return /\S+@\S+\.\S+/.test(value);
    case "phone":
      return /^\+?\d{9,15}$/.test(value);
    case "birthDate":
      return value.length === 10;
    default:
      return value.length > 0;
  }
};

// Service API pour les opérations profile
const profileService = {
  async getProfile(userId: string) {
    try {
      console.log(`🔍 Récupération du profil pour userId: ${userId}`);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`);
      
      if (response.status === 404) {
        const errorData = await response.json();
        console.log(`❌ Profil non trouvé:`, errorData);
        return null;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération du profil');
      }
      
      const data = await response.json();
      console.log(`✅ Profil récupéré:`, data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  async createProfile(userId: string, profileData: any) {
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
      
      const data = await response.json();
      console.log(`✅ Profil créé:`, data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du profil:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, profileData: any) {
    try {
      console.log(`🔄 Mise à jour du profil pour userId: ${userId}`, profileData);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
      }
      
      const data = await response.json();
      console.log(`✅ Profil mis à jour:`, data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  async updateField(userId: string, field: string, value: any) {
    try {
      // Récupérer d'abord le profil actuel
      const currentProfile = await this.getProfile(userId);
      
      // Créer l'objet de mise à jour
      const updatedProfile = {
        ...currentProfile,
        [field]: value,
      };
      
      // Supprimer les champs qui ne doivent pas être sauvegardés
      delete updatedProfile.id;
      delete updatedProfile.createdAt;
      
      return await this.updateProfile(userId, updatedProfile);
    } catch (error) {
      console.error(`❌ Erreur lors de la mise à jour du champ ${field}:`, error);
      throw error;
    }
  }
};

const ProfilePage: React.FC<{ user: FirebaseUser }> = ({ user }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showMasked, setShowMasked] = useState<Record<string, boolean>>({
    email: true,
    phone: true
  });

  // Pour adresse groupée :
  const [editAddress, setEditAddress] = useState<any>({
    address: "",
    address_complement: "",
    postal_code: "",
    etage: "",
    porte: ""
  });

  useEffect(() => {
    if (!user?.uid) return;
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const fetchProfile = async () => {
      try {
        console.log(`🔍 Chargement du profil pour l'utilisateur: ${user.uid}`);
        
        // Tentative de récupération du profil existant
        let profileData = await profileService.getProfile(user.uid);
        
        // Si aucun profil n'existe, créer un profil par défaut
        if (!profileData) {
          console.log(`📝 Aucun profil trouvé, création d'un profil par défaut...`);
          
          const defaultProfile = {
            birthDate: '',
            phone: '',
            address: '',
            address_complement: '',
            postal_code: '',
            etage: '',
            porte: '',
          };
          
          profileData = await profileService.createProfile(user.uid, defaultProfile);
        }
        
        if (!isCancelled) {
          console.log(`✅ Profil chargé avec succès:`, profileData);
          setProfile(profileData);
        }
      } catch (err: any) {
        console.error('❌ Erreur lors du chargement du profil:', err);
        if (!isCancelled) {
          setError(err.message || "Erreur lors du chargement du profil.");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isCancelled = true; };
  }, [user]);

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Edition d'un champ (hors adresse groupée)
  const handleEdit = (field: EditableField) => {
    setEditing(field);
    setError(null);
    setSuccessMsg(null);
    if (field === "displayName") setEditValue(user.displayName || "");
    else if (field === "email") setEditValue(user.email || "");
    else if (field === "addressGroup" && profile) {
      setEditAddress({
        address: profile.address || "",
        address_complement: profile.address_complement || "",
        postal_code: profile.postal_code || "",
        etage: profile.etage || "",
        porte: profile.porte || "",
      });
    } else setEditValue(profile?.[field] || "");
  };

  // Sauvegarde 
  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (editing === "addressGroup") {
        // Validation : au moins l'adresse obligatoire
        if (!editAddress.address || !editAddress.postal_code) {
          setError("L'adresse et le code postal sont obligatoires.");
          setSaving(false);
          return;
        }

        // Mise à jour via l'API
        await profileService.updateProfile(user.uid, {
          ...profile,
          ...editAddress
        });

        setProfile((prev: any) => ({ ...prev, ...editAddress }));
        setSuccessMsg("Adresse mise à jour avec succès !");
        setEditing(null);
      } else {
        // Validation simple
        if (!validateField(editing, editValue)) {
          setSaving(false);
          setError("Format invalide. Veuillez vérifier votre saisie.");
          return;
        }

        if (editing === "displayName") {
          await updateProfile(user, { displayName: editValue });
          setSuccessMsg("Nom mis à jour avec succès !");
        } else if (editing === "email") {
          await updateEmail(user, editValue);
          setSuccessMsg("Adresse email mise à jour avec succès !");
        } else if (profile) {
          // Mise à jour via l'API
          await profileService.updateField(user.uid, editing, editValue);
          setProfile((prev: any) => ({ ...prev, [editing]: editValue }));
          setSuccessMsg("Modification enregistrée avec succès !");
        }
        
        setEditing(null);
        if (editing === "displayName" || editing === "email") {
          setTimeout(() => window.location.reload(), 1500);
        }
      }
    } catch (err: any) {
      console.error('❌ Erreur lors de la sauvegarde:', err);
      setError(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const toggleMask = (field: string) => {
    setShowMasked(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getFieldValue = (field: EditableField) => {
    switch (field) {
      case "displayName":
        return user.displayName || "Non renseigné";

      case "email":
        const email = user.email || "";
        return showMasked.email ? maskEmail(email) : email;

      case "phone":
        const phone = profile?.phone || "";
        return phone ? (showMasked.phone ? maskPhone(phone) : phone) : "Non renseigné";

      case "birthDate":
        const rawDate = profile?.birthDate;
        if (!rawDate) return "Non renseigné";

        try {
          const formatted = new Date(rawDate).toLocaleDateString('fr-FR');
          return isNaN(new Date(rawDate).getTime()) ? "Date invalide" : formatted;
        } catch {
          return "Date invalide";
        }

      default:
        return profile?.[field] || "Non renseigné";
    }
  };

  const getAddressDisplay = () => {
    if (!profile) return "Non renseigné";
    
    const parts = [
      profile.address,
      profile.address_complement,
      [profile.postal_code, profile.etage, profile.porte].filter(Boolean).join(" • ")
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join('\n') : "Non renseigné";
  };

  if (loading) return <Loader text="Chargement de vos données..." />;
  
  if (error && !profile) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" /> 
            Retour
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Mes Données Personnelles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gérez vos informations personnelles en toute sécurité
          </p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span className="text-green-800 font-medium">{successMsg}</span>
          </div>
        )}

        {/* Profile Cards */}
        <div className="space-y-6">
          {(['displayName', 'birthDate', 'email', 'phone'] as EditableField[]).map((field) => (
            <div key={field} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-black to-gray-800 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {fieldIcons[field]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{fieldLabels[field]}</h3>
                      {editing === field ? (
                        <div className="space-y-3">
                          <input
                            type={field === 'birthDate' ? "date" : (field === 'email' ? "email" : "text")}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="width:512px border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 transition-colors duration-200 outline-none"
                            autoFocus
                            placeholder={fieldLabels[field]}
                          />
                          {error && editing === field && (
                            <p className="text-red-500 text-sm flex items-center gap-2">
                              <X className="h-4 w-4" />
                              {error}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700 text-base">
                            {getFieldValue(field)}
                          </span>
                          {(field === 'email' || field === 'phone') && profile[field] && (
                            <button
                              onClick={() => toggleMask(field)}
                              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              {showMasked[field] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {editing === field ? (
                      <>
                        <button 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 disabled:opacity-50"
                          disabled={saving}
                          onClick={handleSave}
                        >
                          {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {saving ? 'Sauvegarde...' : 'Enregistrer'}
                        </button>
                        <button 
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 disabled:opacity-50"
                          disabled={saving}
                          onClick={() => { setEditing(null); setError(null); }}
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button 
                        className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 group-hover:scale-105"
                        onClick={() => handleEdit(field)}
                      >
                        <Edit3 className="h-4 w-4" />
                        Modifier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Address Group Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-black to-gray-800 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {fieldIcons["addressGroup"]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{fieldLabels["addressGroup"]}</h3>
                    {editing === "addressGroup" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addressFields.map(f => (
                            <div key={f.name} className={f.name === 'address' ? 'md:col-span-2' : ''}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label} {f.required && <span className="text-red-500">*</span>}
                              </label>
                              <input
                                type="text"
                                value={editAddress[f.name] || ""}
                                onChange={e => setEditAddress((prev: any) => ({ ...prev, [f.name]: e.target.value }))}
                                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 transition-colors duration-200 outline-none"
                                placeholder={f.label}
                                required={f.required}
                              />
                            </div>
                          ))}
                        </div>
                        {error && editing === "addressGroup" && (
                          <p className="text-red-500 text-sm flex items-center gap-2">
                            <X className="h-4 w-4" />
                            {error}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-700 text-base whitespace-pre-line">
                        {getAddressDisplay()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {editing === "addressGroup" ? (
                    <>
                      <button 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 disabled:opacity-50"
                        disabled={saving}
                        onClick={handleSave}
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {saving ? 'Sauvegarde...' : 'Enregistrer'}
                      </button>
                      <button 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 disabled:opacity-50"
                        disabled={saving}
                        onClick={() => { setEditing(null); setError(null); }}
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button 
                      className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 group-hover:scale-105"
                      onClick={() => handleEdit("addressGroup")}
                    >
                      <Edit3 className="h-4 w-4" />
                      Modifier
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900">Sécurité et confidentialité</h3>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            Vos données personnelles sont protégées et chiffrées. Elles ne sont utilisées que pour améliorer votre expérience et ne sont jamais partagées avec des tiers sans votre consentement explicite.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;