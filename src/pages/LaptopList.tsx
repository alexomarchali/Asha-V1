import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLaptops } from '../context/LaptopContext';

export default function LaptopList() {
  const navigate = useNavigate();
  const { laptops, deleteLaptop } = useLaptops();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [timeoutMessage, setTimeoutMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  useEffect(() => {
    if (timeoutMessage) {
      const timeout = setTimeout(() => {
        setTimeoutMessage('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [timeoutMessage]);

  const handleDelete = (laptopId: string) => {
    setShowDeleteConfirm(laptopId);
    
    const timeout = setTimeout(() => {
      if (showDeleteConfirm === laptopId) {
        setShowDeleteConfirm(null);
        setTimeoutMessage('Verwijder aanvraag is verlopen na 15 minuten inactiviteit');
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    setDeleteTimeout(timeout);
  };

  const confirmDelete = (laptopId: string) => {
    deleteLaptop(laptopId);
    setShowDeleteConfirm(null);
    setSuccessMessage('Laptop is succesvol verwijderd');
    if (deleteTimeout) {
      clearTimeout(deleteTimeout);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
    if (deleteTimeout) {
      clearTimeout(deleteTimeout);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Overzicht Laptops</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {laptops.map((laptop) => {
          const activeProblems = laptop.problems.filter(p => p.status === 'open');
          const resolvedProblems = laptop.problems.filter(p => p.status === 'resolved');
          
          return (
            <div key={laptop.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-[#07114d] break-words flex-1">
                  {laptop.computerName}
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(laptop.id);
                  }}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 ml-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div 
                onClick={() => navigate(`/laptops/${laptop.id}`)}
                className="mt-2 space-y-1 text-[#1c1c1c] cursor-pointer"
              >
                <p className="break-words">CPU: {laptop.cpu}</p>
                <p className="break-words">RAM: {laptop.ram}</p>
                <p>Status: <span className={
                  laptop.status === 'storing' ? 'text-[#d73f3f]' :
                  laptop.status === 'Controleren' ? 'text-[#e4c76b]' :
                  laptop.status === 'beschikbaar' ? 'text-[#599651]' :
                  laptop.status === 'in behandeling' ? 'text-[#e4c76b]' :
                  laptop.status === 'gereserveerd' ? 'text-[#07114d]' :
                  'text-[#599651]'
                }>{laptop.status}</span></p>
                
                {activeProblems.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1 text-[#d73f3f]">
                      <AlertCircle size={16} />
                      <span>{activeProblems.length} actief {activeProblems.length === 1 ? 'probleem' : 'problemen'}</span>
                    </div>
                  </div>
                )}

                {resolvedProblems.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1 text-[#599651]">
                      <CheckCircle2 size={16} />
                      <span>{resolvedProblems.length} opgelost {resolvedProblems.length === 1 ? 'probleem' : 'problemen'}</span>
                    </div>
                  </div>
                )}
              </div>

              {showDeleteConfirm === laptop.id && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-[#d73f3f] mb-2">
                    Weet u zeker dat u deze laptop wilt verwijderen?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(laptop.id);
                      }}
                      className="flex-1 px-3 py-1 bg-[#d73f3f] text-white rounded-lg hover:bg-red-600"
                    >
                      Bevestigen
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelDelete();
                      }}
                      className="flex-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/laptops/create')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Nieuwe Laptop Toevoegen
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-100 text-[#599651] rounded-lg">
          {successMessage}
        </div>
      )}

      {timeoutMessage && (
        <div className="p-4 bg-yellow-100 text-[#e4c76b] rounded-lg">
          {timeoutMessage}
        </div>
      )}
    </div>
  );
}