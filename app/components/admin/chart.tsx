"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// Define types for the patient data and chart data
interface PatientCountsByMonth {
  [key: string]: number;
}

interface ChartData {
  month: string;
  count: number;
}

// Function to fetch patient data
const fetchPatientData = async (): Promise<PatientCountsByMonth> => {
  try {
    const response = await fetch('/api/patient/registerdata/chart');
    if (!response.ok) {
      throw new Error('Failed to fetch patient data');
    }
    const data = await response.json();
    return data.patientCountsByMonth;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return {};
  }
};

// Convert patient counts to chart data format
const convertToChartData = (patientCountsByMonth: PatientCountsByMonth): ChartData[] => {
  return Object.keys(patientCountsByMonth).map((key) => ({
    month: key,
    count: patientCountsByMonth[key],
  }));
};

const chartConfig: ChartConfig = {
  patient: {
    label: "Patient Count",
    color: "#6caba9",
  },
};

// Correctly define the Component function
function Component() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartWidth, setChartWidth] = useState(300); // Smaller width

  useEffect(() => {
    const getData = async () => {
      const patientData = await fetchPatientData();
      const formattedData = convertToChartData(patientData);
      setChartData(formattedData);
    };

    // Check if we're in the browser before accessing window
    if (typeof window !== "undefined") {
      setChartWidth(window.innerWidth / 4); // Smaller width
    }

    getData();
  }, []);

  return (
    <ChartContainer config={chartConfig} className="max-h-[200px] w-1/2">
      <BarChart width={chartWidth} height={70} data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="var(--color-patient)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

export default Component;
