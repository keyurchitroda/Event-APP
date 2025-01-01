import {
  S3Client,
  S3ClientConfigType,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
} as S3ClientConfigType);

export async function uploadToS3(
  Bucket: string | undefined,
  Key: string,
  Body: Buffer<ArrayBufferLike>,
  ContentType: string
) {
  try {
    const command = new PutObjectCommand({
      Bucket,
      Key,
      Body,
      ContentType,
    });
    await s3.send(command);
    return;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
