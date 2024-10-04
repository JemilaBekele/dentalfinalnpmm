import { connect } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { authorizedMiddleware } from "@/app/helpers/authentication";
import Invoice from '@/app/(models)/Invoice';

connect();

export async function GET(request: NextRequest, { params }: { params: { invoiceId: string } }) {
  await authorizedMiddleware(request);
  
  try {
    const { invoiceId } = params; 
    console.log("Received invoiceId:", invoiceId); // Log the invoiceId

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      console.error("Invoice not found for ID:", invoiceId);
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error: unknown) {
    console.error("Error in GET /api/Invoice/payment/repodetail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
