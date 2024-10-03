import { NextRequest, NextResponse } from 'next/server';
import Image from '@/app/(models)/image';
import { authorizedMiddleware } from '@/app/helpers/authentication';


interface Image {
    createdAt: string; // or Date, depending on how you store it
}



// PATCH functionality

// DELETE functionality
export async function DELETE(request: NextRequest) {
    authorizedMiddleware(request);
   

    try {
        const body = await request.json(); // Assuming the imageId is in the JSON body
      const { imageId } = body
      
      if (!imageId) {
        return NextResponse.json({ error: "Finding ID is required" }, { status: 400 });
      }
        // Find and delete the image
        const existingImage = await Image.findByIdAndDelete(imageId).exec();
        if (!existingImage) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        

        return NextResponse.json({ message: "Image deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
