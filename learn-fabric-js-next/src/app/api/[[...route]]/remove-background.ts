import { editImage } from "@/lib/stability-ai";
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

    // Upload original image to S3
    const imageKey = `original/${uuidv4()}.png`;
    const imageUrl = await uploadToS3(image, imageKey);

    // Process image with Stability AI
    const result = await editImage({
      image: imageUrl,
      mode: "remove-background",
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || "Failed to remove background" },
        { status: 500 }
      );
    }

    // Get the processed image as blob
    const processedImageResponse = await fetch(result.data);
    const processedImageBlob = await processedImageResponse.blob();

    // Upload processed image to S3
    const processedImageKey = `processed/${uuidv4()}.png`;
    const processedImageUrl = await uploadToS3(
      processedImageBlob,
      processedImageKey
    );

    return NextResponse.json({
      success: true,
      data: processedImageUrl,
    });
  } catch (error) {
    console.error("Remove background error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
