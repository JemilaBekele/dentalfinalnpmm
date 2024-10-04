// components/PaymentModal.tsx
import { useEffect  } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayment: number; // Accept the current payment amount
  onSubmit: () => void; // No payment amount needed; just confirm
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, currentPayment, onSubmit }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(); // Just confirm the payment
    onClose(); // Close the modal after submitting
  };

  useEffect(() => {
    // Reset the modal state when it opens
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Confirm Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPayment" className="block text-sm mb-2">Current Payment Amount</label>
            <input
              type="number"
              id="currentPayment"
              value={currentPayment}
              readOnly // Make it read-only
              className="border rounded p-2 w-full bg-gray-200"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Confirm
          </button>
          <button type="button" className="ml-2 text-gray-500" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
