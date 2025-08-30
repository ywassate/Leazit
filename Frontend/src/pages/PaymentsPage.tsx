import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Shield,
  Calendar,
  Sparkles,
  Download
} from "lucide-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const statusConfig = {
  "Payé": {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle
  },
  "Échoué": {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle
  },
  "En attente": {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: Clock
  }
};

const Loader = ({ text = "Chargement..." }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-500 to-purple-600 mb-4" />
    <p className="text-gray-600 animate-pulse">{text}</p>
  </div>
);

type Payment = {
  id: string;
  date: string;
  amount: number;
  status: "Payé" | "Échoué" | "En attente";
  method: string;
  last4: string;
};

type FuturePayment = {
  date: string;
  amount: number;
  label?: string;
  status?: "En attente" | "Payé";
};

type SavedCard = {
  last4: string;
  expiry: string;
  name: string;
  method: string;
};

const PaymentCard = ({ payment }: { payment: Payment }) => {
  const config = statusConfig[payment.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {new Date(payment.date).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
            <div className="text-sm text-gray-500">{payment.method} •••• {payment.last4}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{payment.amount} €</div>
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.border} ${config.color} border`}>
            <StatusIcon className="h-4 w-4" />
            {payment.status}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors duration-200">
          <Download className="h-4 w-4" />
          Télécharger le reçu
        </button>
      </div>
    </div>
  );
};

const FuturePaymentCard = ({ payment }: { payment: FuturePayment }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-blue-900">{payment.label || "Paiement à venir"}</div>
          <div className="text-sm text-blue-700">
            {new Date(payment.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-blue-900">{payment.amount} €</div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 border border-yellow-200 text-yellow-700">
          <Clock className="h-4 w-4" />
          {payment.status || "En attente"}
        </div>
      </div>
    </div>
  </div>
);

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [futurePayments, setFuturePayments] = useState<FuturePayment[]>([]);
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid, 'subscription', 'current');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.card) setSavedCard(data.card);

          setPayments([{
            id: data.reservationId || 'paiement-initial',
            date: data.startDate || new Date().toISOString(),
            amount: parseFloat(data.price) || 0,
            status: 'Payé' as const,
            method: data.card?.method || 'Carte bancaire',
            last4: data.card?.last4 || '••••'
          }]);

          setFuturePayments([{ 
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: Number(data.price || 0),
            label: "Prochain prélèvement",
            status: "En attente" as const
          }]);
        }
      } catch (error) {
        console.error("Erreur chargement paiements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCard = async () => {
    const user = getAuth().currentUser;
    if (!user) return;
    const last4 = prompt("Entrez les 4 derniers chiffres de la carte :");
    const expiry = prompt("Entrez la date d'expiration (MM/YY) :");
    const name = prompt("Entrez le nom sur la carte :");

    if (last4 && expiry && name) {
      const card: SavedCard = { last4, expiry, name, method: "Carte bancaire" };
      try {
        await setDoc(doc(db, 'users', user.uid, 'subscription', 'current'), { card }, { merge: true });
        setSavedCard(card);
        alert("Carte enregistrée avec succès !");
      } catch (err) {
        console.error("Erreur enregistrement carte :", err);
        alert("Erreur lors de l'enregistrement de la carte.");
      }
    }
  };

  if (loading) return <Loader text="Chargement de vos paiements..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Retour
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent mb-4">
            Mes Paiements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gérez vos moyens de paiement et consultez l'historique de vos transactions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Moyens de Paiement</h2>
                <p className="text-blue-100">Gérez vos cartes bancaires</p>
              </div>
              <div className="p-8">
                {savedCard ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Carte enregistrée</h3>
                    <p className="text-gray-600">
                      {savedCard.method} •••• {savedCard.last4} — Exp. {savedCard.expiry}
                    </p>
                    <button
                      onClick={handleAddCard}
                      className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-400 hover:to-gray-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl mx-auto group"
                    >
                      <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                      Modifier la carte
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune carte enregistrée</h3>
                    <p className="text-gray-600 mb-6">Ajoutez une carte bancaire pour vos paiements automatiques</p>
                    <button
                      onClick={handleAddCard}
                      className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-400 hover:to-gray-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl mx-auto group"
                    >
                      <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                      Ajouter une carte
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">Paiements sécurisés</h3>
              </div>
              <p className="text-green-800 text-sm leading-relaxed">
                Vos données bancaires sont protégées par un chiffrement de niveau bancaire. Nous ne stockons jamais vos informations de carte complètes.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Paiements à Venir</h2>
                <p className="text-indigo-100">Vos prochaines échéances</p>
              </div>
              <div className="p-8">
                {futurePayments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun paiement en attente</h3>
                    <p className="text-gray-600">Vous n'avez actuellement aucun paiement programmé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {futurePayments.map((payment, index) => (
                      <FuturePaymentCard key={index} payment={payment} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {payments.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-black to-gray-800 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Historique des Paiements</h2>
                  <p className="text-gray-100">Vos transactions récentes</p>
                </div>
                <div className="p-8 space-y-4">
                  {payments.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-black to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Informations importantes</h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p>• Vos mensualités sont prélevées automatiquement tous les 30 jours</p>
                <p>• Aucun frais ne sera appliqué tant que votre abonnement n'est pas confirmé</p>
                <p>• Vous recevrez un email de confirmation pour chaque transaction</p>
                <p>• En cas de problème de paiement, nous vous contacterons immédiatement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;