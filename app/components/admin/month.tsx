import { useEffect, useState } from "react";

// Define the structure of the data expected from the API
interface InvoiceData {
  totalHistoryAmountLastMonth: number;
  totalCardPriceLastMonth: number;
  grandTotalLastMonth: number;
  totalHistoryAmountCurrentMonth: number;
  totalCardPriceCurrentMonth: number;
  grandTotalCurrentMonth: number;
}

const TotalMOnthDisplay = () => {
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch totals from the API
    const fetchTotals = async () => {
      try {
        const response = await fetch("/api/count/month"); // Adjust to the correct API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch totals");
        }
        const result = await response.json();
        setData(result.data); // Assuming the structure includes a 'data' key
      } catch (error) {
        setError("Error fetching totals.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-6 flex flex-col items-center gap-4 p-4">
      {/* Display last month's totals */}
      <div className="bg-indigo-200 shadow-md rounded-lg p-6 w-60 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total Last Month</h2>
        <p className="text-xl font-bold text-gray-600">
          History: {data?.totalHistoryAmountLastMonth || 0}
        </p>
        <p className="text-xl font-bold text-gray-600">
          Cards: {data?.totalCardPriceLastMonth || 0}
        </p>
        <p className="text-xl font-bold text-gray-600">
          Grand Total: {data?.grandTotalLastMonth || 0}
        </p>
      </div>

      {/* Display current month's totals */}
      <div className="bg-indigo-200 shadow-md rounded-lg p-6 w-60 text-center">
        <h2 className="text-lg font-semibold text-gray-700">Total This Month</h2>
        <p className="text-xl font-bold text-gray-600">
          History: {data?.totalHistoryAmountCurrentMonth || 0}
        </p>
        <p className="text-xl font-bold text-gray-600">
          Cards: {data?.totalCardPriceCurrentMonth || 0}
        </p>
        <p className="text-xl font-bold text-gray-600">
          Grand Total: {data?.grandTotalCurrentMonth || 0}
        </p>
      </div>
    </div>
  );
};

export default TotalMOnthDisplay;
