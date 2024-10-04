import React, { useState, useEffect } from "react";
import { Table, TableCaption, TableHead, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import OrderUpdateModal from "./UpdateOrderModal"; // Import the modal component

interface Patient {
  _id: string;
  firstname: string;
  cardno: string;
  orders?: string[]; // Keep orders optional
}

const ActiveOrders: React.FC = () => {
  const [patientsWithOrders, setPatientsWithOrders] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  // Fetch patients with orders function
  const fetchPatientsWithOrders = async () => {
    try {
      const response = await fetch('/api/patient/order/orderlist/active');
      if (!response.ok) {
        throw new Error('Failed to fetch patients with orders');
      }
      const data = await response.json();
      if (data.success) {
        setPatientsWithOrders(data.data); // Set the fetched data
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
    fetchPatientsWithOrders(); // Fetch on component mount
  }, []);

  const openModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchPatientsWithOrders(); // Fetch data again when the modal closes
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl bg-white mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-center">Active Patient Orders</h1>
      <Table>
      <TableCaption>A list of patients with Active Orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Card No</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(patientsWithOrders) && patientsWithOrders.length > 0 ? (
            patientsWithOrders.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>{patient.firstname}</TableCell>
                <TableCell>{patient.cardno}</TableCell>
                <TableCell>
                  {patient.orders?.length ? (  // Safe check for orders being defined and not empty
                    <button 
                      className="text-blue-500 hover:text-blue-700" 
                      onClick={() => openModal(patient.orders[0])}
                    >
                      Update
                    </button>
                  ) : (
                    <span>No Orders</span> // Optional: Display a message if there are no orders
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No active orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <OrderUpdateModal
        isOpen={isModalOpen}
        onClose={handleModalClose} // Pass the close handler
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default ActiveOrders;
