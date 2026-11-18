// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { HealthControlPage } from './pages/HealthControlPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { MedicalArchivePage } from './pages/MedicalArchivePage';
import { FamilyProfilePage } from './pages/FamilyProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LibraryPage } from './pages/LibraryPage';
import { CalendarPage } from './pages/CalendarPage';

// Full Pregnancy Subpages
import { PregnancyPage } from './pages/PregnancyPage';
import { Baby3DPage } from './pages/pregnancy/Baby3DPage';
import { BabySizePage } from './pages/pregnancy/BabySizePage';
import { AnatomyPage } from './pages/pregnancy/AnatomyPage';
import { OrgansPage } from './pages/pregnancy/OrgansPage';
import { PregnancyCalendarPage } from './pages/pregnancy/PregnancyCalendarPage';
import { MomDiaryPage } from './pages/pregnancy/MomDiaryPage';
import { MovementsPage } from './pages/pregnancy/MovementsPage';
import { PregnancySchoolPage } from './pages/pregnancy/PregnancySchoolPage';
import { ForDadPage } from './pages/pregnancy/ForDadPage';
import { BirthPrepPage } from './pages/pregnancy/BirthPrepPage';
import { PregnancyMedicalCardPage } from './pages/pregnancy/PregnancyMedicalCardPage';

import { AuthModal } from './components/common/AuthModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    // Show onboarding for first-time visitors if not yet marked done
    const hasCompleted = localStorage.getItem('nesta_onboarding_completed');
    if (!hasCompleted && localStorage.getItem('nesta_user')) {
      setOnboardingOpen(true);
    }
  }, []);

  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage onOpenAuth={() => setAuthModalOpen(true)} />} />

        {/* Authenticated Dashboard Shell */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="ai-assistant" element={<AiAssistantPage />} />
          <Route path="health-control" element={<HealthControlPage />} />
          <Route path="symptom-checker" element={<SymptomCheckerPage />} />
          <Route path="medical-archive" element={<MedicalArchivePage />} />
          <Route path="family" element={<FamilyProfilePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Full Pregnancy Module Routes */}
          <Route path="pregnancy" element={<PregnancyPage />} />
          <Route path="pregnancy/3d-baby" element={<Baby3DPage />} />
          <Route path="pregnancy/baby-size" element={<BabySizePage />} />
          <Route path="pregnancy/anatomy" element={<AnatomyPage />} />
          <Route path="pregnancy/organs" element={<OrgansPage />} />
          <Route path="pregnancy/calendar" element={<PregnancyCalendarPage />} />
          <Route path="pregnancy/diary" element={<MomDiaryPage />} />
          <Route path="pregnancy/movements" element={<MovementsPage />} />
          <Route path="pregnancy/school" element={<PregnancySchoolPage />} />
          <Route path="pregnancy/for-dad" element={<ForDadPage />} />
          <Route path="pregnancy/birth-prep" element={<BirthPrepPage />} />
          <Route path="pregnancy/medical-card" element={<PregnancyMedicalCardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Global Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </>
  );
};

export default App;
