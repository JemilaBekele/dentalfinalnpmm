import User from "@/app/(models)/User";
import {connect} from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

connect(); 

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    
    try {
     
      const { id } = params;
      
      if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      const user = await User.findById({ _id: id });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(user);
    } catch (error: any) {
      console.error("Error in GET /api/users:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      
      const { id } = params;
      
      if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
      console.error("Error in DELETE /api/users:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
     
      const { id } = params;
      const body = await request.json();
      
      if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  
      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedUser);
    } catch (error: any) {
      console.error("Error in PATCH /api/users:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }



 