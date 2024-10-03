import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";
import {authorizedMiddleware} from "@/app/helpers/authentication"
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
    const patient = await Patient.findOne(query).exec();

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error: unknown) {
    console.error("Error fetching patient:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
