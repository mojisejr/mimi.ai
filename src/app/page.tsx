"use client";
import HeroCard from "@/components/hero-card";
import LineConnectButton from "@/components/line-connect-button";
import Navbar from "@/components/navbar";
import LoadingScreen from "@/components/ui/loading-screen";
import { useLine } from "@/providers/line";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export default function Home() {
  const { isInitialized, isLoggedIn } = useLine();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (isLoggedIn) {
    return redirect("/questions");
  }

  return (
    <motion.div className="h-screen w-full">
      <nav className="h-1/6 w-full flex items-center">
        <Navbar />
      </nav>
      <section className="h-3/6">
        <motion.div
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="h-full w-full  flex justify-center items-center"
        >
          <HeroCard />
        </motion.div>
      </section>
      <section className="h-2/6 w-full">
        {isInitialized ? (
          <div className="flex flex-col  gap-2 w-full h-full justify-center items-center">
            <LineConnectButton />
          </div>
        ) : (
          <div className="flex flex-col  gap-2 w-full h-full justify-center items-center">
            <span>Loading..</span>
          </div>
        )}
      </section>
    </motion.div>
  );
}
