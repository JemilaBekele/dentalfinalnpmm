import { NextResponse } from 'next/server';
import History from '@/app/(models)/history';
import Card from '@/app/(models)/card';

export async function GET() {
  try {
    const currentDate = new Date();

    // Calculate the start of the current month
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Calculate the start of the last month (consider year transitions)
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    // 1. Fetch and calculate total history amount for the last month
    const lastMonthHistory = await History.find({
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfCurrentMonth
      }
    });

    const totalHistoryAmountLastMonth = lastMonthHistory.reduce(
      (total, item) => total + item.Invoice.amount, 0
    );

    // 2. Fetch and calculate total history amount for the current month
    const currentMonthHistory = await History.find({
      createdAt: {
        $gte: startOfCurrentMonth,
        $lte: currentDate
      }
    });

    const totalHistoryAmountCurrentMonth = currentMonthHistory.reduce(
      (total, item) => total + item.Invoice.amount, 0
    );

    // 3. Fetch and calculate total card price for the last month
    const lastMonthCards = await Card.find({
      createdAt: {
        $gte: startOfLastMonth,
        $lt: startOfCurrentMonth
      }
    });

    const totalCardPriceLastMonth = lastMonthCards.reduce(
      (total, card) => total + card.cardprice, 0
    );

    // 4. Fetch and calculate total card price for the current month
    const currentMonthCards = await Card.find({
      createdAt: {
        $gte: startOfCurrentMonth,
        $lte: currentDate
      }
    });

    const totalCardPriceCurrentMonth = currentMonthCards.reduce(
      (total, card) => total + card.cardprice, 0
    );

    // 5. Calculate grand totals
    const grandTotalLastMonth = totalHistoryAmountLastMonth + totalCardPriceLastMonth;
    const grandTotalCurrentMonth = totalHistoryAmountCurrentMonth + totalCardPriceCurrentMonth;

    // 6. Return the results
    return NextResponse.json({
      message: 'History and cards retrieved successfully',
      success: true,
      data: {
        totalHistoryAmountLastMonth,
        totalCardPriceLastMonth,
        grandTotalLastMonth,
        totalHistoryAmountCurrentMonth,
        totalCardPriceCurrentMonth,
        grandTotalCurrentMonth
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching history and cards:', error);
    return NextResponse.json({ message: 'Failed to retrieve history and cards.', success: false }, { status: 500 });
  }
}
