import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";
import { authorizedMiddleware } from "@/app/helpers/authentication";

export async function GET(request: NextRequest) {
  const authrtoResponse = await authorizedMiddleware(request);
  if (authrtoResponse) {
    return authrtoResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const firstname = searchParams.get('firstname');
    const cardno = searchParams.get('cardno');

    console.log('Received Query Parameters:', { firstname, cardno });

    if (!firstname && !cardno) {
      return NextResponse.json({ error: 'firstname or Card ID is required' }, { status: 400 });
    }

    const query = firstname ? { firstname } : { cardno };
    const patients = await Patient.find(query).exec(); // Use find to return an array

    if (!patients.length) {
      return NextResponse.json({ error: "No patients found" }, { status: 404 });
    }

    return NextResponse.json(patients); // Ensure the response is an array
  } catch (error: unknown) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
