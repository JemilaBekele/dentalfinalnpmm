import {  NextResponse } from 'next/server';
 // Adjust the path to your Invoice model
import History from '@/app/(models)/history'; 
import Card from '@/app/(models)/card'; // Import Card model
import { HistoryItem } from '@/types/history';

export async function GET() {
  try {
    // Fetch all history records
    const history: HistoryItem[] = await History.find();

    // Calculate total amount from history
    const totalHistoryAmount = history.reduce((total, item) => total + item.Invoice.amount, 0);

    // Fetch all cards
    const cards = await Card.find();
    
    // Calculate total card price
    const totalCardPrice = cards.reduce((total, card) => total + card.cardprice, 0);

    // Calculate the grand total
    const grandTotal = totalHistoryAmount + totalCardPrice;

    // Return the combined results
    return NextResponse.json({
      message: 'Invoices and cards retrieved successfully',
      success: true,
      data: {
        history,
        cards,
        totalHistoryAmount,
        totalCardPrice,
        grandTotal, // Include grand total in the response
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoices and cards:', error);
    return NextResponse.json({ message: 'Failed to retrieve invoices and cards.', success: false }, { status: 500 });
  }
}
