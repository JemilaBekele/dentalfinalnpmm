import { useState, useEffect } from "react"; 
import { Table, TableCaption, TableHead, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import PaymentModal from "./PaymentModal"; // Import the modal component

interface Invoice {
  _id: string;
  customerName: {
    username: string;
    cardno: string;
  };
  totalAmount: number;
  totalpaid: number;
  balance: number;
  currentpayment: {
    amount: number;
    date: Date;
    confirm: boolean;
  };
  createdBy: {
    username: string;
  };
}

const UnconfirmedInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState<number>(0);

  // Fetch invoices function
  const fetchUnconfirmedInvoices = async () => {
    try {
      const response = await fetch('/api/Invoice/payment/report');
      if (!response.ok) {
        throw new Error('Failed to fetch unconfirmed invoices');
      }
      const data = await response.json();
      if (data.success) {
        setInvoices(data.data);
      } else {
        setError(data.error || "Unknown error occurred");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnconfirmedInvoices(); // Fetch on component mount

    // Set an interval to fetch invoices every 30 seconds
    const intervalId = setInterval(() => {
      fetchUnconfirmedInvoices();
    }, 60000); // 30000 ms = 30 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const openModal = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice._id);
    setCurrentPaymentAmount(invoice.currentpayment.amount); // Set the current payment amount
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePaymentSubmit = async () => {
    try {
      const response = await fetch(`/api/Invoice/payment/comfirm/${selectedInvoiceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId: selectedInvoiceId, currentpayment: currentPaymentAmount }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to update invoice");
      } else {
        // If successful, fetch the invoices again and close the modal
        fetchUnconfirmedInvoices();
        handleModalClose();
      }
    } catch (error) {
      setError("Failed to update invoice");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl bg-white mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-center">Unconfirmed Invoices</h1>
      <Table>
        <TableCaption>A list of patients with Unconfirmed Invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Card No</TableHead>              
            <TableHead>Current Payment</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(invoices) && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.customerName.username}</TableCell>
                <TableCell>{invoice.customerName.cardno}</TableCell>                
                <TableCell>{invoice.currentpayment.amount}</TableCell>   
                <TableCell>Dr {invoice.createdBy.username}</TableCell>       
                <TableCell>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => openModal(invoice)}
                  >
                    Update
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No unconfirmed invoices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaymentModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        currentPayment={currentPaymentAmount}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default UnconfirmedInvoices;
