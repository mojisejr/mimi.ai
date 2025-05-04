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

      const history = await addPaymentHistory({
        lineId: description.userId,
        packId: packId as string,
        status: retrievedCharge.status,
        chargeId: retrievedCharge?.id,
      });

      console.log("history saved");

      if (!history) {
        return NextResponse.json({
          id: retrievedCharge?.id,
          status: retrievedCharge?.status,
        });
      }

      const point = await addPointToUser(
        description.userId,
        parseInt(description.credit_amount)
      );

      if (!point) {
        return NextResponse.json({
          id: retrievedCharge?.id,
          status: retrievedCharge?.status,
        });
      }

      console.log("point save");

      return NextResponse.json({
        id: retrievedCharge?.id,
        status: retrievedCharge?.status,
      });
    } else if (retrievedCharge.status == "pending") {
      return NextResponse.json({
        id: retrievedCharge.source?.id,
        status: retrievedCharge.status,
      });
    } else {
      console.log("other status");
      return NextResponse.json({
        id: retrievedCharge.source?.id,
        status: retrievedCharge.status,
      });
    }
  } catch (error) {
    console.log("ERROR somethig went wrong");
    console.log(error);
    return NextResponse.json({ id: null, status: "idle" });
  }
}
