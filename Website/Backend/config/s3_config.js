import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.VIETNIX_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.VIETNIX_ACCESS_KEY,
    secretAccessKey: process.env.VIETNIX_SECRET_KEY,
  },
  forcePathStyle: true,
});

export default s3;
