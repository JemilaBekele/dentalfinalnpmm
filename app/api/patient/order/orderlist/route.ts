import { connect } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";
import Order from "@/app/(models)/Order";
import { authorizedMiddleware } from "@/app/helpers/authentication";

connect();

export async function GET(request: NextRequest) {
  const authrtoResponse = await authorizedMiddleware(request);
  if (authrtoResponse) {
    return authrtoResponse;
  }

  try {
    if (typeof request === 'object' && request !== null && 'user' in request) {
      const user = (request as { user: { id: string; username: string } }).user; // Type assertion for user

      console.log("User Data:", user); // Log user data
      const doctorId = user.id;

      // Log query parameters
      console.log("Doctor ID:", doctorId);

      // Fetch active orders for the doctor
      const activeOrders = await Order.find({
        'assignedDoctorTo.id': doctorId, // Adjust field as needed
        status: 'Active'
      }).exec();

      // Log query results
      console.log("Active Orders Query:", {
        'assignedDoctorTo.id': doctorId,
        status: 'Active'
      });
      console.log("Active Orders:", activeOrders);

      if (!activeOrders || activeOrders.length === 0) {
        return NextResponse.json({ error: "No active orders found" }, { status: 404 });
      }

      // Extract patient IDs from active orders
      const patientIds = activeOrders.map(order => order.patientId.id);
      console.log("Patient IDs:", patientIds);

      // Fetch patients based on the extracted IDs
      const patients = await Patient.find({ _id: { $in: patientIds } }).exec();
      console.log("Patients:", patients);

      if (!patients || patients.length === 0) {
        return NextResponse.json({ error: "Patients not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Patient profiles retrieved successfully",
        success: true,
        patients,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/patient/order/orderlist", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
