import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvice } from '../context/AdviceContext';

export default function AdviceProcessed() {
  const navigate = useNavigate();
  const { adviceRequests } = useAdvice();
  const processedAdvice = adviceRequests.filter(
    advice => advice.status === 'approved' || advice.status === 'rejected'
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">Verwerkte Adviezen</h1>
        <button
          onClick={() => navigate('/advice/overview')}
          className="px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Terug naar overzicht
        </button>
      </div>

      <div className="grid gap-4">
        {processedAdvice.map((advice) => (
          <div key={advice.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="font-semibold">Type: {advice.type}</p>
                <p className={`font-semibold ${
                  advice.status === 'approved' ? 'text-[#599651]' : 'text-[#d73f3f]'
                }`}>
                  {advice.status === 'approved' ? 'Goedgekeurd' : 'Afgewezen'}
                </p>
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
              {advice.rejectionReason && (
                <div>
                  <p className="font-semibold text-[#d73f3f]">Reden voor afwijzing:</p>
                  <p className="whitespace-pre-wrap">{advice.rejectionReason}</p>
                </div>
              )}
              <div className="text-sm text-gray-500 space-y-1">
                <p>Aangevraagd op: {new Date(advice.createdAt).toLocaleDateString()}</p>
                {advice.processedAt && (
                  <p>Verwerkt op: {new Date(advice.processedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {processedAdvice.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Er zijn nog geen verwerkte adviezen
          </div>
        )}
      </div>
    </div>
  );
}