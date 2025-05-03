import { addPaymentHistory, addPointToUser } from "@/services/torso-db";
import { NextRequest, NextResponse } from "next/server";
import { omise } from "@/services/omise";

interface ChargeDescription {
  userId: string;
  name: string;
  description: string;
  time: number;
  credit_amount: string;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const chargeId = searchParams.get("id");
  const packId = searchParams.get("packId");

  try {
    const retrievedCharge = await omise.charges.retrieve(chargeId!);
    console.log(retrievedCharge.status);

    if (!retrievedCharge) {
      return NextResponse.json({ id: null, status: "idle" });
    }

    if (retrievedCharge.paid && retrievedCharge.status == "successful") {
      const description = JSON.parse(
        retrievedCharge.description
      ) as ChargeDescription;
      addPaymentHistory({
        lineId: description.userId,
        packId: packId as string,
        status: retrievedCharge.status,
        chargeId: retrievedCharge.source?.id!,
      }).then((result) => {
        if (!result) return NextResponse.json({ id: null, status: "failed" });
        addPointToUser(description.userId, parseInt(description.credit_amount));
      });
    }

    return NextResponse.json({
      id: retrievedCharge.source?.id,
      status: retrievedCharge.status,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ id: null, status: "idle" });
  }
}
