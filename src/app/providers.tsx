"use client";

import { DetectionProvider } from "@/context/DetectionContext";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <DetectionProvider>{children}</DetectionProvider>;
}
