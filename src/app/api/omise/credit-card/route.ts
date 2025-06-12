import { NextResponse } from "next/server";
import Omise from "omise";
import { omise } from "@/services/omise";
import { addPaymentHistory, addPointToUser } from "@/services/torso";

type CreditCardChargeType = {
  token: string;
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
  const request = (await req.json()) as CreditCardChargeType;

  try {
    const charge = await omise.charges.create({
      description: request.description,
      amount: request.pack.priceNumber,
      currency: "THB",
      card: request.token,
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

    // Add payment history
    const history = await addPaymentHistory({
      lineId: request.buyerId,
      packId: request.pack.id.toString(),
      status: charge.status,
      chargeId: charge.id,
    });

    if (!history) {
      return NextResponse.json(
        {
          charge: null,
          message: "failed to save payment history",
          success: false,
        },
        { status: 500 }
      );
    }

    // Add points to user
    const point = await addPointToUser(
      request.buyerId,
      parseInt(request.pack.creditAmount)
    );

    if (!point) {
      return NextResponse.json(
        {
          charge: null,
          message: "failed to add points",
          success: false,
        },
        { status: 500 }
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
