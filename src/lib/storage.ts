import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export interface StoredFile {
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class FileValidationError extends Error {}

/**
 * Validates and stores an uploaded file.
 *
 * In production, set S3_BUCKET / S3_REGION / S3_ACCESS_KEY / S3_SECRET_KEY in the environment
 * and swap the body of this function for an S3 PutObject call (or a Cloudinary/Supabase Storage
 * upload) — the calling code (Server Actions) does not need to change, since it only depends on
 * this function's signature and the returned StoredFile shape.
 */
export async function storeUploadedFile(file: File): Promise<StoredFile> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new FileValidationError(`نوع الملف غير مسموح به: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new FileValidationError("حجم الملف أكبر من الحد المسموح به (10MB)");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeExt = path.extname(file.name).slice(0, 10).replace(/[^a-zA-Z0-9.]/g, "");
  const fileName = `${randomUUID()}${safeExt}`;

  if (process.env.S3_BUCKET) {
    // Production path — implement the real S3/Cloudinary client call here.
    // Left intentionally unimplemented in this MVP so no fake "success" is reported
    // when real object storage isn't actually configured yet.
    throw new Error(
      "S3_BUCKET is set but the S3 client is not wired up yet. " +
      "Implement the PutObject call in src/lib/storage.ts before enabling S3 in production."
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), bytes);

  return {
    url: `/uploads/${fileName}`,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size
  };
}
