import Omise from "omise";
const secretKey = process.env.OMISE_SECRET_KEY!;
const publicKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!;

export const omise = Omise({
  publicKey,
  secretKey,
  omiseVersion: "2019-05-29",
});
