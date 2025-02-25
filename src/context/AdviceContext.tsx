import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface voor een adviesaanvraag
export interface Advice {
  id: string;
  type: string;           // Type advies (bijv. software, hardware)
  description: string;    // Beschrijving van de adviesaanvraag
  requirements: string[]; // Lijst met specifieke vereisten
  additionalNotes: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;     // Datum van aanvraag
  processedAt?: string;  // Datum van verwerking
  rejectionReason?: string; // Reden voor afwijzing
}

// Context interface voor adviezen
interface AdviceContextType {
  adviceRequests: Advice[];
  addAdvice: (advice: Omit<Advice, 'id' | 'status' | 'createdAt'>) => void;
  updateAdviceStatus: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => void;
}

const AdviceContext = createContext<AdviceContextType | undefined>(undefined);

// Provider component voor adviezen
export function AdviceProvider({ children }: { children: ReactNode }) {
  const [adviceRequests, setAdviceRequests] = useState<Advice[]>([]);

  // Functie om een nieuwe adviesaanvraag toe te voegen
  const addAdvice = (newAdvice: Omit<Advice, 'id' | 'status' | 'createdAt'>) => {
    const advice: Advice = {
      ...newAdvice,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAdviceRequests(prev => [advice, ...prev]);
  };

  // Functie om de status van een adviesaanvraag bij te werken
  const updateAdviceStatus = (id: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    setAdviceRequests(prev => prev.map(advice => 
      advice.id === id 
        ? {
            ...advice,
            status,
            processedAt: new Date().toISOString(),
            ...(rejectionReason && { rejectionReason })
          }
        : advice
    ));
  };

  return (
    <AdviceContext.Provider value={{ adviceRequests, addAdvice, updateAdviceStatus }}>
      {children}
    </AdviceContext.Provider>
  );
}

// Hook om de advies context te gebruiken
export function useAdvice() {
  const context = useContext(AdviceContext);
  if (!context) {
    throw new Error('useAdvice must be used within an AdviceProvider');
  }
  return context;
}