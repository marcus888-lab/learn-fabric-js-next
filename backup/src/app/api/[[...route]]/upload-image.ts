import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      if (!files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      const uploadedFiles = await Promise.all(
        fileArray.map(async (file) => {
          if (!file) {
            throw new Error("File is undefined");
          }

          const oldPath = file.filepath;
          const ext = path.extname(file.originalFilename || "");
          const newPath = path.join(uploadDir, `${uuidv4()}${ext}`);

          // Resize image to 1280x720
          await sharp(oldPath)
            .resize(1280, 720, {
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .toFile(newPath);

          // Delete the original file
          fs.unlinkSync(oldPath);

          return newPath;
        })
      );

      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/fabric-js";
      const urls = uploadedFiles.map(
        (newPath) =>
          `${basePath}${newPath.replace(process.cwd() + "/public", "")}`
      );

      res.status(200).json({ url: urls[0] });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
