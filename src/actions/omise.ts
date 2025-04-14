import { PackageInfo } from "@/interfaces/i-package";
import Omise from "omise";

const apiKey = process.env.NEXT_PUBLIC_OMISE_API_PUBLIC_KEY;

const omise = Omise({
  publicKey: apiKey,
  omiseVersion: "2019-05-29",
});

export const promptpayCharge = async (
  token: string,
  pack: PackageInfo,
  description: string,
  user: { userId: string; name: string }
) => {
  const response = await omise.charges.create({
    description,
    amount: pack.priceNumber,
    currency: "THB",
    capture: false,
    card: token,
  });
};
