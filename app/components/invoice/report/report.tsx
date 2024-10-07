"use client";

import { useState, useEffect } from 'react';
import DataTable from "@/app/components/ui/TableComponent"; // Import the DataTable component
import Modal from "@/app/components/invoice/detailinvoice"; // Import the Modal component
import { EyeOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx'; // Import the XLSX library

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

// Define the Card interface based on the provided data structure
interface Card {
  _id: string;
  cardprice: number;
  createdAt: string;
  createdBy: {
    id: string;
    username: string;
  };
  patient: {
    id: {
      _id: string;
      cardno: string;
      firstname: string;
      age: string;
      sex: string;
    };
    username: string;
  };
}

// Define the Doctor interface based on your API response
interface Doctor {
  _id: string;
  username: string;
}

const FetchInvoices = () => {
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/patient/doctor'); // Adjust the endpoint as needed
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch doctors");
      }
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setErrorMessage("Error fetching doctors");
    }
  };

  useEffect(() => {
    fetchDoctors(); // Fetch doctors when the component mounts
  }, []);

  const handleFetchInvoices = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setErrorMessage(''); // Clear any previous error messages

    // Validate date inputs
    if (!username && (!startDate || !endDate)) {
      setErrorMessage('Either username or both start and end dates are required.');
      return;
    }

    try {
      const response = await fetch('/api/Invoice/payment/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, startDate, endDate }),
      });

      const data = await response.json();
      console.log("Response data:", data); // Log the response to check structure
      if (data.success) {
        setInvoices(data.data.history || []);
        setCards(data.data.cards || []);
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
    setSelectedInvoiceId(invoice.Invoice.id);
    setIsModalOpen(true);
  };

  // Function to export to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    
  
    // Prepare invoice data
    const invoiceData = invoices.map(invoice => ({
      'Invoice ID': invoice.Invoice.id,
      'Customer': invoice.Invoice.customerName?.username || 'N/A',
      'Amount': invoice.Invoice.amount.toFixed(2),
      'Created By': invoice.Invoice.created?.username || 'N/A',
      'Created At': new Date(invoice.createdAt).toLocaleDateString() || 'N/A',
      
    }));
  
    
  
    // Add invoice worksheet if there are invoices
    if (invoiceData.length > 0) {
      const invoiceWorksheet = XLSX.utils.json_to_sheet(invoiceData);
      XLSX.utils.book_append_sheet(workbook, invoiceWorksheet, 'Invoices');
    } else {
      console.log('No invoices to export.');
    }
  
   
  
    // Write the file
    XLSX.writeFile(workbook, 'Report_invoice.xlsx');
  };
  
  const exportToExcelcard = () => {
    const workbook = XLSX.utils.book_new();
    
    
    // Prepare card data
    const cardData = cards.map(card => ({
      'Card ID': card._id,
      'Patient Name': card.patient.username || 'N/A',
      'Card Price': card.cardprice.toFixed(2),
      'Created By': card.createdBy.username || 'N/A',
      'Created At': new Date(card.createdAt).toLocaleDateString() || 'N/A',
    }));
  
    
  
    // Add card worksheet if there are cards
    if (cardData.length > 0) {
      const cardWorksheet = XLSX.utils.json_to_sheet(cardData);
      XLSX.utils.book_append_sheet(workbook, cardWorksheet, 'Cards');
    } else {
      console.log('No cards to export.');
    }
  
    // Write the file
    XLSX.writeFile(workbook, 'Report_card.xlsx');
  };
  
  // Calculate totals
  const totalInvoiceAmount = invoices.reduce((total, invoice) => total + invoice.Invoice.amount, 0).toFixed(2);
  const totalCardPrice = cards.reduce((total, card) => total + card.cardprice, 0).toFixed(2);
  const grandTotal = (parseFloat(totalInvoiceAmount) + parseFloat(totalCardPrice)).toFixed(2);

  // Define columns for the Invoice DataTable
  const invoiceColumns = [
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

  // Define columns for the Card DataTable
  const cardColumns = [
    {
      header: "Card ID",
      key: "_id" as keyof Card,
      render: (card: Card) => card._id,
    },
    {
      header: "Patient Name",
      key: "patient.username" as keyof Card,
      render: (card: Card) => card.patient.username || 'N/A',
    },
    {
      header: "Card Price",
      key: "cardprice" as keyof Card,
      render: (card: Card) => `${card.cardprice.toFixed(2)}`,
    },
    {
      header: "Created By",
      key: "createdBy.username" as keyof Card,
      render: (card: Card) => card.createdBy.username || 'N/A',
    },
    {
      header: "Created At",
      key: "createdAt" as keyof Card,
      render: (card: Card) => new Date(card.createdAt).toLocaleDateString() || 'N/A',
    },
  ];

  return (
    <div className="flex ml-7 mt-7">
      <div className="flex-grow md:ml-60 container mx-auto">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Invoice Report</h1>
          <form onSubmit={handleFetchInvoices} className="mb-4">
            <div className="mb-4">
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor Name:</label>
              <select
                id="doctor"
                name="doctor"
                aria-label="Select Doctor"
                className="border rounded-md w-full p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor.username}>{doctor.username}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  className="border rounded-md w-full p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  className="border rounded-md w-full p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4">Fetch Invoices</button>
          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {invoices.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Invoices</h2>
              <DataTable data={invoices} columns={invoiceColumns} />
              <h3 className="mt-4">Total Amount: {totalInvoiceAmount}</h3>
            </div>
          )}
          {cards.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Cards</h2>
              <DataTable data={cards} columns={cardColumns} />
              <h3 className="mt-4">Total Card Price: {totalCardPrice}</h3>
            </div>
          )}
          <h3 className="mt-4">Total  Price: {grandTotal}</h3>
          {invoices.length > 0 || cards.length > 0 ? (
            <div className="mt-4">
              <button onClick={exportToExcel} className="bg-green-500 text-white rounded-md py-2 px-4 mx-10">Export Invoice to Excel</button>
              <button onClick={exportToExcelcard} className="bg-green-500 text-white rounded-md py-2 px-4 mx-10">Export Card to Excel</button>
            </div>
          ) : null}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} invoiceId={selectedInvoiceId} />
        </div>
      </div>
    </div>
  );
};

export default FetchInvoices;
