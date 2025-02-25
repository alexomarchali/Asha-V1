import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLaptops } from '../context/LaptopContext';

export default function LaptopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { laptops, updateLaptop } = useLaptops();
  const errorRef = useRef<HTMLDivElement>(null);
  
  const laptop = laptops.find(l => l.id === id);
  
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(laptop?.status || 'Ingebruik');
  const [newRemark, setNewRemark] = useState('');
  const [showRemarkForm, setShowRemarkForm] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errorMessage]);

  if (!laptop) {
    return <div>Laptop niet gevonden</div>;
  }

  const handleStatusUpdate = () => {
    if (newStatus === laptop.status) {
      setErrorMessage('Er is geen wijziging gemaakt.');
      return;
    }
    
    updateLaptop({ ...laptop, status: newStatus });
    setIsEditingStatus(false);
    setErrorMessage('');
  };

  const handleAddRemark = () => {
    if (!newRemark.trim()) {
      setErrorMessage('Opmerking is verplicht.');
      return;
    }

    updateLaptop({
      ...laptop,
      remarks: [...laptop.remarks, newRemark]
    });
    setNewRemark('');
    setShowRemarkForm(false);
    setErrorMessage('');
  };

  const handleReportProblem = () => {
    if (!problemDescription.trim()) {
      setErrorMessage('Melden mislukt: probleembeschrijving is verplicht.');
      return;
    }

    if (!reporterName.trim()) {
      setErrorMessage('Melden mislukt: naam is verplicht.');
      return;
    }

    if (!reporterEmail.trim()) {
      setErrorMessage('Melden mislukt: email is verplicht.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reporterEmail)) {
      setErrorMessage('Melden mislukt: voer een geldig emailadres in.');
      return;
    }

    const newProblem = {
      id: crypto.randomUUID(),
      description: problemDescription,
      reporterName: reporterName,
      reporterEmail: reporterEmail,
      status: 'open' as const,
      dateReported: new Date().toISOString()
    };

    updateLaptop({
      ...laptop,
      problems: [newProblem, ...laptop.problems]
    });
    setProblemDescription('');
    setReporterName('');
    setReporterEmail('');
    setShowProblemForm(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">{laptop.computerName}</h1>
        <button
          onClick={() => navigate('/laptops')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Terug
        </button>
      </div>

      {errorMessage && (
        <div ref={errorRef} className="p-4 bg-red-100 text-[#d73f3f] rounded-lg border-l-4 border-[#d73f3f] animate-fadeIn">
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">CPU:</p>
            <p className="break-words">{laptop.cpu}</p>
          </div>
          <div>
            <p className="font-semibold">RAM:</p>
            <p className="break-words">{laptop.ram}</p>
          </div>
          <div>
            <p className="font-semibold">GPU:</p>
            <p className="break-words">{laptop.gpu}</p>
          </div>
          <div>
            <p className="font-semibold">Software Versie:</p>
            <p className="break-words">{laptop.softwareVersion}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="font-semibold">Status:</p>
            {!isEditingStatus ? (
              <div className="flex gap-2 items-center w-full sm:w-auto">
                <span className={
                  laptop.status === 'storing' ? 'text-[#d73f3f]' :
                  laptop.status === 'Controleren' ? 'text-[#e4c76b]' :
                  'text-[#599651]'
                }>{laptop.status}</span>
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className="w-full sm:w-auto px-3 py-1 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
                >
                  Status aanpassen
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="rounded-lg border-gray-300 flex-1 sm:flex-none"
                >
                  <option value="beschikbaar">Beschikbaar</option>
                  <option value="in behandeling">In behandeling</option>
                  <option value="gereserveerd">Gereserveerd</option>
                  <option value="Ingebruik">In gebruik</option>
                  <option value="Controleren">Controleren</option>
                  <option value="storing">Storing</option>
                </select>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleStatusUpdate}
                    className="flex-1 sm:flex-none px-3 py-1 bg-[#599651] text-white rounded-lg hover:bg-green-600"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={() => setIsEditingStatus(false)}
                    className="flex-1 sm:flex-none px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-lg font-semibold">Opmerkingen</h2>
            <button
              onClick={() => setShowRemarkForm(true)}
              className="w-full sm:w-auto px-3 py-1 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
            >
              Opmerking toevoegen
            </button>
          </div>
          {showRemarkForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Voer een opmerking in..."
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAddRemark}
                  className="flex-1 sm:flex-none px-3 py-1 bg-[#599651] text-white rounded-lg hover:bg-green-600"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => {
                    setShowRemarkForm(false);
                    setNewRemark('');
                    setErrorMessage('');
                  }}
                  className="flex-1 sm:flex-none px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Annuleren
                </button>
              </div>
            </div>
          )}
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {laptop.remarks.map((remark, index) => (
              <li key={index} className="break-words">{remark}</li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-lg font-semibold">Problemen</h2>
            <button
              onClick={() => setShowProblemForm(true)}
              className="w-full sm:w-auto px-3 py-1 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
            >
              Probleem melden
            </button>
          </div>
          {showProblemForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
                  Uw naam *
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Voer uw naam in..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
                  Uw email *
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Voer uw emailadres in..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1c1c1c] mb-2">
                  Probleembeschrijving *
                </label>
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Beschrijf het probleem..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReportProblem}
                  className="flex-1 sm:flex-none px-3 py-1 bg-[#599651] text-white rounded-lg hover:bg-green-600"
                >
                  Verzenden
                </button>
                <button
                  onClick={() => {
                    setShowProblemForm(false);
                    setProblemDescription('');
                    setReporterName('');
                    setReporterEmail('');
                    setErrorMessage('');
                  }}
                  className="flex-1 sm:flex-none px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Annuleren
                </button>
              </div>
            </div>
          )}
          <div className="mt-2 space-y-2">
            {laptop.problems.map((problem) => (
              <div key={problem.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Status:</p>
                  <span className={problem.status === 'resolved' ? 'text-[#599651]' : 'text-[#d73f3f]'}>
                    {problem.status === 'resolved' ? 'Opgelost' : 'Open'}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Gemeld door:</p>
                  <p className="break-words">{problem.reporterName}</p>
                  <p className="text-sm text-gray-600">{problem.reporterEmail}</p>
                </div>
                {problem.resolverName && (
                  <div className="mt-2">
                    <p className="font-semibold">Opgelost door:</p>
                    <p className="break-words">{problem.resolverName}</p>
                  </div>
                )}
                <div className="mt-2">
                  <p className="font-semibold">Beschrijving:</p>
                  <p className="break-words">{problem.description}</p>
                </div>
                {problem.repairDetails && (
                  <div className="mt-2">
                    <p className="font-semibold">Reparatie details:</p>
                    <p className="break-words">{problem.repairDetails}</p>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  <p>Gemeld op: {new Date(problem.dateReported).toLocaleDateString()}</p>
                  {problem.dateResolved && (
                    <p>Opgelost op: {new Date(problem.dateResolved).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}