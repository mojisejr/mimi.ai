import { PackageInfo } from "./i-package";

export interface PaymentData {
  method: string;
  buyerId: string;
  pack: Partial<PackageInfo>;
  description: string;
}
