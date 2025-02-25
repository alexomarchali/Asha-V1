import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvice } from '../context/AdviceContext';

export default function AdviceOverview() {
  const navigate = useNavigate();
  const { adviceRequests, updateAdviceStatus } = useAdvice();
  const pendingAdvice = adviceRequests.filter(advice => advice.status === 'pending');

  const handleReject = (id: string) => {
    const reason = prompt('Geef een reden voor afwijzing:');
    if (reason) {
      updateAdviceStatus(id, 'rejected', reason);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Voorgestelde Adviezen</h1>

      <div className="grid gap-4">
        {pendingAdvice.map((advice) => (
          <div key={advice.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <p className="font-semibold">Type: {advice.type}</p>
                <p className="text-[#e4c76b] font-semibold">In behandeling</p>
              </div>
              <div>
                <p className="font-semibold">Beschrijving:</p>
                <p className="whitespace-pre-wrap">{advice.description}</p>
              </div>
              {advice.requirements.length > 0 && (
                <div>
                  <p className="font-semibold">Vereisten:</p>
                  <ul className="list-disc pl-5">
                    {advice.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {advice.additionalNotes && (
                <div>
                  <p className="font-semibold">Aanvullende opmerkingen:</p>
                  <p className="whitespace-pre-wrap">{advice.additionalNotes}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-sm text-gray-500">
                  Aangevraagd op: {new Date(advice.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => updateAdviceStatus(advice.id, 'approved')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#599651] text-white rounded-lg hover:bg-green-600"
                  >
                    Goedkeuren
                  </button>
                  <button
                    onClick={() => handleReject(advice.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#d73f3f] text-white rounded-lg hover:bg-red-600"
                  >
                    Afwijzen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {pendingAdvice.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center text-gray-500">
            Er zijn geen openstaande adviesaanvragen
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <button
          onClick={() => navigate('/advice/processed')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Verwerkte Adviezen
        </button>
        <button
          onClick={() => navigate('/advice/new')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Advies Geven
        </button>
      </div>
    </div>
  );
}