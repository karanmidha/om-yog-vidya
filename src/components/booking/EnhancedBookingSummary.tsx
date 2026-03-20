import React from 'react';
import type { Database } from '../../types/database';

type TimeSlot = Database['public']['Tables']['time_slots']['Row'] & {
  practice_style?: Database['public']['Tables']['practice_styles']['Row'];
};

interface BookingData {
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface EnhancedBookingSummaryProps {
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  onBookingSubmit: (bookingData: BookingData) => void;
  loading?: boolean;
  disabled?: boolean;
}

const EnhancedBookingSummary: React.FC<EnhancedBookingSummaryProps> = ({
  selectedDate,
  selectedSlot,
  onBookingSubmit,
  loading = false,
  disabled = false
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getSessionType = (slot: TimeSlot) => {
    if (!slot.practice_style?.name) return 'Session';

    const [hours] = slot.start_time.split(':').map(Number);
    const timeOfDay = hours < 12 ? 'Morning' : 'Evening';

    return `${timeOfDay} ${slot.practice_style.name}`;
  };

  // Calculate pricing
  const basePrice = selectedSlot?.practice_style?.price || 0;
  const totalPrice = basePrice;

  const canProceed = selectedDate && selectedSlot && !loading && !disabled;

  const handlePayment = () => {
    if (!canProceed) return;

    // For this simplified version, we'll use mock user data
    // In real implementation, user would be authenticated or form would be on previous step
    const mockUserData: BookingData = {
      name: 'User', // Would come from auth or previous step
      email: 'user@example.com', // Would come from auth or previous step
      phone: '9876543210', // Would come from auth or previous step
      specialRequests: ''
    };

    onBookingSubmit(mockUserData);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-serif text-secondary-900 mb-6">Booking Summary</h3>

      {/* Session Details */}
      {selectedDate && selectedSlot ? (
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-secondary-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-secondary-600 rounded-full mr-2"></span>
            SESSION
          </h4>

          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-secondary-500 mb-1">Practice Style</p>
              <p className="font-semibold text-secondary-900 text-lg">
                {getSessionType(selectedSlot)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-secondary-500 mb-1">DATE</p>
                <p className="font-medium text-secondary-900">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-secondary-500 mb-1">TIME</p>
                <p className="font-medium text-secondary-900">
                  {formatTime(selectedSlot.start_time)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-secondary-500 mb-1">DURATION</p>
              <p className="font-medium text-secondary-900">
                {selectedSlot.practice_style?.duration_minutes} minutes
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-secondary-600 font-medium">Please select a date and session above</p>
          <p className="text-secondary-500 text-sm mt-1">Your booking details will appear here</p>
        </div>
      )}

      {/* Pricing Section */}
      {selectedSlot && (
        <div className="border border-secondary-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-secondary-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
            PRICING
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-secondary-600">BASE PRICE</p>
                <p className="text-xs text-secondary-500">
                  {selectedSlot.practice_style?.name}
                </p>
              </div>
              <p className="font-semibold text-secondary-900 text-lg">
                {formatPrice(basePrice)}
              </p>
            </div>

            <div className="border-t border-secondary-200 pt-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-secondary-900 text-lg">Total Amount</p>
                <p className="font-bold text-secondary-900 text-xl">
                  {formatPrice(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Section */}
      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={!canProceed}
          className={`
            w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform
            ${canProceed
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            border-2 border-transparent
            ${canProceed ? 'hover:border-blue-300' : ''}
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              PAY WITH RAZORPAY
            </span>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-secondary-600 font-medium mb-2">
            🔒 SECURE PAYMENT POWERED BY RAZORPAY
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-secondary-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-bit SSL
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PCI Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">What happens next?</p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Complete payment securely through RazorPay</li>
              <li>• Receive instant booking confirmation via email</li>
              <li>• Get session details and studio location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingSummary;