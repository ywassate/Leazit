import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
// @ts-ignore
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import ReservationSummary from '../components/ReservationSummary';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import StepIndicator from '../components/StepIndicator';
import PaymentSection from '../components/PaymentSection';

import { FormData, CardData, ValidationError } from '../types/reservation';
import { validateStep1, validateStep2, validateStep3, validateStep4 } from '../utils/validation';
import type { CarType } from '../types/cars';

// ---------- CONFIG API ----------
/**
 * Standardise: définis VITE_API_URL = "/api" (ou "https://dev.agence.com/api")
 * Ici on assume "/api" par défaut si la variable n'est pas fournie.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
const api = (path: string) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// ---------- SERVICE CAR ----------
const carService = {
  async getCarById(carId: string): Promise<CarType | null> {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken?.();
      const response = await fetch(api(`/vehicles/${carId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const car = await response.json();
      return car;
    } catch (error) {
      console.error('Erreur lors de la récupération de la voiture:', error);
      throw error;
    }
  }
};

// ---------- UI STATES ----------
const Loader = ({ text = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
    <p className="text-gray-600 animate-pulse">{text}</p>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
      >
        Réessayer
      </button>
    </div>
  </div>
);

const CarNotFound = ({ carId }: { carId: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Véhicule non trouvé</h2>
      <p className="text-gray-600 mb-6">
        Le véhicule avec l'ID "{carId}" n'a pas pu être trouvé.
      </p>
      <button
        onClick={() => (window.location.href = "/vehicles")}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
      >
        Voir nos véhicules
      </button>
    </div>
  </div>
);

// ---------- PAGE ----------
interface ReservationPageProps {
  selectedCarId: string;
  selectedOptions?: {
    engagementIndex: number;
    mileageIndex: number;
    insuranceIndex: number;
    driversCount: number;
  };
  onPageChange: (page: string, data?: any) => void;
}

const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_TOTAL_SIZE_MB = 500;

const ReservationPage: React.FC<ReservationPageProps> = ({
  selectedCarId,
  onPageChange,
  selectedOptions
}) => {
  // Car (from API)
  const [car, setCar] = useState<CarType | null>(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0); // pour retry

  // Steps & forms
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    engagementIndex: selectedOptions?.engagementIndex ?? 0,
    mileageIndex: selectedOptions?.mileageIndex ?? 0,
    insuranceIndex: selectedOptions?.insuranceIndex ?? 0,
    driversCount: selectedOptions?.driversCount ?? 1, 
    type: '',
    nom: '',
    prenom: '',
    email: '',
    birthDate: '',
    tel: '',
    adresse: '',
    codePostal: '',
    etage: '',
    porte: '',
    entreprise: '',
    accepteContrat: false,
    assuranceRisque: false,
  });

  const [card, setCard] = useState<CardData>({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const clientTypeOptions = [
    { value: 'particulier', label: 'Particulier' },
    { value: 'entreprise', label: 'Entreprise' },
    { value: 'touriste', label: 'Touriste' }
  ];

  const stepTitles = [
    'Informations personnelles',
    'Documents d\'identité',
    'Conditions générales',
    'Paiement sécurisé'
  ];

  const steps = stepTitles.map((title, index) => ({
    id: index + 1,
    title,
    isCompleted: step > index + 1,
    isActive: step === index + 1
  }));

  // Fetch car
  useEffect(() => {
    let isCancelled = false;

    const fetchCar = async () => {
      if (!selectedCarId) {
        setCarError("ID de voiture manquant");
        setCarLoading(false);
        return;
      }

      setCarLoading(true);
      setCarError(null);

      try {
        const carData = await carService.getCarById(selectedCarId);
        if (!isCancelled) {
          if (carData) setCar(carData);
          else setCarError(`Véhicule avec l'ID ${selectedCarId} introuvable`);
        }
      } catch (error: any) {
        if (!isCancelled) {
          setCarError(error.message || "Erreur lors du chargement du véhicule");
        }
      } finally {
        if (!isCancelled) setCarLoading(false);
      }
    };

    fetchCar();
    return () => { isCancelled = true; };
  }, [selectedCarId, reloadKey]);

  // Prefill user
  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      const [prenom, nom] = user.displayName?.split(' ') || ['', ''];
      setForm((prev) => ({
        ...prev,
        email: user.email || '',
        nom,
        prenom,
      }));
    }
  }, []);

  const retryLoadCar = () => setReloadKey(k => k + 1);

  // Validation by step
  const validateCurrentStep = (): boolean => {
    let stepErrors: ValidationError[] = [];

    switch (step) {
      case 1:
        stepErrors = validateStep1(form);
        break;
      case 2:
        stepErrors = validateStep2(files, form.type);
        break;
      case 3:
        stepErrors = validateStep3(form.accepteContrat);
        break;
      case 4:
        stepErrors = validateStep4(card);
        break;
    }

    setErrors(stepErrors);
    return stepErrors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors([]);
  };

  // Upload docs to Storage
  const uploadAllDocs = async (uid: string, filesToUpload: File[]) => {
    if (!filesToUpload.length) return [];
    const storage = getStorage();
    const urls: string[] = [];

    for (const file of filesToUpload) {
      // filtre type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        continue;
      }
      const path = `users/${uid}/docs/${Date.now()}_${file.name}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      urls.push(url);
    }
    return urls;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    const user = getAuth().currentUser;
    if (!user || !car) {
      alert("Connexion requise.");
      return;
    }

    setIsSubmitting(true);

    try {
      const engagement = car.subscriptionOptions?.engagement?.[form.engagementIndex ?? 0];
      const mileage = car.subscriptionOptions?.mileage?.[form.mileageIndex ?? 0];
      const insuranceOpt = car.subscriptionOptions?.insurance?.[form.insuranceIndex ?? 0];

      let totalPrice = engagement?.monthlyPrice ?? 0;
      if (mileage?.additionalPrice) totalPrice += mileage.additionalPrice;
      if (form.assuranceRisque && insuranceOpt?.additionalPrice) totalPrice += insuranceOpt.additionalPrice;

      const drivers = Math.max(1, form.driversCount ?? 1);
      if (drivers > 1 && car.subscriptionOptions?.additionalDriverPrice) {
        totalPrice += (drivers - 1) * car.subscriptionOptions.additionalDriverPrice;
      }

      // Upload documents → URLs
      const docUrls = await uploadAllDocs(user.uid, files);

      const planData = {
        carId: car.id,
        engagement: engagement?.months ?? 0,
        mileage: mileage?.km ?? 0,
        insurance: !!form.assuranceRisque,
        price: totalPrice,
        startDate: new Date().toISOString(),
        form: { ...form },
        documents: docUrls,
        card: {
          last4: card.number.slice(-4),
          name: card.name,
          expiry: card.expiry,
          method: "Carte bancaire"
        },
        paymentCompleted: true, // TODO: remplacer par statut réel Stripe (webhook)
        reservationId: `RES-${Date.now()}`,
        selectedOptions: {
          engagement,
          mileage,
          insurance: insuranceOpt,
          driversCount: drivers
        }
      };

      // TODO: remplace la simulation par un appel backend créant un PaymentIntent Stripe
      await new Promise(resolve => setTimeout(resolve, 800));

      // Enregistrer la réservation (sous-collection)
      await setDoc(doc(db, 'users', user.uid, 'subscription', 'current'), planData);

      // Mettre à jour le profil utilisateur (merge safe)
      const addressComplement = `${form.etage ? `${form.etage} ` : ''}${form.porte || ''}`.trim();
      await setDoc(doc(db, 'users', user.uid), {
        phone: form.tel,
        birthDate: form.birthDate || '',
        address: form.adresse || '',
        address_complement: addressComplement,
        postal_code: form.codePostal || ''
      }, { merge: true });

      localStorage.setItem(`user_plan_${user.uid}`, JSON.stringify(planData));

      setIsSubmitting(false);
      onPageChange('my-plan');
    } catch (error: any) {
      setIsSubmitting(false);
      alert("Erreur lors de la sauvegarde : " + error.message);
    }
  };

  const getFieldError = (field: string) =>
    errors.find(error => error.field === field)?.message;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h3>

              <div className="space-y-6">
                <FormSelect
                  label="Type de client"
                  value={form.type}
                  onChange={(value) => setForm({ ...form, type: value as any })}
                  options={clientTypeOptions}
                  error={getFieldError('type')}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Prénom"
                    value={form.prenom}
                    onChange={(value) => setForm({ ...form, prenom: value })}
                    error={getFieldError('prenom')}
                    required
                  />
                  <FormInput
                    label="Nom"
                    value={form.nom}
                    onChange={(value) => setForm({ ...form, nom: value })}
                    error={getFieldError('nom')}
                    required
                  />
                </div>

                <FormInput
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm({ ...form, email: value })}
                  error={getFieldError('email')}
                  required
                />

                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={form.birthDate}
                  onChange={(value) => setForm({ ...form, birthDate: value })}
                  required
                  error={getFieldError('birthDate')}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country={'ma'}
                    value={form.tel}
                    onChange={(tel) => setForm({ ...form, tel })}
                    inputStyle={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '12px',
                      border: getFieldError('tel') ? '2px solid #fca5a5' : '2px solid #e5e7eb',
                      paddingLeft: '60px'
                    }}
                    containerStyle={{ width: '100%' }}
                  />
                  {getFieldError('tel') && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <span>{getFieldError('tel')}</span>
                    </div>
                  )}
                </div>

                <FormInput
                  label="Adresse complète"
                  value={form.adresse}
                  onChange={(value) => setForm({ ...form, adresse: value })}
                  placeholder="Rue, numéro, ville..."
                  error={getFieldError('adresse')}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Étage / Porte"
                    value={form.etage}
                    onChange={(value) => setForm({ ...form, etage: value })}
                    placeholder="Ex: 3ème étage, Porte A"
                  />
                  <FormInput
                    label="Code postal"
                    value={form.codePostal}
                    onChange={(value) => setForm({ ...form, codePostal: value })}
                    placeholder="Ex: 20000"
                    error={getFieldError('codePostal')}
                    required
                  />
                </div>

                {form.type === 'entreprise' && (
                  <FormInput
                    label="Nom de l'entreprise"
                    value={form.entreprise}
                    onChange={(value) => setForm({ ...form, entreprise: value })}
                    error={getFieldError('entreprise')}
                    required
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Documents requis</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <FileText className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Documents à fournir</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div><span>Carte d'identité nationale (CNI) ou Passeport</span></li>
                      <li className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div><span>Permis de conduire valide</span></li>
                      <li className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div><span>Carte bancaire (recto-verso)</span></li>
                      {form.type === 'entreprise' && (
                        <>
                          <li className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div><span>Extrait Kbis (moins de 3 mois)</span></li>
                          <li className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div><span>Justificatif financier</span></li>
                        </>
                      )}
                    </ul>
                    <p className="text-xs text-blue-700 mt-3">
                      Formats acceptés: PDF, JPG, PNG • Taille max: {MAX_TOTAL_SIZE_MB}MB au total
                    </p>
                  </div>
                </div>
              </div>

              <Form
                onFilesChange={(selectedFiles: File[]) => {
                  const filtered = selectedFiles.filter(f => ACCEPTED_FILE_TYPES.includes(f.type));
                  if (filtered.length !== selectedFiles.length) {
                    setFormError("Formats acceptés: PDF, JPG, PNG.");
                  }
                  const deduped = [
                    ...files,
                    ...filtered.filter(
                      (newFile) => !files.some((f) => f.name === newFile.name && f.size === newFile.size)
                    ),
                  ];
                  const totalSize = deduped.reduce((sum, file) => sum + file.size, 0);
                  if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
                    setFormError(`La taille totale des fichiers ne doit pas dépasser ${MAX_TOTAL_SIZE_MB} Mo.`);
                  } else {
                    setFormError(undefined);
                    setFiles(deduped);
                  }
                }}
                maxTotalSizeMo={MAX_TOTAL_SIZE_MB}
                errorMsg={formError || getFieldError('documents')}
                files={files}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Conditions générales</h3>

              <div className="bg-gray-50 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
                <h4 className="font-semibold text-gray-900 mb-4">Contrat de location longue durée</h4>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>En acceptant ces conditions, vous vous engagez à respecter les termes suivants :</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Utilisation responsable du véhicule selon les conditions d'usage</li>
                    <li>Respect des limitations kilométriques convenues</li>
                    <li>Entretien régulier selon le planning défini</li>
                    <li>Signalement immédiat de tout incident ou dommage</li>
                    <li>Restitution du véhicule en bon état à la fin du contrat</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-4">
                    Pour consulter l'intégralité des conditions générales,
                    <a href="#" className="text-blue-600 hover:underline ml-1">cliquez ici</a>.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={form.accepteContrat}
                      onChange={(e) => setForm({ ...form, accepteContrat: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                      form.accepteContrat ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {form.accepteContrat && <CheckCircle className="w-6 h-6 text-white -ml-0.5 -mt-0.5" />}
                    </div>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    J'accepte les conditions générales et le contrat de location longue durée.
                    Je certifie avoir lu et compris l'ensemble des clauses.
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>

                {getFieldError('contract') && (
                  <div className="text-red-600 text-sm pl-9">{getFieldError('contract')}</div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Paiement sécurisé</h3>
              <PaymentSection card={card} setCard={setCard} errors={errors} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ---------- RENDER GATES ----------
  if (carLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loader text="Chargement du véhicule..." />
      </div>
    );
  }

  if (carError) {
    return <ErrorState error={carError} onRetry={retryLoadCar} />;
  }

  if (!car) {
    return <CarNotFound carId={selectedCarId} />;
  }

  // ---------- VIEW ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <StepIndicator steps={steps} />
            {renderStepContent()}

            {/* Nav */}
            <div className="flex justify-between items-center pt-6">
              {step > 1 ? (
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Finaliser la réservation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ReservationSummary car={car} form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
