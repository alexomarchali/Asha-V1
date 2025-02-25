{/* Main App component - Root component van de applicatie */}
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Component imports voor de layout
import AppBar from './components/AppBar';
import SideNav from './components/SideNav';
// Page imports voor verschillende routes
import LaptopList from './pages/LaptopList';
import LaptopDetail from './pages/LaptopDetail';
import LaptopCreate from './pages/LaptopCreate';
import LaptopRepairs from './pages/LaptopRepairs';
import ReservationList from './pages/ReservationList';
import ReservationStatus from './pages/ReservationStatus';
import AdviceNew from './pages/AdviceNew';
import AdviceOverview from './pages/AdviceOverview';
import AdviceProcessed from './pages/AdviceProcessed';
// Context providers voor state management
import { LaptopProvider } from './context/LaptopContext';
import { AdviceProvider } from './context/AdviceContext';
import { ReservationProvider } from './context/ReservationContext';

export default function App() {
  return (
    <Router>
      <LaptopProvider>
        <AdviceProvider>
          <ReservationProvider>
            <div className="min-h-screen bg-[#f2f2f2]">
              <AppBar />
              <div className="pt-14 md:pt-16">
                <SideNav />
                {/* Adjusted left padding for main content */}
                <main className="p-3 sm:p-6 ml-16 transition-all duration-200">
                  <Routes>
                  <Route path="/" element={<LaptopList />} />
                    <Route path="/laptops" element={<LaptopList />} />
                    <Route path="/laptops/:id" element={<LaptopDetail />} />
                    <Route path="/laptops/create" element={<LaptopCreate />} />
                    <Route path="/laptops/repairs" element={<LaptopRepairs />} />
                    <Route path="/reservations" element={<ReservationList />} />
                    <Route path="/reservations/status" element={<ReservationStatus />} />
                    <Route path="/advice/new" element={<AdviceNew />} />
                    <Route path="/advice/overview" element={<AdviceOverview />} />
                    <Route path="/advice/processed" element={<AdviceProcessed />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ReservationProvider>
        </AdviceProvider>
      </LaptopProvider>
    </Router>
  );
}