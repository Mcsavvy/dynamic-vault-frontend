import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  requestChecksumCalculation: "WHEN_REQUIRED",
});

const bucketName = process.env.BACKBLAZE_BUCKET_NAME;

export interface UploadParams {
  buffer: Buffer;
  fileName: string;
  contentType: string;
}

export const uploadFileToS3 = async (params: UploadParams) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: params.fileName,
    Body: params.buffer,
    ContentType: params.contentType,
  });

  const response = await s3.send(command);
  return response;
};

export const getFileFromS3 = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await s3.send(command);
  return response;
};

export const deleteFileFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await s3.send(command);
  return response;
};
