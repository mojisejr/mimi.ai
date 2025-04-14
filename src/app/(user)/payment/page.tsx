// "use client";
import CreditCard from "@/components/credit-card";
import { getActivePacks } from "@/actions/get-pack-info";
import React, { Suspense } from "react";
import LoadingScreen from "@/components/ui/loading-screen";
import PaymentModal from "@/components/modal/payment";

export default async function Page() {
  const packs = await getActivePacks();
  return (
    <div className="h-5/6 w-full overflow-y-scroll">
      <Suspense fallback={<LoadingScreen />}>
        <div className="flex flex-col gap-4 md:flex-row p-4">
          {packs.map((p) => (
            <CreditCard key={p.id} {...p} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
