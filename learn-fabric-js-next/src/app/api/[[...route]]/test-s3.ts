import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3-client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Upload to S3
    const imageKey = `test/${uuidv4()}.png`;
    const imageUrl = await uploadToS3(image, imageKey);

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        key: imageKey,
      },
    });
  } catch (error) {
    console.error("Test S3 error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
