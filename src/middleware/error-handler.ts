import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CustomError } from "@/lib/errors/custom-error";

export function errorHandler(error: Error | CustomError) {
  console.error("Error:", error);

  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        message: error.message,
        code: error.code,
        data: error.data,
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 }
  );
}

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error as Error);
    }
  };
}
