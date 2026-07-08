import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const BookingModalContext = createContext();

export const BookingModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const { user } = useAuth();

  const openBookingModal = async (tutor = null) => {
    if (user && user.role === 'Student' && tutor) {
      try {
        const res = await api.get('/bookings');
        if (res.data && res.data.success) {
          const bookings = res.data.data || [];
          const existing = bookings.find(b => 
            b.assignedTutor && 
            String(b.assignedTutor._id || b.assignedTutor) === String(tutor._id || tutor.id) &&
            ['Pending', 'Assigned', 'Contacted'].includes(b.status)
          );
          if (existing) {
            alert('You have already sent an active request to this tutor. You cannot send another until it is completed or deleted.');
            return;
          }
        }
      } catch (err) {
        console.error('Error checking active bookings:', err);
      }
    }
    setSelectedTutor(tutor);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
    setSelectedTutor(null);
  };

  return (
    <BookingModalContext.Provider value={{ isOpen, selectedTutor, openBookingModal, closeBookingModal }}>
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (context === undefined) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
};
