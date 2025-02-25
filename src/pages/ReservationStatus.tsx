import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '../context/ReservationContext';

export default function ReservationStatus() {
  const navigate = useNavigate();
  const { reservations } = useReservations();
  const processedReservations = reservations.filter(
    res => res.status === 'approved' || res.status === 'rejected'
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1c1c]">Goedgekeurd/Afgewezen Reserveringen</h1>
        <button
          onClick={() => navigate('/reservations')}
          className="w-full sm:w-auto px-4 py-2 bg-[#07114d] text-white rounded-lg hover:bg-[#2e376f]"
        >
          Terug naar overzicht
        </button>
      </div>
      
      <div className="grid gap-4">
        {processedReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="font-semibold break-words">
                  Aantal laptops: <span className="text-[#07114d]">{reservation.quantity}</span>
                </p>
                <p className={`font-semibold ${
                  reservation.status === 'approved' ? 'text-[#599651]' : 'text-[#d73f3f]'
                }`}>
                  {reservation.status === 'approved' ? 'Goedgekeurd' : 'Afgewezen'}
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

              {reservation.reason && (
                <div>
                  <p className="font-semibold text-[#d73f3f]">Reden voor afwijzing:</p>
                  <p className="break-words">{reservation.reason}</p>
                </div>
              )}

              {reservation.processedDate && (
                <p className="text-sm text-gray-500">
                  Verwerkt op: {new Date(reservation.processedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}

        {processedReservations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center text-gray-500">
            Er zijn nog geen verwerkte reserveringen
          </div>
        )}
      </div>
    </div>
  );
}