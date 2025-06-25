import { useEffect, useRef } from "react";

export default function useHeartbeat() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/heartbeat.worker.ts", import.meta.url),
      { type: "module" }
    );
    worker.postMessage("start");
    workerRef.current = worker;

    return () => {
      worker.postMessage("stop");
      worker.terminate();
    };
  }, []);
}