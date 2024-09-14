import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {connect} from "@/app/lib/mongodb";
connect(); 
// Define the request body type
interface UserData {
  username: string;
  password: string;
  role: string;
  phone: string;
}

// Type for Next.js Request
export async function POST(req: Request) {
  
  
    // Parse the JSON body
    const userData: UserData = await req.json();

    connect();
}







export async function GET(req: Request) {
  try {
   // Ensure the user is authenticated

    // Fetch all users from the database
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error in GET /api/REGISTER:", error);
    return NextResponse.json(
      { error: "Internal server error" }
    );
  }
}