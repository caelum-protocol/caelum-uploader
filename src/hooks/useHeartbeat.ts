import { useEffect, useRef } from "react";

export default function useHeartbeat() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    c const worker = new Worker(
      new URL("../workers/heartbeat-worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current = worker;

    const stop = () => {
      if (workerRef.current) {
        workerRef.current.postMessage("stop");
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };

    window.addEventListener("beforeunload", stop);
    return () => {
      stop();
      window.removeEventListener("beforeunload", stop);
    };
  }, []);

  return workerRef;
}