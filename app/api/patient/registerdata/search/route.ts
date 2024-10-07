import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";

// Define a type for the query object
interface Query {
  firstname?: { $regex: string; $options: string }; // optional regex for firstname
 // optional regex for cardno
  phoneNumber?: { $regex: string; $options: string }; // optional regex for phone
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firstname = searchParams.get('firstname');
    
    const phoneNumber = searchParams.get('phoneNumber'); // Add phone number search

    // Create a query object of type Query
    const query: Query = {};

    // Add conditions based on input parameters
    if (firstname) {
      query.firstname = { $regex: firstname, $options: 'i' }; // Case insensitive search
    }    
    if (phoneNumber) {
      // Validate phone format to ensure it's recognized as a phone number
      // Adjust regex based on your phone number structure
        query.phoneNumber = { $regex: phoneNumber, $options: 'i' }; 
     
    }
   

    // Check if at least one search parameter is provided
    if (!firstname && !phoneNumber) {
      return NextResponse.json({ error: 'At least one search parameter (firstname, card ID, or phone) is required' }, { status: 400 });
    }

    // Perform the database search
    const patients = await Patient.find(query).exec(); // Use find to return an array

    if (!patients || patients.length === 0) {
      return NextResponse.json({ error: "No patients found" }, { status: 404 });
    }

    return NextResponse.json(patients); // Ensure the response is an array
  } catch (error: unknown) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
