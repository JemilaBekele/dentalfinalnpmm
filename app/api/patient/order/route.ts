import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";
import User from "@/app/(models)/User";
import Order from "@/app/(models)/Order";
import {authMiddleware,authorizedMiddleware} from "@/app/helpers/authentication"




export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware(request, 'reception');
  if (authResponse) {
    return authResponse;
  }

  try {
    const { user } = request as any;
    const {  patientId, assigneddoctorTo: assignedDoctorId, status } = await request.json();

    console.log('Received Data:', { patientId, assignedDoctorId, status });

    const createdBy = {
      id: user.id,
      username: user.username,
    };

    const patient = await Patient.findById(patientId).exec();
    if (!patient) {
      console.error(`Patient not found: ${patientId}`);
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const assignedDoctor = await User.findById(assignedDoctorId);
    if (!assignedDoctor) {
      console.error(`Doctor not found: ${assignedDoctorId}`);
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const newOrder = new Order({
      assignedDoctorTo: {
        id: assignedDoctor._id,
        username: assignedDoctor.username,
      },
      patientId: {
        id: patient._id
      },
      createdBy,
      status,
    });

    const savedOrder = await newOrder.save();

    if (!patient.Order) {
      patient.Order = [];
    }

    patient.Order.push(savedOrder._id);
    await patient.save();

    return NextResponse.json({
      message: "Order created successfully",
      success: true,
      savedOrder,
    });
  } catch (error) {
    console.error("Error in POST /api/patient/order", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  const authrtoResponse = await authorizedMiddleware(request);
    try {
      // Find users with the role of 'doctor'
      const doctors = await User.find({ role: 'doctor' }, { username: 1, _id: 1 }).exec();
  
      return NextResponse.json(doctors);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }


