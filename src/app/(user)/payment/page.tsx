"use client";
import CreditCard from "@/components/credit-card";
import { getActivePacks } from "@/actions/get-pack-info";
import React, { Suspense, useEffect, useState } from "react";
import LoadingScreen from "@/components/ui/loading-screen";
import { PackageInfo } from "@/interfaces/i-package";
import PaymentModal from "@/components/modal/payment";

export default function Page() {
  const [packs, setPacks] = useState<PackageInfo[]>();
  const [ready, setReady] = useState<boolean>(false);
  const [selectedPack, setSelectedPack] = useState<PackageInfo>();
  const [isMethodDialogOpen, setMethodDialogOpen] = useState<boolean>(false);

  const handleSetSelectedPack = (pack: PackageInfo) => {
    setSelectedPack(pack);
    setMethodDialogOpen(true);
  };

  useEffect(() => {
    if (!ready && window !== undefined) {
      setReady(true);
    }
  }, [ready]);

  useEffect(() => {
    getActivePacks().then((packs) => {
      setPacks(packs);
    });
  }, []);

  return (
    <div className="h-5/6 w-full overflow-y-scroll">
      <Suspense fallback={<LoadingScreen />}>
        <div className="flex flex-col gap-4 md:flex-row p-4 items-center md:justify-center">
          {packs &&
            packs.map((p) => (
              <CreditCard
                key={p.id}
                {...p}
                setSelectedPack={handleSetSelectedPack}
              />
            ))}
        </div>
      </Suspense>
      <PaymentModal
        isOpen={isMethodDialogOpen}
        pack={selectedPack!}
        onClose={() => setMethodDialogOpen(false)}
      />
    </div>
  );
}
