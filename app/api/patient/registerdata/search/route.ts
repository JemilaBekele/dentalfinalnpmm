import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";

interface Query {
  firstname?: { $regex: string; $options: string }; // optional regex for firstname
  phoneNumber?: { $regex: string; $options: string }; // optional regex for phone
}

// Extract search parameters outside of the try-catch block
const getSearchParams = (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const firstname = searchParams.get('firstname');
  const phoneNumber = searchParams.get('phoneNumber');
  return { firstname, phoneNumber };
};

export async function GET(request: NextRequest) {
  // Get the search parameters
  const { firstname, phoneNumber } = getSearchParams(request);

  // Initialize the query object
  const query: Query = {};

  try {
    // Build the query based on provided parameters
    if (firstname) {
      query.firstname = { $regex: firstname, $options: 'i' };
    }
    if (phoneNumber) {
      query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    }

    // Check if no parameters were provided
    if (!firstname && !phoneNumber) {
      return NextResponse.json(
        { error: 'At least one search parameter (firstname or phone) is required' },
        { status: 400 }
      );
    }

    // Query the Patient model with the constructed query
    const patients = await Patient.find(query).exec();

    // Check if patients were found
    if (!patients || patients.length === 0) {
      return NextResponse.json(
        { error: "No patients found" },
        { status: 404 }
      );
    }

    // Return the found patients
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
