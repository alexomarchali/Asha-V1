import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Laptop } from '../types';

const initialLaptops: Laptop[] = [
  {
    id: '1',
    computerName: 'Laptop-001',
    cpu: 'Intel i7',
    ram: '16GB',
    gpu: 'NVIDIA RTX 3060',
    softwareVersion: 'Windows 11',
    status: 'beschikbaar',
    remarks: [],
    problems: []
  },
  {
    id: '2',
    computerName: 'Laptop-002',
    cpu: 'AMD Ryzen 9',
    ram: '32GB',
    gpu: 'NVIDIA RTX 4080',
    softwareVersion: 'Windows 11',
    status: 'in behandeling',
    remarks: [],
    problems: []
  }
];

interface LaptopContextType {
  laptops: Laptop[];
  updateLaptop: (updatedLaptop: Laptop) => void;
  deleteLaptop: (id: string) => void;
  addLaptop: (laptop: Laptop) => void;
}

const LaptopContext = createContext<LaptopContextType | undefined>(undefined);

export function LaptopProvider({ children }: { children: ReactNode }) {
  const [laptops, setLaptops] = useState<Laptop[]>(initialLaptops);

  const updateLaptop = (updatedLaptop: Laptop) => {
    setLaptops(prev => prev.map(laptop => 
      laptop.id === updatedLaptop.id ? updatedLaptop : laptop
    ));
  };

  const deleteLaptop = (id: string) => {
    setLaptops(prev => prev.filter(laptop => laptop.id !== id));
  };

  const addLaptop = (laptop: Laptop) => {
    setLaptops(prev => [...prev, laptop]);
  };

  return (
    <LaptopContext.Provider value={{ laptops, updateLaptop, deleteLaptop, addLaptop }}>
      {children}
    </LaptopContext.Provider>
  );
}

export function useLaptops() {
  const context = useContext(LaptopContext);
  if (context === undefined) {
    throw new Error('useLaptops must be used within a LaptopProvider');
  }
  return context;
}