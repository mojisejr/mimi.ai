import Image from "next/image";

export default function Navbar() {
  return (
    <div className="w-full flex justify-center pr-6 pl-6 items-center">
      <figure className="max-w-36">
        <Image src="/logo-1.png" height={200} width={300} alt="logo" />
      </figure>
      {/* <div className="flex justify-start gap-1 items-center">
        <div className="relative h-[50px] w-[50px]">
          <div className="absolute top-0 left-0 loading loading-ring bg-gradient-to-br from-primary to-accent w-[50px]"></div>
          <div className="absolute top-[25%] left-[25%] loading loading-infinity bg-gradient-to-br from-accent to-primary w-[25x]"></div>
        </div>
        <h1 className="text-xl">MiMiVibe.ai</h1>
      </div> */}
    </div>
  );
}
