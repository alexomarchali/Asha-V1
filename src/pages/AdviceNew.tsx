import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvice } from '../context/AdviceContext';

interface AdviceForm {
  type: string;
  description: string;
  requirements: string[];
  additionalNotes: string;
}

export default function AdviceNew() {
  const navigate = useNavigate();
  const { addAdvice } = useAdvice();
  const [formData, setFormData] = useState<AdviceForm>({
    type: '',
    description: '',
    requirements: [],
    additionalNotes: ''
  });
  const [error, setError] = useState('');

  const adviceTypes = [
    'Nieuw softwarepakket',
    'Nieuwe functionaliteit',
    'Hardware kwaliteit'
  ];

  const requirementOptions = {
    'Nieuw softwarepakket': [
      'Compatibiliteit met bestaande systemen',
      'Gebruiksvriendelijke interface',
      'Offline beschikbaarheid',
      'Data import/export mogelijkheden',
      'Multi-user ondersteuning',
      'Printer driver voor printtaken',
      'Performance status monitoring (CPU, RAM, etc.)'
    ],
    'Nieuwe functionaliteit': [
      'Mobiele simulatie',
      'Presentatie tools',
      'Remote desktop mogelijkheden',
      'Cloud synchronisatie',
      'Virtualisatie opties'
    ],
    'Hardware kwaliteit': [
      'Geluidskaart kwaliteit',
      'Videokaart prestaties',
      'Processor snelheid',
      'Geheugen capaciteit',
      'Scherm resolutie'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description) {
      setError('Vul alle verplichte velden in');
      return;
    }

    addAdvice(formData);
    navigate('/advice/overview');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Advies Geven</h1>
        <button
          onClick={() => navigate('/advice/overview')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Terug naar overzicht
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Type Advies *
          </label>
          <select
            value={formData.type}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                type: e.target.value,
                requirements: []
              }));
            }}
            className="w-full rounded-lg border-gray-300 shadow-sm"
            required
          >
            <option value="">Selecteer type advies</option>
            {adviceTypes.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Beschrijving *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-lg border-gray-300 shadow-sm"
            rows={4}
            placeholder="Beschrijf hier uw adviesvraag..."
            required
          />
        </div>

        {formData.type && (
          <div>
            <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
              Specifieke Vereisten
            </label>
            <div className="space-y-2">
              {requirementOptions[formData.type as keyof typeof requirementOptions].map(option => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requirements.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          requirements: [...prev.requirements, option]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          requirements: prev.requirements.filter(r => r !== option)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
            Aanvullende opmerkingen
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            className="w-full rounded-lg border-gray-300 shadow-sm"
            rows={4}
            placeholder="Voeg hier eventuele extra informatie toe..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-[#d73f3f] rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/advice/overview')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Annuleren
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#599651] text-white rounded-lg hover:bg-green-600"
          >
            Advies Versturen
          </button>
        </div>
      </form>
    </div>
  );
}