import { NextRequest, NextResponse } from 'next/server';
import Appointment from '@/app/(models)/appointment';
import Patient from "@/app/(models)/Patient";
import { authorizedMiddleware } from '@/app/helpers/authentication';

interface Appointment {
  createdAt: string; // or Date, depending on how you store it
  // Add other fields as needed
}
// Create a new medical finding
export async function GET(request: NextRequest, { params }: { params: { patientId: string; recordId: string } }) {
   
  
    try {
      const { patientId, recordId } = params;
      if (!patientId || !recordId) {
        return NextResponse.json({ error: "Patient ID and Finding ID are required" }, { status: 400 });
      }
      const patient = await Patient.findById(patientId).exec();
      if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
      }
  
      // Find the Appointment by ID
      const finding = await Appointment.findById(recordId).exec();
      if (!finding) {
        return NextResponse.json({ error: "Appointmentnot found" }, { status: 404 });
      }
  
      return NextResponse.json({
        message: "Appointmentretrieved successfully",
        success: true,
        data: finding,
      });
    } catch (error) {
      console.error("Error retrieving medical finding:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  
  export async function PATCH(request: NextRequest) {
    await authorizedMiddleware(request);
    
    try {
      const body = await request.json(); // Parse the request body
      const { appointmentId, ...data } = body; // Extract appointmentId and updates
  
      if (!appointmentId) {
        return NextResponse.json({ error: "Finding ID is required" }, { status: 400 });
      }
  
      // Find and update the Appointment by ID
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, data, { new: true }).exec();
      if (!updatedAppointment) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
  
      return NextResponse.json({
        message: "Appointment updated successfully",
        success: true,
        data: updatedAppointment,
      });
    } catch (error) {
      console.error("Error updating Appointment:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  

  

  export async function DELETE(request: NextRequest) {
     await authorizedMiddleware(request);
    // Make sure to check the authorization response
  
    try {
      // Parse the request body to get the appointmentId
      const body = await request.json(); // Assuming the appointmentId is in the JSON body
      const { appointmentId } = body;
  
      if (!appointmentId) {
        return NextResponse.json({ error: "Finding ID is required" }, { status: 400 });
      }
  
      // Find and delete the Appointment by ID
      const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId).exec();
      if (!deletedAppointment) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
  
      return NextResponse.json({
        message: "Appointment deleted successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error deleting Appointment:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  