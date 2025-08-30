// src/App.tsx

import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
  useLocation,
} from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import ReservationPage from './pages/ReservationPage';
import ContactPage from './pages/ContactPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import HowItWorksPage from './pages/HowItWorksPage';
import BrandPage from './pages/BrandPage';
import MyPlanPage from './pages/MyPlanPage';
import PaymentsPage from './pages/PaymentsPage';
import SimulationModal from './components/SimulationModal';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}



function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userChecked, setUserChecked] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('🚀 App mounted, setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('🔄 Auth state changed:', {
        hasUser: !!u,
        userEmail: u?.email,
        userDisplayName: u?.displayName,
        uid: u?.uid
      });
      setUser(u);
      setUserChecked(true);
    });

    // Vérification immédiate de l'état actuel
    console.log('🔍 Current auth state:', {
      currentUser: auth.currentUser,
      hasCurrentUser: !!auth.currentUser
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  console.log('🖥️ App render:', { 
    userChecked, 
    hasUser: !!user, 
    userEmail: user?.email 
  });

  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <Router>
      {!(isMobile && showSimulator) && <HeaderWrapper user={user} userChecked={userChecked} />}
      <ScrollToTopWrapper />
      <main className="overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePageWrapper setShowSimulator={setShowSimulator} />} />
          <Route path="/vehicles" element={<VehiclesPageWrapper />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPageWrapper />} />
          <Route path="/reservation/:id" element={<ReservationPageWrapper />} />
          <Route path="/service-detail/:type" element={<ServiceDetailPageWrapper />} />
          <Route path="/comment" element={<HowItWorksPageWrapper />} />
          <Route path="/brand/:brandId" element={<BrandPageWrapper />} />
          <Route path="/contact" element={<ContactPageWrapper />} />
          <Route path="/profile" element={<ProfilePageWrapper user={user} userChecked={userChecked} />} />
          <Route path="/my-plan" element={<MyPlanPageWrapper user={user} userChecked={userChecked} />} />
          <Route path="/payments" element={<PaymentsPageWrapper user={user} userChecked={userChecked} />} />
          
          {/* Redirection fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <SimulationModal isOpen={showSimulator} onClose={() => setShowSimulator(false)} />
      </main>
    <FooterWrapper />
    </Router>
  );
}

export default App;

// ----- PROFILE PAGE WRAPPER AVEC DEBUG COMPLET -----
function ProfilePageWrapper({ user, userChecked }: { user: FirebaseUser | null; userChecked: boolean }) {
  

  if (!userChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-700">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <ProfilePage user={user} />;
}


// ----- MY PLAN PAGE WRAPPER -----
function MyPlanPageWrapper({ 
  user, 
  userChecked 
}: { 
  user: FirebaseUser | null; 
  userChecked: boolean; 
}) {
  console.log('📋 MyPlanPageWrapper called:', { userChecked, hasUser: !!user });
  
  if (!userChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('❌ MyPlan: No user, redirecting');
    return <Navigate to="/" replace />;
  }
  
  return <MyPlanPage />;
}
// ----- HEADER WRAPPER -----
function HeaderWrapper({
  user,
  userChecked,
}: {
  user: FirebaseUser | null;
  userChecked: boolean;
}) {
  const navigate = useNavigate();

  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'home':
        if (data && data.scrollToFaq) {
          navigate('/', { state: { scrollToFaq: true } });
        } else {
          navigate('/');
        }
        break;
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'vehicle-details':
        if (typeof data === 'string') navigate(`/vehicle/${data}`);
        break;
      case 'reservation':
        if (typeof data === 'string') navigate(`/reservation/${data}`);
        break;
      case 'service-detail':
        if (typeof data === 'string') navigate(`/service-detail/${data}`);
        break;
      case 'comment':
        navigate('/comment');
        break;
      case 'brand':
        if (typeof data === 'string') navigate(`/brand/${data}`);
        break;

      // --- COMPTE CLIENT ---
      case 'profile':
        console.log("➡️ Navigation vers /profile depuis le Header");
        navigate('/profile');
        break;
      case 'subscription':
      case 'my-plan':
        navigate('/my-plan');
        break;
      case 'payment':
      case 'payments':
        navigate('/payments');
        break;

      // --- AUTRES PAGES ---
      case 'contact':
        navigate('/contact');
        break;

      default:
        navigate('/');
    }
  };

  return (
    <Header
      user={user}
      userChecked={userChecked}
      onPageChange={handlePageChange}
      scrollToFaq={() => handlePageChange('home', { scrollToFaq: true })}
      onLogout={() => handlePageChange('home')}
    />
  );
}


// ----- FOOTER WRAPPER -----
function FooterWrapper() {
  const navigate = useNavigate();
  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'vehicles':
        navigate('/vehicles');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'comment':
        navigate('/comment');
        break;
      case 'service-detail':
        if (typeof data === 'string') navigate(`/service-detail/${data}`);
        break;
      default:
        if (data !== undefined) console.log('[FooterWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };
  return <Footer onPageChange={handlePageChange} />;
}

function HomePageWrapper({ setShowSimulator }: { setShowSimulator: (show: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToFaqTrigger = location.state?.scrollToFaq;

  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'service-detail':
        if (typeof data === 'string') {
          navigate(`/service-detail/${data}`);
        }
        break;
      default:
        if (data !== undefined) {
          console.log('[HomePageWrapper] Unused page/data:', page, data);
        }
        navigate('/');
    }
  };

  return (
    <HomePage
      onPageChange={handlePageChange}
      scrollToFaqTrigger={scrollToFaqTrigger}
      setShowSimulator={setShowSimulator}
    />
  );
}



// ----- PAYMENTS PAGE WRAPPER -----
function PaymentsPageWrapper({ 
  user, 
  userChecked 
}: { 
  user: FirebaseUser | null; 
  userChecked: boolean; 
}) {
  if (!userChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <PaymentsPage />;
}

// ----- VEHICLES PAGE WRAPPER -----
function VehiclesPageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  // Récupère le filtre initial (si on arrive depuis "Utilitaires" ou un filtre)
  const initialCategory = location.state?.initialCategory || null;

  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'vehicle-details':
        if (typeof data === 'string') {
          navigate(`/vehicle/${data}`);
        } else if (data !== undefined) {
          console.log('[VehiclesPageWrapper] Param data véhicule inattendu:', data);
        }
        break;
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'home':
        if (data !== undefined) console.log('[VehiclesPageWrapper] Unused data:', data);
        navigate('/');
        break;       
      default:
        if (data !== undefined) console.log('[VehiclesPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };

  const handleCarSelect = (carId: string) => {
    navigate(`/vehicle/${carId}`);
  };

  return (
    <VehiclesPage
      onPageChange={handlePageChange}
      onCarSelect={handleCarSelect}
      initialCategory={initialCategory}
    />
  );
}

// Dans App.tsx - VehicleDetailsPageWrapper corrigé

function VehicleDetailsPageWrapper() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'vehicle-details':
        if (typeof data === 'string') navigate(`/vehicle/${data}`);
        else if (data !== undefined) console.log('[VehicleDetailsPageWrapper] Param data véhicule inattendu:', data);
        break;
      case 'reservation':
        // Gestion corrigée pour les données de réservation
        if (typeof data === 'string') {
          // Cas simple : juste l'ID du véhicule
          navigate(`/reservation/${data}`);
        } else if (data && typeof data === 'object' && data.selectedCarId) {
          // Cas complet : objet avec selectedCarId et selectedOptions
          navigate(`/reservation/${data.selectedCarId}`, { 
            state: { selectedOptions: data.selectedOptions } 
          });
        } else if (data !== undefined) {
          console.log('[VehicleDetailsPageWrapper] Param data reservation inattendu:', data);
        }
        break;
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'home':
        if (data !== undefined) console.log('[VehicleDetailsPageWrapper] Unused data:', data);
        navigate('/');
        break;
      default:
        if (data !== undefined) console.log('[VehicleDetailsPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };

  return id ? (
    <VehicleDetailsPage
      selectedCarId={id}
      onPageChange={handlePageChange}
      onReserve={() => navigate(`/reservation/${id}`)}
    />
  ) : null;
}
// ----- RESERVATION PAGE WRAPPER -----
function ReservationPageWrapper() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const selectedOptions = location.state?.selectedOptions;

  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'my-plan':
        if (data !== undefined) console.log('[ReservationPageWrapper] Unused data:', data);
        navigate('/my-plan');
        break;
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'home':
        if (data !== undefined) console.log('[ReservationPageWrapper] Unused data:', data);
        navigate('/');
        break;
      default:
        if (data !== undefined) console.log('[ReservationPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };
  return id ? (
    <ReservationPage
      selectedCarId={id}
      selectedOptions={selectedOptions}   
      onPageChange={handlePageChange}
    />
  ) : null;
}

// ----- SERVICE DETAIL PAGE WRAPPER -----
function ServiceDetailPageWrapper() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'home':
        if (data !== undefined) console.log('[ServiceDetailPageWrapper] Unused data:', data);
        navigate('/');
        break;
      default:
        if (data !== undefined) console.log('[ServiceDetailPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };
  return type ? (
    <ServiceDetailPage serviceType={type} onPageChange={handlePageChange} />
  ) : null;
}

// ----- BENEFITS PAGE WRAPPER -----
function HowItWorksPageWrapper() {
  const navigate = useNavigate();
  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'home':
        if (data !== undefined) console.log('[BenefitsPageWrapper] Unused data:', data);
        navigate('/');
        break;
      default:
        if (data !== undefined) console.log('[BenefitsPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };
  return <HowItWorksPage onPageChange={handlePageChange} />;
}


// ----- BRAND PAGE WRAPPER -----
function BrandPageWrapper() {
  const navigate = useNavigate();
  const { brandId } = useParams<{ brandId: string }>();
  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'vehicles':
        if (data && data.initialCategory) {
          navigate('/vehicles', { state: { initialCategory: data.initialCategory } });
        } else {
          navigate('/vehicles');
        }
        break;
      case 'vehicle-details':
        if (typeof data === 'string') navigate(`/vehicle/${data}`);
        break;
      case 'home':
        if (data !== undefined) console.log('[BrandPageWrapper] Unused data:', data);
        navigate('/');
        break;
      default:
        if (data !== undefined) console.log('[BrandPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };
  return brandId ? <BrandPage brandId={brandId} onPageChange={handlePageChange} /> : null;
}

// ----- CONTACT PAGE WRAPPER -----
function ContactPageWrapper() {
  const navigate = useNavigate();
  const handlePageChange = (page: string, data?: any) => {
    switch (page) {
      case 'home':
        if (data !== undefined) console.log('[ContactPageWrapper] Unused data:', data);
        navigate('/');
        break;
      default:
        if (data !== undefined) console.log('[ContactPageWrapper] Unused page/data:', page, data);
        navigate('/');
    }
  };
  return <ContactPage onPageChange={handlePageChange} />;
}



// ----- SCROLL TO TOP -----
function ScrollToTopWrapper() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}