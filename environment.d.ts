import { type Address } from "viem";
import { type Mongoose } from "mongoose";
import ms from 'ms';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Smart Contracts
      NEXT_PUBLIC_RWA_ASSET_CONTRACT: Address;
      NEXT_PUBLIC_DYNAMIC_PRICING_AGENT_CONTRACT: Address;
      NEXT_PUBLIC_MARKETPLACE_CONTRACT: Address;
      // MongoDB
      MONGO_URI: string;
      // Backblaze
      BACKBLAZE_BUCKET_NAME: string;
      BACKBLAZE_ENDPOINT: string;
      BACKBLAZE_REGION: string;
      AWS_ACCESS_KEY_ID: string;  // backblaze key id
      AWS_SECRET_ACCESS_KEY: string; // backblaze app key
      // JWT Options
      JWT_SECRET: string;
      JWT_EXPIRY: ms.StringValue;
      REFRESH_TOKEN_EXPIRY: ms.StringValue;
    }
  }
  interface Global {
    mongoose: {
      conn: unknown;
      promise: Promise<Mongoose> | null;
    };
  }
}

export {};