import {connect} from "@/app/lib/mongodb";
import Patient from "@/app/(models)/Patient";
import { NextRequest, NextResponse } from "next/server";
// Adjust the checkAuthenticationpath as needed
import {authMiddleware,authorizedMiddleware} from "@/app/helpers/authentication"
connect();


export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware(request, 'reception');
  if (authResponse) {
    return authResponse;
  }

  try {
    const { user } = request as any;
    console.log("User Data:", user);

    const reqBody = await request.json();
    console.log("Request Body:", reqBody);

    const { cardno, firstname, lastname, age, sex, email, phoneNumber, description } = reqBody;

    reqBody.createdBy = {
      id: user.id,       // Ensure these values are properly set
      username: user.username,
    };

    const existingPatient = await Patient.findOne({ phoneNumber });
    if (existingPatient) {
      return NextResponse.json({ error: "User with this phone number already exists" }, { status: 400 });
    }
    const existingcardno = await Patient.findOne({ cardno });
    if (existingcardno) {
      return NextResponse.json({ error: "User with this cardno number already exists" }, { status: 400 });
    }
    
    const existingemail= await Patient.findOne({ email });
    if (existingemail) {
      return NextResponse.json({ error: "User with this email number already exists" }, { status: 400 });
    }
    const newPatient = new Patient({
      cardno,
      firstname,
      lastname,
      age,
      sex,
      email,
      phoneNumber,
      description,
      createdBy: reqBody.createdBy,
    });

    const savedPatient = await newPatient.save();
    return NextResponse.json({
      message: "Patient created successfully",
      success: true,
      savedPatient,
    });
  } catch (error) {
    console.error("Error in POST /api/patient/registerdata", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function GET(request: NextRequest) {
  const authrtoResponse = await authorizedMiddleware(request);
  if (authrtoResponse) {
    return authrtoResponse;
  }

 
    try {
      // Ensure the user is authenticated
   
      // Fetch all users from the database
      const patients = await Patient.find({});
      return NextResponse.json(patients);
    } catch (error: any) {
      console.error("Error in GET /api/patient/registerdata", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }