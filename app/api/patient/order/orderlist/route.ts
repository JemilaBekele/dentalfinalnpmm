import { connect } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from 'next/server';
import Patient from "@/app/(models)/Patient";
import Order from "@/app/(models)/Order";


connect();

export async function GET(request: NextRequest) {
 

  try {
    if (typeof request === 'object' && request !== null && 'user' in request) {
      const user = (request as { user: { id: string; username: string } }).user; // Type assertion for user

     // Log user data
      const doctorId = user.id;

    

      // Fetch active orders for the doctor
      const activeOrders = await Order.find({
        'assignedDoctorTo.id': doctorId, // Adjust field as needed
        status: 'Active'
      }).exec();

     

      if (!activeOrders || activeOrders.length === 0) {
        return NextResponse.json({ error: "No active orders found" }, { status: 404 });
      }

      // Extract patient IDs from active orders
      const patientIds = activeOrders.map(order => order.patientId.id);
      

      // Fetch patients based on the extracted IDs
      const patients = await Patient.find({ _id: { $in: patientIds } }).exec();
      

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
