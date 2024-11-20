import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "File upload error", error: err });
    }

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    const maskFile = Array.isArray(files.mask) ? files.mask[0] : files.mask;

    if (!imageFile || !maskFile) {
      return res
        .status(400)
        .json({ message: "Image and mask files are required" });
    }

    try {
      const stabilityApiKey = process.env.STABILITY_API_KEY;
      if (!stabilityApiKey) {
        return res
          .status(500)
          .json({ message: "Stability AI API key is not configured" });
      }

      const imageBuffer = fs.readFileSync(imageFile.filepath);
      const maskBuffer = fs.readFileSync(maskFile.filepath);

      const formData = new FormData();
      formData.append("image", new Blob([imageBuffer]), "image.png");
      formData.append("mask", new Blob([maskBuffer]), "mask.png");
      formData.append("output_format", "webp");

      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/edit/erase",
        formData,
        {
          headers: {
            Authorization: `Bearer ${stabilityApiKey}`,
            Accept: "image/*",
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );

      // Generate a unique filename
      const outputFilename = `erased-${Date.now()}.webp`;
      const outputPath = path.join(
        process.cwd(),
        "public/uploads",
        outputFilename
      );

      // Save the processed image
      fs.writeFileSync(outputPath, Buffer.from(response.data as ArrayBuffer));

      res.status(200).json({
        message: "Image processed successfully",
        outputPath: `/uploads/${outputFilename}`,
      });
    } catch (error) {
      console.error("Stability AI API Error:", error);
      res.status(500).json({
        message: "Error processing image",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
