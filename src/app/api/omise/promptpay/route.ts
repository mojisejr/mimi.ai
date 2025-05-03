import { NextResponse } from "next/server";
import Omise from "omise";
import { omise } from "@/services/omise";

type PromptpayChargeType = {
  id: string;
  buyerId: string;
  pack: {
    id: number;
    packageTitle: string;
    creditAmount: string;
    creditAmountNumber: number;
    priceNumber: number;
    price: string;
    currency: string;
    subtitle: string;
    ctaText: string;
  };
  description: string;
};

type OmiseChargeResponse = Omise.Charges.ICharge;

export type ChargeApiResponse = {
  charge: OmiseChargeResponse | null;
  message: string;
  success: boolean;
};

export async function POST(
  req: Request
): Promise<NextResponse<ChargeApiResponse>> {
  const request = (await req.json()) as PromptpayChargeType;

  try {
    const charge = await omise.charges.create({
      description: request.description,
      amount: request.pack.priceNumber,
      currency: "THB",
      source: request.id,
    });

    if (!charge) {
      return NextResponse.json(
        {
          charge: null,
          message: "failed",
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      charge: charge,
      message: "success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        charge: null,
        message: "fatal error",
        success: false,
      },
      { status: 500 }
    );
  }
}
