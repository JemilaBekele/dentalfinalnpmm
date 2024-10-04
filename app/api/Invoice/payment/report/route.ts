// pages/api/invoice/getInvoices.ts
import { NextRequest, NextResponse } from 'next/server';
import Invoice from '@/app/(models)/Invoice'; // Adjust the path to your Invoice model
import History from '@/app/(models)/history'; 
export async function POST(req: NextRequest) {
  const body = await req.json();
  const startDateStr = body.startDate;
  const endDateStr = body.endDate;

  if (!startDateStr || !endDateStr) {
    return NextResponse.json({ message: 'Start date and end date are required.', success: false }, { status: 400 });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json({ message: 'Invalid date format.', success: false }, { status: 400 });
  }

  if (endDate < startDate) {
    return NextResponse.json({ message: 'End date must be greater than or equal to start date.', success: false }, { status: 400 });
  }

  // Set endDate to the end of the day
  endDate.setHours(23, 59, 59, 999);

  console.log('Fetching invoices from:', startDate, 'to:', endDate);

  try {
    const history = await History.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return NextResponse.json({ message: 'Invoices  history retrieved successfully', success: true, data: history }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ message: 'Failed to retrieve history invoices.', success: false }, { status: 500 });
  }
}





export async function GET() {
  try {
    // Correct the typo from `falsee` to `false`
    const invoices = await Invoice.find({
      'currentpayment.confirm': false, // Use quotes around the key
    });

    // Return the success response with status 200
    return NextResponse.json({
      message: 'Invoices retrieved successfully',
      success: true,
      data: invoices,
    }, { status: 200 });
  } catch (error) {
    // Log and return an error response with status 500
    console.error('Error fetching invoices:', error);
    return NextResponse.json({
      message: 'Failed to retrieve invoices.',
      success: false,
    }, { status: 500 });
  }
}


