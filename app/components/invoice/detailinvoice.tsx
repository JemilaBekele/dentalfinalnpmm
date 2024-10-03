import React, { useEffect, useState } from 'react';
import { Invoice } from "@/types/invotwo"; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | null; // Accept invoice ID instead of full invoice object
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, invoiceId }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (invoiceId) {
        setLoading(true);
        setError(''); // Clear previous errors
        try {
          const response = await fetch(`/api/Invoice/payment/detail`, {
            method: 'GET', // Set method to GET
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ invoiceId }) // Send invoiceId in the body
          });
          const data = await response.json();

          if (response.ok) { // Check if response status is OK
            setInvoice(data); // Set the invoice data
          } else {
            setError(data.error || "Failed to fetch invoice details."); // Set error message from response
          }
        } catch (err) {
          setError('Failed to fetch invoice details. Please try again.'); // General error handling
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchInvoiceDetails(); // Fetch invoice details if modal is open
    }
  }, [isOpen, invoiceId]);

  if (!isOpen || loading) return null; // Don't render if modal is closed or loading

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-500 bg-green-100";
      case "Pending":
        return "text-yellow-500 bg-yellow-100";
      case "Cancel":
        return "text-red-500 bg-red-100";
      case "order":
        return "text-blue-500 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-3/4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-150 hover:bg-blue-200"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold text-center mb-6">Invoice Details</h2>

        {/* Error Handling */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Invoice Summary */}
        {invoice && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong className="text-gray-700">Invoice ID:</strong>{' '}
              <span className="text-gray-900">{invoice._id}</span>
            </div>
            <div>
              <strong className="text-gray-700">Invoice Date:</strong>{' '}
              <span className="text-gray-900">{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
            </div>
            <div>
              <strong className="text-gray-700">Total Amount:</strong>{' '}
              <span className="text-gray-900">{invoice.totalAmount.toFixed(2)}</span>
            </div>
            <div className="text-gray-600">Created By: Dr {invoice.createdBy.username}</div>
            <div>
              <strong className="text-gray-700">Status:</strong>{' '}
              <span
                className={`text-sm font-bold py-1 px-3 rounded ${getStatusColor(invoice.status)}`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Items Section */}
        <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Items</h3>
        <div className="overflow-y-auto h-48">
          <ul className="space-y-3">
            {invoice?.items.map((item, index) => (
              <li key={index} className="flex justify-between items-start bg-gray-100 p-3 rounded-lg shadow-sm">
                <div>
                  <div className="font-medium text-gray-800">
                    {item.service.service} (x{item.quantity})
                  </div>
                  <div className="text-gray-600">Description: {item.description}</div>
                  <div className="text-gray-600">Price per unit: {item.price.toFixed(2)}</div>
                </div>
                <span className="text-lg font-bold text-gray-800">{item.totalPrice.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
