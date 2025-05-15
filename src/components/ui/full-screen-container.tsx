import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function FullScreenContainer({ children }: Props) {
  return <div className="h-5/6 w-full">{children}</div>;
}
