import { NextRequest, NextResponse } from 'next/server';


import Order from "@/app/(models)/Order";
import { authorizedMiddleware } from "@/app/helpers/authentication";



import { connect } from "@/app/lib/mongodb";

connect();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  

  const { id } = params; // Get the order ID from the URL params

  try {
    const order = await Order.findById(id).exec();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order retrieved successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in GET /api/patient/order/orderlist", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest) {
  // Middleware check for authorization
  await authorizedMiddleware(request);

  try {
    if (typeof request === 'object' && request !== null && 'user' in request) {
      const user = (request as { user: { id: string; username: string } }).user; // Type assertion for user
      console.log("User Data:", user);

      const reqBody = await request.json();
      const { orderId, status } = reqBody;

      // Check if the order ID is provided and exists
      if (!orderId) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
      }

      const existingOrder = await Order.findById(orderId).exec();
      if (!existingOrder) {
        console.error(`Order not found: ${orderId}`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Update status if provided
      if (status !== undefined) {
        existingOrder.status = status;
      } else {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
      }

      existingOrder.updatedAt = new Date(); // Update the timestamp for the order

      const updatedOrder = await existingOrder.save();

      return NextResponse.json({
        message: "Order status updated successfully",
        success: true,
        updatedOrder,
      });

    }
  } catch (error) {
    console.error("Error in PATCH /api/patient/order", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}