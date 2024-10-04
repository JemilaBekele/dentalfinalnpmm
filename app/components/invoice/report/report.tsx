"use client";
import { useState } from 'react';
import DataTable from "@/app/components/ui/TableComponent"; // Import the DataTable component
import Modal from "@/app/components/invoice/detailinvoice"; // Import the Modal component
import { EyeOutlined } from "@ant-design/icons";

// Define the Invoice interface based on the History model
interface Invoice {
  _id: string;
  Invoice: {
    id: string;
    amount: number;
    created: {
      username: string;
      id: string;
    };
    customerName: {
      username: string;
      id: string;
      cardno: string;
    };
  };
  createdAt: string; // to represent the timestamp
}

const FetchInvoices = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFetchInvoices = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setErrorMessage(''); // Clear any previous error messages

    // Validate date inputs
    if (!startDate || !endDate) {
      setErrorMessage('Both start date and end date are required.');
      return;
    }

    try {
      const response = await fetch('/api/Invoice/payment/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      const data = await response.json();
      console.log("Response data:", data); // Log the response to check structure
      if (data.success) {
        setInvoices(data.data); // Set the fetched invoices to state
      } else {
        setErrorMessage(data.message); // Show error message if the response indicates failure
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setErrorMessage('Failed to fetch invoices. Please try again.'); // Show general error message
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log("Viewing invoice ID:", invoice.Invoice.id); // Log the ID for debugging
    setSelectedInvoiceId(invoice.Invoice.id); // Set only the ID
    setIsModalOpen(true);
  };

  // Define columns for the DataTable
  const columns = [
    {
      header: "Invoice ID",
      key: "_id" as keyof Invoice,
      render: (invoice: Invoice) => invoice.Invoice.id,
    },
    {
      header: "Customer",
      key: "customerName.username" as keyof Invoice,
      render: (invoice: Invoice) => invoice.Invoice.customerName?.username || 'N/A',
    },
    {
      header: "Amount",
      key: "amount" as keyof Invoice,
      render: (invoice: Invoice) => invoice.Invoice.amount ? `${invoice.Invoice.amount.toFixed(2)}` : '0.00',
    },
    {
      header: "Created By",
      key: "created.username" as keyof Invoice,
      render: (invoice: Invoice) => invoice.Invoice.created?.username || 'N/A',
    },
    {
      header: "Created At",
      key: "createdAt" as keyof Invoice,
      render: (invoice: Invoice) => new Date(invoice.createdAt).toLocaleDateString() || 'N/A',
    },
    {
      header: "Action",
      key: "action" as keyof Invoice,
      render: (invoice: Invoice) => (
        <button aria-label="view detail" className="text-blue-600 hover:underline hover:bg-blue-200" onClick={() => handleViewInvoice(invoice)}>
          <EyeOutlined className="text-xl text-blue-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex ml-7 mt-7">
      <div className="flex-grow md:ml-60 container mx-auto">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Invoice Report</h1>
          <form onSubmit={handleFetchInvoices} className="mb-4">
            <div className="mb-4">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Fetch Invoices
            </button>
          </form>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          {invoices.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Invoices</h2>
              <DataTable data={invoices} columns={columns} caption="List of Invoices" />
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing invoice details */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceId={selectedInvoiceId} // Pass only the invoice ID
      />
    </div>
  );
};

export default FetchInvoices;
