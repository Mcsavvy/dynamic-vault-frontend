 
 import { NextRequest, NextResponse } from "next/server";
 import { withAuthAny } from "@/lib/auth/authMiddleware";
 import { validateBody } from "@/lib/validators";
 import {
   predictionAcceptSchema,
 } from "@/lib/validators/schemas";
 import connectToDatabase from "@/lib/database";
 import mongoose from "mongoose";
import { aiOracleService } from "@/lib/services";

 // Get a single prediction by ID
 export async function GET(
   request: NextRequest,
   { params }: { params: { predictionId: string } }
 ): Promise<NextResponse> {
   // Connect to the database
   await connectToDatabase();

   return withAuthAny(request, async (req) => {
     try {
       const { predictionId } = params;

       // Validate predictionId format
       if (!predictionId || !mongoose.isValidObjectId(predictionId)) {
         return NextResponse.json(
           { error: "Invalid prediction ID" },
           { status: 400 }
         );
       }

       // Only oracles and admins can view predictions
       if (
         !req.user ||
         !req.user.roles.some((role) => ["oracle", "admin"].includes(role))
       ) {
         return NextResponse.json(
           { error: "Unauthorized - Insufficient permissions" },
           { status: 403 }
         );
       }

       // Get the prediction
       const prediction = await aiOracleService.getPrediction(predictionId);

       if (!prediction) {
         return NextResponse.json(
           { error: "Prediction not found" },
           { status: 404 }
         );
       }

       // Return the prediction
       return NextResponse.json({
         prediction: {
           id: prediction._id.toString(),
           tokenId: prediction.tokenId,
           assetId:
             typeof prediction.assetId === "string"
               ? prediction.assetId
               : prediction.assetId.toString(),
           predictedPrice: prediction.predictedPrice,
           confidenceScore: prediction.confidenceScore,
           modelVersion: prediction.modelVersion,
           dataSourcesUsed: prediction.dataSourcesUsed,
           featureImportance: prediction.featureImportance,
           inputs: prediction.inputs,
           performanceMetrics: prediction.performanceMetrics,
           status: prediction.status,
           timestamp: prediction.timestamp,
           onChainReference: prediction.onChainReference,
         },
       });
     } catch (error) {
       console.error(
         `Error fetching prediction with ID ${params.predictionId}:`,
         error
       );
       return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
       );
     }
   });
 }

 // Accept a prediction (admin only)
 export async function POST(
   request: NextRequest,
   { params }: { params: { predictionId: string } }
 ): Promise<NextResponse> {
   // Connect to the database
   await connectToDatabase();

   return withAuthAny(request, async (req) => {
     try {
       const { predictionId } = params;

       // Validate predictionId format
       if (!predictionId || !mongoose.isValidObjectId(predictionId)) {
         return NextResponse.json(
           { error: "Invalid prediction ID" },
           { status: 400 }
         );
       }

       // Only admins can accept predictions
       if (!req.user || !req.user.roles.includes("admin")) {
         return NextResponse.json(
           { error: "Unauthorized - Admin privileges required" },
           { status: 403 }
         );
       }

       // Validate request body
       const [bodyData, validationError] = await validateBody(
         request,
         predictionAcceptSchema
       );

       if (validationError) {
         return validationError;
       }

       // Accept the prediction
       const updatedPrediction = await aiOracleService.acceptPrediction(
         predictionId,
         bodyData?.transactionHash,
         bodyData?.blockNumber
       );

       if (!updatedPrediction) {
         return NextResponse.json(
           { error: "Prediction not found or could not be accepted" },
           { status: 404 }
         );
       }

       return NextResponse.json({
         message: "Prediction accepted successfully",
         prediction: {
           id: updatedPrediction._id.toString(),
           tokenId: updatedPrediction.tokenId,
           status: updatedPrediction.status,
           predictedPrice: updatedPrediction.predictedPrice,
         },
       });
     } catch (error) {
       console.error(
         `Error accepting prediction with ID ${params.predictionId}:`,
         error
       );
       return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
       );
     }
   });
 }

 // Reject a prediction (admin only)
 export async function DELETE(
   request: NextRequest,
   { params }: { params: { predictionId: string } }
 ): Promise<NextResponse> {
   // Connect to the database
   await connectToDatabase();

   return withAuthAny(request, async (req) => {
     try {
       const { predictionId } = params;

       // Validate predictionId format
       if (!predictionId || !mongoose.isValidObjectId(predictionId)) {
         return NextResponse.json(
           { error: "Invalid prediction ID" },
           { status: 400 }
         );
       }

       // Only admins can reject predictions
       if (!req.user || !req.user.roles.includes("admin")) {
         return NextResponse.json(
           { error: "Unauthorized - Admin privileges required" },
           { status: 403 }
         );
       }

       // Get reason from query parameters
       const url = new URL(request.url);
       const reason = url.searchParams.get("reason") || undefined;

       // Reject the prediction
       const updatedPrediction = await aiOracleService.rejectPrediction(
         predictionId,
         reason
       );

       if (!updatedPrediction) {
         return NextResponse.json(
           { error: "Prediction not found or could not be rejected" },
           { status: 404 }
         );
       }

       return NextResponse.json({
         message: "Prediction rejected successfully",
         prediction: {
           id: updatedPrediction._id.toString(),
           tokenId: updatedPrediction.tokenId,
           status: updatedPrediction.status,
         },
       });
     } catch (error) {
       console.error(
         `Error rejecting prediction with ID ${params.predictionId}:`,
         error
       );
       return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
       );
     }
   });
 }