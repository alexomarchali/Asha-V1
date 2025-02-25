import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaptops } from '../context/LaptopContext';

export default function LaptopCreate() {
  const navigate = useNavigate();
  const { addLaptop } = useLaptops();
  const [formData, setFormData] = useState({
    computerName: '',
    cpu: '',
    ram: '',
    gpu: '',
    softwareVersion: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(formData).some(value => !value.trim())) {
      setError('kan gegevens niet aanmaken vul alle verplichte velden in.');
      return;
    }

    const newLaptop = {
      id: crypto.randomUUID(),
      ...formData,
      status: 'Ingebruik' as const,
      remarks: [],
      problems: []
    };

    addLaptop(newLaptop);
    navigate('/laptops');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Nieuwe Laptop Toevoegen</h1>
        <button
          onClick={() => navigate('/laptops')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Terug
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="computerName" className="block text-sm font-medium text-[#1c1c1c]">
              Computer Naam *
            </label>
            <input
              type="text"
              id="computerName"
              name="computerName"
              value={formData.computerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="cpu" className="block text-sm font-medium text-[#1c1c1c]">
              CPU *
            </label>
            <input
              type="text"
              id="cpu"
              name="cpu"
              value={formData.cpu}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="ram" className="block text-sm font-medium text-[#1c1c1c]">
              RAM *
            </label>
            <input
              type="text"
              id="ram"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="gpu" className="block text-sm font-medium text-[#1c1c1c]">
              GPU *
            </label>
            <input
              type="text"
              id="gpu"
              name="gpu"
              value={formData.gpu}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="softwareVersion" className="block text-sm font-medium text-[#1c1c1c]">
              Software Versie *
            </label>
            <input
              type="text"
              id="softwareVersion"
              name="softwareVersion"
              value={formData.softwareVersion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-[#d73f3f] rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-[#599651] text-white rounded-lg hover:bg-green-600"
          >
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}