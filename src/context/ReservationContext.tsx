import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface voor een reservering
export interface Reservation {
  id: string;
  laptopId: string;
  userId: string;
  startDate: string;
  startTime: string;    // Tijd waarop de reservering start
  endDate: string;
  endTime: string;      // Tijd waarop de reservering eindigt
  quantity: number;     // Aantal laptops dat gereserveerd wordt
  description: string;  // Beschrijving van het doel van de reservering
  status: 'pending' | 'approved' | 'rejected';
  processedDate?: string;
  reason?: string;      // Reden voor afwijzing
}

// Context interface voor reserveringen
interface ReservationContextType {
  reservations: Reservation[];
  updateReservationStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

// Voorbeelddata voor reserveringen
const initialReservations: Reservation[] = [
  {
    id: '1',
    laptopId: 'Laptop-001',
    userId: 'user1',
    startDate: '2024-03-20',
    startTime: '12:00',
    endDate: '2024-03-20',
    endTime: '14:00',
    quantity: 10,
    description: 'We hebben deze laptops nodig voor taalles en willen graag Duolingo erop installeren.',
    status: 'pending'
  },
  {
    id: '2',
    laptopId: 'Laptop-002',
    userId: 'user2',
    startDate: '2024-03-22',
    startTime: '09:00',
    endDate: '2024-03-22',
    endTime: '16:00',
    quantity: 15,
    description: 'Programmeerles voor beginners. Visual Studio Code moet geïnstalleerd worden.',
    status: 'pending'
  }
];

// Provider component voor reserveringen
export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);

  // Functie om de status van een reservering bij te werken
  const updateReservationStatus = (id: string, status: 'approved' | 'rejected', reason?: string) => {
    setReservations(prev => prev.map(reservation =>
      reservation.id === id
        ? {
            ...reservation,
            status,
            processedDate: new Date().toISOString(),
            ...(reason && { reason })
          }
        : reservation
    ));
  };

  return (
    <ReservationContext.Provider value={{ reservations, updateReservationStatus }}>
      {children}
    </ReservationContext.Provider>
  );
}

// Hook om de reservering context te gebruiken
export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
}