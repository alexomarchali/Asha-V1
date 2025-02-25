import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '../context/ReservationContext';

export default function ReservationList() {
  const navigate = useNavigate();
  const { reservations, updateReservationStatus } = useReservations();
  const pendingReservations = reservations.filter(res => res.status === 'pending');

  const handleStatusChange = (id: string, status: 'approved' | 'rejected', reason?: string) => {
    updateReservationStatus(id, status, reason);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Overzicht Reserveringen</h1>
      
      <div className="grid gap-4">
        {pendingReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <p className="font-semibold break-words">
                    Aantal laptops: <span className="text-[#07114d]">{reservation.quantity}</span>
                  </p>
                  <p className="font-semibold text-[#e4c76b]">
                    Status: {reservation.status}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p>Datum: {reservation.startDate}</p>
                  <p>Tijd: {reservation.startTime} - {reservation.endTime}</p>
                </div>

                <div>
                  <p className="font-semibold">Beschrijving:</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{reservation.description}</p>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleStatusChange(reservation.id, 'approved')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#599651] text-white rounded-lg hover:bg-green-600"
                >
                  Goedkeuren
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Geef een reden voor afwijzing:');
                    if (reason) {
                      handleStatusChange(reservation.id, 'rejected', reason);
                    }
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#d73f3f] text-white rounded-lg hover:bg-red-600"
                >
                  Afwijzen
                </button>
              </div>
            </div>
          </div>
        ))}

        {pendingReservations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center text-gray-500">
            Er zijn geen openstaande reserveringen
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/reservations/status')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Bekijk Verwerkte Reserveringen
        </button>
      </div>
    </div>
  );
}